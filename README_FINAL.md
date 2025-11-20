
# FAIRWAY ⛳

A mobile app for tracking and rating golf courses, built with React Native and Expo.

## 🎯 What is FAIRWAY?

FAIRWAY is like Beli for golf courses. Track every course you play, rate them using a unique comparative system, and share your golf journey with friends.

### Key Features

- **Comparative Rating System**: Rate courses by comparing them to others you've played
- **Social Feed**: See what courses your friends are playing
- **Personal Profile**: Track your stats, rounds, and achievements
- **Course Discovery**: Find new courses based on your preferences
- **Beautiful UI**: Clean, modern interface with dark mode support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

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

## 📱 App Structure

```
fairway/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── (social)/      # Social feed
│   │   ├── (home)/        # Course discovery
│   │   └── profile.tsx    # User profile
│   ├── modal.tsx          # Course selection
│   ├── rating-flow.tsx    # Rating flow
│   └── onboarding.tsx     # First-time user flow
├── components/            # Reusable components
│   ├── rating/           # Rating flow components
│   └── social/           # Social components
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript types
├── styles/               # Global styles
└── data/                 # Sample data
```

## 🎨 Design System

### Colors
- Primary: `#57C8A1` (Mint Green)
- Dark: `#2C5F4F` (Forest Green)
- Background (Light): `#F8F8FF`
- Background (Dark): `#1C1C1E`

### Typography
- System fonts (San Francisco on iOS, Roboto on Android)
- Weights: 400, 600, 700, 800

## 🔧 Tech Stack

- **Framework**: React Native + Expo 54
- **Navigation**: Expo Router
- **Storage**: AsyncStorage
- **Animations**: React Native Reanimated
- **UI**: Custom components with native feel
- **TypeScript**: Full type safety

## 📦 Key Dependencies

- `expo` - Expo SDK
- `expo-router` - File-based routing
- `react-native-reanimated` - Smooth animations
- `@react-native-async-storage/async-storage` - Local storage
- `expo-haptics` - Haptic feedback
- `expo-store-review` - App Store review prompts

## 🏗️ Building for Production

### iOS

```bash
# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### Android

```bash
# Build for Android
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android
```

## 📝 App Store Submission

See `APP_STORE_SUBMISSION_FINAL.md` for detailed submission instructions.

### Required Assets
- App icon (1024x1024px)
- Splash screen (2048x2048px)
- Screenshots (various sizes)

See `ASSET_CREATION_INSTRUCTIONS.md` for asset creation guide.

## 🧪 Testing

```bash
# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Test on physical device
# Scan QR code from Expo Dev Tools
```

## 📚 Documentation

- `APP_STORE_SUBMISSION_FINAL.md` - Complete submission guide
- `ASSET_CREATION_INSTRUCTIONS.md` - How to create required assets
- `LAUNCH_CHECKLIST.md` - Pre-launch checklist
- `PRIVACY_POLICY.md` - Privacy policy
- `TERMS_OF_SERVICE.md` - Terms of service

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

## 📄 License

All rights reserved.

## 🆘 Support

For questions or issues:
- Email: support@fairway.app
- GitHub Issues: [Create an issue]

## 🎉 Acknowledgments

- Inspired by Beli's rating system
- Built with Expo and React Native
- Icons from SF Symbols and Material Icons

---

**Ready to launch!** 🚀

Follow the launch checklist in `LAUNCH_CHECKLIST.md` to submit to app stores.
