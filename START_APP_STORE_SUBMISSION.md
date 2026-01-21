
# 🚀 Start Here: App Store Submission Guide

## What You Need to Do

Your Fairway app is ready for the App Store! You just need to authenticate with Apple and configure a few settings.

---

## 📋 Quick 3-Step Process

### Step 1: Get Your Apple Team ID (2 minutes)

1. Go to https://developer.apple.com/account
2. Sign in with your Apple ID
3. Click **Membership** in the sidebar
4. Copy your **Team ID** (format: ABCDE12345)

### Step 2: Update eas.json (1 minute)

Open the file `eas.json` in your project and find this section:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "YOUR_APPLE_ID@example.com",
      "ascAppId": "LEAVE_EMPTY_UNTIL_APP_CREATED_IN_APP_STORE_CONNECT",
      "appleTeamId": "YOUR_TEAM_ID_FROM_APPLE_DEVELOPER_PORTAL",
      "sku": "fairway-golf-tracker"
    }
  }
}
```

Replace:
- `YOUR_APPLE_ID@example.com` with your actual Apple Developer email
- `YOUR_TEAM_ID_FROM_APPLE_DEVELOPER_PORTAL` with the Team ID from Step 1

**Leave `ascAppId` empty for now** - you'll get this after creating the app in App Store Connect.

### Step 3: Build Your App (10 minutes)

Run these commands in your terminal:

```bash
# Install EAS CLI if you haven't already
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios --profile production
```

**During the build, EAS will:**
- Prompt you to authenticate with your Apple account (if needed)
- Automatically generate certificates and provisioning profiles
- Build your app in the cloud

---

## 📱 After the Build Completes

### Create Your App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click **My Apps** → **+** → **New App**
3. Fill in:
   - Platform: **iOS**
   - Name: **Fairway**
   - Language: **English (US)**
   - Bundle ID: **com.fairway.golftracker**
   - SKU: **fairway-golf-tracker**
4. Click **Create**
5. Look at the URL - it will be like: `https://appstoreconnect.apple.com/apps/1234567890/...`
6. Copy that number (1234567890) - this is your **App Store Connect App ID**
7. Update `eas.json` with this number in the `ascAppId` field

### Submit to App Store

```bash
eas submit --platform ios --profile production
```

This will automatically upload your app to App Store Connect!

---

## 📝 Complete Your App Store Listing

In App Store Connect, you need to add:

### Required Information
- **Screenshots** (3 device sizes - see guide below)
- **App Description** (provided below)
- **Keywords** (provided below)
- **Privacy Policy URL** (you need to host this)
- **Support URL** (your email or website)
- **Pricing** (Free or paid)

### Screenshots Needed

Take screenshots of these screens on an iPhone:
1. Home/Discover screen
2. Course logging screen
3. Rating flow
4. Profile with stats
5. Social feed

You need 3 sizes:
- 6.7" Display (1290 x 2796 pixels) - iPhone 15 Pro Max
- 6.5" Display (1242 x 2688 pixels) - iPhone 11 Pro Max
- 5.5" Display (1242 x 2208 pixels) - iPhone 8 Plus

### App Description (Copy This)

```
Track your golf journey with Fairway - the ultimate golf course tracker.

FEATURES:
• Log every round you play
• Rate and review golf courses with our unique comparison system
• Build your personalized golf profile
• Discover new courses tailored to your preferences
• Connect with friends and compare experiences
• Track your progress with stats and badges
• Beautiful, intuitive interface

Whether you're a weekend warrior or a serious golfer, Fairway helps you remember every course, track your favorites, and discover your next great round.

Like Beli for restaurants, but for golf courses.

RATING SYSTEM:
Our innovative rating system helps you accurately rate courses by comparing them to courses you've already played. No more arbitrary 1-10 ratings - just simple comparisons that build your personalized course rankings.

SOCIAL FEATURES:
• Follow friends and see what courses they're playing
• Compare ratings and experiences
• Discover new courses through your network
• Share your golf journey

TRACK YOUR PROGRESS:
• Total rounds played
• Total courses visited
• Personal course rankings
• Badges and achievements
• Beautiful stats dashboard

Start building your golf profile today!
```

### Keywords (Copy This)

```
golf, golf courses, golf tracker, golf app, course rating, golf rounds, golf stats, golf social, golf discovery, golf profile, golf logger, golf journal, golf scorecard, golf handicap, golf game
```

---

## ✅ Final Steps

1. Complete all required fields in App Store Connect
2. Upload screenshots
3. Add privacy policy URL
4. Click **Add for Review**
5. Answer the review questions
6. Click **Submit for Review**

**Review time:** Usually 24-48 hours

---

## 🚨 Important Notes

### Bundle Identifier
Your app uses: `com.fairway.golftracker`

If this is already taken by someone else, you'll need to change it to something unique like:
- `com.yourname.fairway`
- `com.yourcompany.fairway`

To change it:
1. Update `bundleIdentifier` in `app.json`
2. Register the new bundle ID at https://developer.apple.com/account/resources/identifiers/list
3. Rebuild with `eas build --platform ios --profile production`

### Privacy Policy
You need to create and host a privacy policy. It should cover:
- What data you collect (contacts, location, user content)
- How you use the data
- How users can delete their data
- Contact information

You can use a privacy policy generator or hire a lawyer to create one.

---

## 📚 Detailed Guides

For more detailed information, see:
- **APPLE_AUTHENTICATION_GUIDE.md** - Complete step-by-step guide
- **QUICK_APPLE_AUTH_STEPS.md** - Fast track guide
- **APP_STORE_SUBMISSION_CHECKLIST.md** - Complete checklist
- **APPLE_AUTH_COMMANDS.md** - Command reference

---

## 🆘 Need Help?

### Common Issues

**"No valid signing identity"**
→ EAS will automatically generate certificates during build

**"Bundle ID already taken"**
→ Change `bundleIdentifier` in `app.json` to something unique

**"Authentication failed"**
→ Open Xcode → Settings → Accounts → Add your Apple ID

**"Missing Team ID"**
→ Get it from https://developer.apple.com/account (Membership section)

### Support Resources
- EAS Documentation: https://docs.expo.dev/build/introduction/
- App Store Connect: https://developer.apple.com/support/app-store-connect/
- Expo Forums: https://forums.expo.dev/

---

## 🎯 Summary

**What you need:**
1. Apple Developer account ($99/year)
2. Your Team ID from developer.apple.com
3. Update `eas.json` with your Apple ID and Team ID
4. Run `eas build --platform ios --profile production`
5. Create app in App Store Connect
6. Run `eas submit --platform ios --profile production`
7. Complete App Store listing
8. Submit for review

**Total time:** ~1-2 hours for first submission

**You've got this! 🚀⛳**
