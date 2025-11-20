
# FAIRWAY - Troubleshooting Guide

## 🐛 Common Issues & Solutions

### Build & Development Issues

#### Issue: Metro bundler won't start
```bash
# Solution 1: Clear cache
npm start -- --reset-cache

# Solution 2: Clear watchman
watchman watch-del-all

# Solution 3: Clean install
rm -rf node_modules
npm install
```

#### Issue: "Unable to resolve module"
```bash
# Solution: Clear cache and restart
rm -rf node_modules
npm install
npm start -- --reset-cache
```

#### Issue: iOS build fails
```bash
# Solution 1: Clean iOS build
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Solution 2: Reset simulator
# Device > Erase All Content and Settings
```

#### Issue: Android build fails
```bash
# Solution 1: Clean Android build
cd android
./gradlew clean
cd ..

# Solution 2: Clear gradle cache
rm -rf ~/.gradle/caches
```

---

### App Functionality Issues

#### Issue: App crashes on launch
**Possible Causes:**
- Missing assets (app icon, splash screen)
- AsyncStorage corruption
- Navigation configuration error

**Solutions:**
```bash
# 1. Check for console errors
npm start

# 2. Clear app data
# iOS: Reset simulator
# Android: Settings > Apps > FAIRWAY > Clear Data

# 3. Verify assets exist
ls assets/images/app-icon.png
ls assets/images/splash-icon.png
```

#### Issue: Rating flow doesn't work
**Possible Causes:**
- No courses in sample data
- AsyncStorage not working
- Navigation params missing

**Solutions:**
```typescript
// 1. Check sample courses exist
import { sampleCourses } from '@/data/sampleCourses';
console.log('Sample courses:', sampleCourses.length);

// 2. Check AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.getAllKeys().then(keys => console.log('Storage keys:', keys));

// 3. Check navigation params
// In rating-flow.tsx
console.log('Params:', params);
```

#### Issue: Social feed is empty
**Expected Behavior:**
- Social feed will be empty until you rate courses
- Your own activity will appear in the feed

**Solutions:**
1. Rate at least one course
2. Check if feed events are being saved
3. Pull to refresh

#### Issue: Dark mode not working
**Solutions:**
```typescript
// 1. Check system settings
// iOS: Settings > Display & Brightness > Dark
// Android: Settings > Display > Dark theme

// 2. Force restart app
// 3. Check theme provider in app/_layout.tsx
```

---

### Data & Storage Issues

#### Issue: Data not persisting
**Possible Causes:**
- AsyncStorage not initialized
- Storage keys incorrect
- Data not being saved

**Solutions:**
```typescript
// 1. Check AsyncStorage is working
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.setItem('test', 'value')
  .then(() => AsyncStorage.getItem('test'))
  .then(value => console.log('Test value:', value));

// 2. Check storage keys
// In utils/storage.ts
console.log('Storage keys:', STORAGE_KEYS);

// 3. Clear all data and start fresh
AsyncStorage.clear();
```

#### Issue: Ratings not calculating correctly
**Possible Causes:**
- Algorithm error
- Missing comparison data
- Invalid rank position

**Solutions:**
```typescript
// 1. Check algorithm inputs
// In utils/ratingAlgorithm.ts
console.log('Inputs:', {
  playAgainResponse,
  comparisonWins,
  comparisonLosses,
  rankPosition,
  totalCourses,
  neighborRatings,
});

// 2. Verify score is in range 1-10
console.log('Final score:', finalScore);
```

---

### UI & UX Issues

#### Issue: Haptic feedback not working
**Possible Causes:**
- Device doesn't support haptics
- Haptics disabled in settings
- Simulator doesn't support haptics

**Solutions:**
1. Test on physical device
2. Check device settings
3. Verify haptic calls:
```typescript
import * as Haptics from 'expo-haptics';
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
```

#### Issue: Animations are laggy
**Possible Causes:**
- Too many re-renders
- Heavy computations on main thread
- Debug mode enabled

**Solutions:**
1. Build in production mode
2. Use React.memo for expensive components
3. Move heavy logic to useEffect
4. Use React Native Reanimated for animations

#### Issue: Tab bar not showing
**Possible Causes:**
- FloatingTabBar not rendered
- Z-index issue
- SafeAreaView covering it

**Solutions:**
```typescript
// 1. Check FloatingTabBar is rendered
// In app/(tabs)/_layout.tsx
console.log('Rendering FloatingTabBar');

// 2. Check z-index
// In components/FloatingTabBar.tsx
style={{ zIndex: 1000 }}

// 3. Check SafeAreaView edges
<SafeAreaView edges={['bottom']}>
```

---

### Navigation Issues

#### Issue: Can't navigate to rating flow
**Possible Causes:**
- Route not defined
- Missing params
- Navigation stack issue

**Solutions:**
```typescript
// 1. Check route exists
// In app/_layout.tsx
<Stack.Screen name="rating-flow" />

// 2. Check params are passed
router.push({
  pathname: '/rating-flow',
  params: {
    courseId: 'id',
    courseName: 'name',
    courseLocation: 'location',
  },
});

// 3. Use router.replace instead of router.push
router.replace('/rating-flow');
```

#### Issue: Back button doesn't work
**Solutions:**
```typescript
// 1. Use router.back()
import { useRouter } from 'expo-router';
const router = useRouter();
router.back();

// 2. Check navigation stack
console.log('Can go back:', router.canGoBack());
```

---

### Build & Submission Issues

#### Issue: EAS build fails
**Possible Causes:**
- Invalid credentials
- Missing configuration
- Dependency conflicts

**Solutions:**
```bash
# 1. Check EAS configuration
cat eas.json

# 2. Update credentials
eas credentials

# 3. Check build logs
eas build:list
eas build:view [build-id]

# 4. Clear EAS cache
eas build --clear-cache
```

#### Issue: App Store rejection
**Common Reasons:**
- Missing privacy policy
- Incomplete app information
- Crashes on launch
- Missing required screenshots

**Solutions:**
1. Read rejection reason carefully
2. Fix issues mentioned
3. Test thoroughly before resubmitting
4. Add detailed notes for reviewers

#### Issue: App icon not showing
**Solutions:**
```bash
# 1. Check file exists
ls assets/images/app-icon.png

# 2. Check file size
# Should be 1024x1024px

# 3. Check file format
# Should be PNG, no transparency

# 4. Rebuild app
eas build --platform ios --clear-cache
```

---

### Performance Issues

#### Issue: App is slow
**Solutions:**
1. Enable Hermes (already enabled in Expo 54)
2. Use React.memo for expensive components
3. Avoid inline functions in render
4. Use FlatList for long lists
5. Optimize images

#### Issue: High memory usage
**Solutions:**
1. Check for memory leaks
2. Clean up useEffect hooks
3. Unsubscribe from listeners
4. Clear unused data from AsyncStorage

---

### Testing Issues

#### Issue: Can't test on physical device
**Solutions:**
```bash
# 1. Make sure device is on same network
# 2. Use tunnel mode
npm start -- --tunnel

# 3. Scan QR code with Expo Go app
# 4. Or build development client
eas build --profile development
```

#### Issue: Simulator not launching
**Solutions:**
```bash
# iOS
# 1. Open Xcode
# 2. Window > Devices and Simulators
# 3. Create new simulator

# Android
# 1. Open Android Studio
# 2. AVD Manager
# 3. Create new virtual device
```

---

## 🔍 Debugging Tips

### Enable Debug Mode
```typescript
// In app/_layout.tsx
if (__DEV__) {
  console.log('Debug mode enabled');
}
```

### Log Everything
```typescript
// Add console.logs liberally
console.log('Component mounted');
console.log('Data:', data);
console.log('Error:', error);
```

### Use React DevTools
```bash
# Install
npm install -g react-devtools

# Run
react-devtools
```

### Check AsyncStorage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get all keys
AsyncStorage.getAllKeys().then(keys => {
  console.log('All keys:', keys);
  
  // Get all data
  AsyncStorage.multiGet(keys).then(data => {
    console.log('All data:', data);
  });
});
```

### Monitor Network Requests
```typescript
// In app/_layout.tsx
if (__DEV__) {
  global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
  global.FormData = global.originalFormData || global.FormData;
}
```

---

## 📞 Getting Help

### Internal Resources
- `DEVELOPER_GUIDE.md` - Developer documentation
- `FINAL_SUMMARY.md` - Complete feature list
- `APP_STORE_SUBMISSION_FINAL.md` - Submission guide

### External Resources
- Expo Forums: https://forums.expo.dev
- React Native Discord: https://discord.gg/react-native
- Stack Overflow: Tag with `expo` or `react-native`
- GitHub Issues: Create an issue in the repo

### Emergency Fixes

#### Nuclear Option: Start Fresh
```bash
# 1. Backup your code
git commit -am "Backup before reset"

# 2. Clear everything
rm -rf node_modules
rm -rf ios/Pods
rm -rf android/.gradle
rm package-lock.json
rm yarn.lock

# 3. Reinstall
npm install

# 4. Clear Metro cache
npm start -- --reset-cache

# 5. Clear device data
# iOS: Reset simulator
# Android: Clear app data
```

---

## ✅ Prevention Checklist

### Before Making Changes
- [ ] Commit current working code
- [ ] Test on both iOS and Android
- [ ] Check for console warnings
- [ ] Verify dark mode still works

### Before Building
- [ ] Update version number
- [ ] Test all features
- [ ] Clear cache
- [ ] Check for TypeScript errors

### Before Submitting
- [ ] Test on physical devices
- [ ] Check all screenshots
- [ ] Verify privacy policy
- [ ] Test on both light and dark mode

---

**Still having issues?** Check the other documentation files or reach out for support!
