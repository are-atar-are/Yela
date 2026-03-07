#!/bin/bash
# Xcode Installation Script for Yela Development

set -e

echo "🍎 Xcode Installation Script"
echo "=============================="
echo ""

# Check if Xcode is already installed
if [ -d "/Applications/Xcode.app" ]; then
    echo "✅ Xcode is already installed at /Applications/Xcode.app"
    echo ""
    echo "Setting up Xcode command line tools..."
    sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
    sudo xcodebuild -runFirstLaunch
    echo "✅ Xcode setup complete!"
    exit 0
fi

echo "Xcode is not installed. You have two options:"
echo ""
echo "Option 1: Install via Mac App Store (Recommended)"
echo "------------------------------------------------"
echo "1. Open App Store"
echo "2. Search for 'Xcode'"
echo "3. Click 'Get' and install (requires ~12GB free space)"
echo ""
echo "Option 2: Install via Apple Developer Portal"
echo "--------------------------------------------"
echo "1. Go to: https://developer.apple.com/download/"
echo "2. Sign in with your Apple ID"
echo "3. Download 'Xcode 15.x' (latest stable)"
echo "4. Extract the .xip file (double-click)"
echo "5. Drag Xcode.app to /Applications"
echo ""
echo "Option 3: Install via xcodes CLI (requires Apple ID)"
echo "----------------------------------------------------"
echo "Run: xcodes install 15.4"
echo ""

read -p "Press Enter to open Mac App Store, or type 'dev' for Developer Portal: " choice

if [ "$choice" = "dev" ]; then
    open "https://developer.apple.com/download/"
else
    open -a "App Store"
fi

echo ""
echo "After Xcode is installed, run this script again to complete setup."
echo ""
echo "Next steps after Xcode installation:"
echo "1. Run: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
echo "2. Run: sudo xcodebuild -runFirstLaunch"
echo "3. Run: cd Yela/ios && fastlane match init"
