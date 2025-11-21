
# FAIRWAY - Final App Store Submission Checklist

## ✅ Pre-Submission Checklist

### 1. GolfCourseAPI Configuration
- [ ] Sign up for GolfCourseAPI account at https://golfcourseapi.com/
- [ ] Get your API key from the dashboard
- [ ] Add API key to environment variables:
  ```bash
  EXPO_PUBLIC_GOLF_COURSE_API_KEY=your_api_key_here
  ```
- [ ] Test course search functionality
- [ ] Verify API quota is sufficient for launch
- [ ] Configure production API key in EAS secrets:
  ```bash
  eas secret:create --scope project --name EXPO_PUBLIC_GOLF_COURSE_API_KEY --value your_production_key
  ```

### 2. App Configuration (app.json)
- [ ] App name: "Fairway"
- [ ] Bundle identifier (iOS): com.fairway.golftracker
- [ ] Package name (Android): com.fairway.golftracker
- [ ] Version: 1.0.0
- [ ] Build numbers set correctly
- [ ] App icon created (1024x1024px)
- [ ] Splash screen configured
- [ ] Privacy descriptions added for:
  - [ ] Photo Library
  - [ ] Camera
  - [ ] Location (when in use)

### 3. EAS Configuration (eas.json)
- [ ] Update `projectId` in app.json extra.eas section
- [ ] Configure Apple ID in eas.json submit.production.ios
- [ ] Configure App Store Connect App ID (ascAppId)
- [ ] Configure Apple Team ID
- [ ] For Android: Add service account key path

### 4. Required Assets

#### App Icon (1024x1024px)
- [ ] Create app icon with deep mint green (#57C8A1) background
- [ ] Include dark green "F" monogram with golf flag
- [ ] Save as `assets/images/app-icon.png`
- [ ] No transparency
- [ ] No rounded corners (iOS handles this)

#### Splash Screen
- [ ] Create splash icon (400x400px recommended)
- [ ] Save as `assets/images/splash-icon.png`
- [ ] Mint green background (#57C8A1)
- [ ] Centered logo/icon

#### App Store Screenshots (Required for iOS)
You need screenshots for:
- [ ] 6.7" Display (iPhone 15 Pro Max) - 1290 x 2796 pixels
- [ ] 6.5" Display (iPhone 11 Pro Max) - 1242 x 2688 pixels
- [ ] 5.5" Display (iPhone 8 Plus) - 1242 x 2208 pixels

Recommended screenshots:
1. Social feed showing friend activity
2. Course selection with search
3. Rating flow (comparison cards)
4. User profile with stats
5. Course ranking list

#### App Store Preview Video (Optional but Recommended)
- [ ] 15-30 seconds
- [ ] Show key features: search, rate, social feed
- [ ] Same dimensions as screenshots

### 5. App Store Connect Setup

#### App Information
- [ ] App name: "Fairway"
- [ ] Subtitle: "Track Your Golf Journey"
- [ ] Category: Sports
- [ ] Secondary category: Social Networking
- [ ] Content rating: 4+ (no objectionable content)

#### App Description
```
Track your golf journey. Log rounds, rate courses, and build your ultimate golf profile.

FAIRWAY is like Beli for golf courses - a social platform for golfers to:

• LOG ROUNDS - Track every course you play
• RATE COURSES - Use our unique comparison-based rating system
• BUILD YOUR PROFILE - Create your golf identity with stats and achievements
• DISCOVER COURSES - Search thousands of courses worldwide
• CONNECT WITH FRIENDS - See what courses your friends are playing
• COMPARE RANKINGS - See how your ratings compare with friends

FEATURES:

Course Search
Search from thousands of golf courses worldwide. Find your local muni or that bucket-list destination course.

Smart Rating System
Rate courses through direct comparisons, not arbitrary numbers. Our algorithm creates your personalized course rankings.

Social Feed
Follow friends, see their rounds, compare ratings, and discover new courses together.

Golf Profile
Build your golf identity with stats, badges, and a map of everywhere you've played.

Achievements & Badges
Earn badges for milestones like playing new states, logging rounds, and exploring new courses.

Beautiful Design
Clean, modern interface with mint green branding and smooth animations.

Whether you're a weekend warrior or a golf course connoisseur, FAIRWAY helps you track, rate, and share your golf experiences.

Download now and start building your golf story!
```

#### Keywords (100 characters max)
```
golf,courses,tracker,rating,social,rounds,scorecard,handicap,tee time,golf app
```

#### Support URL
- [ ] Create support page or use: https://yourwebsite.com/support

#### Privacy Policy URL
- [ ] Host privacy-policy.html on your website
- [ ] Or use: https://yourwebsite.com/privacy

#### Terms of Service URL (Optional)
- [ ] Host terms-of-service.html on your website

### 6. Privacy & Permissions

#### Required Permissions
- [ ] Camera - "Take photos of courses"
- [ ] Photo Library - "Add course photos to rounds"
- [ ] Location (When In Use) - "Discover nearby courses"

#### Privacy Nutrition Label (App Store)
Data collected:
- [ ] User Content (photos, reviews, ratings)
- [ ] Identifiers (user ID)
- [ ] Usage Data (app interactions)

Data NOT collected:
- [ ] Contact Info
- [ ] Financial Info
- [ ] Health & Fitness
- [ ] Precise Location

### 7. Testing

#### Functionality Testing
- [ ] Course search works with API key
- [ ] Course search falls back to sample data without API key
- [ ] Rating flow completes successfully
- [ ] Social feed displays correctly
- [ ] Profile shows accurate stats
- [ ] Friend requests work
- [ ] Notifications appear
- [ ] Dark mode works correctly
- [ ] Light mode works correctly

#### Device Testing
- [ ] iPhone (latest iOS)
- [ ] iPhone (iOS 15+)
- [ ] iPad (if supporting tablets)
- [ ] Android phone (latest)
- [ ] Android phone (older version)

#### Edge Cases
- [ ] No internet connection
- [ ] First-time user experience
- [ ] Empty states (no rounds, no friends)
- [ ] Large data sets (100+ rounds)
- [ ] API rate limit reached

### 8. Build & Submit

#### iOS Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Create production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production
```

#### Android Build
```bash
# Create production build
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android --profile production
```

### 9. App Store Review Preparation

#### Test Account (Required)
Create a test account for Apple reviewers:
- [ ] Username: reviewer@fairway.com (or similar)
- [ ] Password: (provide in App Store Connect)
- [ ] Pre-populate with sample data:
  - [ ] 5-10 logged rounds
  - [ ] 2-3 friends
  - [ ] Some rated courses

#### Review Notes
```
FAIRWAY is a social golf course tracking app.

API Key: The app uses GolfCourseAPI for course search. This is configured via environment variables.

Test Account:
Username: [your test account]
Password: [your test password]

The test account has sample data including:
- Several logged rounds
- Friend connections
- Rated courses

Key Features to Test:
1. Search for a golf course (try "Pebble Beach")
2. Select a course and complete the rating flow
3. View the social feed
4. Check the profile page

Note: The app works offline with sample courses if the API is unavailable.
```

### 10. Post-Submission

#### Monitor Status
- [ ] Check App Store Connect daily
- [ ] Respond to any review questions within 24 hours
- [ ] Be ready to provide additional info

#### Prepare for Launch
- [ ] Create social media accounts
- [ ] Prepare launch announcement
- [ ] Set up analytics (optional)
- [ ] Plan marketing strategy

#### After Approval
- [ ] Test the live app from App Store
- [ ] Monitor crash reports
- [ ] Respond to user reviews
- [ ] Plan first update

## 🚀 Quick Start Commands

### Development
```bash
# Start development server
npm run dev

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Production Build
```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Build for both
eas build --platform all --profile production
```

### Submit to Stores
```bash
# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

## 📋 Common Issues & Solutions

### Issue: API Key Not Working
**Solution:** 
- Verify key is correct in environment variables
- Check API quota hasn't been exceeded
- Restart development server after adding key

### Issue: Build Fails
**Solution:**
- Run `npm install` to ensure dependencies are up to date
- Clear cache: `npx expo start -c`
- Check EAS build logs for specific errors

### Issue: App Rejected
**Common reasons:**
- Missing privacy policy
- Incomplete app description
- Crashes during review
- Missing test account credentials

### Issue: Screenshots Wrong Size
**Solution:**
- Use exact pixel dimensions listed above
- Use Xcode simulator or Android emulator
- Or use design tools like Figma/Sketch

## 📞 Support Resources

- **Expo Documentation:** https://docs.expo.dev/
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **EAS Submit:** https://docs.expo.dev/submit/introduction/
- **App Store Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Google Play Guidelines:** https://play.google.com/about/developer-content-policy/
- **GolfCourseAPI Docs:** https://golfcourseapi.com/docs

## ✨ Final Notes

1. **API Key is Optional:** The app works without the GolfCourseAPI key using sample courses. However, the search feature requires the API key.

2. **Test Thoroughly:** Use TestFlight (iOS) and Internal Testing (Android) before public release.

3. **Privacy First:** Be transparent about data collection in your privacy policy.

4. **User Feedback:** Monitor reviews and be responsive to user feedback.

5. **Iterate:** Plan for regular updates based on user needs.

Good luck with your launch! 🏌️‍♂️⛳
