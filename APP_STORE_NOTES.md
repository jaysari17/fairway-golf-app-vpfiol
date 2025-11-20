
# FAIRWAY - App Store Submission Guide

## App Information

**App Name:** FAIRWAY
**Bundle ID (iOS):** com.fairway.golftracker
**Package Name (Android):** com.fairway.golftracker
**Version:** 1.0.0
**Build Number (iOS):** 1
**Version Code (Android):** 1

## App Description

FAIRWAY is a golf course tracking and social platform that helps golfers log rounds, rate courses, and build their ultimate golf profile. Track every course you play, share your experiences, and discover new courses tailored to your preferences.

### Key Features:
- Log and track every round you play
- Rate and review golf courses with a simple 1-100 rating system
- Build your personalized golf profile with stats and achievements
- Earn badges for milestones and accomplishments
- Track your golf journey with detailed statistics
- Beautiful, modern interface with dark mode support

### Target Audience:
Golfers of all skill levels who want to track their rounds, remember courses they've played, and improve their game through data and insights.

## App Store Assets Needed

### App Icon
- **Size:** 1024x1024px (iOS), 512x512px (Android)
- **Design:** Minimalist "F" monogram with golf flag built into the top stroke
- **Colors:** Deep mint green (#57C8A1) background with dark forest green (#228B22) symbol
- **Format:** PNG with no transparency

### Splash Screen
- **Background Color:** #57C8A1 (Deep mint green)
- **Icon:** Centered FAIRWAY logo
- **Size:** 200px width (configured in app.json)

### Screenshots Required

#### iOS (6.5" Display - iPhone 14 Pro Max)
1. Home screen showing recent rounds and statistics
2. Log round screen with course selection
3. Profile screen with badges and stats
4. Course card detail view
5. Onboarding welcome screen

#### Android (Phone)
1. Home screen showing recent rounds and statistics
2. Log round screen with course selection
3. Profile screen with badges and stats
4. Course card detail view
5. Onboarding welcome screen

### App Preview Video (Optional but Recommended)
- 15-30 seconds showcasing key features
- Show: logging a round, viewing stats, earning badges

## Privacy & Permissions

### iOS Permissions (Info.plist)
- **NSPhotoLibraryUsageDescription:** "FAIRWAY needs access to your photo library to let you add course photos to your rounds."
- **NSCameraUsageDescription:** "FAIRWAY needs access to your camera to let you take photos of courses you play."

### Android Permissions
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE

### Data Collection
- User profile information (username, bio, handicap)
- Golf round data (courses, dates, ratings, reviews)
- All data stored locally on device using AsyncStorage
- No data transmitted to external servers
- No third-party analytics or tracking

## App Store Categories

### iOS
- **Primary Category:** Sports
- **Secondary Category:** Lifestyle

### Android (Google Play)
- **Category:** Sports
- **Content Rating:** Everyone

## Keywords (for App Store Optimization)

golf, golf tracker, golf courses, golf rounds, golf scorecard, golf stats, golf journal, golf log, course rating, golf profile, golf badges, golf achievements

## Support & Contact

**Support Email:** support@fairway.app (update with your actual email)
**Privacy Policy URL:** (create and host a privacy policy)
**Terms of Service URL:** (create and host terms of service)

## Build Instructions

### iOS Build (using EAS)
```bash
eas build --platform ios
```

### Android Build (using EAS)
```bash
eas build --platform android
```

### Local Development
```bash
npm run ios
npm run android
```

## Testing Checklist

- [ ] Onboarding flow works correctly
- [ ] Can log a round successfully
- [ ] Rounds display correctly on home screen
- [ ] Profile updates save properly
- [ ] Statistics calculate correctly
- [ ] Badges unlock at appropriate milestones
- [ ] Dark mode works throughout app
- [ ] App works offline (data persists)
- [ ] No crashes or errors in production build
- [ ] All permissions work correctly
- [ ] App icon displays correctly
- [ ] Splash screen displays correctly

## App Store Review Notes

This app is a personal golf tracking tool that stores all data locally on the user's device. No account creation or login is required. The app does not collect or transmit any user data to external servers.

## Post-Launch Checklist

- [ ] Monitor crash reports
- [ ] Respond to user reviews
- [ ] Track download metrics
- [ ] Plan feature updates based on feedback
- [ ] Update app regularly with improvements

## Future Features (Roadmap)

- Social features (friend connections, shared courses)
- Course discovery with recommendations
- Advanced statistics and insights
- Photo uploads for courses
- Export data functionality
- Cloud sync (optional)
- Apple Watch companion app
- Widget support
