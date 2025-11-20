
# FAIRWAY - App Store Submission Notes

## 📝 App Information

### Basic Details
- **App Name**: FAIRWAY
- **Subtitle**: Golf Course Tracker
- **Bundle ID (iOS)**: com.fairway.golftracker
- **Package Name (Android)**: com.fairway.golftracker
- **Version**: 1.0.0
- **Build Number**: 1

### Categories
- **Primary**: Sports
- **Secondary**: Lifestyle

### Age Rating
- **iOS**: 4+ (No objectionable content)
- **Android**: Everyone

### Pricing
- **Free** (no in-app purchases, no ads)

## 📱 App Description

### Short Description (80 characters)
```
Track rounds, rate courses, build your golf profile
```

### Full Description
```
FAIRWAY is the ultimate golf course tracking app. Like Beli for restaurants, but for golf courses.

🏌️ TRACK YOUR GOLF JOURNEY
Log every round you play and build your personal course library. Track stats, scores, and progress over time.

⭐ UNIQUE RATING SYSTEM
Our Beli-inspired rating system makes rating courses fun and meaningful:
• Simple "Would you play again?" question
• Compare courses side-by-side
• Drag-to-rank your favorites
• Auto-generated 1-10 scores

👥 SOCIAL FEATURES (Coming Soon)
• Follow friends and compare courses
• See what others are playing
• Discover course overlaps
• Share your golf profile

📊 PERSONALIZED INSIGHTS
• Golf taste profile
• Course style preferences
• Favorite regions
• Achievement badges

🎨 BEAUTIFUL DESIGN
• Clean, modern interface
• Mint green brand aesthetic
• Dark mode support
• Smooth animations

Whether you're a weekend warrior or a golf enthusiast, FAIRWAY helps you remember every course, discover new favorites, and build your ultimate golf profile.

Download FAIRWAY today and start tracking your golf journey!
```

### Keywords (iOS - 100 characters max)
```
golf,course,tracker,rating,rounds,scorecard,handicap,golfing,courses,stats
```

### What's New (Version 1.0.0)
```
🎉 Welcome to FAIRWAY!

• Track every round you play
• Rate courses with our unique Beli-style system
• Build your personal golf profile
• Earn badges for achievements
• Beautiful dark mode support

Start your golf journey today!
```

## 🖼️ Required Assets

### App Icon
- **Size**: 1024 x 1024 pixels
- **Format**: PNG (no transparency)
- **Design**: Mint green background (#57C8A1) with dark green "F" logo
- **Location**: `./assets/images/app-icon.png`
- **Status**: ⚠️ NEEDS TO BE CREATED

### Splash Screen
- **Size**: 1284 x 2778 pixels
- **Format**: PNG
- **Design**: Mint green background with centered FAIRWAY logo
- **Location**: `./assets/images/splash-icon.png`
- **Status**: ⚠️ NEEDS TO BE CREATED

### Screenshots (iOS)
Required sizes:
- **6.7" Display** (1290 x 2796): iPhone 14 Pro Max, 15 Pro Max
- **6.5" Display** (1242 x 2688): iPhone 11 Pro Max, XS Max
- **5.5" Display** (1242 x 2208): iPhone 8 Plus, 7 Plus

Recommended screenshots (5-10):
1. Home screen with recent rounds
2. Rating flow - "Play Again" step
3. Rating flow - Comparison step
4. Rating flow - Drag-to-rank step
5. Rating flow - Confirmation screen
6. Profile with stats and badges
7. Course list view

**Status**: ⚠️ NEEDS TO BE CREATED

### Screenshots (Android)
Required sizes:
- **Phone** (1080 x 1920 minimum)

Same screenshot content as iOS.

**Status**: ⚠️ NEEDS TO BE CREATED

### Feature Graphic (Android Only)
- **Size**: 1024 x 500 pixels
- **Format**: PNG or JPEG
- **Design**: FAIRWAY branding with key features
- **Status**: ⚠️ NEEDS TO BE CREATED

## 🔒 Privacy & Legal

### Privacy Policy
- **Content**: See `PRIVACY_POLICY.md`
- **HTML Version**: `privacy-policy.html`
- **URL**: ⚠️ NEEDS TO BE HOSTED
- **Required**: Yes

### Terms of Service
- **Content**: See `TERMS_OF_SERVICE.md`
- **HTML Version**: `terms-of-service.html`
- **URL**: ⚠️ NEEDS TO BE HOSTED
- **Required**: Yes

### Data Collection
**None** - All data is stored locally on the user's device.

### Permissions

**iOS**:
- Camera (optional): For taking course photos
- Photo Library (optional): For adding course photos
- Photo Library Add (optional): For saving photos

**Android**:
- CAMERA (optional): For taking course photos
- READ_EXTERNAL_STORAGE (optional): For adding course photos
- WRITE_EXTERNAL_STORAGE (optional): For saving photos

## 📋 App Store Connect Configuration

### App Information
```
Name: FAIRWAY
Subtitle: Golf Course Tracker
Primary Language: English (U.S.)
Bundle ID: com.fairway.golftracker
SKU: fairway-golf-tracker
```

### Pricing and Availability
```
Price: Free
Availability: All countries
```

### App Privacy
```
Data Types Collected: None
Privacy Policy URL: [Your hosted URL]
```

### Age Rating
```
Made for Kids: No
Age Rating: 4+
Unrestricted Web Access: No
Gambling: No
Contests: No
```

### App Review Information
```
Contact Information:
  First Name: [Your first name]
  Last Name: [Your last name]
  Phone Number: [Your phone]
  Email: [Your email]

Demo Account: Not required

Notes:
FAIRWAY is a golf course tracking and rating app. Users can log rounds, rate courses using a unique comparison-based system, and track their golf journey. All data is stored locally on the device. No server communication or user tracking.

The app uses expo-store-review to request app reviews following Apple's guidelines (after meaningful interactions, maximum 3 times per year).
```

## 📋 Google Play Console Configuration

### Store Listing
```
App name: FAIRWAY
Short description: Track rounds, rate courses, build your golf profile
Full description: [Use full description from above]
```

### Categorization
```
App category: Sports
Tags: golf, course, tracker, rating
```

### Contact Details
```
Email: [Your email]
Phone: [Your phone] (optional)
Website: [Your website] (optional)
```

### Privacy Policy
```
Privacy Policy URL: [Your hosted URL]
```

### App Content
```
Target audience: Everyone
Content rating: Everyone
Ads: No
In-app purchases: No
```

### Store Presence
```
App availability: All countries
Pricing: Free
```

## 🚀 Build Commands

### Development
```bash
# Start dev server
npm run dev

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Production Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build iOS
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production
```

### Submission
```bash
# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

## ✅ Pre-Submission Checklist

### Assets
- [ ] App icon created (1024x1024)
- [ ] Splash screen created (1284x2778)
- [ ] iOS screenshots taken (5-10 images, 3 sizes)
- [ ] Android screenshots taken (5-10 images)
- [ ] Feature graphic created (Android, 1024x500)

### Legal
- [ ] Privacy policy hosted and URL added
- [ ] Terms of service hosted and URL added
- [ ] Contact information added

### Configuration
- [ ] app.json updated with correct bundle IDs
- [ ] eas.json configured
- [ ] Expo account created
- [ ] Apple Developer account ($99/year)
- [ ] Google Play Developer account ($25 one-time)

### Testing
- [ ] App tested on physical iOS device
- [ ] App tested on physical Android device
- [ ] Rating flow tested end-to-end
- [ ] Data persistence verified
- [ ] Dark mode tested
- [ ] No crashes or errors
- [ ] Performance acceptable (< 3s launch)

### Build
- [ ] iOS production build created
- [ ] Android production build created
- [ ] Builds tested on devices
- [ ] No build errors

### Store Setup
- [ ] App Store Connect app created
- [ ] Google Play Console app created
- [ ] All information filled in
- [ ] Screenshots uploaded
- [ ] Privacy policy URL added
- [ ] Contact information added

## 📊 Expected Timeline

| Task | Time | Status |
|------|------|--------|
| Create assets | 1-2 hours | ⚠️ Pending |
| Host privacy policy | 15 minutes | ⚠️ Pending |
| Set up EAS | 30 minutes | ⚠️ Pending |
| Build app | 1-2 hours | ⚠️ Pending |
| Configure stores | 1 hour | ⚠️ Pending |
| Submit | 30 minutes | ⚠️ Pending |
| **Total** | **4-6 hours** | |
| | | |
| iOS Review | 1-3 days | ⏳ After submission |
| Android Review | 1-7 days | ⏳ After submission |

## 🎯 Success Criteria

### Technical
- ✅ App launches without crashes
- ✅ Rating flow works end-to-end
- ✅ Data persists correctly
- ✅ Dark mode works
- ✅ Animations smooth
- ✅ No console errors

### Design
- ⚠️ App icon created
- ⚠️ Splash screen created
- ⚠️ Screenshots taken
- ✅ UI polished
- ✅ Brand consistent

### Legal
- ⚠️ Privacy policy hosted
- ⚠️ Terms of service hosted
- ✅ Privacy policy written
- ✅ Terms of service written

### Store
- ⚠️ App Store Connect configured
- ⚠️ Google Play Console configured
- ⚠️ Builds uploaded
- ⚠️ Submitted for review

## 📞 Support Contacts

### Expo
- **Documentation**: https://docs.expo.dev
- **Discord**: https://chat.expo.dev
- **Forums**: https://forums.expo.dev

### Apple
- **App Store Connect**: https://appstoreconnect.apple.com
- **Developer Support**: https://developer.apple.com/support/
- **Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/

### Google
- **Play Console**: https://play.google.com/console
- **Developer Support**: https://support.google.com/googleplay/android-developer/
- **Policy Center**: https://play.google.com/about/developer-content-policy/

## 🎉 Next Steps

1. **Create Assets** (1-2 hours)
   - Use Canva or hire on Fiverr
   - Follow `ASSET_CREATION_GUIDE.md`

2. **Host Privacy Policy** (15 minutes)
   - Use GitHub Pages (free)
   - Or use your own website

3. **Set Up EAS** (30 minutes)
   - Create Expo account
   - Install EAS CLI
   - Configure project

4. **Build App** (1-2 hours)
   - Run EAS build
   - Test builds

5. **Submit** (1 hour)
   - Configure stores
   - Upload builds
   - Submit for review

**You're almost there!** 🚀

The app is fully built and working. Just need to create assets and submit!

Good luck! 🏌️⛳
