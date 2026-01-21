
# 🎯 START HERE - Fairway App Store Launch

Welcome! This guide will get you from where you are now to having Fairway live on the App Store and Google Play Store.

## 📍 Where You Are Now

✅ **Fully functional app** with all features implemented:
- Course tracking and logging
- Smart rating system
- Social features (friends, feed)
- Contact sync
- Golf Course API integration
- User profiles with stats and badges

✅ **Complete documentation** for launch

✅ **Ready for App Store submission** - just need to generate icons and configure accounts

## 🎯 What You Need to Do

### Total Time: ~3-4 hours
### Review Time: 1-3 days (iOS), 1-7 days (Android)

---

## Step 1: Generate App Icons (5 minutes)

1. Open `assets/images/generate-icons.html` in your web browser
2. Click **"Generate All Icons"**
3. Download all icons
4. Save them to `assets/images/`:
   - `app-icon.png` (1024x1024)
   - `adaptive-icon.png` (1024x1024)
   - `splash-icon.png` (400x400)

**Why**: App stores require specific icon sizes and formats

---

## Step 2: Set Up EAS (10 minutes)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to your Expo account
eas login

# Initialize EAS project
eas init
```

This will give you a **project ID**. Copy it and update `app.json`:

```json
"extra": {
  "eas": {
    "projectId": "paste-your-project-id-here"
  }
}
```

**Why**: EAS (Expo Application Services) builds and submits your app

---

## Step 3: Create App Store Accounts (30 minutes)

### iOS - App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Click **"My Apps"** → **"+"** → **"New App"**
3. Fill in:
   - Name: **Fairway**
   - Bundle ID: **com.fairway.golftracker**
   - SKU: **fairway-golf-tracker**
4. Save the following for later:
   - Your Apple ID email
   - App Store Connect App ID (10-digit number)
   - Team ID (from Membership page)

### Android - Google Play Console

1. Go to [play.google.com/console](https://play.google.com/console)
2. Click **"Create app"**
3. Fill in:
   - Name: **Fairway**
   - Package: **com.fairway.golftracker**
4. Complete the store listing (you'll add details later)

**Why**: You need these accounts to submit your app

---

## Step 4: Update Configuration (5 minutes)

Update `eas.json` with your account details:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-apple-id@example.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCDE12345"
    }
  }
}
```

**Why**: EAS needs these to submit your app automatically

---

## Step 5: Prepare Screenshots (1-2 hours)

You need screenshots showing your app's key features:

### iOS Screenshots Needed
- iPhone 6.7" (1290 x 2796) - at least 3 screenshots
- iPhone 6.5" (1242 x 2688) - at least 3 screenshots

### Android Screenshots Needed
- Phone (1080 x 1920) - at least 2 screenshots

### Recommended Screenshots
1. **Home/Discover** - Course cards and search
2. **Rating Flow** - The unique rating experience
3. **Profile** - Stats, badges, and achievements
4. **Social Feed** - Friend activity
5. **Course Detail** - Course information and ratings

**Tip**: Use iOS Simulator and Android Emulator to capture screenshots at the correct sizes

**Why**: App stores require screenshots to show users what your app looks like

---

## Step 6: Build Your App (30 minutes)

```bash
# Build for both platforms
eas build --platform all --profile production
```

This will:
- Build iOS (.ipa file)
- Build Android (.aab file)
- Take ~20-30 minutes

**Why**: Creates the actual app files to submit to stores

---

## Step 7: Test with TestFlight/Internal Testing (30 minutes)

### iOS - TestFlight
```bash
eas submit --platform ios --profile production
```

Then:
1. Go to App Store Connect
2. Find your app under TestFlight
3. Invite yourself as a tester
4. Install and test on your iPhone

### Android - Internal Testing
```bash
eas submit --platform android --profile production
```

Then:
1. Go to Google Play Console
2. Create an internal testing track
3. Add yourself as a tester
4. Install and test on your Android device

**Why**: Catch any issues before public release

---

## Step 8: Complete Store Listings (30 minutes)

### iOS - App Store Connect

Fill in:
- **Description**: See `APP_STORE_LAUNCH_GUIDE.md` for full text
- **Keywords**: golf, golf courses, golf tracker, course ratings, golf social
- **Category**: Sports
- **Screenshots**: Upload the ones you prepared
- **Privacy Policy URL**: https://yourdomain.com/privacy
- **Support URL**: https://yourdomain.com/support

### Android - Google Play Console

Fill in:
- **Short description**: "Track your golf journey. Log rounds, rate courses, build your golf profile."
- **Full description**: See `APP_STORE_LAUNCH_GUIDE.md` for full text
- **Category**: Sports
- **Screenshots**: Upload the ones you prepared
- **Privacy Policy URL**: https://yourdomain.com/privacy

**Why**: Users need to understand what your app does before downloading

---

## Step 9: Submit for Review (15 minutes)

### iOS
1. In App Store Connect, go to your app
2. Click **"Submit for Review"**
3. Answer the questionnaire
4. Submit

### Android
1. In Google Play Console, go to your app
2. Click **"Send for review"**
3. Complete any required information
4. Submit

**Why**: This is the final step to get your app live!

---

## Step 10: Wait for Approval

- **iOS**: Usually 1-3 days
- **Android**: Usually 1-7 days

You'll receive an email when your app is approved or if there are any issues.

---

## 🎉 You're Done!

Once approved, your app will be live on the App Store and Google Play Store!

## 📚 Detailed Documentation

Need more details? Check these guides:

- **[LAUNCH_READY.md](LAUNCH_READY.md)** - Complete overview
- **[APP_STORE_LAUNCH_GUIDE.md](APP_STORE_LAUNCH_GUIDE.md)** - Detailed step-by-step
- **[FINAL_PRE_LAUNCH_CHECKLIST.md](FINAL_PRE_LAUNCH_CHECKLIST.md)** - Full checklist
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick reference card
- **[assets/images/ICON_SPECS.md](assets/images/ICON_SPECS.md)** - Icon specifications

## 🆘 Need Help?

- **Verify everything is ready**: `npm run verify-launch`
- **Troubleshooting**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **EAS Documentation**: https://docs.expo.dev/eas/
- **Expo Forums**: https://forums.expo.dev

## ✅ Quick Verification

Run this to check if everything is ready:

```bash
npm run verify-launch
```

This will check:
- ✅ All required files exist
- ✅ Configuration is correct
- ✅ Dependencies are installed
- ✅ Documentation is available

---

## 🚀 Ready to Start?

1. **Right now**: Generate icons (Step 1)
2. **Next**: Set up EAS (Step 2)
3. **Then**: Follow steps 3-10

**You've got this!** The app is ready, you just need to package it up and submit it. 

Good luck with your launch! 🎉⛳

---

**Questions?** Everything you need is in the documentation files listed above.
