
# FAIRWAY ⛳

A beautiful, feature-complete golf course tracking app built with React Native and Expo.

## 🎯 Overview

FAIRWAY is a social golf tracking app that helps golfers log rounds, rate courses, and share their golf journey with friends. Think of it as "Beli for golf courses."

## ✨ Features

### Core Features
- 📝 **Course Logging**: Log every round you play with dates, scores, and notes
- ⭐ **Smart Rating System**: Unique multi-step rating flow inspired by Beli
- 👥 **Social Features**: Connect with friends, share rounds, and compare courses
- 📊 **Statistics**: Track your golf journey with detailed stats and insights
- 🏆 **Badges**: Earn achievements for milestones
- 🔍 **Course Discovery**: Browse and search golf courses
- 🌓 **Dark Mode**: Full light and dark theme support

### Rating System
FAIRWAY uses a unique 4-step rating process:
1. **Play Again**: Would you play this course again?
2. **Comparison**: Compare with courses you've played
3. **Drag Rank**: Place the course in your personal ranking
4. **Confirmation**: View your calculated rating (1-10 scale)

### Social Features
- Mutual friendship model (not follower-based)
- Social feed showing friend activity
- Like and comment on rounds
- View mutual courses with friends
- Compare ratings and experiences

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fairway.git
cd fairway

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Running on Devices

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 App Structure

```
fairway/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── (social)/      # Social feed (home)
│   │   ├── (home)/        # Course discovery
│   │   └── profile.tsx    # User profile
│   ├── onboarding.tsx     # First-time user flow
│   ├── modal.tsx          # Log round modal
│   └── rating-flow.tsx    # Rating flow modal
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── types/                 # TypeScript type definitions
├── data/                  # Sample data
└── styles/                # Shared styles
```

## 🎨 Design System

### Colors
- **Primary**: #57C8A1 (Mint Green)
- **Secondary**: #45A088 (Dark Mint)
- **Accent**: #228B22 (Forest Green)

### Typography
- **Font**: System default (San Francisco on iOS, Roboto on Android)
- **Weights**: Regular (400), Semibold (600), Bold (700), Extra Bold (800)

## 🛠️ Tech Stack

- **Framework**: React Native 0.81
- **Platform**: Expo 54
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Storage**: AsyncStorage
- **Animations**: React Native Reanimated
- **Styling**: StyleSheet API

## 📦 Key Dependencies

- `expo` - Expo SDK
- `expo-router` - File-based navigation
- `react-native-reanimated` - Smooth animations
- `@react-native-async-storage/async-storage` - Local storage
- `expo-haptics` - Haptic feedback
- `expo-store-review` - App Store review prompts

## 🏗️ Building for Production

### iOS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios --profile production
```

### Android

```bash
# Build for Android
eas build --platform android --profile production
```

## 📝 Documentation

- [App Store Submission Guide](./APP_STORE_READY.md)
- [Immediate Next Steps](./IMMEDIATE_NEXT_STEPS.md)
- [Launch Ready Summary](./LAUNCH_READY_SUMMARY.md)
- [Privacy Policy](./PRIVACY_POLICY.md)
- [Terms of Service](./TERMS_OF_SERVICE.md)

## 🎯 Roadmap

### Phase 1: Backend Integration
- [ ] User authentication
- [ ] Cloud data sync
- [ ] Real-time updates
- [ ] Push notifications

### Phase 2: Enhanced Features
- [ ] Course photos and galleries
- [ ] Advanced statistics
- [ ] Leaderboards
- [ ] AI recommendations

### Phase 3: Premium Features
- [ ] Premium subscription
- [ ] Detailed analytics
- [ ] Data export
- [ ] Custom themes

## 🐛 Known Issues

- Maps feature disabled (react-native-maps not supported in Natively)
- Local storage only (no cloud sync yet)
- Sample course database (limited courses)

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

This project is private and proprietary.

## 👤 Author

Your Name
- Website: https://yourwebsite.com
- Email: your.email@example.com

## 🙏 Acknowledgments

- Inspired by Beli app
- Built with Expo and React Native
- Icons from SF Symbols and Material Icons

---

**Ready to launch?** Check out [IMMEDIATE_NEXT_STEPS.md](./IMMEDIATE_NEXT_STEPS.md) for what to do next!

⛳ Happy golfing! 🏌️
