
# FAIRWAY Backend Integration Plan

## Current Status

✅ **Frontend Complete**: All UI components and screens are built and working with local AsyncStorage
✅ **Backend Specification Complete**: Full database schema and API endpoints documented
⏳ **Backend Implementation**: Pending - needs to be built
⏳ **Frontend Integration**: Pending - needs to replace AsyncStorage with API calls

## What's Working Now (Local Storage)

The app currently works fully with local AsyncStorage:
- User profiles stored locally
- Rounds and ratings saved locally
- Social feed events stored locally
- Friends and followers managed locally
- All features functional for single-device testing

## What Needs Backend Integration

### 1. Authentication System
**Priority: HIGH**
- User registration and login
- JWT token management
- Password hashing and security
- Session management

**Files to Update:**
- Create `contexts/AuthContext.tsx` for auth state
- Update `app/_layout.tsx` to check auth status
- Create `app/auth/login.tsx` and `app/auth/register.tsx`
- Update all API calls to include auth token

### 2. User Profiles
**Priority: HIGH**
- Profile creation and updates
- Avatar uploads to object storage
- Profile viewing for other users
- Stats calculation (total rounds, courses, etc.)

**Files to Update:**
- `app/(tabs)/profile.tsx` - Replace StorageService with apiClient
- `app/(tabs)/profile.ios.tsx` - Same as above
- `app/profile-setup.tsx` - Use API for profile creation
- `hooks/useProfile.ts` - Fetch from API instead of AsyncStorage

### 3. Rounds Management
**Priority: HIGH**
- Create, read, update, delete rounds
- Photo uploads for rounds
- Associate rounds with courses
- Sync across devices

**Files to Update:**
- `utils/storage.ts` - Replace with API calls
- `hooks/useRounds.ts` - Fetch from API
- All screens that create/edit rounds

### 4. Course Ratings
**Priority: HIGH**
- Save ratings to backend
- Retrieve user's ratings
- Calculate rankings across all users
- Rating algorithm results

**Files to Update:**
- `app/rating-flow.tsx` - Save to API instead of AsyncStorage
- `utils/ratingStorage.ts` - Replace with API calls
- `components/rating/*` - Update to use API

### 5. Social Features - Followers
**Priority: HIGH**
- Follow/unfollow users
- View followers and following lists
- Follower counts
- Notifications for new followers

**Files to Update:**
- `app/user-followers.tsx` - Fetch from API
- `app/user-following.tsx` - Fetch from API
- `app/(tabs)/profile.tsx` - Update follow buttons
- `hooks/useSocial.ts` - Replace with API calls

### 6. Social Features - Feed
**Priority: HIGH**
- Post feed events (rounds, ratings)
- Like and comment on posts
- View feed from followed users
- Real-time updates

**Files to Update:**
- `app/(tabs)/(social)/index.tsx` - Fetch feed from API
- `app/(tabs)/(social)/index.ios.tsx` - Same as above
- `app/comment-modal.tsx` - Post comments to API
- `components/social/FeedEventCard.tsx` - Update like/comment actions
- `utils/socialStorage.ts` - Replace with API calls

### 7. Notifications
**Priority: MEDIUM**
- Friend requests
- New followers
- Likes and comments
- Badge achievements
- Push notifications (future)

**Files to Update:**
- Create `app/notifications.tsx` screen
- Add notification bell to header
- Update `utils/socialStorage.ts` with API calls

### 8. Search
**Priority: MEDIUM**
- Search for users
- Search for courses (already working with Golf Course API)
- Search results with proper filtering

**Files to Update:**
- Create `app/search.tsx` screen
- Add search functionality to social tab
- Use API for user search

### 9. Privacy Settings
**Priority: LOW**
- Account visibility settings
- Mute users
- Control what's visible on profile

**Files to Update:**
- Create `app/settings/privacy.tsx`
- Update profile visibility logic
- Use API for settings

### 10. Badges System
**Priority: LOW**
- Award badges based on achievements
- Display earned badges
- Badge notifications

**Files to Update:**
- Update `data/badges.ts` to fetch from API
- Add badge checking logic
- Display badges on profile

## Integration Steps

### Phase 1: Authentication (Week 1)
1. Set up auth context and token management
2. Create login/register screens
3. Add auth checks to protected routes
4. Test authentication flow

### Phase 2: Core Data (Week 2)
1. Integrate user profiles with API
2. Connect rounds management to backend
3. Integrate ratings system
4. Test data persistence

### Phase 3: Social Features (Week 3)
1. Implement followers system
2. Connect social feed to API
3. Add like and comment functionality
4. Test social interactions

### Phase 4: Additional Features (Week 4)
1. Add notifications
2. Implement search
3. Add privacy settings
4. Test complete app flow

### Phase 5: Polish & Deploy (Week 5)
1. Error handling and edge cases
2. Loading states and optimistic updates
3. Performance optimization
4. Deploy to production

## API Client Usage

All API calls should use the `apiClient` from `utils/api.ts`:

```typescript
import { apiClient } from '@/utils/api';

// Set token after login
apiClient.setToken(token);

// Make API calls
const { data, error } = await apiClient.getRounds();
if (error) {
  console.error('Failed to fetch rounds:', error);
  return;
}
// Use data
```

## Migration Strategy

### Option 1: Big Bang (Recommended for MVP)
- Switch all features to backend at once
- Requires backend to be fully ready
- Cleaner migration, less complexity
- Users start fresh with new accounts

### Option 2: Gradual Migration
- Migrate features one by one
- Keep AsyncStorage as fallback
- More complex but allows partial deployment
- Can migrate existing user data

## Testing Checklist

Before going live with backend:
- [ ] User registration and login works
- [ ] Profile creation and updates work
- [ ] Rounds can be created, edited, deleted
- [ ] Ratings are saved and retrieved correctly
- [ ] Following/unfollowing works
- [ ] Feed shows posts from followed users
- [ ] Likes and comments work
- [ ] Notifications are created and displayed
- [ ] Search finds users and courses
- [ ] Privacy settings are respected
- [ ] All data syncs across devices
- [ ] Error handling works properly
- [ ] Loading states are shown
- [ ] App works offline (with cached data)

## Environment Variables

Add to `.env`:
```
EXPO_PUBLIC_API_URL=https://api.fairway.app
```

For development:
```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Notes

- Keep AsyncStorage code as fallback during development
- Add proper error handling for network failures
- Implement optimistic updates for better UX
- Cache data locally for offline support
- Add retry logic for failed requests
- Show loading states during API calls
- Handle token expiration and refresh
- Implement proper logout flow

## Timeline

- **Backend Development**: 2-3 weeks
- **Frontend Integration**: 2-3 weeks
- **Testing & Bug Fixes**: 1-2 weeks
- **Total**: 5-8 weeks to full production

## Success Criteria

✅ All features work with real backend
✅ Data persists across devices
✅ Social features work between users
✅ App handles errors gracefully
✅ Performance is acceptable
✅ Ready for App Store submission
