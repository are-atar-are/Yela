# Yela

A React Native mobile application built with TypeScript.

## Getting Started

### Prerequisites

- Node.js >= 18
- React Native development environment setup
- Android Studio (for Android)
- Xcode (for iOS - macOS only)

### Installation

```bash
npm install
```

### Running the App

**Android:**
```bash
npx react-native run-android
```

**iOS:**
```bash
cd ios && bundle install && bundle exec pod install && cd ..
npx react-native run-ios
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── services/       # API calls and services
└── hooks/          # Custom React hooks
```

## Features

- React Navigation for screen navigation
- TypeScript for type safety
- Scalable folder structure
- Reusable Button component
