import { Auth } from 'aws-amplify';
import type {
  User,
  AuthTokens,
  CognitoError,
} from '../types/auth.types';

// Helper to map Cognito user to our User type
const mapCognitoUser = (cognitoUser: any): User => {
  const attributes = cognitoUser.attributes || {};
  return {
    id: cognitoUser.username,
    username: cognitoUser.username,
    email: attributes.email || '',
    name: attributes.name || '',
    phoneNumber: attributes.phone_number || '',
    emailVerified: attributes.email_verified || false,
  };
};

// Helper to extract tokens from Cognito session
const extractTokens = (session: any): AuthTokens => {
  const accessToken = session.getAccessToken().getJwtToken();
  const idToken = session.getIdToken().getJwtToken();
  const refreshToken = session.getRefreshToken().getToken();
  const expiresIn = session.getAccessToken().getExpiration() - Math.floor(Date.now() / 1000);

  return {
    accessToken,
    idToken,
    refreshToken,
    expiresIn,
  };
};

class CognitoService {
  // Sign in with username and password (SRP - Secure Remote Password)
  async signIn(username: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const cognitoUser = await Auth.signIn(username, password);
      
      // Check if new password is required
      if (cognitoUser.challengeName === 'NEW_PASSWORD_REQUIRED') {
        throw new Error('NEW_PASSWORD_REQUIRED');
      }

      // Get session
      const session = await Auth.currentSession();
      
      return {
        user: mapCognitoUser(cognitoUser),
        tokens: extractTokens(session),
      };
    } catch (error) {
      const cognitoError = error as CognitoError;
      
      if (cognitoError.code === 'UserNotFoundException') {
        throw new Error('User not found. Please check your username.');
      }
      
      if (cognitoError.code === 'NotAuthorizedException') {
        throw new Error('Incorrect username or password.');
      }
      
      if (cognitoError.code === 'UserNotConfirmedException') {
        throw new Error('Please verify your email before signing in.');
      }
      
      if (cognitoError.message === 'NEW_PASSWORD_REQUIRED') {
        throw new Error('Please set a new password.');
      }
      
      throw new Error(cognitoError.message || 'Authentication failed');
    }
  }

  // Complete new password challenge
  async completeNewPassword(username: string, newPassword: string, requiredAttributes: any = {}): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      // Get the current user object
      const currentUser = await Auth.signIn(username, newPassword);
      
      if (currentUser.challengeName === 'NEW_PASSWORD_REQUIRED') {
        const user = await Auth.completeNewPassword(
          currentUser,
          newPassword,
          requiredAttributes
        );
        
        const session = await Auth.currentSession();
        return {
          user: mapCognitoUser(user),
          tokens: extractTokens(session),
        };
      }
      
      // If no challenge, just return the user
      const session = await Auth.currentSession();
      return {
        user: mapCognitoUser(currentUser),
        tokens: extractTokens(session),
      };
    } catch (error) {
      const cognitoError = error as CognitoError;
      throw new Error(cognitoError.message || 'Failed to set new password');
    }
  }

  // Sign up new user
  async signUp(username: string, password: string, email: string, name?: string): Promise<void> {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          name: name || username,
        },
      });
    } catch (error) {
      const cognitoError = error as CognitoError;
      
      if (cognitoError.code === 'UsernameExistsException') {
        throw new Error('User already exists.');
      }
      
      throw new Error(cognitoError.message || 'Sign up failed');
    }
  }

  // Confirm sign up with code
  async confirmSignUp(username: string, code: string): Promise<void> {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (error) {
      const cognitoError = error as CognitoError;
      
      if (cognitoError.code === 'CodeMismatchException') {
        throw new Error('Invalid verification code.');
      }
      
      throw new Error(cognitoError.message || 'Verification failed');
    }
  }

  // Resend confirmation code
  async resendConfirmationCode(username: string): Promise<void> {
    try {
      await Auth.resendSignUp(username);
    } catch (error) {
      const cognitoError = error as CognitoError;
      throw new Error(cognitoError.message || 'Failed to resend code');
    }
  }

  // Forgot password
  async forgotPassword(username: string): Promise<void> {
    try {
      await Auth.forgotPassword(username);
    } catch (error) {
      const cognitoError = error as CognitoError;
      throw new Error(cognitoError.message || 'Failed to initiate password reset');
    }
  }

  // Confirm forgot password with code
  async confirmForgotPassword(username: string, code: string, newPassword: string): Promise<void> {
    try {
      await Auth.forgotPasswordSubmit(username, code, newPassword);
    } catch (error) {
      const cognitoError = error as CognitoError;
      
      if (cognitoError.code === 'CodeMismatchException') {
        throw new Error('Invalid reset code.');
      }
      
      throw new Error(cognitoError.message || 'Password reset failed');
    }
  }

  // Get current authenticated user
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return mapCognitoUser(user);
    } catch {
      return null;
    }
  }

  // Get current session
  async getCurrentSession(): Promise<AuthTokens | null> {
    try {
      const session = await Auth.currentSession();
      return extractTokens(session);
    } catch {
      return null;
    }
  }

  // Refresh tokens
  async refreshSession(): Promise<AuthTokens> {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const session = await Auth.currentSession();
      
      // Refresh the session
      currentUser.refreshSession(session.getRefreshToken(), (err: any) => {
        if (err) throw err;
      });

      const newSession = await Auth.currentSession();
      return extractTokens(newSession);
    } catch (error) {
      throw new Error('Session refresh failed');
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}

export const cognitoService = new CognitoService();
export default cognitoService;
