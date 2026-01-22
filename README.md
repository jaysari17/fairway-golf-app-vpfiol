
# ⛳ FAIRWAY - Golf Course Tracking App

**Track your golf journey. Log rounds, rate courses, and build your ultimate golf profile.**

## 🎉 Status: Ready for TestFlight Deployment

Your FAIRWAY app is fully integrated with Supabase and ready to deploy to TestFlight!

## 🚀 Quick Deploy

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Build for iOS
eas build --platform ios --profile production

# 3. Submit to TestFlight
eas submit --platform ios
```

## ✅ What's Working

### Core Features
- ✅ User authentication (email/password)
- ✅ Profile creation and editing
- ✅ Round logging with worldwide course search
- ✅ Course rating system with comparisons
- ✅ Badge system
- ✅ Onboarding flow

### Social Features
- ✅ Follow/unfollow users
- ✅ Social feed with rounds and ratings
- ✅ Friend requests
- ✅ Comments on feed posts
- ✅ Like feed posts
- ✅ View followers/following

### Backend
- ✅ Supabase database with 8 tables
- ✅ Row Level Security (RLS) enabled
- ✅ Real-time data sync
- ✅ Secure authentication
- ✅ Cloud storage ready

## 📱 Run Locally

```bash
# Install dependencies
npm install

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 🔧 Configuration

### Environment Variables
The `.env` file is already configured with:
- Supabase URL and API key
- Golf Course API key

### Database
All tables are created in Supabase:
- `profiles` - User profiles
- `rounds` - Golf rounds
- `ratings` - Course ratings
- `followers` - Social relationships
- `feed_events` - Social feed
- `feed_comments` - Comments
- `badges` - Achievements
- `friend_requests` - Friend requests

## 📚 Documentation

- **Deployment Guide:** `TESTFLIGHT_DEPLOYMENT_GUIDE.md`
- **Supabase Setup:** `SUPABASE_DEPLOYMENT_COMPLETE.md`
- **Quick Reference:** `DEPLOYMENT_READY.md`

## 🎯 Features

### For Users
1. **Track Rounds** - Log every round you play
2. **Rate Courses** - Comparison-based rating system
3. **Build Profile** - Showcase your golf journey
4. **Social Feed** - See what friends are playing
5. **Discover Courses** - Find new places to play
6. **Earn Badges** - Unlock achievements

### For Developers
1. **Supabase Backend** - Fully configured
2. **Row Level Security** - Data protection
3. **Real-time Sync** - Instant updates
4. **TypeScript** - Type-safe code
5. **Expo Router** - File-based routing
6. **React Native** - Cross-platform

## 🏗️ Tech Stack

- **Frontend:** React Native + Expo 54
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **API:** Golf Course API (worldwide courses)
- **Navigation:** Expo Router
- **State:** React Context + Hooks
- **Styling:** StyleSheet + React Navigation Theme

## 📊 Database Schema

```
profiles (user profiles)
├── id, user_id, username, display_name
├── bio, handicap, phone_number, avatar_url
└── created_at, updated_at

rounds (golf rounds)
├── id, user_id, course_id, course_name
├── course_location, date_played, score
├── tee_box, yardage, review
└── created_at

ratings (course ratings)
├── id, user_id, course_id, course_name
├── play_again_response, comparison_wins
├── rank_position, final_score, play_count
└── created_at, updated_at

followers (social relationships)
├── id, follower_id, following_id
└── created_at

feed_events (social feed)
├── id, user_id, event_type, course_name
├── rating, score, likes_count, comments_count
└── created_at

feed_comments (comments)
├── id, event_id, user_id, text
└── created_at

badges (achievements)
├── id, user_id, badge_id, badge_name
├── badge_description, badge_icon
└── earned_at

friend_requests (friend requests)
├── id, from_user_id, to_user_id, status
└── created_at, updated_at
```

## 🔒 Security

- **Row Level Security (RLS)** - Users can only access their own data
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt password encryption
- **API Key Protection** - Environment variables
- **HTTPS Only** - Secure connections

## 🐛 Troubleshooting

### Authentication Issues
```bash
# Check Supabase credentials
cat .env

# Verify Supabase project is active
# Visit: https://app.supabase.com/project/hwpiblxpxghuzpkaenwg
```

### Build Issues
```bash
# Clear cache
eas build --platform ios --profile production --clear-cache

# Check logs
eas build:list
```

### Data Not Saving
1. Check RLS policies in Supabase Dashboard
2. Verify user is authenticated
3. Check console logs for errors

## 📞 Support

- **Supabase Dashboard:** https://app.supabase.com/project/hwpiblxpxghuzpkaenwg
- **Expo Dashboard:** https://expo.dev
- **Documentation:** See `TESTFLIGHT_DEPLOYMENT_GUIDE.md`

## 🎉 Ready to Launch!

Your app is production-ready with:
- ✅ Full backend infrastructure
- ✅ User authentication
- ✅ Data persistence
- ✅ Social features
- ✅ Real-time sync
- ✅ Secure with RLS

Just build and submit to TestFlight! 🚀⛳

## 📝 License

Copyright © 2024 FAIRWAY. All rights reserved.
