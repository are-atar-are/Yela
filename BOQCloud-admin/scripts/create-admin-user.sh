#!/bin/bash
# Create Admin Test User in AWS Cognito
# Run this script to create a test admin user

echo "Creating admin test user in AWS Cognito..."

# Configuration
USER_POOL_ID="eu-north-1_v8P404noM"
USERNAME="admin@test.com"
PASSWORD="TestPassword123!"
EMAIL="admin@test.com"

# Create user
aws cognito-idp admin-create-user \
  --user-pool-id $USER_POOL_ID \
  --username $USERNAME \
  --user-attributes Name=email,Value=$EMAIL Name=email_verified,Value=true \
  --temporary-password $PASSWORD \
  --message-action SUPPRESS \
  --region eu-north-1

# Set permanent password
aws cognito-idp admin-set-user-password \
  --user-pool-id $USER_POOL_ID \
  --username $USERNAME \
  --password $PASSWORD \
  --permanent \
  --region eu-north-1

# Add to admin group (if exists)
aws cognito-idp admin-add-user-to-group \
  --user-pool-id $USER_POOL_ID \
  --username $USERNAME \
  --group-name admin \
  --region eu-north-1 2>/dev/null || echo "Note: admin group may not exist"

echo ""
echo "✅ Admin test user created!"
echo ""
echo "Login credentials:"
echo "  Username: $USERNAME"
echo "  Password: $PASSWORD"
echo ""
echo "You can now login at: http://localhost:3000"
