// AWS Cognito Configuration
// These values should be set in environment variables

interface AwsConfig {
  Auth: {
    region: string;
    userPoolId: string;
    userPoolWebClientId: string;
    oauth?: {
      domain: string;
      scope: string[];
      redirectSignIn: string;
      redirectSignOut: string;
      responseType: string;
    };
  };
}

const awsConfig: AwsConfig = {
  Auth: {
    region: process.env.REACT_APP_AWS_REGION || 'eu-north-1',
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || '',
    userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID || '',
  },
};

// Validate configuration at runtime
export const validateConfig = (): boolean => {
  const required = [
    'REACT_APP_AWS_REGION',
    'REACT_APP_COGNITO_USER_POOL_ID',
    'REACT_APP_COGNITO_CLIENT_ID',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }

  return true;
};

export default awsConfig;
