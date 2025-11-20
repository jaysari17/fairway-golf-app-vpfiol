
# FAIRWAY - Developer Guide

## 🚀 Quick Start

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

## 📁 Project Structure

### Key Directories

```
app/                    # Expo Router screens
├── (tabs)/            # Tab navigation
│   ├── (social)/      # Social feed (home)
│   ├── (home)/        # Course discovery
│   └── profile.tsx    # User profile
├── modal.tsx          # Course selection
├── rating-flow.tsx    # Rating flow (4 steps)
└── onboarding.tsx     # First-time user flow

components/            # Reusable UI components
├── rating/           # Rating flow components
├── social/           # Social components
└── [others]          # Shared components

hooks/                # Custom React hooks
├── useRounds.ts      # Round management
├── useProfile.ts     # User profile
├── useSocial.ts      # Social features
└── useRatingTrigger.ts # Rating triggers

utils/                # Utility functions
├── ratingAlgorithm.ts    # Score calculation
├── ratingStorage.ts      # Rating persistence
├── socialStorage.ts      # Social data
├── storage.ts            # General storage
└── appStoreReview.ts     # Review requests

types/                # TypeScript definitions
├── golf.ts           # Golf-related types
├── rating.ts         # Rating types
└── social.ts         # Social types
```

## 🎯 Key Features

### 1. Course Selection (modal.tsx)
- User selects a course from a list
- Navigates to rating flow
- No quick rating option

### 2. Rating Flow (rating-flow.tsx)
Four-step process:
1. **Play Again?** - Definitely/Maybe/No
2. **Comparisons** - Compare with 3 courses
3. **Drag-to-Rank** - Place in personal list
4. **Confirmation** - Show final score

### 3. Social Feed ((social)/index.tsx)
- Friend activity feed
- Friend requests
- Like/comment on posts
- Pull-to-refresh

### 4. Profile (profile.tsx)
- User stats
- Course list
- Play history
- Achievements

## 🔧 Technical Details

### Data Storage
All data is stored locally using AsyncStorage:

```typescript
// Storage keys
@fairway_rounds          // User's rounds
@fairway_ratings         // Course ratings
@fairway_profile         // User profile
@fairway_friends         // Friend list
@fairway_feed_events     // Social feed
@fairway_onboarding      // Onboarding status
```

### Rating Algorithm
Located in `utils/ratingAlgorithm.ts`:

```typescript
calculateFinalScore(
  playAgainResponse: 'definitely' | 'maybe' | 'no',
  comparisonWins: number,
  comparisonLosses: number,
  rankPosition: number,
  totalCourses: number,
  neighborRatings: { above?: number; below?: number }
): number
```

**Scoring weights:**
- Play Again: 30%
- Comparisons: 25%
- Rank Position: 30%
- Neighbor Ratings: 15%

### Navigation
Using Expo Router with file-based routing:

```typescript
// Navigate to rating flow
router.push({
  pathname: '/rating-flow',
  params: {
    courseId: 'course-id',
    courseName: 'Course Name',
    courseLocation: 'City, State',
  },
});

// Go back
router.back();
```

### Haptic Feedback
Used throughout for better UX:

```typescript
import * as Haptics from 'expo-haptics';

// Light tap
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium tap
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Success
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Warning
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
```

## 🎨 Styling

### Color System
Defined in `styles/commonStyles.ts`:

```typescript
export const colors = {
  primary: '#57C8A1',      // Mint green
  primaryDark: '#2C5F4F',  // Forest green
  background: '#F8F8FF',   // Light background
  backgroundDark: '#1C1C1E', // Dark background
  card: '#FFFFFF',         // Light card
  cardDark: '#2C2C2E',     // Dark card
  text: '#333333',         // Light text
  textDark: '#FFFFFF',     // Dark text
  border: '#E0E0E0',       // Light border
  borderDark: '#38383A',   // Dark border
};
```

### Theme Usage
Using React Navigation theme:

```typescript
import { useTheme } from '@react-navigation/native';

const theme = useTheme();

// Use theme colors
<View style={{ backgroundColor: theme.colors.background }}>
  <Text style={{ color: theme.colors.text }}>Hello</Text>
</View>
```

## 🔌 Custom Hooks

### useRounds
Manages user's rounds:

```typescript
const { rounds, loading, addRound, refresh } = useRounds();
```

### useProfile
Manages user profile:

```typescript
const { profile, stats, updateProfile } = useProfile();
```

### useSocial
Manages social features:

```typescript
const {
  friends,
  friendRequests,
  feedEvents,
  acceptFriendRequest,
  declineFriendRequest,
  likeFeedEvent,
} = useSocial();
```

### useRatingTrigger
Manages rating triggers:

```typescript
const {
  pendingTriggers,
  triggerRatingAfterLog,
  completeTrigger,
} = useRatingTrigger();
```

## 📱 Platform-Specific Code

### iOS-specific files
Files ending in `.ios.tsx`:
- `app/(tabs)/_layout.ios.tsx` - Native tabs
- `app/(tabs)/(social)/index.ios.tsx` - iOS-specific social feed
- `components/IconSymbol.ios.tsx` - SF Symbols

### Android-specific files
Files ending in `.android.tsx`:
- Would use Material Design components
- Currently using shared code with platform checks

### Shared fallback
Files ending in `.tsx` are used when no platform-specific file exists.

## 🧪 Testing

### Manual Testing Checklist
- [ ] Onboarding flow
- [ ] Course selection
- [ ] Rating flow (all 4 steps)
- [ ] Social feed
- [ ] Profile page
- [ ] Dark mode toggle
- [ ] Pull-to-refresh
- [ ] Haptic feedback

### Test on Multiple Devices
- [ ] iPhone (iOS Simulator)
- [ ] iPad (iOS Simulator)
- [ ] Android Phone (Emulator)
- [ ] Android Tablet (Emulator)

## 🐛 Common Issues

### Build Fails
```bash
# Clear cache
npm run clean
rm -rf node_modules
npm install

# Reset Metro bundler
npm start -- --reset-cache
```

### AsyncStorage Issues
```bash
# Clear app data
# iOS: Reset simulator
# Android: Clear app data in settings
```

### Navigation Issues
```bash
# Make sure all routes are properly defined
# Check expo-router configuration
```

## 📦 Dependencies

### Core
- `expo` - Expo SDK
- `react-native` - React Native
- `expo-router` - File-based routing

### UI
- `react-native-reanimated` - Animations
- `react-native-gesture-handler` - Gestures
- `expo-blur` - Blur effects
- `expo-haptics` - Haptic feedback

### Storage
- `@react-native-async-storage/async-storage` - Local storage

### Other
- `expo-store-review` - App Store reviews
- `expo-image-picker` - Image selection
- `@react-native-community/datetimepicker` - Date picker

## 🔨 Build Commands

### Development
```bash
npm run dev        # Start dev server
npm run ios        # Run on iOS
npm run android    # Run on Android
```

### Production
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

# Submit
eas submit --platform ios
eas submit --platform android
```

## 📝 Code Style

### TypeScript
- Use explicit types
- Avoid `any`
- Use interfaces for objects
- Use type aliases for unions

### React
- Functional components only
- Use hooks
- Extract complex logic to custom hooks
- Keep components under 500 lines

### Naming
- Components: PascalCase
- Files: camelCase or kebab-case
- Hooks: useXxx
- Utils: camelCase
- Types: PascalCase

### Comments
```typescript
// Single-line comments for brief explanations

/**
 * Multi-line comments for complex logic
 * or function documentation
 */
```

## 🚀 Deployment

### Pre-Deployment Checklist
- [ ] All features tested
- [ ] No console errors
- [ ] Dark mode works
- [ ] Haptic feedback works
- [ ] App icon created
- [ ] Splash screen created
- [ ] Privacy policy updated
- [ ] Terms of service updated

### Build Process
1. Update version in `app.json`
2. Build with EAS
3. Test build on TestFlight/Internal Testing
4. Submit to stores
5. Monitor for crashes

## 📚 Resources

### Documentation
- Expo: https://docs.expo.dev
- React Native: https://reactnative.dev
- Expo Router: https://docs.expo.dev/router/introduction/

### Tools
- Expo Dev Tools: http://localhost:19002
- React DevTools: https://react-devtools-experimental.vercel.app/
- Flipper: https://fbflipper.com/

## 🆘 Getting Help

### Internal Docs
- `APP_STORE_SUBMISSION_FINAL.md` - Submission guide
- `ASSET_CREATION_INSTRUCTIONS.md` - Asset creation
- `LAUNCH_CHECKLIST.md` - Launch checklist
- `FINAL_SUMMARY.md` - Complete summary

### External Resources
- Expo Forums: https://forums.expo.dev
- React Native Discord: https://discord.gg/react-native
- Stack Overflow: Tag with `expo` or `react-native`

---

**Happy coding! 🚀**
