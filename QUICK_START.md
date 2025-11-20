
# FAIRWAY - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator
- Physical device with Expo Go app (optional)

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

3. **Run on Platform**
```bash
# iOS (Mac only)
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 Testing the App

### First Launch
1. App will show onboarding screens (3 screens)
2. Tap "Next" through screens or "Skip" to jump ahead
3. After onboarding, you'll see the home screen

### Logging Your First Round
1. Tap the "+" button in the center of the tab bar
2. Select a course from the horizontal scroll
3. Choose a date (defaults to today)
4. Set a rating using stars or the slider
5. Optionally add score, tee box, and review
6. Tap "Save Round"

### Viewing Your Profile
1. Tap the "Profile" tab
2. Tap "Edit Profile" to customize
3. Add your name, bio, and handicap
4. View your statistics and badges

### Testing Features
- **Pull to refresh** on home screen to reload data
- **Dark mode** - Change system settings to see dark theme
- **Offline mode** - Turn off internet, app still works
- **Data persistence** - Close and reopen app, data remains

## 🎨 Customization

### Changing Colors
Edit `styles/commonStyles.ts`:
```typescript
export const colors = {
  primary: '#57C8A1',  // Change this for different theme
  // ... other colors
};
```

### Adding More Courses
Edit `data/sampleCourses.ts`:
```typescript
export const sampleCourses: GolfCourse[] = [
  {
    id: '9',
    name: 'Your Course Name',
    location: 'City, State',
    // ... other fields
  },
];
```

### Modifying Badges
Edit `data/badges.ts`:
```typescript
export const availableBadges: Badge[] = [
  {
    id: 'your-badge',
    name: 'Badge Name',
    description: 'How to earn it',
    icon: '🏆',
    earned: false,
  },
];
```

## 🔧 Development Tips

### Clearing Data
To reset the app and clear all stored data:
```typescript
import { StorageService } from '@/utils/storage';
await StorageService.clearAll();
```

### Debugging
- Check console logs for errors
- Use React DevTools for component inspection
- Enable remote debugging in Expo Dev Tools

### Hot Reload
- Save any file to see changes instantly
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) for dev menu

## 📦 Building for Production

### iOS Build
```bash
# Using EAS Build (recommended)
eas build --platform ios

# Local build
npm run build:ios
```

### Android Build
```bash
# Using EAS Build (recommended)
eas build --platform android

# Local build
npm run build:android
```

### Web Build
```bash
npm run build:web
```

## 🎯 Key Files to Know

### App Structure
```
app/
├── _layout.tsx              # Root layout with navigation
├── onboarding.tsx           # Onboarding screens
├── modal.tsx                # Log round modal
└── (tabs)/
    ├── (home)/
    │   └── index.tsx        # Home screen
    └── profile.tsx          # Profile screen
```

### Components
```
components/
├── CourseCard.tsx           # Round display card
├── StatCard.tsx             # Statistics card
├── LoadingSpinner.tsx       # Loading indicator
├── ErrorBoundary.tsx        # Error handling
└── FloatingTabBar.tsx       # Custom tab bar
```

### Data & Logic
```
hooks/
├── useRounds.ts             # Rounds management
└── useProfile.ts            # Profile management

utils/
└── storage.ts               # AsyncStorage wrapper

data/
├── sampleCourses.ts         # Course data
└── badges.ts                # Badge definitions

types/
└── golf.ts                  # TypeScript types
```

## 🐛 Common Issues

### Issue: App won't start
**Solution:** 
```bash
# Clear cache and restart
rm -rf node_modules
npm install
npm start -- --clear
```

### Issue: Data not persisting
**Solution:** Check AsyncStorage permissions and ensure StorageService is being called correctly

### Issue: Dark mode not working
**Solution:** Ensure device/simulator has dark mode enabled in system settings

### Issue: Tab bar not showing
**Solution:** Check that FloatingTabBar is rendered in tab layout and not covered by content

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)

## 🆘 Getting Help

1. Check console logs for error messages
2. Review implementation files for examples
3. Search Expo documentation
4. Check React Native community forums

## ✅ Pre-Launch Checklist

- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Test dark mode
- [ ] Test offline functionality
- [ ] Create app icon (see ASSET_CREATION_GUIDE.md)
- [ ] Create splash screen
- [ ] Take screenshots
- [ ] Write app description
- [ ] Set up privacy policy
- [ ] Configure support email
- [ ] Test production build

---

**Happy Coding! ⛳**
