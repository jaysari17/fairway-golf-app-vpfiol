
# FAIRWAY - App Store Submission Checklist

## ✅ Pre-Submission Requirements

### 1. App Assets (REQUIRED)
You need to create the following assets before submitting:

#### App Icon (1024x1024px)
- **Location**: `./assets/images/app-icon.png`
- **Requirements**:
  - 1024x1024 pixels
  - PNG format
  - No transparency
  - No rounded corners (iOS adds them automatically)
- **Design**: Deep mint green (#57C8A1) background with dark forest green "F" logo with golf flag

#### Splash Screen (1284x2778px recommended)
- **Location**: `./assets/images/splash-icon.png`
- **Requirements**:
  - PNG format
  - Centered logo on mint green background
  - Will be displayed while app loads
- **Design**: FAIRWAY logo centered on #57C8A1 background

### 2. App Store Screenshots (REQUIRED)

#### iOS Screenshots
You need screenshots for:
- **iPhone 6.7"** (1290 x 2796 pixels) - iPhone 14 Pro Max, 15 Pro Max
- **iPhone 6.5"** (1242 x 2688 pixels) - iPhone 11 Pro Max, XS Max
- **iPhone 5.5"** (1242 x 2208 pixels) - iPhone 8 Plus, 7 Plus
- **iPad Pro 12.9"** (2048 x 2732 pixels) - Optional but recommended

**Recommended Screenshots** (5-10 images):
1. Home screen showing recent rounds
2. Course rating flow - "Play Again" step
3. Course comparison step
4. Drag-to-rank interface
5. Profile with stats and badges
6. Course list/discovery
7. Round logging interface

#### Android Screenshots
You need screenshots for:
- **Phone** (1080 x 1920 pixels minimum)
- **7-inch Tablet** (1024 x 1600 pixels) - Optional
- **10-inch Tablet** (1536 x 2048 pixels) - Optional

### 3. App Store Listing Content

#### App Name
**FAIRWAY - Golf Course Tracker**

#### Subtitle (iOS) / Short Description (Android)
**Track rounds, rate courses, build your golf profile**

#### Description
```
FAIRWAY is the ultimate golf course tracking app. Like Beli for restaurants, but for golf courses.

🏌️ TRACK YOUR GOLF JOURNEY
- Log every round you play
- Build your personal course library
- Track stats, scores, and progress

⭐ RATE & RANK COURSES
- Unique Beli-style rating system
- Compare courses side-by-side
- Drag-to-rank your favorites
- Auto-generated 1-10 scores

👥 SOCIAL FEATURES
- Follow friends and compare courses
- See what others are playing
- Discover course overlaps
- Share your golf profile

📊 PERSONALIZED INSIGHTS
- Golf taste profile
- Course style preferences
- Favorite regions
- Rarity scores

🎯 GAMIFICATION
- Earn badges for achievements
- Track milestones
- Build your golf identity

🎨 BEAUTIFUL DESIGN
- Clean, modern interface
- Mint green brand aesthetic
- Dark mode support
- Smooth animations

Whether you're a weekend warrior or a golf enthusiast, FAIRWAY helps you remember every course, discover new favorites, and build your ultimate golf profile.

Download FAIRWAY today and start tracking your golf journey!
```

#### Keywords (iOS - 100 characters max)
```
golf,course,tracker,rating,rounds,scorecard,handicap,golfing,courses,stats
```

#### Category
- **Primary**: Sports
- **Secondary**: Lifestyle

#### Age Rating
- **iOS**: 4+
- **Android**: Everyone

### 4. Privacy Policy & Terms of Service

✅ **Already Created**:
- Privacy Policy: `PRIVACY_POLICY.md` and `privacy-policy.html`
- Terms of Service: `TERMS_OF_SERVICE.md` and `terms-of-service.html`

**Action Required**:
1. Host these files on a public URL (GitHub Pages, your website, etc.)
2. Update `app.json` with the URLs
3. Add links in App Store Connect / Google Play Console

### 5. App Configuration

#### Update `app.json`:
```json
{
  "expo": {
    "name": "FAIRWAY",
    "slug": "fairway",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.fairway.golftracker",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.fairway.golftracker",
      "versionCode": 1
    }
  }
}
```

✅ **Already configured** in your app.json

### 6. Build Configuration

#### Create EAS Build Profile
File: `eas.json`

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true,
      "ios": {
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 📱 Building for Production

### iOS Build

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure iOS Build**:
   ```bash
   eas build:configure
   ```

4. **Build for iOS**:
   ```bash
   eas build --platform ios --profile production
   ```

5. **Submit to App Store**:
   ```bash
   eas submit --platform ios
   ```

### Android Build

1. **Build for Android**:
   ```bash
   eas build --platform android --profile production
   ```

2. **Submit to Google Play**:
   ```bash
   eas submit --platform android
   ```

## 🔍 Pre-Launch Testing

### Test Checklist:
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test all rating flow steps
- [ ] Test round logging
- [ ] Test data persistence
- [ ] Test app store review prompt
- [ ] Test dark mode
- [ ] Test on different screen sizes
- [ ] Test offline functionality
- [ ] Test app icon and splash screen

### Performance Checklist:
- [ ] App launches in < 3 seconds
- [ ] No crashes or freezes
- [ ] Smooth animations
- [ ] Responsive UI
- [ ] Proper error handling

## 📋 App Store Connect Setup (iOS)

1. **Create App in App Store Connect**:
   - Go to https://appstoreconnect.apple.com
   - Click "My Apps" → "+" → "New App"
   - Fill in app information

2. **App Information**:
   - Name: FAIRWAY
   - Bundle ID: com.fairway.golftracker
   - SKU: fairway-golf-tracker
   - Primary Language: English

3. **Pricing and Availability**:
   - Price: Free
   - Availability: All countries

4. **App Privacy**:
   - Data Collection: None (all data stored locally)
   - Privacy Policy URL: [Your hosted URL]

5. **App Review Information**:
   - Contact Information
   - Demo Account (if needed)
   - Notes: "FAIRWAY is a golf course tracking app. All data is stored locally on device."

## 📋 Google Play Console Setup (Android)

1. **Create App in Google Play Console**:
   - Go to https://play.google.com/console
   - Click "Create app"
   - Fill in app details

2. **Store Listing**:
   - App name: FAIRWAY
   - Short description: Track rounds, rate courses, build your golf profile
   - Full description: [Use description from above]

3. **Content Rating**:
   - Complete questionnaire
   - Expected rating: Everyone

4. **Pricing & Distribution**:
   - Free
   - Available in all countries

5. **App Content**:
   - Privacy Policy URL: [Your hosted URL]
   - Ads: No
   - In-app purchases: No

## ✅ Final Checklist

Before submitting:
- [ ] All assets created and added
- [ ] Screenshots taken and uploaded
- [ ] Privacy policy and terms hosted
- [ ] App tested on real devices
- [ ] Build created with EAS
- [ ] App Store Connect / Play Console configured
- [ ] Contact information added
- [ ] App description finalized
- [ ] Keywords optimized
- [ ] Age rating set
- [ ] Pricing configured

## 🚀 Post-Submission

### Expected Timeline:
- **iOS**: 1-3 days for review
- **Android**: 1-7 days for review

### After Approval:
1. Monitor crash reports
2. Respond to user reviews
3. Track analytics
4. Plan updates based on feedback

## 📞 Support

If you encounter issues:
- **Expo Documentation**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policies**: https://play.google.com/about/developer-content-policy/

## 🎉 Congratulations!

You're ready to submit FAIRWAY to the app stores! Good luck! 🏌️⛳
