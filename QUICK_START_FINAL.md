
# FAIRWAY - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- Expo Go app on your phone (for testing)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
Create a `.env` file:
```env
GOLF_COURSE_API_KEY=your_api_key_here
```

Get your API key from [RapidAPI - GolfCourseAPI](https://rapidapi.com/golfcourseapi/api/golf-course-api)

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open on Your Device
1. Install Expo Go on your phone
2. Scan the QR code from the terminal
3. App will load on your device

## 📱 Testing the New Features

### Test Contact Sync
1. Complete the onboarding screens
2. Enter profile information (use any email/phone)
3. On contact sync screen, tap "Sync Contacts"
4. Grant permission when prompted
5. You'll see mock users (Tiger Woods, Rory McIlroy, etc.)
6. Select users and tap "Add Friends"

### Test Rating Flow
1. Tap the "+" button in the center of the tab bar
2. Search for a course (e.g., "Pebble Beach")
3. Select a course
4. Complete the rating flow:
   - Answer "Would you play again?"
   - Compare with other courses
   - Drag to rank the course
   - View your final score

### Test Social Feed
1. Log a few rounds
2. Navigate to the Social tab
3. See your activity in the feed
4. View friend requests (if you added friends)

## 🔧 Common Development Tasks

### Add a New Screen
```typescript
// Create file: app/new-screen.tsx
import { View, Text } from 'react-native';

export default function NewScreen() {
  return (
    <View>
      <Text>New Screen</Text>
    </View>
  );
}
```

### Add a New Component
```typescript
// Create file: components/MyComponent.tsx
import { View, Text, StyleSheet } from 'react-native';

export function MyComponent() {
  return (
    <View style={styles.container}>
      <Text>My Component</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

### Update User Profile Type
```typescript
// Edit: types/golf.ts
export interface UserProfile {
  username: string;
  email: string;
  phoneNumber: string;
  // Add your new field here
  newField?: string;
}
```

### Add Storage for New Data
```typescript
// Edit: utils/storage.ts
const STORAGE_KEYS = {
  // Add your new key
  NEW_DATA: '@fairway_new_data',
};

export const StorageService = {
  async getNewData(): Promise<any> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.NEW_DATA);
    return data ? JSON.parse(data) : null;
  },
  
  async saveNewData(data: any): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.NEW_DATA, JSON.stringify(data));
  },
};
```

## 🎨 Customizing the App

### Change Brand Colors
Edit `styles/commonStyles.ts`:
```typescript
export const colors = {
  primary: '#57C8A1',    // Mint green
  secondary: '#3FA87F',  // Darker mint
  // Add your colors
};
```

### Update App Name/Icon
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "icon": "./assets/images/your-icon.png"
  }
}
```

### Modify Onboarding Screens
Edit `app/onboarding.tsx`:
```typescript
const onboardingData = [
  {
    title: 'Your Title',
    description: 'Your description',
    emoji: '🎯',
  },
  // Add more screens
];
```

## 🔌 Adding Backend (Supabase)

### Step 1: Enable Supabase in Natively
1. Click the Supabase button in Natively
2. Connect to your Supabase project
3. Copy your project URL and anon key

### Step 2: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### Step 3: Create Supabase Client
```typescript
// Create: utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 4: Replace AsyncStorage with Supabase
```typescript
// Before (AsyncStorage)
const profile = await StorageService.getProfile();

// After (Supabase)
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

## 📊 Database Schema (for Backend)

### Users Table
```sql
create table users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  email text unique not null,
  phone_number text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  handicap decimal(4,1),
  created_at timestamp default now()
);
```

### Rounds Table
```sql
create table rounds (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  course_id text not null,
  course_name text not null,
  course_location text not null,
  date timestamp not null,
  rating integer not null,
  review text,
  score integer,
  created_at timestamp default now()
);
```

### Friends Table
```sql
create table friends (
  user_id uuid references users(id),
  friend_id uuid references users(id),
  created_at timestamp default now(),
  primary key (user_id, friend_id)
);
```

## 🐛 Debugging

### View Logs
```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

### Clear Cache
```bash
# Clear Expo cache
npx expo start --clear

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Reset App Data
```typescript
// Add this to your app temporarily
import { StorageService } from '@/utils/storage';
import { SocialStorageService } from '@/utils/socialStorage';

// Call this to reset all data
await StorageService.clearAll();
await SocialStorageService.clearAllSocialData();
```

## 📦 Building for Production

### iOS
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build
eas build --platform ios --profile production
```

### Android
```bash
# Build
eas build --platform android --profile production
```

## 🧪 Testing Checklist

Before submitting to app stores:

- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test all onboarding flows
- [ ] Test contact sync (grant/deny)
- [ ] Test course search
- [ ] Test rating flow
- [ ] Test social features
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test offline functionality
- [ ] Test with poor network
- [ ] Check for console errors
- [ ] Verify all permissions work

## 📚 Key Files to Know

### Navigation
- `app/_layout.tsx` - Root layout
- `app/(tabs)/_layout.tsx` - Tab navigation
- `app/onboarding.tsx` - First-time user flow

### Features
- `app/profile-setup.tsx` - Profile creation
- `app/contact-sync.tsx` - Contact sync
- `app/rating-flow.tsx` - Rating system
- `app/modal.tsx` - Course selection

### Data
- `utils/storage.ts` - Main data storage
- `utils/socialStorage.ts` - Social data
- `utils/contactSync.ts` - Contact sync
- `utils/golfCourseApi.ts` - Course search

### Types
- `types/golf.ts` - Golf data types
- `types/social.ts` - Social types
- `types/rating.ts` - Rating types

## 🆘 Common Issues

### Issue: "Expo Go not connecting"
**Solution**: Make sure phone and computer are on same WiFi

### Issue: "Module not found"
**Solution**: 
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### Issue: "Contacts permission not working"
**Solution**: 
```bash
npx expo prebuild --clean
npx expo run:ios  # or run:android
```

### Issue: "Build fails"
**Solution**: Check `app.json` is valid JSON, update EAS CLI

## 💡 Tips

1. **Use TypeScript**: It catches errors before runtime
2. **Test on Real Devices**: Simulators don't show all issues
3. **Check Console Logs**: Most errors show up there
4. **Use React DevTools**: Great for debugging
5. **Read the Docs**: Check the other MD files for details

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Expo Router Docs](https://docs.expo.dev/router/introduction)

## 📞 Need Help?

1. Check the documentation files in this repo
2. Review console logs for errors
3. Search Expo forums
4. Check Stack Overflow
5. Contact: support@fairwayapp.com

## ✅ Next Steps

1. **Customize the app** with your branding
2. **Test thoroughly** on real devices
3. **Add backend** (Supabase recommended)
4. **Create screenshots** for app stores
5. **Submit to stores** when ready
6. **Launch!** 🚀

---

**Happy Coding!** 💚⛳

For detailed information, see:
- [APP_STORE_READY_FINAL.md](./APP_STORE_READY_FINAL.md)
- [CONTACT_SYNC_GUIDE.md](./CONTACT_SYNC_GUIDE.md)
- [IMPLEMENTATION_SUMMARY_FINAL.md](./IMPLEMENTATION_SUMMARY_FINAL.md)
