
# FAIRWAY - Developer Quick Start

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure GolfCourseAPI (Optional)
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your API key
# Get one free at: https://golfcourseapi.com/
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Run on Device/Simulator
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📁 Project Structure

```
fairway/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation
│   │   ├── (home)/              # Home tab (social feed)
│   │   ├── (social)/            # Social features
│   │   └── profile.tsx          # Profile tab
│   ├── modal.tsx                # Course selection modal
│   ├── rating-flow.tsx          # Rating flow modal
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
│   ├── rating/                  # Rating flow components
│   ├── social/                  # Social components
│   └── ...                      # Other components
├── hooks/                       # Custom React hooks
│   ├── useProfile.ts           # Profile management
│   ├── useRounds.ts            # Rounds management
│   ├── useSocial.ts            # Social features
│   └── useRatingTrigger.ts     # Rating triggers
├── utils/                       # Utility functions
│   ├── golfCourseApi.ts        # GolfCourseAPI integration
│   ├── ratingAlgorithm.ts      # Rating calculations
│   ├── ratingStorage.ts        # Rating data storage
│   ├── socialStorage.ts        # Social data storage
│   └── storage.ts              # General storage
├── types/                       # TypeScript types
│   ├── golf.ts                 # Golf-related types
│   ├── rating.ts               # Rating types
│   └── social.ts               # Social types
├── styles/                      # Styling
│   └── commonStyles.ts         # Common styles & colors
├── data/                        # Static data
│   ├── sampleCourses.ts        # Sample courses
│   └── badges.ts               # Badge definitions
└── assets/                      # Images, fonts, etc.
```

## 🎨 Key Features

### 1. Course Search
- **File:** `app/modal.tsx`
- **API:** `utils/golfCourseApi.ts`
- Real-time search with debouncing
- Falls back to sample courses without API key

### 2. Rating Flow
- **File:** `app/rating-flow.tsx`
- **Components:** `components/rating/`
- Multi-step comparative rating system:
  1. Play Again? (Definitely/Maybe/No)
  2. Comparison Cards (vs other courses)
  3. Drag-to-Rank (position in list)
  4. Auto-generated score (1-10)

### 3. Social Feed
- **File:** `app/(tabs)/(social)/index.tsx`
- **Components:** `components/social/`
- Friend activity feed
- Friend requests
- Course comparisons

### 4. Profile
- **File:** `app/(tabs)/profile.tsx`
- User stats and achievements
- Course history
- Badge collection

## 🔧 Development Tips

### Hot Reload
The app supports hot reload. Changes to most files will update automatically.

### Platform-Specific Code
Use `.ios.tsx` or `.android.tsx` extensions for platform-specific code:
```
index.tsx        # Default (all platforms)
index.ios.tsx    # iOS only
index.android.tsx # Android only
```

### Debugging
```bash
# Clear cache and restart
npx expo start -c

# View logs
# iOS: Xcode Console or Terminal
# Android: Android Studio Logcat or Terminal
```

### Testing Without API Key
The app works perfectly without a GolfCourseAPI key:
- Uses sample courses from `data/sampleCourses.ts`
- All features work except real-time search
- Great for development and testing

## 🎯 Common Tasks

### Add a New Course to Sample Data
Edit `data/sampleCourses.ts`:
```typescript
{
  id: '9',
  name: 'Your Course Name',
  location: 'City, State',
  city: 'City',
  state: 'State',
  country: 'USA',
  type: 'parkland',
  holes: 18,
  par: 72,
  yardage: 7000,
}
```

### Modify Rating Algorithm
Edit `utils/ratingAlgorithm.ts`:
```typescript
export function calculateRating(
  playAgainResponse: string,
  comparisonWins: number,
  comparisonLosses: number,
  rankPosition: number,
  totalCourses: number
): number {
  // Your custom algorithm here
}
```

### Add a New Badge
Edit `data/badges.ts`:
```typescript
{
  id: 'new-badge',
  name: 'Badge Name',
  description: 'Badge description',
  icon: 'trophy',
  earned: false,
}
```

### Customize Colors
Edit `styles/commonStyles.ts`:
```typescript
export const colors = {
  primary: '#57C8A1',    // Mint green
  secondary: '#2C5F4F',  // Dark green
  // ... add more colors
};
```

## 🧪 Testing

### Test Rating Flow
1. Tap "+" button in tab bar
2. Select a course
3. Complete rating steps
4. Verify score is calculated correctly

### Test Social Features
1. Go to Social tab
2. Send friend request (use sample data)
3. View friend's profile
4. Compare course ratings

### Test Search
1. Add API key to `.env`
2. Restart dev server
3. Tap "+" button
4. Type course name in search bar
5. Verify results appear

## 📦 Building for Production

### iOS
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build
eas build --platform ios --profile production
```

### Android
```bash
eas build --platform android --profile production
```

### Both Platforms
```bash
eas build --platform all --profile production
```

## 🐛 Common Issues

### "Cannot find module"
```bash
npm install
npx expo start -c
```

### "API key not working"
- Check `.env` file exists
- Verify key is correct
- Restart dev server

### "Build fails"
```bash
# Clear cache
eas build --platform ios --clear-cache
```

### "App crashes on startup"
- Check console logs
- Verify all dependencies installed
- Clear cache and rebuild

## 📚 Learn More

- **Expo Docs:** https://docs.expo.dev/
- **React Native:** https://reactnative.dev/
- **Expo Router:** https://docs.expo.dev/router/introduction/
- **GolfCourseAPI:** https://golfcourseapi.com/docs

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

[Your License Here]

## 💬 Support

For questions or issues:
- Check documentation
- Review console logs
- Contact the development team

---

Happy coding! 🏌️‍♂️⛳
