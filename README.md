
# ⛳ Fairway - Track Your Golf Journey

**Like Beli for golf courses.** Track every round, rate courses, build your golf profile, and connect with friends.

## 🚀 Quick Start

### For App Store Launch
👉 **See [LAUNCH_READY.md](LAUNCH_READY.md)** for complete launch instructions

### For Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📱 What is Fairway?

Fairway is a social golf tracking app that helps you:
- **Track** every golf course you play
- **Rate** courses with a unique comparison-based system
- **Connect** with friends and compare experiences
- **Discover** new courses based on your preferences
- **Build** your personalized golf profile

## ✨ Key Features

### 🏌️ Course Tracking
- Log every round with date, location, and details
- Search courses using Golf Course API integration
- Build a comprehensive history of your golf journey

### ⭐ Smart Rating System
- Multi-step rating flow: "Play Again?" → Comparisons → Ranking
- Compare courses head-to-head
- Drag-to-rank placement among your top courses
- Automatic score calculation based on your preferences

### 👥 Social Features
- Connect with friends via contact sync
- Follow friends and see what they're playing
- Social feed with friend activity
- Compare course ratings and experiences

### 📊 Personal Profile
- View your golf statistics
- Track badges and achievements
- See your most-played courses
- Build your golf taste profile

### 🔍 Discovery
- Find new courses based on your preferences
- Filter by location, difficulty, and more
- Personalized recommendations

## 🎨 Brand

- **Colors**: Deep mint green (#57C8A1) with dark forest green (#1a4d3a)
- **Logo**: Minimalist "F" monogram with integrated golf flag
- **Style**: Clean, modern, breathable design

## 📂 Project Structure

```
fairway/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation
│   │   ├── (home)/              # Discover/home tab
│   │   ├── (social)/            # Social feed tab
│   │   └── profile.tsx          # Profile tab
│   ├── modal.tsx                # Course selection modal
│   ├── rating-flow.tsx          # Multi-step rating flow
│   ├── contact-sync.tsx         # Contact sync screen
│   └── profile-setup.tsx        # Initial profile setup
├── components/                   # Reusable components
│   ├── rating/                  # Rating flow components
│   ├── social/                  # Social feature components
│   └── ...                      # UI components
├── hooks/                       # Custom React hooks
├── utils/                       # Utility functions
├── types/                       # TypeScript types
├── data/                        # Sample data and badges
├── assets/                      # Images, fonts, icons
└── styles/                      # Common styles

```

## 🛠️ Tech Stack

- **Framework**: React Native + Expo 54
- **Navigation**: Expo Router (file-based routing)
- **Storage**: AsyncStorage (local data)
- **API**: Golf Course API integration
- **Animations**: React Native Reanimated
- **UI**: Custom components with glassmorphism effects

## 📋 Documentation

- **[LAUNCH_READY.md](LAUNCH_READY.md)** - Complete App Store launch guide
- **[APP_STORE_LAUNCH_GUIDE.md](APP_STORE_LAUNCH_GUIDE.md)** - Detailed submission steps
- **[FINAL_PRE_LAUNCH_CHECKLIST.md](FINAL_PRE_LAUNCH_CHECKLIST.md)** - Pre-launch checklist
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Development documentation
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

## 🎯 App Store Readiness

### ✅ Completed
- [x] All core features implemented
- [x] Golf Course API integration
- [x] Contact sync functionality
- [x] Social features (friends, feed)
- [x] Rating system with algorithm
- [x] App Store review integration
- [x] Privacy policy and terms of service
- [x] App configuration (app.json, eas.json)
- [x] Icon generator tool

### 📝 To Do Before Launch
- [ ] Generate app icons (use `assets/images/generate-icons.html`)
- [ ] Set up EAS project (`eas init`)
- [ ] Configure App Store Connect (iOS)
- [ ] Configure Google Play Console (Android)
- [ ] Prepare screenshots
- [ ] Build and test (`eas build`)
- [ ] Submit for review

## 🔧 Configuration

### Environment Variables
Create a `.env` file:
```bash
EXPO_PUBLIC_API_URL=https://your-api-url.com
EXPO_PUBLIC_GOLF_COURSE_API_KEY=your-golf-course-api-key
```

### Bundle Identifiers
- **iOS**: `com.fairway.golftracker`
- **Android**: `com.fairway.golftracker`

## 🎨 Generate App Icons

1. Open `assets/images/generate-icons.html` in your browser
2. Click "Generate All Icons"
3. Download and save to `assets/images/`
4. Run `npx expo prebuild --clean`

## 🚀 Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to EAS
eas login

# Initialize project
eas init

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to App Store
eas submit --platform ios --profile production

# Submit to Google Play
eas submit --platform android --profile production
```

## 📱 Testing

```bash
# Run linter
npm run lint

# Test on iOS simulator
npm run ios

# Test on Android emulator
npm run android

# Test web version
npm run web
```

## 🔐 Privacy & Permissions

The app requests the following permissions:
- **Camera**: To take photos of golf courses
- **Photo Library**: To add course photos from your library
- **Location**: To discover nearby golf courses
- **Contacts**: To find friends who use the app

All permissions include clear descriptions and are only requested when needed.

## 📞 Support

- **Documentation**: See docs folder
- **Issues**: Check TROUBLESHOOTING.md
- **EAS Help**: https://docs.expo.dev/eas/
- **Expo Forums**: https://forums.expo.dev

## 📄 License

Private - All rights reserved

## 🎉 Ready to Launch!

Everything is configured and ready for App Store submission. Follow the steps in [LAUNCH_READY.md](LAUNCH_READY.md) to complete your launch.

**Estimated time to launch**: 3-4 hours
**Review time**: 1-3 days (iOS), 1-7 days (Android)

Good luck with your launch! 🚀⛳
