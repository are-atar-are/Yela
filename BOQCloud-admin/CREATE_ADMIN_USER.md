# Create Admin Test User - Manual Steps

Since the AWS credentials have limited permissions, follow these steps to create an admin test user:

---

## Step 1: Open AWS Cognito Console

1. Go to https://console.aws.amazon.com/
2. Search for **"Cognito"** → Click **Amazon Cognito**
3. Click **"User pools"** (left sidebar)
4. Click on **"eu-north-1_v8P404noM"** (Fleeto user pool)

---

## Step 2: Create User

1. Click **"Users"** tab
2. Click **"Create user"** button

**User information:**
- **Email address:** `admin@test.com`
- **Email verified:** ✅ Check this box
- **Phone number:** Leave empty
- **Temporary password:** `TestPassword123!`

Click **"Create user"**

---

## Step 3: Set Permanent Password

1. Click on the newly created user (`admin@test.com`)
2. Click **"Actions"** dropdown
3. Click **"Set permanent password"**
4. Enter password: `TestPassword123!`
5. ✅ Check **"Set as permanent password"**
6. Click **"Set password"**

---

## Step 4: Add to Admin Group (Optional)

If you have an admin group:

1. On the user details page, click **"Groups"** tab
2. Click **"Add user to group"**
3. Select **"admin"** group
4. Click **"Add to group"**

---

## Step 5: Login to Admin Portal

1. Go to http://localhost:3000
2. Enter username: `admin@test.com`
3. Click **"Continue"**
4. Enter password: `TestPassword123!`
5. Click **"Sign in"**

---

## ✅ Done!

You should now be logged into the Fleeto Admin Dashboard.

---

## Alternative: Use the Sign-Up Flow

If the above doesn't work, you can also:

1. Go to http://localhost:3000
2. Look for a **"Sign up"** or **"Create account"** link
3. Register with:
   - Email: `admin@test.com`
   - Password: `TestPassword123!`
4. Then login with those credentials

---

## Test User Credentials Summary

| Field | Value |
|-------|-------|
| **Username** | admin@test.com |
| **Password** | TestPassword123! |
| **Email** | admin@test.com |

---

## Next Steps

Once logged in, you can:
- View all vehicles
- View all bookings (admin sees everything)
- Manage users
- View dashboard statistics
