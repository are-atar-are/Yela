#!/bin/bash
# Setup script for CI/CD secrets and configuration

set -e

echo "🚀 Setting up Yela CI/CD..."

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not found. Install it first:"
    echo "   brew install gh"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub. Run: gh auth login"
    exit 1
fi

echo ""
echo "📋 Required Secrets to Configure:"
echo ""
echo "1. MATCH_PASSWORD - Encryption password for Fastlane Match"
echo "2. MATCH_GIT_URL - Private repo URL for certificates/keystores"
echo "3. APP_STORE_CONNECT_KEY_ID - App Store Connect API Key ID"
echo "4. APP_STORE_CONNECT_ISSUER_ID - App Store Connect Issuer ID"
echo "5. APP_STORE_CONNECT_KEY_CONTENT - App Store Connect API Key (.p8 content)"
echo "6. GOOGLE_PLAY_SERVICE_ACCOUNT_JSON - Google Play Service Account JSON"
echo "7. SLACK_WEBHOOK_URL - Slack webhook for notifications (optional)"
echo ""

read -p "Do you want to set these secrets now? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
    
    echo "Setting secrets for: $REPO"
    echo ""
    
    read -p "MATCH_PASSWORD: " MATCH_PASSWORD
    gh secret set MATCH_PASSWORD -b "$MATCH_PASSWORD" -R "$REPO"
    
    read -p "MATCH_GIT_URL: " MATCH_GIT_URL
    gh secret set MATCH_GIT_URL -b "$MATCH_GIT_URL" -R "$REPO"
    
    read -p "APP_STORE_CONNECT_KEY_ID: " KEY_ID
    gh secret set APP_STORE_CONNECT_KEY_ID -b "$KEY_ID" -R "$REPO"
    
    read -p "APP_STORE_CONNECT_ISSUER_ID: " ISSUER_ID
    gh secret set APP_STORE_CONNECT_ISSUER_ID -b "$ISSUER_ID" -R "$REPO"
    
    echo "Paste APP_STORE_CONNECT_KEY_CONTENT (.p8 content, end with Ctrl+D):"
    KEY_CONTENT=$(cat)
    gh secret set APP_STORE_CONNECT_KEY_CONTENT -b "$KEY_CONTENT" -R "$REPO"
    
    echo "Paste GOOGLE_PLAY_SERVICE_ACCOUNT_JSON (end with Ctrl+D):"
    SERVICE_ACCOUNT=$(cat)
    gh secret set GOOGLE_PLAY_SERVICE_ACCOUNT_JSON -b "$SERVICE_ACCOUNT" -R "$REPO"
    
    read -p "SLACK_WEBHOOK_URL (optional): " SLACK_URL
    if [ ! -z "$SLACK_URL" ]; then
        gh secret set SLACK_WEBHOOK_URL -b "$SLACK_URL" -R "$REPO"
    fi
    
    echo ""
    echo "✅ Secrets configured!"
fi

echo ""
echo "📚 Next Steps:"
echo "1. Set up App Store Connect API Key"
echo "2. Set up Google Play Service Account"
echo "3. Initialize Fastlane Match for iOS certificates"
echo "4. Upload first build manually to create store listings"
echo ""
echo "See Documentation/features/ci-cd-pipeline.md for detailed instructions."
