
# 🚀 TestFlight Deployment Guide - FAIRWAY

## Quick Start (5 Steps to TestFlight)

### Step 1: Verify Environment
```bash
# Check that .env file exists and has Supabase credentials
cat .env

# Should show:
# EXPO_PUBLIC_SUPABASE_URL=https://hwpiblxpxghuzpkaenwg.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
# EXPO_PUBLIC_GOLF_COURSE_API_KEY=U2RVDJNGLFSNE5B2MAOAZGX2SM
```

### Step 2: Test Locally
```bash
# Install dependencies
npm install

# Run on iOS simulator
npm run ios

# Test these features:
# ✅ Sign up with email/password
# ✅ Create profile
# ✅ Log a round
# ✅ Rate a course
# ✅ View social feed
```

### Step 3: Configure EAS Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure
```

### Step 4: Build for iOS
```bash
# Build for TestFlight
eas build --platform ios --profile production

# This will:
# 1. Upload your code to Expo servers
# 2. Build the iOS app
# 3. Generate an .ipa file
# 4. Take about 15-20 minutes
```

### Step 5: Submit to TestFlight
```bash
# Submit to App Store Connect
eas submit --platform ios

# You'll need:
# - Apple Developer account
# - App Store Connect API key
# - Bundle identifier (com.yourcompany.fairway)
```

## 📋 Pre-Deployment Checklist

### ✅ Backend Ready
- [x] Supabase project created
- [x] Database schema deployed
- [x] RLS policies enabled
- [x] Environment variables configured
- [x] Storage services updated

### ✅ App Configuration
- [ ] Update `app.json` with your bundle identifier
- [ ] Update app name and description
- [ ] Add app icon (1024x1024)
- [ ] Add splash screen
- [ ] Configure version number

### ✅ Apple Developer Setup
- [ ] Apple Developer account ($99/year)
- [ ] App Store Connect access
- [ ] Bundle identifier registered
- [ ] Certificates and provisioning profiles

### ✅ Optional Features
- [ ] Configure Google OAuth (optional)
- [ ] Configure Apple OAuth (optional)
- [ ] Create avatars storage bucket
- [ ] Set up push notifications (optional)

## 🔧 Configuration Files to Update

### 1. app.json
```json
{
  "expo": {
    "name": "FAIRWAY",
    "slug": "fairway",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.fairway",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.fairway",
      "versionCode": 1
    }
  }
}
```

### 2. eas.json (if not exists)
```json
{
  "build": {
    "production": {
      "ios": {
        "distribution": "store",
        "autoIncrement": true
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-id"
      }
    }
  }
}
```

## 🎨 Assets Needed

### App Icon
- Size: 1024x1024 pixels
- Format: PNG
- No transparency
- No rounded corners (iOS adds them)
- Location: `assets/images/icon.png`

### Splash Screen
- Size: 1284x2778 pixels (iPhone 14 Pro Max)
- Format: PNG
- Background color: #57C8A1 (mint green)
- Location: `assets/images/splash.png`

## 🔐 Supabase Setup (Already Done)

### ✅ Completed
- [x] Database tables created
- [x] RLS policies enabled
- [x] Auth configured
- [x] Environment variables set

### 🔄 Optional (Do Later)
- [ ] Create `avatars` storage bucket
- [ ] Configure Google OAuth
- [ ] Configure Apple OAuth
- [ ] Set up email templates

## 📱 Testing Before Submission

### Test on Real Device
```bash
# Build development version
eas build --platform ios --profile development

# Install on device via TestFlight or direct install
```

### Test These Features
1. **Authentication**
   - Sign up with email/password
   - Sign in
   - Sign out
   - Password reset (if implemented)

2. **Core Features**
   - Create profile
   - Log a round
   - Search for courses
   - Rate a course
   - View ratings

3. **Social Features**
   - Follow another user
   - View social feed
   - Like a post
   - Comment on a post
   - View followers/following

4. **Edge Cases**
   - Offline mode
   - Poor network connection
   - App backgrounding
   - Push notifications (if enabled)

## 🚨 Common Issues

### Build Fails
```bash
# Clear cache and retry
eas build --platform ios --profile production --clear-cache
```

### Authentication Not Working
1. Check `.env` file has correct Supabase URL and key
2. Verify Supabase project is active
3. Check Supabase Dashboard → Authentication

### Data Not Saving
1. Check RLS policies in Supabase
2. Verify user is authenticated
3. Check console logs for errors

### App Crashes on Launch
1. Check for JavaScript errors in logs
2. Verify all dependencies are installed
3. Test on simulator first

## 📊 Monitoring After Launch

### Supabase Dashboard
- Monitor user signups
- Check database usage
- View API requests
- Monitor errors

### App Store Connect
- Track downloads
- Monitor crashes
- Read user reviews
- Check TestFlight feedback

### Expo Dashboard
- View build history
- Monitor updates
- Check analytics

## 🎯 Next Steps After TestFlight

1. **Invite Beta Testers**
   - Add testers in App Store Connect
   - Send TestFlight invitations
   - Collect feedback

2. **Iterate Based on Feedback**
   - Fix bugs
   - Improve UX
   - Add requested features

3. **Prepare for App Store**
   - Create app screenshots
   - Write app description
   - Set pricing (free)
   - Submit for review

4. **Launch! 🚀**
   - Submit to App Store
   - Wait for review (1-3 days)
   - Celebrate launch!

## 📞 Support

### Supabase Issues
- Dashboard: https://app.supabase.com/project/hwpiblxpxghuzpkaenwg
- Docs: https://supabase.com/docs
- Support: https://supabase.com/support

### Expo Issues
- Dashboard: https://expo.dev
- Docs: https://docs.expo.dev
- Forums: https://forums.expo.dev

### App Store Issues
- App Store Connect: https://appstoreconnect.apple.com
- Developer Portal: https://developer.apple.com
- Support: https://developer.apple.com/support

## ✅ You're Ready!

Your app is fully configured and ready for TestFlight deployment. Just run:

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

Good luck with your launch! 🚀⛳
