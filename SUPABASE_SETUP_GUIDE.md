
# Supabase Setup Guide for FAIRWAY

## 🎯 Overview

Your FAIRWAY app is now configured to use Supabase as the backend! This guide will walk you through setting up your Supabase project.

## 📋 Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Your Supabase project URL and anon key

## 🚀 Quick Start

### Step 1: Get Your Supabase Credentials

1. Go to https://app.supabase.com
2. Create a new project or select an existing one
3. Go to **Settings** → **API**
4. Copy your:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### Step 2: Configure Environment Variables

Create a `.env` file in your project root (copy from `.env.example`):

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Golf Course API (already configured)
EXPO_PUBLIC_GOLF_COURSE_API_KEY=U2RVDJNGLFSNE5B2MAOAZGX2SM
```

### Step 3: Create Database Tables

Run these SQL commands in your Supabase SQL Editor (Dashboard → SQL Editor):

#### 1. Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  handicap INTEGER,
  phone_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

#### 2. Rounds Table
```sql
CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  course_location TEXT NOT NULL,
  date_played DATE NOT NULL,
  score INTEGER,
  tee_box TEXT,
  yardage INTEGER,
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own rounds"
  ON rounds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rounds"
  ON rounds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rounds"
  ON rounds FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rounds"
  ON rounds FOR DELETE
  USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX rounds_user_id_idx ON rounds(user_id);
CREATE INDEX rounds_date_played_idx ON rounds(date_played DESC);
```

#### 3. Ratings Table
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  course_location TEXT NOT NULL,
  play_again_response TEXT,
  comparison_wins INTEGER DEFAULT 0,
  comparison_losses INTEGER DEFAULT 0,
  compared_course_ids TEXT[],
  rank_position INTEGER,
  total_courses INTEGER,
  final_score INTEGER NOT NULL,
  play_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own ratings"
  ON ratings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX ratings_user_id_idx ON ratings(user_id);
CREATE INDEX ratings_course_id_idx ON ratings(course_id);
```

#### 4. Feed Events Table
```sql
CREATE TABLE feed_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  course_id TEXT,
  round_id UUID REFERENCES rounds(id) ON DELETE CASCADE,
  rating INTEGER,
  score INTEGER,
  photo_url TEXT,
  comment TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE feed_events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Feed events are viewable by everyone"
  ON feed_events FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own feed events"
  ON feed_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX feed_events_user_id_idx ON feed_events(user_id);
CREATE INDEX feed_events_created_at_idx ON feed_events(created_at DESC);
```

#### 5. Feed Comments Table
```sql
CREATE TABLE feed_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES feed_events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Comments are viewable by everyone"
  ON feed_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own comments"
  ON feed_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX feed_comments_event_id_idx ON feed_comments(event_id);
```

#### 6. Followers Table
```sql
CREATE TABLE followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Enable Row Level Security
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Followers are viewable by everyone"
  ON followers FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON followers FOR DELETE
  USING (auth.uid() = follower_id);

-- Index for performance
CREATE INDEX followers_follower_id_idx ON followers(follower_id);
CREATE INDEX followers_following_id_idx ON followers(following_id);
```

#### 7. Badges Table
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Enable Row Level Security
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Badges are viewable by everyone"
  ON badges FOR SELECT
  USING (true);

CREATE POLICY "System can award badges"
  ON badges FOR INSERT
  WITH CHECK (true);

-- Index for performance
CREATE INDEX badges_user_id_idx ON badges(user_id);
```

#### 8. Database Functions
```sql
-- Function to increment likes on feed events
CREATE OR REPLACE FUNCTION increment_likes(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE feed_events
  SET likes_count = likes_count + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Step 4: Set Up Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `avatars`
3. Set it to **Public** (so avatar images are accessible)
4. Add this policy for the avatars bucket:

```sql
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public access to view avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
```

### Step 5: Configure Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Email** authentication
3. (Optional) Enable **Google** and **Apple** OAuth:
   - Follow the Supabase docs for setting up OAuth providers
   - Update your app's redirect URLs

## 🔄 Using Supabase in Your App

### Authentication

```typescript
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

function MyComponent() {
  const { user, signIn, signUp, signOut } = useSupabaseAuth();

  // Sign up
  await signUp('email@example.com', 'password', {
    username: 'johndoe',
    displayName: 'John Doe'
  });

  // Sign in
  await signIn('email@example.com', 'password');

  // Sign out
  await signOut();
}
```

### Database Operations

```typescript
import { SupabaseStorageService } from '@/utils/supabaseStorage';

// Save a round
await SupabaseStorageService.saveRound(round);

// Get user profile
const profile = await SupabaseStorageService.getProfile();

// Follow a user
await SupabaseStorageService.followUser(userId);
```

## 🔐 Security Notes

1. **Never commit your `.env` file** - it contains sensitive keys
2. **Row Level Security (RLS)** is enabled on all tables for security
3. **Anon key is safe to expose** - it's meant for client-side use
4. **Service role key** should NEVER be used in the app (only for admin tasks)

## 🧪 Testing

1. Start your app: `npm run dev`
2. Try signing up with a test email
3. Check your Supabase dashboard to see the data being created
4. Test creating rounds, ratings, and social features

## 📚 Next Steps

1. **Migrate existing data**: If you have data in AsyncStorage, you'll need to migrate it to Supabase
2. **Set up real-time subscriptions**: Supabase supports real-time updates for social features
3. **Add push notifications**: Integrate with Expo notifications for social alerts
4. **Deploy**: When ready, update your production environment variables

## 🆘 Troubleshooting

### "No Supabase credentials" warning
- Make sure your `.env` file exists and has the correct keys
- Restart your Expo dev server after adding environment variables

### "Row Level Security" errors
- Check that your RLS policies are set up correctly
- Make sure the user is authenticated before making requests

### Authentication not working
- Verify your Supabase URL and anon key are correct
- Check that email authentication is enabled in Supabase dashboard

## 📖 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-react-native)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Your FAIRWAY app is now connected to Supabase! 🎉**

All your data will be stored in a real database, and users can authenticate, create profiles, and interact with each other in real-time.
