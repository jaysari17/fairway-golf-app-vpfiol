
# 🔄 Migration Guide: AsyncStorage → Supabase

## Overview

This guide shows you how to update your existing FAIRWAY code to use Supabase instead of AsyncStorage.

## Quick Reference

| Old (AsyncStorage) | New (Supabase) |
|-------------------|----------------|
| `StorageService` | `SupabaseStorageService` |
| Local data only | Cloud database |
| No authentication | Built-in auth |
| Single device | Multi-device sync |

## Step-by-Step Migration

### 1. Authentication

**Before:**
```typescript
// No authentication - data stored locally
import { StorageService } from '@/utils/storage';
```

**After:**
```typescript
// Users must be authenticated
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { SupabaseStorageService } from '@/utils/supabaseStorage';

function MyComponent() {
  const { user, signIn, signUp } = useSupabaseAuth();
  
  // Check if user is logged in
  if (!user) {
    return <LoginScreen />;
  }
  
  // User is authenticated, can access data
}
```

### 2. User Profile

**Before:**
```typescript
import { StorageService } from '@/utils/storage';

// Get profile
const profile = await StorageService.getProfile();

// Save profile
await StorageService.saveProfile(profile);
```

**After:**
```typescript
import { SupabaseStorageService } from '@/utils/supabaseStorage';

// Get profile (automatically uses authenticated user)
const profile = await SupabaseStorageService.getProfile();

// Get another user's profile
const otherProfile = await SupabaseStorageService.getProfile('user-id');

// Save profile (automatically saves for authenticated user)
await SupabaseStorageService.saveProfile(profile);
```

### 3. Golf Rounds

**Before:**
```typescript
import { StorageService } from '@/utils/storage';

// Get rounds
const rounds = await StorageService.getRounds();

// Save round
await StorageService.saveRound(round);

// Update round
await StorageService.updateRound(roundId, updatedRound);

// Delete round
await StorageService.deleteRound(roundId);
```

**After:**
```typescript
import { SupabaseStorageService } from '@/utils/supabaseStorage';

// Get rounds (automatically uses authenticated user)
const rounds = await SupabaseStorageService.getRounds();

// Get another user's rounds
const otherRounds = await SupabaseStorageService.getRounds('user-id');

// Save round
await SupabaseStorageService.saveRound(round);

// Update round
await SupabaseStorageService.updateRound(roundId, updatedRound);

// Delete round
await SupabaseStorageService.deleteRound(roundId);
```

### 4. Course Ratings

**Before:**
```typescript
import { RatingStorageService } from '@/utils/ratingStorage';

// Get ratings
const ratings = await RatingStorageService.getRatings();

// Save rating
await RatingStorageService.saveRating(rating);
```

**After:**
```typescript
import { SupabaseStorageService } from '@/utils/supabaseStorage';

// Get ratings (automatically uses authenticated user)
const ratings = await SupabaseStorageService.getRatings();

// Get another user's ratings
const otherRatings = await SupabaseStorageService.getRatings('user-id');

// Save rating
await SupabaseStorageService.saveRating(rating);
```

### 5. Social Features

**Before:**
```typescript
import { SocialStorageService } from '@/utils/socialStorage';

// Get feed
const feed = await SocialStorageService.getFeedEvents();

// Like event
await SocialStorageService.likeFeedEvent(eventId);
```

**After:**
```typescript
import { SupabaseStorageService } from '@/utils/supabaseStorage';

// Get feed (shows events from followed users)
const feed = await SupabaseStorageService.getFeedEvents(50, 0);

// Create feed event
await SupabaseStorageService.createFeedEvent(event);

// Like event
await SupabaseStorageService.likeFeedEvent(eventId);

// Follow user
await SupabaseStorageService.followUser(userId);

// Unfollow user
await SupabaseStorageService.unfollowUser(userId);

// Get followers
const followers = await SupabaseStorageService.getFollowers(userId);

// Get following
const following = await SupabaseStorageService.getFollowing(userId);
```

### 6. Avatar Upload

**Before:**
```typescript
// No file upload support in AsyncStorage
```

**After:**
```typescript
import { SupabaseStorageService } from '@/utils/supabaseStorage';
import * as ImagePicker from 'expo-image-picker';

// Pick image
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
});

if (!result.canceled) {
  // Convert to blob
  const response = await fetch(result.assets[0].uri);
  const blob = await response.blob();
  
  // Upload to Supabase
  const avatarUrl = await SupabaseStorageService.uploadAvatar(
    blob,
    user.id
  );
  
  // Update profile with new avatar URL
  await SupabaseStorageService.saveProfile({
    ...profile,
    avatar: avatarUrl,
  });
}
```

## Example: Updating a Component

### Before (AsyncStorage)

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { StorageService } from '@/utils/storage';
import { Round } from '@/types/golf';

export default function RoundsScreen() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRounds();
  }, []);

  const loadRounds = async () => {
    const data = await StorageService.getRounds();
    setRounds(data);
    setLoading(false);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      {rounds.map(round => (
        <Text key={round.id}>{round.courseName}</Text>
      ))}
    </View>
  );
}
```

### After (Supabase)

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SupabaseStorageService } from '@/utils/supabaseStorage';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Round } from '@/types/golf';

export default function RoundsScreen() {
  const { user, loading: authLoading } = useSupabaseAuth();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRounds();
    }
  }, [user]);

  const loadRounds = async () => {
    const data = await SupabaseStorageService.getRounds();
    setRounds(data);
    setLoading(false);
  };

  if (authLoading || loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Text>Please log in to view your rounds</Text>;
  }

  return (
    <View>
      {rounds.map(round => (
        <Text key={round.id}>{round.courseName}</Text>
      ))}
    </View>
  );
}
```

## Key Differences

### 1. Authentication Required
- **AsyncStorage**: No authentication needed
- **Supabase**: User must be logged in to access their data

### 2. User Context
- **AsyncStorage**: Single user per device
- **Supabase**: Multi-user support, data tied to authenticated user

### 3. Data Scope
- **AsyncStorage**: Can only access own data
- **Supabase**: Can access own data + public data from other users

### 4. Error Handling
- **AsyncStorage**: Rarely fails (local storage)
- **Supabase**: Network errors possible, need proper error handling

### 5. Real-time Updates
- **AsyncStorage**: Manual refresh needed
- **Supabase**: Can subscribe to real-time changes (optional)

## Migration Checklist

- [ ] Set up Supabase project
- [ ] Add credentials to `.env` file
- [ ] Create all database tables
- [ ] Set up storage bucket for avatars
- [ ] Update imports from `StorageService` to `SupabaseStorageService`
- [ ] Add authentication checks to components
- [ ] Update profile screen to use Supabase auth
- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Test data persistence
- [ ] Test social features
- [ ] Migrate existing test data (if needed)

## Testing Your Migration

1. **Sign Up**: Create a new account
2. **Profile**: Update your profile and avatar
3. **Rounds**: Log a new round
4. **Ratings**: Rate a course
5. **Social**: Follow another user (create a second test account)
6. **Feed**: Post to the feed and like posts
7. **Multi-device**: Log in on another device and verify data syncs

## Rollback Plan

If you need to temporarily revert to AsyncStorage:

1. Keep both `StorageService` and `SupabaseStorageService` files
2. Use a feature flag to switch between them:

```typescript
const USE_SUPABASE = process.env.EXPO_PUBLIC_USE_SUPABASE === 'true';

const storage = USE_SUPABASE 
  ? SupabaseStorageService 
  : StorageService;

// Use storage.getRounds(), storage.saveProfile(), etc.
```

## Need Help?

- **Setup issues**: See `SUPABASE_QUICKSTART.md`
- **Detailed docs**: See `SUPABASE_SETUP_GUIDE.md`
- **Supabase docs**: https://supabase.com/docs

---

**Happy migrating! 🚀**
