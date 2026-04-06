# AWS Cognito Authentication Implementation

## Security & Dependency Analysis

### Package Security Vetting

#### Current Dependencies Status
| Package | Current | Latest | Risk Level | Action |
|---------|---------|--------|------------|--------|
| @types/node | 16.18.126 | 25.5.0 | Low | Dev dependency, types only |
| @types/jest | 27.5.2 | 30.0.0 | Low | Dev dependency, types only |
| typescript | 4.9.5 | 5.9.3 | Medium | LTS version, stable |
| web-vitals | 2.1.4 | 5.1.0 | Low | Non-critical, monitoring only |

#### AWS SDK Dependencies to Add
```json
{
  "aws-amplify": "5.3.27",
  "@aws-amplify/auth": "5.6.12",
  "@aws-amplify/core": "5.8.12"
}
```

**Security Vetting Results:**
- ✅ AWS Amplify v5.3.27: Stable LTS, no known CVEs
- ✅ @aws-amplify/auth v5.6.12: Authentication module, actively maintained
- ✅ @aws-amplify/core v5.8.12: Core SDK, stable

**Version Pinning Strategy:**
- All AWS packages pinned to exact versions
- No caret (^) or tilde (~) operators
- Prevents auto-updates that could break compatibility

### Known Issues & Mitigations

1. **React 19 Compatibility**
   - AWS Amplify v5.x supports React 18-19
   - No breaking changes expected

2. **TypeScript 4.9.5**
   - Compatible with AWS SDK types
   - No type conflicts detected

3. **Potential Version Mismatches**
   - @types/node v16 may conflict with newer Node features
   - Mitigation: Use Node 18+ LTS in production

## Architecture Overview

### Authentication Flow (Cognito-Compatible)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Login Screen  │────▶│  Username/Email │────▶│  Password/OTP   │
│   (Entry Point) │     │   (Step 1)      │     │   (Step 2)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │  MFA/OTP Verify │
                                               │   (Step 3)      │
                                               └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │    Dashboard    │
                                               │   (Protected)   │
                                               └─────────────────┘
```

### User States

1. **First-Time User**
   - Username/Email input
   - Password setup (if required)
   - OTP verification
   - Redirect to dashboard

2. **Returning User**
   - Display cached username/name
   - Username input (pre-filled)
   - OTP verification
   - Redirect to dashboard

## AWS Cognito Setup Guide

### Step 1: AWS Account Setup (Cost-Effective)

**Free Tier Eligibility:**
- 50,000 MAUs (Monthly Active Users) free
- Unlimited user pool creation
- No charges for first 50,000 authentications/month

**Cost Optimization Tips:**
1. Use User Pool only (no Identity Pool for now)
2. Enable only required attributes
3. Use email OTP instead of SMS (SMS has costs)
4. Set up CloudWatch alarms for usage monitoring

### Step 2: Cognito User Pool Configuration

**Required Settings:**
```
User Pool Name: fleeto-admin-users
Sign-in options: Username, Email
Required attributes: email
Optional attributes: name, phone_number
MFA: Optional (OTP via email)
Password policy: Strong (8+ chars, mixed case, numbers, symbols)
Account recovery: Email only
```

**App Client Settings:**
```
App client name: fleeto-admin-web
Auth flows: USER_PASSWORD_AUTH, USER_SRP_AUTH
OAuth 2.0: Disabled (for now)
Token validity: 1 hour (access), 30 days (refresh)
```

### Step 3: Environment Configuration

Create `.env.local`:
```env
REACT_APP_AWS_REGION=us-east-1
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
REACT_APP_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_COGNITO_DOMAIN=fleeto-admin.auth.us-east-1.amazoncognito.com
```

## Implementation Plan

### Phase 1: Core Authentication (This PR)
- [ ] Install AWS Amplify dependencies
- [ ] Configure Amplify in app entry
- [ ] Create auth service layer
- [ ] Update Login component with Cognito integration
- [ ] Add auth state management (Redux)
- [ ] Create protected route wrapper
- [ ] Add session persistence

### Phase 2: User Experience
- [ ] Remember username functionality
- [ ] Auto-redirect for authenticated users
- [ ] Session timeout handling
- [ ] Logout functionality
- [ ] Password reset flow

### Phase 3: Security Hardening
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] Rate limiting UI feedback
- [ ] Secure token storage
- [ ] Audit logging

## File Structure

```
src/
├── features/
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   ├── OtpForm.tsx
│       │   └── ProtectedRoute.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── useCognito.ts
│       ├── services/
│       │   └── cognitoService.ts
│       ├── store/
│       │   ├── authSlice.ts
│       │   └── authSelectors.ts
│       └── types/
│           └── auth.types.ts
├── config/
│   └── aws-config.ts
└── utils/
    └── auth.utils.ts
```

## Security Checklist

- [ ] No hardcoded credentials
- [ ] Environment variables validated at runtime
- [ ] HTTPS only (enforced by Cognito)
- [ ] Tokens stored in memory (not localStorage for sensitive apps)
- [ ] Refresh token rotation enabled
- [ ] Session timeout warnings
- [ ] Secure logout (clear all tokens)
- [ ] Input sanitization
- [ ] Error messages don't leak sensitive info

## Testing Strategy

1. **Unit Tests**: Auth service methods
2. **Integration Tests**: Login flow with mocked Cognito
3. **E2E Tests**: Full authentication journey
4. **Security Tests**: Token handling, session management

## Documentation

- API integration guide
- Troubleshooting common issues
- AWS cost monitoring setup
- Security incident response
