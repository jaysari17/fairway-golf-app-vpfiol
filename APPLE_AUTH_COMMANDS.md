
# Apple Authentication Commands Reference

## 🔐 Authentication Commands

### Check if Xcode is installed
```bash
xcode-select -p
```

### Install Xcode Command Line Tools
```bash
xcode-select --install
```

### Check Xcode version
```bash
xcodebuild -version
```

### List available simulators
```bash
xcrun simctl list devices
```

---

## 🏗️ EAS Build Commands

### Install EAS CLI globally
```bash
npm install -g eas-cli
```

### Check EAS CLI version
```bash
eas --version
```

### Login to Expo account
```bash
eas login
```

### Check login status
```bash
eas whoami
```

### Configure EAS for your project
```bash
eas build:configure
```

### Build for iOS (production)
```bash
eas build --platform ios --profile production
```

### Build for iOS (preview/testing)
```bash
eas build --platform ios --profile preview
```

### Build for iOS simulator
```bash
eas build --platform ios --profile development
```

### Check build status
```bash
eas build:list
```

### View specific build details
```bash
eas build:view [BUILD_ID]
```

### Cancel a running build
```bash
eas build:cancel [BUILD_ID]
```

---

## 📤 Submission Commands

### Submit to App Store
```bash
eas submit --platform ios --profile production
```

### Submit specific build
```bash
eas submit --platform ios --profile production --id [BUILD_ID]
```

### Check submission status
```bash
eas submit:list
```

---

## 🔑 Credentials Management

### View iOS credentials
```bash
eas credentials --platform ios
```

### Remove all iOS credentials (fresh start)
```bash
eas credentials --platform ios
# Then select "Remove all credentials"
```

### Generate new push notification key
```bash
eas credentials --platform ios
# Then select "Push Notifications: Manage your Apple Push Notifications Key"
```

---

## 🔍 Debugging Commands

### View build logs
```bash
eas build:view [BUILD_ID]
```

### Check project configuration
```bash
eas config
```

### Validate app.json and eas.json
```bash
eas build:configure
```

### Check for common issues
```bash
npx expo-doctor
```

---

## 📱 Local Development Commands

### Start Expo development server
```bash
npm run ios
```

### Run on specific iOS simulator
```bash
npx expo run:ios --device "iPhone 15 Pro"
```

### Clear cache and restart
```bash
npx expo start --clear
```

---

## 🍎 Apple Developer Commands

### List provisioning profiles
```bash
security find-identity -v -p codesigning
```

### List certificates
```bash
security find-certificate -a -c "Apple Development"
```

### Check bundle identifier availability (via web)
```bash
# Go to: https://developer.apple.com/account/resources/identifiers/list
```

---

## 🚀 Complete Build & Submit Flow

### One-command build and submit
```bash
eas build --platform ios --profile production && eas submit --platform ios --profile production
```

### Build, wait, then submit
```bash
# Build
eas build --platform ios --profile production

# Wait for build to complete, then submit
eas submit --platform ios --profile production
```

---

## 🔧 Troubleshooting Commands

### Clear EAS cache
```bash
eas build --platform ios --profile production --clear-cache
```

### Reset credentials and rebuild
```bash
eas credentials --platform ios
# Select "Remove all credentials"
eas build --platform ios --profile production
```

### Check for outdated dependencies
```bash
npm outdated
```

### Update Expo SDK
```bash
npx expo install expo@latest
```

---

## 📊 Project Information Commands

### View project details
```bash
eas project:info
```

### View project ID
```bash
eas project:info | grep "Project ID"
```

### Link project to EAS
```bash
eas init
```

---

## 🎯 Quick Reference

**Most common workflow:**
```bash
# 1. Login
eas login

# 2. Build
eas build --platform ios --profile production

# 3. Submit
eas submit --platform ios --profile production

# 4. Check status
eas build:list
eas submit:list
```

**If build fails:**
```bash
# Clear cache and try again
eas build --platform ios --profile production --clear-cache

# Or reset credentials
eas credentials --platform ios
# Select "Remove all credentials"
eas build --platform ios --profile production
```

**If submission fails:**
```bash
# Check submission status
eas submit:list

# Try submitting again with specific build
eas submit --platform ios --profile production --id [BUILD_ID]
```

---

## 📞 Get Help

```bash
# EAS help
eas --help

# Build help
eas build --help

# Submit help
eas submit --help

# Credentials help
eas credentials --help
```

---

**Save this file for quick reference during your build and submission process! 🚀**
