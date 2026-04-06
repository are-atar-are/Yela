# AWS IAM Permissions Required for Fleeto Admin

The AWS user `fleeto-app` needs additional permissions to use Cognito and DynamoDB.

## Current Issue

The error shows:
```
AccessDeniedException: User: arn:aws:iam::325866320806:user/fleeto-app 
is not authorized to perform: cognito-idp:ListUsers
```

## Required IAM Policy

Go to **AWS Console → IAM → Users → fleeto-app → Add permissions → Create inline policy**

### Option 1: Full Fleeto Access (Recommended for development)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CognitoAccess",
      "Effect": "Allow",
      "Action": [
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminDeleteUser",
        "cognito-idp:AdminDisableUser",
        "cognito-idp:AdminEnableUser",
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminListUsers",
        "cognito-idp:AdminSetUserPassword",
        "cognito-idp:AdminUpdateUserAttributes",
        "cognito-idp:ListUsers",
        "cognito-idp:SignUp"
      ],
      "Resource": "arn:aws:cognito-idp:eu-north-1:325866320806:userpool/eu-north-1_v8P404noM"
    },
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:eu-north-1:*:table/FleetoVehicles",
        "arn:aws:dynamodb:eu-north-1:*:table/FleetoVehicles/index/*",
        "arn:aws:dynamodb:eu-north-1:*:table/FleetoBookings",
        "arn:aws:dynamodb:eu-north-1:*:table/FleetoBookings/index/*"
      ]
    }
  ]
}
```

### Option 2: Minimal Permissions (Production)

For production, use more restrictive permissions based on user roles.

## Alternative: Use Your Personal AWS Credentials

If you have AWS CLI configured with your personal credentials that have admin access:

1. Check your current credentials:
   ```bash
   aws sts get-caller-identity
   ```

2. If you have admin access, update the `.env.local` file:
   ```
   REACT_APP_AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
   REACT_APP_AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
   ```

## Quick Fix for Testing

Since the AWS credentials don't have Cognito permissions, you have two options:

### Option A: Add Cognito Permissions to fleeto-app user
1. Go to AWS Console → IAM → Users → fleeto-app
2. Add the policy above
3. Restart the admin portal

### Option B: Use Mock Mode (No AWS Required)
I can configure the app to use mock data instead of real AWS services for testing.

**Which option do you prefer?**
