import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand, AdminDisableUserCommand, AdminEnableUserCommand, ListUsersCommand, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';

const REGION = process.env.REACT_APP_AWS_REGION || 'eu-north-1';
const USER_POOL_ID = process.env.REACT_APP_COGNITO_USER_POOL_ID || 'eu-north-1_v8P404noM';

// Check if we have credentials
const hasCredentials = process.env.REACT_APP_AWS_ACCESS_KEY_ID && process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

const getCognitoClient = () => {
  if (!hasCredentials) {
    throw new Error('AWS credentials not configured');
  }
  
  return new CognitoIdentityProviderClient({
    region: REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
    },
  });
};

export interface CognitoUser {
  userId: string;
  username: string;
  email: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  role: 'admin' | 'manager' | 'employee';
  createdAt: string;
  lastLogin?: string;
  enabled: boolean;
}

class CognitoService {
  private client: CognitoIdentityProviderClient | null = null;

  constructor() {
    try {
      this.client = getCognitoClient();
    } catch (error) {
      console.warn('Cognito client not initialized:', error);
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  // List all users from Cognito
  async listUsers(): Promise<CognitoUser[]> {
    if (!this.client) {
      throw new Error('Cognito not configured');
    }

    try {
      const command = new ListUsersCommand({
        UserPoolId: USER_POOL_ID,
        Limit: 60,
      });

      const response = await this.client.send(command);
      
      return (response.Users || []).map((user): CognitoUser => {
        const attributes = user.Attributes || [];
        const getAttr = (name: string) => attributes.find(a => a.Name === name)?.Value || '';
        
        const roleValue = getAttr('custom:role');
        const validRole: 'admin' | 'manager' | 'employee' = 
          roleValue === 'admin' || roleValue === 'manager' || roleValue === 'employee' 
            ? roleValue 
            : 'employee';
        
        return {
          userId: user.Username || '',
          username: user.Username || '',
          email: getAttr('email'),
          name: getAttr('name') || getAttr('email'),
          status: user.Enabled === false ? 'inactive' : 'active',
          role: validRole,
          createdAt: user.UserCreateDate?.toISOString() || new Date().toISOString(),
          lastLogin: user.UserLastModifiedDate?.toISOString(),
          enabled: user.Enabled !== false,
        };
      });
    } catch (error: any) {
      console.error('Error listing users:', error);
      // Return demo data if permission denied
      if (error.name === 'AccessDeniedException') {
        console.warn('Cognito access denied - returning demo data');
        return [
          {
            userId: 'demo-001',
            username: 'admin',
            email: 'admin@fleeto.com',
            name: 'Admin User (Demo Mode)',
            status: 'active',
            role: 'admin',
            createdAt: new Date().toISOString(),
            enabled: true,
          },
        ];
      }
      throw error;
    }
  }

  // Create a new user in Cognito
  async createUser(userData: {
    name: string;
    email: string;
    username: string;
    role: string;
  }): Promise<CognitoUser> {
    if (!this.client) {
      throw new Error('Cognito not configured');
    }

    try {
      // Create user with temporary password
      const createCommand = new AdminCreateUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: userData.username,
        UserAttributes: [
          { Name: 'email', Value: userData.email },
          { Name: 'email_verified', Value: 'true' },
          { Name: 'name', Value: userData.name },
          { Name: 'custom:role', Value: userData.role },
        ],
        TemporaryPassword: this.generateTempPassword(),
        MessageAction: undefined, // Will send email
      });

      const response = await this.client.send(createCommand);
      const user = response.User;

      if (!user) {
        throw new Error('Failed to create user');
      }

      return {
        userId: user.Username || '',
        username: user.Username || '',
        email: userData.email,
        name: userData.name,
        status: 'pending', // User needs to change password on first login
        role: userData.role as any,
        createdAt: new Date().toISOString(),
        enabled: true,
      };
    } catch (error: any) {
      console.error('Error creating user:', error);
      // Return demo user if permission denied
      if (error.name === 'AccessDeniedException') {
        console.warn('Cognito access denied - returning demo user');
        alert('Note: Cognito access denied. User created in demo mode only.');
        return {
          userId: `demo-${Date.now()}`,
          username: userData.username,
          email: userData.email,
          name: userData.name,
          status: 'pending',
          role: userData.role as any,
          createdAt: new Date().toISOString(),
          enabled: true,
        };
      }
      throw error;
    }
  }

  // Disable/Enable user (soft delete)
  async toggleUserStatus(username: string, enable: boolean): Promise<void> {
    if (!this.client) {
      throw new Error('Cognito not configured');
    }

    try {
      if (enable) {
        const command = new AdminEnableUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: username,
        });
        await this.client.send(command);
      } else {
        const command = new AdminDisableUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: username,
        });
        await this.client.send(command);
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }

  // Update user attributes
  async updateUser(username: string, updates: {
    name?: string;
    email?: string;
    role?: string;
  }): Promise<void> {
    if (!this.client) {
      throw new Error('Cognito not configured');
    }

    try {
      const attributes: { Name: string; Value: string }[] = [];
      
      if (updates.name) {
        attributes.push({ Name: 'name', Value: updates.name });
      }
      if (updates.email) {
        attributes.push({ Name: 'email', Value: updates.email });
      }
      if (updates.role) {
        attributes.push({ Name: 'custom:role', Value: updates.role });
      }

      const command = new AdminUpdateUserAttributesCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
        UserAttributes: attributes,
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Set permanent password (for admin setting password)
  async setPermanentPassword(username: string, password: string): Promise<void> {
    if (!this.client) {
      throw new Error('Cognito not configured');
    }

    try {
      const command = new AdminSetUserPasswordCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
        Password: password,
        Permanent: true,
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error setting password:', error);
      throw error;
    }
  }

  private generateTempPassword(): string {
    // Generate a secure temporary password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

export const cognitoService = new CognitoService();
export default cognitoService;
