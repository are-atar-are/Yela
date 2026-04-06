# AWS DynamoDB Implementation Guide - Task List

## Overview
Cost-effective DynamoDB implementation for Task List CRUD operations using AWS Amplify.

## Cost Structure

### DynamoDB Free Tier (Always Free)
- 25 GB of storage
- 25 write capacity units (WCU)
- 25 read capacity units (RCU)
- **Estimated cost: $0 for small to medium usage**

### On-Demand Pricing (Pay-per-request)
- Write request: $1.25 per million write request units
- Read request: $0.25 per million read request units
- Storage: $0.25 per GB/month

**Example monthly cost for 1000 tasks:**
- Storage: ~$0.01 (negligible)
- Requests: ~$0.01 (negligible)
- **Total: ~$0.02/month**

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│  AWS Amplify    │────▶│   DynamoDB      │
│   (Task List)   │◄────│   (API/Data)    │◄────│   (Tasks Table) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Table Design

### Primary Table: Tasks

**Partition Key:** `userId` (String)
**Sort Key:** `taskId` (String)

**Attributes:**
- `userId` (String) - Cognito user sub
- `taskId` (String) - UUID
- `title` (String) - Task title
- `description` (String) - Task details
- `status` (String) - pending, in-progress, completed
- `priority` (String) - low, medium, high
- `dueDate` (String) - ISO 8601 date
- `createdAt` (String) - ISO 8601 timestamp
- `updatedAt` (String) - ISO 8601 timestamp
- `tags` (List) - Array of tag strings
- `assignedTo` (String) - User ID

### Global Secondary Indexes (GSIs)

**GSI1: StatusIndex**
- PK: `status`
- SK: `dueDate`
- Use case: Query tasks by status

**GSI2: PriorityIndex**
- PK: `priority`
- SK: `dueDate`
- Use case: Query tasks by priority

## Setup Instructions

### 1. Create DynamoDB Table

**AWS Console Method:**
1. Go to AWS Console → DynamoDB
2. Click "Create table"
3. Table name: `FleetoTasks`
4. Partition key: `userId` (String)
5. Sort key: `taskId` (String)
6. Table settings: Customize settings
7. Capacity mode: **On-demand** (pay-per-request, cost-effective)
8. Click "Create table"

**Create GSIs:**
1. Go to table → Indexes tab
2. Create index:
   - Index name: `StatusIndex`
   - Partition key: `status`
   - Sort key: `dueDate`
3. Create another index:
   - Index name: `PriorityIndex`
   - Partition key: `priority`
   - Sort key: `dueDate`

### 2. Set Up IAM Permissions

Create IAM policy for the app:

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
        "arn:aws:dynamodb:*:*:table/FleetoTasks",
        "arn:aws:dynamodb:*:*:table/FleetoTasks/index/*"
      ]
    }
  ]
}
```

Attach to Cognito Identity Pool or IAM role.

### 3. Install AWS SDK for DynamoDB

```bash
npm install @aws-sdk/client-dynamodb@3.478.0 @aws-sdk/lib-dynamodb@3.478.0 --save-exact
```

### 4. Environment Variables

Add to `.env.local`:
```env
REACT_APP_DYNAMODB_TABLE=FleetoTasks
REACT_APP_DYNAMODB_REGION=eu-north-1
```

## CRUD Operations

### Create Task
```typescript
const createTask = async (task: TaskInput) => {
  const taskItem = {
    userId: currentUser.sub,
    taskId: uuid(),
    ...task,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await dynamoDB.put({
    TableName: 'FleetoTasks',
    Item: taskItem,
  });
};
```

### Read Tasks
```typescript
const getTasks = async (userId: string) => {
  const result = await dynamoDB.query({
    TableName: 'FleetoTasks',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  });
  
  return result.Items;
};
```

### Update Task
```typescript
const updateTask = async (userId: string, taskId: string, updates: Partial<Task>) => {
  await dynamoDB.update({
    TableName: 'FleetoTasks',
    Key: { userId, taskId },
    UpdateExpression: 'set #title = :title, #status = :status, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#title': 'title',
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':title': updates.title,
      ':status': updates.status,
      ':updatedAt': new Date().toISOString(),
    },
  });
};
```

### Delete Task
```typescript
const deleteTask = async (userId: string, taskId: string) => {
  await dynamoDB.delete({
    TableName: 'FleetoTasks',
    Key: { userId, taskId },
  });
};
```

## Cost Optimization Tips

1. **Use On-Demand Capacity**: Pay only for what you use
2. **Query, Don't Scan**: Always use queries with partition key
3. **Project Necessary Attributes**: Use `ProjectionExpression` to fetch only needed fields
4. **Batch Operations**: Use `BatchWriteItem` for multiple operations
5. **TTL for Old Data**: Auto-delete completed tasks after 90 days

## Monitoring

Set up CloudWatch alarms for:
- Consumed read/write capacity > 80%
- Throttled requests > 0
- Table size > 1GB

## Security

- Row-level security via `userId` partition key
- IAM policies restrict access to user's own data
- API Gateway can add additional authorization layer
- All data encrypted at rest (DynamoDB default)
