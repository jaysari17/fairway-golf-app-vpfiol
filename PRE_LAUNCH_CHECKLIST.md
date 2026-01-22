
# ✅ Pre-Launch Checklist - FAIRWAY

## 🎯 Complete Before TestFlight Submission

### ✅ Backend (DONE)
- [x] Supabase project created
- [x] Database schema deployed
- [x] RLS policies enabled
- [x] Environment variables configured
- [x] Storage services updated
- [x] Authentication configured

### 📱 App Configuration (TODO)
- [ ] Update `app.json` with your bundle identifier
- [ ] Set app version to 1.0.0
- [ ] Add app icon (1024x1024 PNG)
- [ ] Add splash screen
- [ ] Update app name and description
- [ ] Configure privacy policy URL
- [ ] Configure terms of service URL

### 🍎 Apple Developer (TODO)
- [ ] Apple Developer account ($99/year)
- [ ] Bundle identifier registered
- [ ] App Store Connect app created
- [ ] Certificates and provisioning profiles
- [ ] App Store Connect API key

### 🔧 Optional Features (Can Do Later)
- [ ] Create avatars storage bucket in Supabase
- [ ] Configure Google OAuth
- [ ] Configure Apple OAuth
- [ ] Set up push notifications
- [ ] Add analytics

### 🧪 Testing (RECOMMENDED)
- [ ] Test signup/signin flow
- [ ] Test profile creation
- [ ] Test logging a round
- [ ] Test rating a course
- [ ] Test social feed
- [ ] Test following users
- [ ] Test on real device
- [ ] Test offline mode

## 📝 Detailed Steps

### 1. Update app.json

<write file="app.json">
{
  "expo": {
    "name": "FAIRWAY",
    "slug": "fairway",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "fairway",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#57C8A1"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.fairway",
      "buildNumber": "1",
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "FAIRWAY needs access to your photo library to upload profile pictures.",
        "NSCameraUsageDescription": "FAIRWAY needs access to your camera to take profile pictures.",
        "NSContactsUsageDescription": "FAIRWAY needs access to your contacts to help you find friends who use the app."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#57C8A1"
      },
      "package": "com.yourcompany.fairway",
      "versionCode": 1,
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "CAMERA",
        "READ_CONTACTS"
      ]
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "FAIRWAY needs access to your photo library to upload profile pictures."
        }
      ],
      [
        "expo-contacts",
        {
          "contactsPermission": "FAIRWAY needs access to your contacts to help you find friends who use the app."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "your-project-id-here"
      }
    }
  }
}
