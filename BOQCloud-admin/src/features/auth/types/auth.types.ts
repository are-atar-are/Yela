// Authentication Types

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  emailVerified: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  rememberedUsername: string | null;
}

export interface LoginCredentials {
  username: string;
  password?: string;
}

export interface OtpVerification {
  username: string;
  code: string;
}

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type AuthStep = 'username' | 'password' | 'otp' | 'newPassword';

export interface CognitoError {
  code: string;
  message: string;
  name: string;
}

// Common Cognito error codes
export const CognitoErrorCodes = {
  USER_NOT_FOUND: 'UserNotFoundException',
  NOT_AUTHORIZED: 'NotAuthorizedException',
  CODE_MISMATCH: 'CodeMismatchException',
  EXPIRED_CODE: 'ExpiredCodeException',
  LIMIT_EXCEEDED: 'LimitExceededException',
  TOO_MANY_REQUESTS: 'TooManyRequestsException',
  USER_NOT_CONFIRMED: 'UserNotConfirmedException',
  NEW_PASSWORD_REQUIRED: 'NewPasswordRequiredException',
} as const;
