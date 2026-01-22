
# 🚀 Supabase Quick Start for FAIRWAY

## ⚡ 5-Minute Setup

### Step 1: Get Supabase Credentials (2 minutes)

1. Go to https://app.supabase.com
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: FAIRWAY
   - **Database Password**: (choose a strong password)
   - **Region**: (choose closest to you)
5. Wait for project to be created (~2 minutes)
6. Go to **Settings** → **API**
7. Copy these two values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

### Step 2: Configure Your App (1 minute)

1. In your FAIRWAY project, create a file named `.env`
2. Add your credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_GOLF_COURSE_API_KEY=U2RVDJNGLFSNE5B2MAOAZGX2SM
```

3. Restart your Expo dev server:
```bash
npm run dev
```

### Step 3: Create Database Tables (2 minutes)

1. In Supabase dashboard, click **SQL Editor**
2. Click **New Query**
3. Copy and paste this SQL (creates all tables at once):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
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

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Rounds table
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

ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rounds"
  ON rounds FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rounds"
  ON rounds FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rounds"
  ON rounds FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rounds"
  ON rounds FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX rounds_user_id_idx ON rounds(user_id);
CREATE INDEX rounds_date_played_idx ON rounds(date_played DESC);

-- Ratings table
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

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ratings"
  ON ratings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ratings"
  ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX ratings_user_id_idx ON ratings(user_id);
CREATE INDEX ratings_course_id_idx ON ratings(course_id);

-- Feed events table
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

ALTER TABLE feed_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feed events are viewable by everyone"
  ON feed_events FOR SELECT USING (true);

CREATE POLICY "Users can insert their own feed events"
  ON feed_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX feed_events_user_id_idx ON feed_events(user_id);
CREATE INDEX feed_events_created_at_idx ON feed_events(created_at DESC);

-- Feed comments table
CREATE TABLE feed_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES feed_events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON feed_comments FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments"
  ON feed_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX feed_comments_event_id_idx ON feed_comments(event_id);

-- Followers table
CREATE TABLE followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Followers are viewable by everyone"
  ON followers FOR SELECT USING (true);

CREATE POLICY "Users can follow others"
  ON followers FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON followers FOR DELETE USING (auth.uid() = follower_id);

CREATE INDEX followers_follower_id_idx ON followers(follower_id);
CREATE INDEX followers_following_id_idx ON followers(following_id);

-- Badges table
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

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone"
  ON badges FOR SELECT USING (true);

CREATE POLICY "System can award badges"
  ON badges FOR INSERT WITH CHECK (true);

CREATE INDEX badges_user_id_idx ON badges(user_id);

-- Function to increment likes
CREATE OR REPLACE FUNCTION increment_likes(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE feed_events
  SET likes_count = likes_count + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

4. Click **Run** (bottom right)
5. You should see "Success. No rows returned"

### Step 4: Set Up Storage (30 seconds)

1. In Supabase dashboard, click **Storage**
2. Click **New bucket**
3. Name it: `avatars`
4. Make it **Public**
5. Click **Create bucket**

### Step 5: Enable Email Authentication (30 seconds)

1. In Supabase dashboard, click **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Done!

## ✅ You're Ready!

Your FAIRWAY app is now connected to Supabase! 

### Test It Out

1. Run your app: `npm run dev`
2. The app should start without any Supabase warnings
3. Try signing up a new user
4. Check your Supabase dashboard → **Authentication** → **Users** to see the new user

### What You Can Do Now

✅ User authentication (sign up, sign in, sign out)
✅ Store user profiles with avatars
✅ Save golf rounds to the database
✅ Rate courses with comparative ranking
✅ Social feed with likes and comments
✅ Follow/unfollow other users
✅ Earn and display badges

### Next Steps

- **Migrate existing data**: If you have test data in AsyncStorage, you can migrate it to Supabase
- **Add OAuth**: Set up Google and Apple sign-in (optional)
- **Real-time updates**: Add live feed updates using Supabase subscriptions
- **Deploy**: When ready for production, update your environment variables

## 🆘 Need Help?

- **Full documentation**: See `SUPABASE_SETUP_GUIDE.md`
- **Supabase docs**: https://supabase.com/docs
- **React Native guide**: https://supabase.com/docs/guides/getting-started/tutorials/with-react-native

---

**Happy golfing! ⛳🎉**
