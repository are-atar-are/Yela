# AWS Cognito Setup Guide - Fleeto Admin

## Overview
This guide walks you through setting up AWS Cognito for the Fleeto Admin authentication system. The setup is designed to be **cost-effective** and follows **security best practices**.

## Cost Structure

### Free Tier (First 12 Months)
- **50,000 Monthly Active Users (MAUs)** - FREE
- Unlimited user pools
- No charges for first 50,000 authentications/month

### After Free Tier
- $0.0055 per MAU (first 10,000)
- $0.00275 per MAU (next 990,000)
- SMS costs: ~$0.0075 per message (if using SMS MFA)

**Recommendation:** Use email OTP instead of SMS to avoid SMS costs.

---

## Step-by-Step Setup

### Step 1: Create AWS Account (if needed)

1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Follow the registration process
4. Complete identity verification
5. Select the Basic (Free) support plan

### Step 2: Access AWS Cognito

1. Log into AWS Console
2. Search for "Cognito" in the search bar
3. Click on "Cognito" service
4. Click "Create user pool"

### Step 3: Configure User Pool

#### Provider Types
- Select: **Cognito user pool**
- Click "Next"

#### Configure Sign-in Experience

**Cognito user pool sign-in options:**
- ✅ Username
- ✅ Email

**Attribute verification and user account confirmation:**
- ✅ Allow Cognito to automatically send messages to verify and confirm
- ✅ Email
- ☐ Phone Number (to save costs)

**Required attributes:**
- ✅ email

**Custom attributes (optional):**
- name (String)
- company (String)

Click "Next"

#### Configure Security Requirements

**Password policy:**
- Select: **Cognito defaults** (recommended)
- Or choose **Custom** with:
  - Minimum length: 8
  - Require numbers: ✅
  - Require special characters: ✅
  - Require uppercase letters: ✅
  - Require lowercase letters: ✅

**Multi-factor authentication:**
- Select: **Optional MFA**
- MFA methods: **Authenticator apps** (TOTP) - more secure than SMS
- Or select **No MFA** for simpler setup initially

**User account recovery:**
- ✅ Email only

Click "Next"

#### Configure Sign-up Experience

**Self-service sign-up:**
- ☐ Enable self-registration (disable for admin-only access)
- Or ✅ Enable if users can sign themselves up

**Attribute verification:**
- ✅ Allow Cognito to automatically verify attributes
- ✅ Email

Click "Next"

#### Configure Message Delivery

**Email:**
- Select: **Send email with Cognito** (default)
- This uses AWS SES with a default sending limit

**SMS (skip to save costs):**
- Select: **Skip SMS setup**

Click "Next"

#### Integrate Your App

**User pool name:**
```
fleeto-admin-users
```

**Initial app client:**
- App client name: `fleeto-admin-web`
- ✅ Generate a client secret (not needed for React apps)

**Authentication flows:**
- ✅ ALLOW_USER_SRP_AUTH (recommended)
- ✅ ALLOW_REFRESH_TOKEN_AUTH

**Authentication flow session duration:**
- 3 minutes (default)

**Refresh token expiration:**
- 30 days (default)

**Access token expiration:**
- 1 hour (default)
- Can be reduced to 15 minutes for higher security

**ID token expiration:**
- 1 hour (default)

Click "Next"

#### Review and Create

Review all settings and click "Create user pool"

### Step 4: Get Configuration Values

After creation, you'll see the User Pool details:

1. **User Pool ID**: Copy this value
   - Format: `us-east-1_XXXXXXXXX`

2. Click on the "App integration" tab
3. Scroll down to "App client list"
4. Click on your app client (`fleeto-admin-web`)
5. **Client ID**: Copy this value
   - Format: `xxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 5: Configure Environment Variables

Create `.env.local` file in project root:

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

Fill in:
```env
REACT_APP_AWS_REGION=us-east-1
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
REACT_APP_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 6: Create First Admin User

1. In Cognito console, go to "Users" tab
2. Click "Create user"
3. Fill in:
   - Username: `admin`
   - Email: your-email@example.com
   - Temporary password: Generate or set
   - Phone number: (optional)
   - Name: Your Name
4. Click "Create user"
5. Check your email for temporary password

---

## Security Best Practices

### 1. Enable MFA (Recommended)

1. Go to User Pool → Sign-in experience
2. Click "Edit"
3. Under "Multi-factor authentication"
4. Select "Require MFA"
5. Choose "Authenticator apps"
6. Save changes

### 2. Set Up CloudWatch Alarms

Monitor authentication activity:

1. Go to CloudWatch console
2. Click "Alarms" → "Create alarm"
3. Set up alerts for:
   - Failed login attempts > 10/minute
   - New user registrations > 50/day
   - Token refresh failures

### 3. Enable AWS WAF (Web Application Firewall)

Protect against common attacks:

1. Go to WAF console
2. Create Web ACL
3. Associate with Cognito
4. Enable managed rules:
   - AWSManagedRulesCommonRuleSet
   - AWSManagedRulesKnownBadInputsRuleSet

### 4. Set Up Cost Alerts

1. Go to Billing console
2. Click "Budgets"
3. Create budget:
   - Name: `Cognito-Monthly`
   - Amount: $10
   - Alert at: 80%

---

## Testing the Setup

### 1. Start the Application

```bash
cd ar-fleeto-admin
npm start
```

### 2. Test Login Flow

1. Navigate to `http://localhost:3000/login`
2. Enter username: `admin`
3. Enter temporary password from email
4. Set new password when prompted
5. Complete OTP verification (if MFA enabled)
6. Should redirect to Dashboard

### 3. Test Protected Routes

Try accessing `/dashboard` directly without login:
- Should redirect to `/login`

### 4. Test Logout

Click logout button (to be implemented):
- Should clear session
- Redirect to login

---

## Troubleshooting

### Issue: "User pool not found"
**Solution:** Check User Pool ID in `.env.local`

### Issue: "Client not found"
**Solution:** Check Client ID in `.env.local`

### Issue: "Not authorized"
**Solution:** 
- Verify user exists in Cognito
- Check password is correct
- Ensure user status is "CONFIRMED"

### Issue: "OTP not received"
**Solution:**
- Check spam folder
- Verify email attribute is correct
- Check Cognito email configuration

---

## Production Deployment Checklist

- [ ] Use production AWS account
- [ ] Enable MFA for all users
- [ ] Set up CloudWatch monitoring
- [ ] Configure AWS WAF
- [ ] Set up cost alerts
- [ ] Use HTTPS only
- [ ] Rotate app client secret (if used)
- [ ] Enable CloudTrail logging
- [ ] Set up backup/restore procedures
- [ ] Document incident response plan

---

## Support Resources

- AWS Cognito Docs: https://docs.aws.amazon.com/cognito/
- Amplify Auth Docs: https://docs.amplify.aws/lib/auth/getting-started/
- AWS Free Tier: https://aws.amazon.com/free/
- Cost Calculator: https://calculator.aws/

---

## Next Steps

1. Complete AWS setup above
2. Test authentication flow
3. Add more admin users
4. Implement password reset flow
5. Add user profile management
6. Set up audit logging
