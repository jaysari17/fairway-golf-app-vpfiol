
# FAIRWAY - Complete Deployment Guide

## 🎯 Overview

This guide walks you through deploying FAIRWAY to the Apple App Store and Google Play Store. The app is now fully integrated with GolfCourseAPI for real-time course search.

## 📋 Prerequisites

### Required Accounts
1. **Expo Account** (Free)
   - Sign up at https://expo.dev/

2. **Apple Developer Account** ($99/year)
   - Required for iOS App Store
   - Sign up at https://developer.apple.com/

3. **Google Play Developer Account** ($25 one-time)
   - Required for Android Play Store
   - Sign up at https://play.google.com/console/

4. **GolfCourseAPI Account** (Optional but Recommended)
   - Free tier: 100 requests/month
   - Sign up at https://golfcourseapi.com/
   - Enables course search feature

### Required Software
- Node.js 18+ installed
- npm or yarn package manager
- EAS CLI: `npm install -g eas-cli`

## 🔑 Step 1: Configure GolfCourseAPI

### Get Your API Key
1. Go to https://golfcourseapi.com/
2. Sign up for an account
3. Navigate to your dashboard
4. Copy your API key

### Add to Your Project
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   EXPO_PUBLIC_GOLF_COURSE_API_KEY=your_actual_api_key_here
   ```

3. **Important:** Never commit `.env` to git!

### Configure for Production
Add your API key to EAS secrets:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_GOLF_COURSE_API_KEY --value your_production_api_key
```

## 🎨 Step 2: Create Required Assets

### App Icon (1024x1024px)
Create an app icon with:
- Deep mint green background (#57C8A1)
- Dark green "F" monogram with golf flag
- No transparency
- No rounded corners
- Save as: `assets/images/app-icon.png`

### Splash Screen (400x400px)
Create a splash icon with:
- Mint green background (#57C8A1)
- Centered logo
- Save as: `assets/images/splash-icon.png`

### App Store Screenshots
Required sizes for iOS:
- 6.7" Display: 1290 x 2796 pixels (iPhone 15 Pro Max)
- 6.5" Display: 1242 x 2688 pixels (iPhone 11 Pro Max)
- 5.5" Display: 1242 x 2208 pixels (iPhone 8 Plus)

Recommended screenshots:
1. Social feed with friend activity
2. Course search interface
3. Rating flow (comparison cards)
4. User profile with stats
5. Course ranking list

## ⚙️ Step 3: Configure App Settings

### Update app.json
1. Set your EAS project ID:
   ```json
   "extra": {
     "eas": {
       "projectId": "your-project-id-here"
     }
   }
   ```

2. Verify bundle identifiers:
   - iOS: `com.fairway.golftracker`
   - Android: `com.fairway.golftracker`

### Update eas.json
1. Add your Apple ID:
   ```json
   "submit": {
     "production": {
       "ios": {
         "appleId": "your-apple-id@example.com",
         "ascAppId": "your-app-store-connect-id",
         "appleTeamId": "YOUR-TEAM-ID"
       }
     }
   }
   ```

2. For Android, add service account key path if using automated submission

## 🏗️ Step 4: Build the App

### Initialize EAS
```bash
# Login to Expo
eas login

# Configure EAS for your project
eas build:configure
```

### Build for iOS
```bash
# Create production build
eas build --platform ios --profile production

# This will:
# - Upload your code to EAS servers
# - Build the app in the cloud
# - Generate an .ipa file
# - Take about 15-20 minutes
```

### Build for Android
```bash
# Create production build
eas build --platform android --profile production

# This will:
# - Upload your code to EAS servers
# - Build the app in the cloud
# - Generate an .aab file
# - Take about 15-20 minutes
```

### Build for Both Platforms
```bash
eas build --platform all --profile production
```

## 📱 Step 5: Test Your Builds

### iOS Testing (TestFlight)
1. After build completes, submit to TestFlight:
   ```bash
   eas submit --platform ios --profile production
   ```

2. Go to App Store Connect
3. Navigate to TestFlight
4. Add internal testers
5. Test thoroughly before public release

### Android Testing (Internal Testing)
1. After build completes, submit to Google Play:
   ```bash
   eas submit --platform android --profile production
   ```

2. Go to Google Play Console
3. Navigate to Internal Testing
4. Add test users
5. Test thoroughly before public release

## 🏪 Step 6: App Store Setup

### iOS - App Store Connect

1. **Create App Listing**
   - Go to https://appstoreconnect.apple.com/
   - Click "My Apps" → "+" → "New App"
   - Fill in app information

2. **App Information**
   - Name: Fairway
   - Subtitle: Track Your Golf Journey
   - Category: Sports
   - Secondary Category: Social Networking

3. **Pricing**
   - Price: Free
   - Availability: All countries

4. **App Privacy**
   - Data collected: User Content, Identifiers, Usage Data
   - Data NOT collected: Contact Info, Financial Info, Health, Precise Location

5. **App Description**
   ```
   Track your golf journey. Log rounds, rate courses, and build your ultimate golf profile.

   FAIRWAY is like Beli for golf courses - a social platform for golfers to:

   • LOG ROUNDS - Track every course you play
   • RATE COURSES - Use our unique comparison-based rating system
   • BUILD YOUR PROFILE - Create your golf identity with stats and achievements
   • DISCOVER COURSES - Search thousands of courses worldwide
   • CONNECT WITH FRIENDS - See what courses your friends are playing
   • COMPARE RANKINGS - See how your ratings compare with friends

   Whether you're a weekend warrior or a golf course connoisseur, FAIRWAY helps you track, rate, and share your golf experiences.
   ```

6. **Keywords**
   ```
   golf,courses,tracker,rating,social,rounds,scorecard,handicap,tee time,golf app
   ```

7. **Support URL**
   - Add your support website URL

8. **Privacy Policy URL**
   - Host `privacy-policy.html` on your website
   - Add the URL here

9. **Screenshots**
   - Upload screenshots for all required device sizes
   - Add captions describing each feature

10. **App Review Information**
    - Create a test account
    - Provide login credentials
    - Add review notes explaining the app

### Android - Google Play Console

1. **Create App**
   - Go to https://play.google.com/console/
   - Click "Create app"
   - Fill in app details

2. **Store Listing**
   - App name: Fairway
   - Short description: Track your golf journey
   - Full description: (Use same as iOS)
   - App icon: Upload 512x512 PNG
   - Feature graphic: 1024x500 PNG
   - Screenshots: Upload for phone and tablet

3. **Content Rating**
   - Complete questionnaire
   - Should receive "Everyone" rating

4. **Pricing & Distribution**
   - Free app
   - Available in all countries
   - Ads: No
   - In-app purchases: No

5. **App Content**
   - Privacy policy: Add URL
   - Target audience: Everyone
   - Content declarations: Complete all sections

## 🚀 Step 7: Submit for Review

### iOS Submission
1. In App Store Connect, go to your app
2. Click "Prepare for Submission"
3. Fill in all required information
4. Upload screenshots
5. Add app preview video (optional)
6. Select build from TestFlight
7. Click "Submit for Review"

**Review Time:** Typically 1-3 days

### Android Submission
1. In Google Play Console, go to your app
2. Complete all sections in the left sidebar
3. Go to "Production" → "Create new release"
4. Upload your .aab file
5. Add release notes
6. Click "Review release"
7. Click "Start rollout to Production"

**Review Time:** Typically 1-7 days

## 🧪 Step 8: Testing Checklist

Before submitting, test:

### Core Functionality
- [ ] Course search works (with API key)
- [ ] Course selection works
- [ ] Rating flow completes successfully
- [ ] Social feed displays correctly
- [ ] Profile shows accurate stats
- [ ] Friend requests work
- [ ] Notifications appear
- [ ] App Store review prompt appears appropriately

### UI/UX
- [ ] Dark mode works correctly
- [ ] Light mode works correctly
- [ ] All icons display properly
- [ ] Animations are smooth
- [ ] No layout issues on different screen sizes

### Edge Cases
- [ ] Works without internet connection (with sample data)
- [ ] Works without API key (falls back to sample courses)
- [ ] First-time user experience is smooth
- [ ] Empty states look good (no rounds, no friends)
- [ ] Large data sets work (100+ rounds)

### Permissions
- [ ] Camera permission request works
- [ ] Photo library permission request works
- [ ] Location permission request works (if implemented)

## 📊 Step 9: Post-Launch

### Monitor Performance
1. **App Store Connect / Google Play Console**
   - Check crash reports daily
   - Monitor user reviews
   - Track download numbers

2. **Respond to Reviews**
   - Reply to user feedback within 24-48 hours
   - Address bugs and issues quickly
   - Thank users for positive reviews

3. **Plan Updates**
   - Fix critical bugs immediately
   - Plan feature updates based on feedback
   - Regular updates improve store rankings

### Marketing
1. **Social Media**
   - Create accounts (Twitter, Instagram, TikTok)
   - Share launch announcement
   - Post regular content

2. **Golf Communities**
   - Share in golf subreddits
   - Post in golf forums
   - Reach out to golf influencers

3. **Press**
   - Contact golf blogs and websites
   - Submit to app review sites
   - Create press kit with screenshots

## 🔧 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
npx expo start -c
eas build --platform ios --profile production --clear-cache
```

### API Key Not Working
- Verify key is correct in EAS secrets
- Check API quota hasn't been exceeded
- Test with a different API key

### App Rejected
Common reasons:
- Missing privacy policy
- Incomplete app description
- Crashes during review
- Missing test account credentials

**Solution:** Address the issue and resubmit

### Crashes in Production
1. Check crash logs in App Store Connect / Play Console
2. Reproduce the issue locally
3. Fix and submit update
4. Use EAS Update for quick fixes (if applicable)

## 📞 Support Resources

- **Expo Docs:** https://docs.expo.dev/
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **EAS Submit:** https://docs.expo.dev/submit/introduction/
- **App Store Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Google Play Guidelines:** https://play.google.com/about/developer-content-policy/
- **GolfCourseAPI:** https://golfcourseapi.com/docs

## ✅ Final Checklist

Before submitting:
- [ ] GolfCourseAPI key configured
- [ ] App icon created (1024x1024)
- [ ] Splash screen created
- [ ] Screenshots prepared (all sizes)
- [ ] Privacy policy hosted and URL added
- [ ] Test account created with sample data
- [ ] App tested on real devices
- [ ] All permissions working
- [ ] Dark and light modes tested
- [ ] EAS project ID configured
- [ ] Bundle identifiers correct
- [ ] Version numbers correct
- [ ] Build successful
- [ ] TestFlight/Internal testing complete
- [ ] App Store/Play Store listing complete
- [ ] Review notes written
- [ ] Ready to submit!

## 🎉 Congratulations!

You're ready to launch FAIRWAY! Remember:
- Be patient during the review process
- Monitor feedback closely after launch
- Iterate based on user needs
- Keep the app updated regularly

Good luck with your launch! 🏌️‍♂️⛳
