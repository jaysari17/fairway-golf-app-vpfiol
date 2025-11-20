
# FAIRWAY - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- iOS Simulator (Mac) or Android Emulator

### Step 1: Install Dependencies (2 minutes)
```bash
npm install
```

### Step 2: Start Development Server (1 minute)
```bash
npm run dev
```

### Step 3: Run the App (2 minutes)

**On iOS:**
```bash
npm run ios
```

**On Android:**
```bash
npm run android
```

That's it! The app should now be running.

---

## 📱 First Time Using the App

### 1. Onboarding
- Complete the 3-screen onboarding flow
- Enter your name and handicap (optional)

### 2. Rate Your First Course
- Tap the "+" button at the bottom
- Select a course from the list
- Go through the 4-step rating flow:
  1. Would you play again?
  2. Compare with other courses (if you've rated any)
  3. Place in your ranking
  4. See your final score

### 3. Explore Features
- **Social Tab**: See your activity feed
- **Profile Tab**: View your stats and course list
- **Discover**: Browse and search courses

---

## 🎯 Key Features to Try

### Rating a Course
1. Tap "+" button
2. Select course
3. Complete rating flow
4. View on profile

### Viewing Your Profile
1. Tap "Profile" tab
2. See your stats
3. View course rankings
4. Check play history

### Social Feed
1. Tap "Social" tab
2. See your activity
3. Pull to refresh
4. (Add friends in future updates)

---

## 🎨 Customization

### Toggle Dark Mode
- iOS: Settings > Display & Brightness > Dark
- Android: Settings > Display > Dark theme
- App will automatically adapt

### Haptic Feedback
- Enabled by default
- Provides tactile feedback on interactions

---

## 🐛 Having Issues?

### App Won't Start
```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Build Errors
```bash
# Clean install
rm -rf node_modules
npm install
```

### More Help
See `TROUBLESHOOTING_GUIDE.md` for detailed solutions.

---

## 📚 Next Steps

### For Users
- Rate more courses
- Build your profile
- Explore the social feed

### For Developers
- Read `DEVELOPER_GUIDE.md`
- Check `FINAL_SUMMARY.md`
- Review code structure

### For App Store Submission
- Read `APP_STORE_SUBMISSION_FINAL.md`
- Follow `LAUNCH_CHECKLIST.md`
- Create required assets

---

## ✅ Quick Reference

### Commands
```bash
npm install              # Install dependencies
npm run dev             # Start dev server
npm run ios             # Run on iOS
npm run android         # Run on Android
```

### File Structure
```
app/                    # Screens
components/             # UI components
hooks/                  # Custom hooks
utils/                  # Utilities
types/                  # TypeScript types
```

### Key Files
- `app/modal.tsx` - Course selection
- `app/rating-flow.tsx` - Rating flow
- `app/(tabs)/(social)/index.tsx` - Social feed
- `app/(tabs)/profile.tsx` - Profile

---

**That's it! You're ready to use FAIRWAY! 🏌️⛳**

For more detailed information, check the other documentation files in the project root.
