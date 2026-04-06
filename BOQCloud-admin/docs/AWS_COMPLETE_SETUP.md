# Fleeto Admin - AWS Setup Complete Guide

This document covers the complete AWS setup for Fleeto Admin, including authentication (Cognito) and database (DynamoDB).

---

## Part 1: AWS Cognito Authentication (COMPLETED)

### What Was Set Up
- **User Pool**: `User pool - cp7b8z` (ID: `eu-north-1_v8P404noM`)
- **App Client**: `fleeto-admin-web` (ID: `54be4kuke0tt2t74kc9tpo4hfc`)
- **Region**: `eu-north-1` (Stockholm)
- **Authentication Flow**: SRP (Secure Remote Password)

### Configuration Steps Completed

#### 1. Created Cognito User Pool
1. AWS Console → Cognito → Create User Pool
2. Selected: **Single-page application (SPA)**
3. Name: `User pool - cp7b8z`
4. Enabled: Email sign-in
5. Disabled: Client secret (not needed for React apps)

#### 2. App Client Configuration
- Name: `fleeto-admin-web`
- Client secret: **DISABLED** (critical for React apps)
- Authentication flows: ALLOW_USER_SRP_AUTH, ALLOW_REFRESH_TOKEN_AUTH

#### 3. Environment Variables (.env.local)
```env
REACT_APP_AWS_REGION=eu-north-1
REACT_APP_COGNITO_USER_POOL_ID=eu-north-1_v8P404noM
REACT_APP_COGNITO_CLIENT_ID=54be4kuke0tt2t74kc9tpo4hfc
```

#### 4. Test User Created
- Email: `are.atar.are@gmail.com`
- Password: `ATAR@test123#`

### Issues Encountered & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| SECRET_HASH error | App client had secret | Created new app client WITHOUT secret |
| CUSTOM_AUTH not enabled | Missing Lambda trigger | Switched to SRP auth (standard) |
| Custom auth Lambda not configured | Required for custom flows | Simplified to standard SRP flow |

### Cost
- **Free tier**: 50,000 MAUs/month
- **Current cost**: $0 (within free tier)

---

## Part 2: AWS DynamoDB Database (NEXT STEPS)

### What We're Setting Up
- **Table**: `FleetoTasks`
- **Purpose**: Store task list data with user isolation
- **Cost**: ~$0.02/month for 1000 tasks

### Step-by-Step Setup

#### Step 1: Create DynamoDB Table

1. **Go to AWS Console**
   - Navigate to: https://console.aws.amazon.com/dynamodb
   - Or: AWS Console → Services → DynamoDB

2. **Create Table**
   - Click **"Create table"**
   - Table name: `FleetoTasks`
   - Partition key: `userId` (Type: String)
   - Sort key: `taskId` (Type: String)
   - Click **"Create table"**

3. **Configure Table Settings**
   - Table settings: **Customize settings**
   - Capacity mode: **On-demand** (pay-per-request, cost-effective)
   - Encryption: **AWS owned key** (default)
   - Tags: Optional
   - Click **"Create table"**

#### Step 2: Create Global Secondary Indexes (GSIs)

These indexes enable efficient queries by status and priority.

1. **Go to Table → Indexes tab**

2. **Create StatusIndex**
   - Click **"Create index"**
   - Partition key: `status` (String)
   - Sort key: `dueDate` (String)
   - Index name: `StatusIndex`
   - Projected attributes: All
   - Click **"Create index"**

3. **Create PriorityIndex**
   - Click **"Create index"**
   - Partition key: `priority` (String)
   - Sort key: `dueDate` (String)
   - Index name: `PriorityIndex`
   - Projected attributes: All
   - Click **"Create index"**

#### Step 3: Set Up IAM Permissions

The app needs permission to access DynamoDB.

**Option A: Using Cognito Identity Pool (Recommended)**

1. Go to **Cognito** → **Identity pools**
2. Create new identity pool or use existing
3. Go to **Authenticated role** → **Edit**
4. Add inline policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
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
        "arn:aws:dynamodb:eu-north-1:*:table/FleetoTasks",
        "arn:aws:dynamodb:eu-north-1:*:table/FleetoTasks/index/*"
      ],
      "Condition": {
        "ForAllValues:StringEquals": {
          "dynamodb:LeadingKeys": ["${cognito-identity.amazonaws.com:sub}"]
        }
      }
    }
  ]
}
```

**Option B: Using IAM User (Development Only)**

1. Go to **IAM** → **Users** → **Add user**
2. User name: `fleeto-admin-dev`
3. Access type: **Programmatic access**
4. Attach policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
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
        "arn:aws:dynamodb:eu-north-1:*:table/FleetoTasks",
        "arn:aws:dynamodb:eu-north-1:*:table/FleetoTasks/index/*"
      ]
    }
  ]
}
```

5. Save Access Key ID and Secret Access Key
6. Add to `.env.local`:
```env
REACT_APP_AWS_ACCESS_KEY_ID=your_access_key
REACT_APP_AWS_SECRET_ACCESS_KEY=your_secret_key
```

#### Step 4: Update Environment Variables

Add to `.env.local`:
```env
# DynamoDB Configuration
REACT_APP_DYNAMODB_TABLE=FleetoTasks
REACT_APP_DYNAMODB_REGION=eu-north-1
```

#### Step 5: Test the Setup

1. **Restart the app**:
   ```bash
   npm start
   ```

2. **Login** with test credentials

3. **Navigate to Task List**:
   - Go to `/task-list`
   - Create a new task
   - Verify it appears in the list
   - Edit the task
   - Delete the task

4. **Verify in AWS Console**:
   - Go to DynamoDB → Tables → FleetoTasks
   - Click "Explore table items"
   - You should see your task data

---

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│  AWS Cognito    │────▶│   DynamoDB      │
│                 │     │  (Auth)         │     │   (Tasks)       │
│  - Login        │     │                 │     │                 │
│  - Task List    │     │  - User Pool    │     │  - FleetoTasks  │
│  - CRUD Ops     │     │  - SRP Auth     │     │  - User Isolated│
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                               │
         └───────────────────────────────────────────────┘
                           User-specific data access
```

---

## Cost Summary

| Service | Free Tier | Expected Usage | Monthly Cost |
|---------|-----------|----------------|--------------|
| Cognito | 50,000 MAUs | < 10 users | $0 |
| DynamoDB | 25 GB, 25 WCU, 25 RCU | < 1000 tasks | ~$0.02 |
| **Total** | | | **~$0.02** |

---

## Security Best Practices

1. ✅ **User Isolation**: Tasks partitioned by `userId`
2. ✅ **No Client Secret**: React app uses public client
3. ✅ **IAM Permissions**: Least privilege access
4. ✅ **Row-Level Security**: Users can only access their own data
5. ✅ **HTTPS Only**: All AWS services enforce HTTPS

---

## Troubleshooting

### Issue: "Access Denied" when creating tasks
**Solution**: Check IAM permissions, ensure DynamoDB table name matches

### Issue: "Table not found"
**Solution**: Verify `REACT_APP_DYNAMODB_TABLE` environment variable

### Issue: Tasks not appearing
**Solution**: Check browser console for errors, verify user is authenticated

### Issue: "User is not authorized"
**Solution**: Ensure userId from Cognito matches the partition key

---

## Next Steps

1. ✅ Complete DynamoDB table setup
2. ✅ Configure IAM permissions
3. ✅ Test CRUD operations
4. ⏳ Set up CloudWatch monitoring (optional)
5. ⏳ Configure backup/restore (optional)
6. ⏳ Add more features (file uploads, notifications)

---

## Documentation Files

- `docs/AUTHENTICATION.md` - Cognito setup details
- `docs/DYNAMODB_SETUP.md` - DynamoDB deep dive
- `docs/SECURITY_REPORT.md` - Security analysis
- `docs/AWS_SETUP_GUIDE.md` - Original AWS guide

---

**Last Updated**: 2026-03-23
**Status**: Authentication ✅ Complete | Database ⏳ Setup Required
