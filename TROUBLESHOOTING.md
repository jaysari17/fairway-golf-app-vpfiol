
# FAIRWAY - Troubleshooting Guide

## 🔧 Common Issues & Solutions

### Installation Issues

#### "Module not found" errors

**Problem**: Missing dependencies after cloning

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Or use yarn
rm -rf node_modules
yarn install
```

#### "Expo CLI not found"

**Problem**: Expo CLI not installed globally

**Solution**:
```bash
npm install -g expo-cli
# Or use npx
npx expo start
```

---

### Build Issues

#### "EAS project not found"

**Problem**: Project not initialized with EAS

**Solution**:
```bash
eas init
```

Then update `app.json` with the project ID.

#### "Bundle identifier already exists"

**Problem**: Bundle ID is taken

**Solution**:
Update bundle IDs in `app.json`:
```json
{
  "ios": {
    "bundleIdentifier": "com.yourcompany.fairway"
  },
  "android": {
    "package": "com.yourcompany.fairway"
  }
}
```

#### "Build failed: Missing assets"

**Problem**: App icon or splash screen not found

**Solution**:
1. Create `assets/images/app-icon.png` (1024x1024)
2. Create `assets/images/splash-icon.png` (1242x2436)
3. Rebuild

---

### Runtime Issues

#### App crashes on launch

**Problem**: Various causes

**Solutions**:

1. **Check error logs**:
```bash
npx expo start
# Press 'j' to open debugger
```

2. **Clear cache**:
```bash
npx expo start --clear
```

3. **Reset AsyncStorage**:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear();
```

#### "Cannot read property of undefined"

**Problem**: Data not loaded yet

**Solution**:
Check for loading states:
```typescript
if (loading) return <LoadingSpinner />;
if (!data) return <EmptyState />;
```

#### Dark mode looks broken

**Problem**: Colors not adapting to theme

**Solution**:
Use theme colors:
```typescript
const theme = useTheme();
<Text style={{ color: theme.colors.text }}>
```

---

### Navigation Issues

#### "Cannot navigate to route"

**Problem**: Route doesn't exist

**Solution**:
Check file structure matches route:
```
app/(tabs)/(social)/index.tsx → /(tabs)/(social)/
```

#### Tab bar not showing

**Problem**: Platform-specific layout issue

**Solution**:
- iOS: Check `_layout.ios.tsx` exists
- Android: Check `FloatingTabBar` is rendered

#### Modal won't close

**Problem**: Navigation stack issue

**Solution**:
```typescript
router.back(); // or
router.dismiss();
```

---

### Data Issues

#### Rounds not saving

**Problem**: AsyncStorage error

**Solution**:
```typescript
try {
  await StorageService.saveRound(round);
} catch (error) {
  console.error('Save error:', error);
  Alert.alert('Error', 'Failed to save round');
}
```

#### Rating flow not triggering

**Problem**: Trigger not created

**Solution**:
Check trigger creation in `modal.tsx`:
```typescript
await RatingStorageService.addTrigger({
  courseId: course.id,
  courseName: course.name,
  roundId: round.id,
  triggerType: 'after_log',
  triggeredAt: new Date(),
  completed: false,
});
```

#### Data lost after app restart

**Problem**: AsyncStorage not persisting

**Solution**:
1. Check permissions
2. Verify storage keys are consistent
3. Test on real device (not just simulator)

---

### Social Features Issues

#### Friends not showing

**Problem**: Sample data not generated

**Solution**:
Social features use local storage. To test:
1. Log some rounds
2. Wait for feed to generate sample events
3. Or manually create friend data

#### Feed events not appearing

**Problem**: No rounds logged

**Solution**:
1. Log at least one round
2. Refresh the feed
3. Check `useSocial` hook is loading data

---

### Performance Issues

#### App feels slow

**Solutions**:

1. **Enable Hermes** (already enabled in Expo 54)

2. **Optimize images**:
```typescript
<Image
  source={{ uri: imageUrl }}
  resizeMode="cover"
  style={{ width: 100, height: 100 }}
/>
```

3. **Use FlatList for long lists**:
```typescript
<FlatList
  data={items}
  renderItem={({ item }) => <Item data={item} />}
  keyExtractor={(item) => item.id}
/>
```

#### Animations stuttering

**Problem**: Heavy computations on UI thread

**Solution**:
Use `runOnJS` for heavy operations:
```typescript
import { runOnJS } from 'react-native-reanimated';

runOnJS(heavyComputation)();
```

---

### Testing Issues

#### Can't test on physical device

**Problem**: Device not connected

**Solutions**:

**iOS**:
1. Connect device via USB
2. Trust computer on device
3. Run `npm run ios`

**Android**:
1. Enable Developer Mode
2. Enable USB Debugging
3. Run `npm run android`

#### TestFlight build not installing

**Problem**: Various causes

**Solutions**:
1. Check device iOS version matches minimum
2. Verify bundle ID matches
3. Check provisioning profile
4. Try deleting and reinstalling

---

### Submission Issues

#### "Missing privacy policy"

**Problem**: Privacy policy URL not set

**Solution**:
1. Host `privacy-policy.html` online
2. Add URL to App Store Connect
3. Add URL to `app.json`

#### "Missing screenshots"

**Problem**: Screenshots not uploaded

**Solution**:
Required sizes:
- iOS: 6.5" (1284x2778), 5.5" (1242x2208)
- Android: 1080x1920

#### "App rejected: Crashes on launch"

**Problem**: Production build has errors

**Solution**:
1. Test preview build first
2. Check error logs in App Store Connect
3. Fix issues and resubmit

---

## 🆘 Getting Help

### Debug Mode

Enable debug mode:
```bash
npx expo start
# Press 'd' to open developer menu
# Press 'j' to open Chrome debugger
```

### Logs

View logs:
```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

### Reset Everything

Nuclear option:
```bash
# Clear cache
npx expo start --clear

# Reset Metro bundler
rm -rf node_modules
rm -rf .expo
npm install

# Reset iOS
cd ios && pod install && cd ..

# Reset Android
cd android && ./gradlew clean && cd ..
```

---

## 📚 Resources

### Documentation
- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Expo Router Docs](https://docs.expo.dev/router/introduction)

### Community
- [Expo Discord](https://chat.expo.dev)
- [Expo Forums](https://forums.expo.dev)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

### Tools
- [Expo Snack](https://snack.expo.dev) - Test code online
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com) - Advanced debugging

---

## 🐛 Reporting Issues

If you find a bug:

1. Check this guide first
2. Search existing issues
3. Create detailed bug report with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/videos
   - Device/OS info
   - Error logs

---

## ✅ Prevention Tips

### Before Building
- [ ] Test on real devices
- [ ] Test both light and dark mode
- [ ] Test all user flows
- [ ] Check error handling
- [ ] Verify data persistence

### Before Submitting
- [ ] Create all required assets
- [ ] Test production build
- [ ] Capture screenshots
- [ ] Write app description
- [ ] Set up support email

### After Launch
- [ ] Monitor crash reports
- [ ] Read user reviews
- [ ] Track analytics
- [ ] Plan updates

---

**Still stuck?** Check the other documentation files or reach out for help!
