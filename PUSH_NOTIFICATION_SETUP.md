# Push Notification Implementation Guide

## Overview
Send push notifications to mobile users when their booking status changes (confirmed, cancelled, rejected).

## Architecture

```
Mobile App                    Backend (Admin)                 AWS Services
    │                              │                              │
    │ 1. Get FCM Token             │                              │
    │─────────────────────────────>│                              │
    │                              │                              │
    │ 2. Save token to DynamoDB    │                              │
    │─────────────────────────────>│                              │
    │                              │                              │
    │                              │ 3. Booking status changes    │
    │                              │─────────────────────────────>│
    │                              │                              │
    │                              │ 4. Send push notification    │
    │                              │─────────────────────────────>│
    │                              │                              │
    │ 5. Receive notification      │                              │
    │<─────────────────────────────│                              │
```

## Implementation Steps

### Step 1: Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project "Fleeto"
3. Add Android app:
   - Package name: `com.atar.fleeto`
   - Download `google-services.json`
   - Place in `android/app/`
4. Add iOS app:
   - Bundle ID: `com.atar.fleeto`
   - Download `GoogleService-Info.plist`
   - Place in `ios/`
5. Go to Project Settings > Cloud Messaging
6. Copy Server Key (for backend)

### Step 2: Install Dependencies

**Mobile App:**
```bash
cd /Users/areatar/.openclaw/workspace/ATAR-ENG/arFleetTracker
npm install @react-native-firebase/app @react-native-firebase/messaging
```

**Admin Portal:**
```bash
cd /Users/areatar/.openclaw/workspace/ATAR-ENG/ar-fleeto-admin
npm install @aws-sdk/client-sns
```

### Step 3: Update DynamoDB Schema

Add device token fields to user profile:

```typescript
interface UserProfile {
  userId: string;
  email: string;
  name: string;
  // Add these:
  deviceToken?: string;
  devicePlatform?: 'ios' | 'android';
  tokenUpdatedAt?: string;
}
```

### Step 4: Mobile App Integration

Initialize push notifications on login:

```typescript
// In authService.ts after successful login
import { pushNotificationService } from './pushNotificationService';

// After login success
await pushNotificationService.initialize(user.sub);
```

### Step 5: Admin Portal Integration

Send notification when booking status changes:

```typescript
// In Bookings.tsx when confirming/rejecting
import { pushNotificationSender } from '../services/pushNotificationService';

// When booking is confirmed
await pushNotificationSender.sendBookingStatusNotification(
  user.deviceToken,
  user.devicePlatform,
  booking.bookingId,
  'confirmed',
  vehicle.name
);
```

### Step 6: AWS SNS Setup

1. Go to AWS Console > SNS
2. Create platform applications:
   - iOS: Upload APNS certificate
   - Android: Enter Firebase Server Key
3. Note the Application ARNs

### Step 7: Environment Variables

**Mobile App (.env):**
```
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=fleeto-app
```

**Admin Portal (.env):**
```
REACT_APP_AWS_SNS_IOS_ARN=arn:aws:sns:eu-north-1:xxx:app/APNS/Fleeto-iOS
REACT_APP_AWS_SNS_ANDROID_ARN=arn:aws:sns:eu-north-1:xxx:app/GCM/Fleeto-Android
```

## Notification Types

### Booking Confirmed
```json
{
  "title": "Booking Confirmed!",
  "body": "Your booking for Toyota Hilux has been confirmed.",
  "data": {
    "bookingId": "bk-123",
    "status": "confirmed",
    "type": "booking_status_update"
  }
}
```

### Booking Rejected
```json
{
  "title": "Booking Rejected",
  "body": "Your booking for Toyota Hilux has been rejected.",
  "data": {
    "bookingId": "bk-123",
    "status": "rejected",
    "type": "booking_status_update"
  }
}
```

### Booking Cancelled
```json
{
  "title": "Booking Cancelled",
  "body": "Your booking for Toyota Hilux has been cancelled.",
  "data": {
    "bookingId": "bk-123",
    "status": "cancelled",
    "type": "booking_status_update"
  }
}
```

## Testing

1. **Get device token:**
   - Login on mobile app
   - Check console logs for FCM token

2. **Send test notification:**
   - Use AWS SNS console
   - Or use the admin portal to change booking status

3. **Verify delivery:**
   - Check if notification appears on device
   - Check CloudWatch logs in AWS

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Token not saving | Check DynamoDB permissions |
| Notification not received | Check device token is valid |
| iOS not working | Check APNS certificate is valid |
| Android not working | Check Firebase Server Key |

## Cost

- **Firebase Cloud Messaging:** Free
- **AWS SNS:** 
  - First 1 million notifications/month: Free
  - After that: $0.50 per million

## Security

- Store device tokens securely in DynamoDB
- Use IAM roles for SNS access
- Validate tokens before sending
- Implement rate limiting
