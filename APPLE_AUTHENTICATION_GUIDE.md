
# Apple Authentication & App Store Setup Guide

## 🍎 Step 1: Apple Developer Account Setup

### Create/Access Your Apple Developer Account
1. Go to https://developer.apple.com
2. Sign in with your Apple ID (or create one)
3. Enroll in the Apple Developer Program ($99/year)
   - Click "Account" → "Enroll"
   - Complete the enrollment process
   - Wait for approval (usually 24-48 hours)

### Find Your Apple Team ID
1. Go to https://developer.apple.com/account
2. Sign in with your Apple ID
3. Click on "Membership" in the sidebar
4. Your **Team ID** is displayed (format: ABCDE12345)
5. **Copy this Team ID** - you'll need it below

---

## 🔐 Step 2: Authenticate Xcode with Your Apple Account

### Option A: Authenticate via Xcode (Recommended)
1. Open Xcode on your Mac
2. Go to **Xcode → Settings** (or Preferences on older versions)
3. Click the **Accounts** tab
4. Click the **+** button in the bottom left
5. Select **Apple ID**
6. Enter your Apple Developer account email and password
7. Click **Sign In**
8. Your account should now appear in the list
9. Select your account and verify your Team ID is shown

### Option B: Authenticate via Command Line
```bash
# Install Xcode Command Line Tools if not already installed
xcode-select --install

# Sign in to your Apple account
xcrun altool --list-providers -u "your-apple-id@example.com" -p "your-app-specific-password"
```

---

## 📱 Step 3: Configure Your App for App Store

### Update Your Bundle Identifier
Your bundle identifier is already set to: `com.fairway.golftracker`

**Important:** This must be unique across the entire App Store. If someone else has registered this, you'll need to change it to something like:
- `com.yourcompany.fairway`
- `com.yourusername.fairway`
- `com.fairwaygolf.app`

### Register Your Bundle Identifier in Apple Developer Portal
1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click the **+** button to create a new identifier
3. Select **App IDs** → Continue
4. Select **App** → Continue
5. Enter:
   - **Description:** Fairway Golf Tracker
   - **Bundle ID:** `com.fairway.golftracker` (or your custom one)
6. Select capabilities you need:
   - ✅ Associated Domains (for deep linking)
   - ✅ Push Notifications (if you plan to add them)
7. Click **Continue** → **Register**

---

## 🔧 Step 4: Update Your Configuration Files

### Update eas.json with Your Apple Information

Open `eas.json` and update the `submit.production.ios` section:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-actual-apple-id@example.com",
      "ascAppId": "LEAVE_EMPTY_FOR_NOW",
      "appleTeamId": "YOUR_TEAM_ID_HERE",
      "sku": "fairway-golf-tracker"
    }
  }
}
```

Replace:
- `your-actual-apple-id@example.com` → Your Apple Developer account email
- `YOUR_TEAM_ID_HERE` → Your Team ID from Step 1
- `ascAppId` → Leave empty until you create the app in App Store Connect (Step 5)

---

## 📦 Step 5: Create Your App in App Store Connect

### Create the App Listing
1. Go to https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account
3. Click **My Apps** → **+** button → **New App**
4. Fill in the form:
   - **Platform:** iOS
   - **Name:** Fairway
   - **Primary Language:** English (US)
   - **Bundle ID:** Select `com.fairway.golftracker` from dropdown
   - **SKU:** `fairway-golf-tracker` (must match eas.json)
   - **User Access:** Full Access
5. Click **Create**

### Get Your App Store Connect App ID
1. After creating the app, you'll see the app's page
2. Look at the URL: `https://appstoreconnect.apple.com/apps/1234567890/...`
3. The number `1234567890` is your **ascAppId**
4. Copy this number and update it in `eas.json`

---

## 🏗️ Step 6: Build Your App with EAS

### Install EAS CLI (if not already installed)
```bash
npm install -g eas-cli
```

### Login to Expo
```bash
eas login
```

### Configure Your Project
```bash
eas build:configure
```

### Build for iOS Production
```bash
eas build --platform ios --profile production
```

This will:
- ✅ Authenticate with your Apple account
- ✅ Create necessary certificates and provisioning profiles
- ✅ Build your app in the cloud
- ✅ Generate an IPA file ready for App Store submission

**During the build, EAS will prompt you to:**
1. Sign in to your Apple account (if not already authenticated)
2. Confirm your Team ID
3. Generate certificates and provisioning profiles automatically

---

## 📤 Step 7: Submit to App Store

### Automatic Submission via EAS
```bash
eas submit --platform ios --profile production
```

This will automatically upload your app to App Store Connect.

### Manual Submission via Transporter
1. Download your IPA from the EAS build page
2. Download **Transporter** app from Mac App Store
3. Open Transporter and sign in with your Apple ID
4. Drag and drop your IPA file
5. Click **Deliver**

---

## 📝 Step 8: Complete App Store Listing

Go to App Store Connect and fill in all required information:

### App Information
- **Name:** Fairway
- **Subtitle:** Track Your Golf Journey
- **Category:** Sports
- **Content Rights:** Check if you have all rights

### Pricing and Availability
- **Price:** Free (or set your price)
- **Availability:** All countries or select specific ones

### App Privacy
- **Privacy Policy URL:** Add your privacy policy URL
- **Data Collection:** Declare what data you collect
  - ✅ Contact Info (for friend connections)
  - ✅ Location (for course discovery)
  - ✅ User Content (rounds, ratings, photos)

### Screenshots and Previews
You need screenshots for:
- **6.7" Display** (iPhone 15 Pro Max): 1290 x 2796 pixels
- **6.5" Display** (iPhone 11 Pro Max): 1242 x 2688 pixels
- **5.5" Display** (iPhone 8 Plus): 1242 x 2208 pixels

Take screenshots of:
1. Home/Discover screen
2. Course logging screen
3. Rating flow
4. Profile with stats
5. Social feed

### App Description
```
Track your golf journey with Fairway - the ultimate golf course tracker.

FEATURES:
• Log every round you play
• Rate and review golf courses
• Build your personalized golf profile
• Discover new courses tailored to your preferences
• Connect with friends and compare experiences
• Track your progress with stats and badges
• Beautiful, intuitive interface

Whether you're a weekend warrior or a serious golfer, Fairway helps you remember every course, track your favorites, and discover your next great round.

Like Beli for restaurants, but for golf courses.
```

### Keywords
```
golf, golf courses, golf tracker, golf app, course rating, golf rounds, golf stats, golf social, golf discovery, golf profile
```

### Support URL
Add a support email or website where users can get help.

### Marketing URL (Optional)
Your app's website or landing page.

---

## ✅ Step 9: Submit for Review

1. In App Store Connect, go to your app
2. Click **+ Version or Platform** → **iOS**
3. Enter version number: `1.0.0`
4. Fill in "What's New in This Version"
5. Add screenshots
6. Complete all required fields
7. Click **Add for Review**
8. Answer the App Review questions:
   - Does your app use encryption? → No (already set in app.json)
   - Does your app access third-party content? → No
9. Click **Submit for Review**

**Review Timeline:** Usually 24-48 hours, but can take up to 7 days.

---

## 🚨 Common Issues & Solutions

### Issue: "No valid code signing identity found"
**Solution:** Run `eas build --platform ios --profile production` and let EAS generate certificates automatically.

### Issue: "Bundle identifier already in use"
**Solution:** Change your bundle identifier in `app.json` to something unique:
```json
"ios": {
  "bundleIdentifier": "com.yourcompany.fairway"
}
```

### Issue: "Invalid provisioning profile"
**Solution:** Delete old profiles and let EAS regenerate:
```bash
eas credentials --platform ios
# Select "Remove provisioning profile"
# Then rebuild
```

### Issue: "Missing compliance information"
**Solution:** Already handled in `app.json` with `ITSAppUsesNonExemptEncryption: false`

### Issue: "App icon missing"
**Solution:** Your icon is set to `./assets/images/natively-dark.png`. Make sure this file exists and is 1024x1024 pixels.

---

## 📋 Pre-Submission Checklist

Before submitting, verify:

- ✅ Apple Developer account is active ($99/year paid)
- ✅ Bundle identifier is registered in Apple Developer Portal
- ✅ App created in App Store Connect
- ✅ `eas.json` updated with your Apple ID, Team ID, and App ID
- ✅ App icon is 1024x1024 PNG with no transparency
- ✅ Screenshots prepared for all required device sizes
- ✅ Privacy policy URL added
- ✅ App description and keywords written
- ✅ Support URL/email provided
- ✅ All required permissions explained in Info.plist
- ✅ App tested on real device (not just simulator)
- ✅ No crashes or major bugs
- ✅ Complies with App Store Review Guidelines

---

## 🎯 Quick Start Commands

```bash
# 1. Login to EAS
eas login

# 2. Build for production
eas build --platform ios --profile production

# 3. Submit to App Store
eas submit --platform ios --profile production

# 4. Check build status
eas build:list

# 5. View submission status
eas submit:list
```

---

## 📞 Need Help?

- **EAS Documentation:** https://docs.expo.dev/build/introduction/
- **App Store Connect Help:** https://developer.apple.com/support/app-store-connect/
- **Expo Forums:** https://forums.expo.dev/
- **Apple Developer Support:** https://developer.apple.com/contact/

---

## 🎉 You're Ready!

Follow these steps in order, and you'll have your app submitted to the App Store. The most important steps are:

1. Get your Team ID from Apple Developer Portal
2. Update `eas.json` with your Apple information
3. Run `eas build --platform ios --profile production`
4. Complete your App Store Connect listing
5. Submit for review

Good luck with your launch! 🚀⛳
