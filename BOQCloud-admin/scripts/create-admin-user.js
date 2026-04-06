const { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand, AdminAddUserToGroupCommand } = require('@aws-sdk/client-cognito-identity-provider');

const REGION = 'eu-north-1';
const USER_POOL_ID = 'eu-north-1_v8P404noM';

const client = new CognitoIdentityProviderClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function createAdminUser() {
  const username = 'admin@test.com';
  const password = 'TestPassword123!';
  const email = 'admin@test.com';

  try {
    console.log('Creating admin test user...\n');

    // Step 1: Create user
    console.log('Step 1: Creating user...');
    await client.send(new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: username,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
      ],
      TemporaryPassword: password,
      MessageAction: 'SUPPRESS', // Don't send email
    }));
    console.log('✅ User created');

    // Step 2: Set permanent password
    console.log('\nStep 2: Setting permanent password...');
    await client.send(new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: username,
      Password: password,
      Permanent: true,
    }));
    console.log('✅ Password set');

    // Step 3: Add to admin group (optional)
    console.log('\nStep 3: Adding to admin group...');
    try {
      await client.send(new AdminAddUserToGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
        GroupName: 'admin',
      }));
      console.log('✅ Added to admin group');
    } catch (err) {
      console.log('⚠️  Could not add to admin group (group may not exist)');
    }

    console.log('\n🎉 Admin test user created successfully!');
    console.log('\nLogin credentials:');
    console.log('  Username:', username);
    console.log('  Password:', password);
    console.log('\nLogin at: http://localhost:3000');

  } catch (error) {
    if (error.name === 'UsernameExistsException') {
      console.log('\n⚠️  User already exists');
      console.log('\nLogin credentials:');
      console.log('  Username:', username);
      console.log('  Password:', password);
    } else {
      console.error('\n❌ Error:', error.message);
    }
  }
}

createAdminUser();
