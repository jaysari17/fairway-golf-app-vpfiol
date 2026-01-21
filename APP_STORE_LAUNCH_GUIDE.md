
# 🚀 Fairway App Store Launch Guide

## ✅ Pre-Launch Checklist

### 1. Generate App Icons
1. Open `assets/images/generate-icons.html` in your browser
2. Click "Generate All Icons"
3. Download all icons
4. Place them in the correct locations:
   - `app-icon.png` (1024x1024) → `assets/images/app-icon.png`
   - `adaptive-icon.png` (1024x1024) → `assets/images/adaptive-icon.png`
   - `splash-icon.png` (400x400) → `assets/images/splash-icon.png`

### 2. Update Configuration Files

#### app.json
- ✅ App name: "Fairway"
- ✅ Bundle ID (iOS): `com.fairway.golftracker`
- ✅ Package name (Android): `com.fairway.golftracker`
- ✅ Version: `1.0.0`
- ✅ Permissions configured
- ⚠️ Update `extra.eas.projectId` with your actual EAS project ID

#### eas.json
- ⚠️ Update iOS submission details:
  - `appleId`: Your Apple ID email
  - `ascAppId`: Your App Store Connect app ID
  - `appleTeamId`: Your Apple Developer Team ID
- ⚠️ Update Android submission:
  - `serviceAccountKeyPath`: Path to your Google Play service account JSON

### 3. Environment Variables
Create a `.env` file with:
```bash
EXPO_PUBLIC_API_URL=https://your-production-api-url.com
EXPO_PUBLIC_GOLF_COURSE_API_KEY=your-golf-course-api-key
```

### 4. Test the App Thoroughly
- [ ] Test all screens and navigation
- [ ] Test course logging and rating flow
- [ ] Test contact sync functionality
- [ ] Test social features (friends, feed)
- [ ] Test on both iOS and Android
- [ ] Test in both light and dark mode
- [ ] Verify all permissions work correctly

## 📱 iOS App Store Submission

### Step 1: Create App Store Connect Record
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform**: iOS
   - **Name**: Fairway
   - **Primary Language**: English
   - **Bundle ID**: com.fairway.golftracker
   - **SKU**: fairway-golf-tracker

### Step 2: Prepare App Store Listing

#### App Information
- **Name**: Fairway
- **Subtitle**: Track Your Golf Journey
- **Category**: Sports
- **Secondary Category**: Social Networking

#### Description
```
Track your golf journey with Fairway - the ultimate app for golf course enthusiasts.

FEATURES:
• Log every round you play
• Rate and review golf courses
• Build your personalized golf profile
• Discover new courses tailored to your preferences
• Connect with friends and compare experiences
• Track your progress with stats and badges
• Share your golf journey

Like Beli for restaurants, but for golf courses. Build your ultimate golf profile and never forget a great course again.

SOCIAL FEATURES:
• Follow friends and see what they're playing
• Compare course ratings and experiences
• Discover courses your friends love
• Build your golf network

PERSONALIZED INSIGHTS:
• Your golf taste profile
• Favorite course types and regions
• Top-rated courses
• Progress tracking and achievements

Whether you're a weekend warrior or a golf enthusiast, Fairway helps you track, rate, and remember every course you play.
```

#### Keywords
```
golf, golf courses, golf tracker, golf app, course ratings, golf social, golf friends, golf stats, golf profile, course reviews
```

#### Support URL
```
https://fairway.app/support
```

#### Privacy Policy URL
```
https://fairway.app/privacy
```

### Step 3: Prepare Screenshots

You need screenshots for:
- **iPhone 6.7"** (iPhone 15 Pro Max): 1290 x 2796 pixels
- **iPhone 6.5"** (iPhone 11 Pro Max): 1242 x 2688 pixels
- **iPhone 5.5"** (iPhone 8 Plus): 1242 x 2208 pixels
- **iPad Pro 12.9"**: 2048 x 2732 pixels

Recommended screenshots:
1. Home/Discover screen showing course cards
2. Course rating flow
3. User profile with stats and badges
4. Social feed with friend activity
5. Course detail page

### Step 4: Build and Submit

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to EAS
eas login

# 3. Configure project
eas build:configure

# 4. Build for iOS
eas build --platform ios --profile production

# 5. Submit to App Store
eas submit --platform ios --profile production
```

### Step 5: App Review Information
- **Demo Account**: Provide a test account if needed
- **Notes**: Explain contact sync and location features
- **Contact Information**: Your email and phone

## 🤖 Google Play Store Submission

### Step 1: Create Google Play Console App
1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in:
   - **App name**: Fairway
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free

### Step 2: Prepare Store Listing

#### Short Description (80 characters)
```
Track your golf journey. Log rounds, rate courses, build your golf profile.
```

#### Full Description (4000 characters)
```
Track your golf journey with Fairway - the ultimate app for golf course enthusiasts.

🏌️ TRACK EVERY ROUND
Log every golf course you play with detailed information including date, location, and your personal rating. Build a comprehensive history of your golf experiences.

⭐ RATE & REVIEW COURSES
Share your thoughts on course conditions, layout, difficulty, and amenities. Help other golfers discover great courses.

👤 BUILD YOUR GOLF PROFILE
Automatically generate your personalized golf taste profile based on your playing history. Discover your favorite course types, most-played regions, and top-rated experiences.

🔍 DISCOVER NEW COURSES
Get personalized recommendations based on your preferences. Filter by location, price, difficulty, and more. Find your next great round.

👥 CONNECT WITH FRIENDS
Follow friends, see what they're playing, and compare experiences. Discover courses your friends love and build your golf network.

📊 TRACK YOUR PROGRESS
Earn badges and achievements as you explore new courses. View detailed statistics about your golf journey.

🎯 KEY FEATURES:
• Course logging with ratings and reviews
• Personalized golf taste profile
• Smart course recommendations
• Social feed and friend connections
• Progress tracking and badges
• Course discovery with filters
• Contact sync to find friends
• Beautiful, intuitive interface
• Dark mode support

Like Beli for restaurants, but for golf courses. Whether you're a weekend warrior or a golf enthusiast, Fairway helps you track, rate, and remember every course you play.

Download Fairway today and start building your ultimate golf profile!
```

#### App Category
- **Category**: Sports
- **Tags**: Golf, Social, Tracking

### Step 3: Prepare Graphics

#### App Icon
- 512 x 512 pixels (32-bit PNG with alpha)

#### Feature Graphic
- 1024 x 500 pixels

#### Screenshots
- At least 2 screenshots
- Recommended: 1080 x 1920 pixels (portrait)

Recommended screenshots:
1. Home/Discover screen
2. Course rating flow
3. User profile
4. Social feed
5. Course detail

### Step 4: Content Rating
Complete the content rating questionnaire:
- Violence: None
- Sexual Content: None
- Language: None
- Controlled Substances: None
- Gambling: None
- User Interaction: Yes (users can interact)

### Step 5: Build and Submit

```bash
# 1. Build for Android
eas build --platform android --profile production

# 2. Submit to Google Play
eas submit --platform android --profile production
```

## 🔧 Final Configuration Steps

### 1. Set Up EAS Project
```bash
# Initialize EAS project
eas init

# This will give you a project ID - update it in app.json
```

### 2. Configure Secrets
```bash
# Add API keys as secrets
eas secret:create --scope project --name GOLF_COURSE_API_KEY --value your-api-key
eas secret:create --scope project --name API_URL --value your-api-url
```

### 3. Update Bundle Identifiers
Make sure your bundle IDs are unique and match your developer accounts:
- iOS: `com.fairway.golftracker` (or your custom domain)
- Android: `com.fairway.golftracker` (or your custom domain)

### 4. Set Up Deep Linking
Update `app.json` with your actual domain:
```json
"ios": {
  "associatedDomains": ["applinks:yourdomain.com"]
},
"android": {
  "intentFilters": [{
    "data": [{ "scheme": "https", "host": "yourdomain.com" }]
  }]
}
```

## 📋 Pre-Submission Testing

### iOS TestFlight
```bash
# Build and submit to TestFlight
eas build --platform ios --profile production
eas submit --platform ios --profile production

# Invite testers through App Store Connect
```

### Android Internal Testing
```bash
# Build and submit to internal testing
eas build --platform android --profile production
eas submit --platform android --profile production

# Create internal testing track in Play Console
```

## 🎯 Launch Day Checklist

- [ ] All icons generated and in place
- [ ] App Store listings complete (iOS & Android)
- [ ] Screenshots prepared and uploaded
- [ ] Privacy policy and terms of service live
- [ ] Support email/website set up
- [ ] Backend API in production mode
- [ ] Environment variables configured
- [ ] Deep linking configured
- [ ] TestFlight/Internal testing completed
- [ ] App review information provided
- [ ] Builds submitted to both stores

## 📞 Support & Resources

- **EAS Documentation**: https://docs.expo.dev/eas/
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console
- **Expo Forums**: https://forums.expo.dev

## 🚨 Common Issues

### Build Failures
- Check that all dependencies are compatible with Expo SDK 54
- Verify bundle identifiers are correct
- Ensure all required permissions are declared

### Submission Rejections
- **iOS**: Provide clear explanations for all permissions
- **Android**: Complete content rating questionnaire accurately
- Both: Ensure privacy policy is accessible and accurate

### Icon Issues
- iOS: Icons must be exactly 1024x1024, no transparency, no rounded corners
- Android: Adaptive icons should have safe zone for different shapes
- Use the provided HTML generator for correct specifications

## 🎉 Post-Launch

After approval:
1. Monitor crash reports and user feedback
2. Respond to user reviews
3. Plan updates and new features
4. Track analytics and user engagement
5. Iterate based on user feedback

Good luck with your launch! 🚀⛳
