#!/bin/bash
# Create App in App Store Connect using API

set -e

KEY_ID="GY3H992G6W"
ISSUER_ID="50f75704-db3f-4938-9a9a-cf560fd69397"
KEY_CONTENT="-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgyes8Qrscd4r9GK58
hjO7eS2kK74+2nX9X+s/+A7o3GegCgYIKoZIzj0DAQehRANCAASQHuwmdGKTTxtQ
6ClWl3nl+SZqPQufQbpQ37r5FD+geJiYuYke8tJzucxgb8JCbMNP7qnaBAqb6Sld
8dOgcCHe
-----END PRIVATE KEY-----"

echo "Creating App ID com.yela.app in App Store Connect..."

# This requires manual creation or using fastlane produce with password
# For now, please create it manually:

echo ""
echo "Please create the app manually:"
echo "1. Go to https://appstoreconnect.apple.com/apps"
echo "2. Click '+' to add new app"
echo "3. Select 'iOS'"
echo "4. Enter:"
echo "   - Name: Yela"
echo "   - Bundle ID: com.yela.app (create new)"
echo "   - SKU: yela-001"
echo ""
echo "Or use fastlane produce with your password:"
echo "fastlane produce -u are.atar.are@gmail.com -a com.yela.app --app_name 'Yela'"
echo ""
