
# FAIRWAY Backend Setup - Complete Database & API Specification

## Overview
This document outlines the complete backend system for FAIRWAY, including all database tables, API endpoints, and integration points. The backend will provide full social features, data persistence, and real-time updates.

## Database Schema

### 1. users
- id (uuid, primary key)
- email (text, unique, required)
- username (text, unique, required)
- display_name (text, required)
- password_hash (text, required)
- avatar_url (text, nullable)
- bio (text, nullable)
- handicap (integer, nullable)
- phone_number (text, nullable)
- contacts_synced (boolean, default false)
- created_at (timestamp, default now)
- updated_at (timestamp, default now)

### 2. golf_courses
- id (uuid, primary key)
- external_id (text, unique, nullable) - from Golf Course API
- name (text, required)
- location (text, required)
- city (text, nullable)
- state (text, nullable)
- country (text, nullable)
- course_type (text, nullable)
- holes (integer, nullable)
- par (integer, nullable)
- yardage (integer, nullable)
- difficulty (text, nullable)
- website (text, nullable)
- phone (text, nullable)
- latitude (decimal, nullable)
- longitude (decimal, nullable)
- created_at (timestamp, default now)

### 3. rounds
- id (uuid, primary key)
- user_id (uuid, foreign key to users, required)
- course_id (uuid, foreign key to golf_courses, required)
- date_played (timestamp, required)
- score (integer, nullable)
- tee_box (text, nullable)
- yardage (integer, nullable)
- review (text, nullable)
- created_at (timestamp, default now)
- updated_at (timestamp, default now)

### 4. round_photos
- id (uuid, primary key)
- round_id (uuid, foreign key to rounds, required)
- photo_url (text, required)
- uploaded_at (timestamp, default now)

### 5. course_ratings
- id (uuid, primary key)
- user_id (uuid, foreign key to users, required)
- course_id (uuid, foreign key to golf_courses, required)
- play_again_response (text, required)
- comparison_wins (integer, default 0)
- comparison_losses (integer, default 0)
- compared_course_ids (jsonb, default [])
- rank_position (integer, required)
- total_courses (integer, required)
- final_score (integer, required)
- created_at (timestamp, default now)
- updated_at (timestamp, default now)
- UNIQUE (user_id, course_id)

### 6. followers
- id (uuid, primary key)
- follower_id (uuid, foreign key to users, required)
- following_id (uuid, foreign key to users, required)
- created_at (timestamp, default now)
- UNIQUE (follower_id, following_id)

### 7. friend_requests
- id (uuid, primary key)
- from_user_id (uuid, foreign key to users, required)
- to_user_id (uuid, foreign key to users, required)
- status (text, required)
- created_at (timestamp, default now)
- responded_at (timestamp, nullable)

### 8. feed_events
- id (uuid, primary key)
- user_id (uuid, foreign key to users, required)
- event_type (text, required)
- course_id (uuid, foreign key to golf_courses, nullable)
- round_id (uuid, foreign key to rounds, nullable)
- rating (integer, nullable)
- score (integer, nullable)
- photo_url (text, nullable)
- comment (text, nullable)
- created_at (timestamp, default now)

### 9. feed_likes
- id (uuid, primary key)
- event_id (uuid, foreign key to feed_events, required)
- user_id (uuid, foreign key to users, required)
- created_at (timestamp, default now)
- UNIQUE (event_id, user_id)

### 10. feed_comments
- id (uuid, primary key)
- event_id (uuid, foreign key to feed_events, required)
- user_id (uuid, foreign key to users, required)
- text (text, required)
- created_at (timestamp, default now)

### 11. notifications
- id (uuid, primary key)
- user_id (uuid, foreign key to users, required)
- from_user_id (uuid, foreign key to users, nullable)
- notification_type (text, required)
- message (text, required)
- related_id (text, nullable)
- read (boolean, default false)
- created_at (timestamp, default now)

### 12. badges
- id (uuid, primary key)
- user_id (uuid, foreign key to users, required)
- badge_type (text, required)
- earned_at (timestamp, default now)

### 13. privacy_settings
- user_id (uuid, primary key, foreign key to users)
- account_visibility (text, default 'friends')
- show_handicap (boolean, default true)
- show_course_map (boolean, default true)
- show_ranking_list (boolean, default true)
- show_recent_activity (boolean, default true)
- muted_users (jsonb, default [])

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### User Profile
- GET /api/users/:userId
- PUT /api/users/profile
- POST /api/users/avatar

### Golf Courses
- GET /api/courses
- GET /api/courses/:courseId
- POST /api/courses

### Rounds
- GET /api/rounds
- POST /api/rounds
- PUT /api/rounds/:roundId
- DELETE /api/rounds/:roundId
- POST /api/rounds/:roundId/photos

### Course Ratings
- GET /api/ratings
- POST /api/ratings
- PUT /api/ratings/:ratingId
- GET /api/ratings/course/:courseId

### Social - Followers
- POST /api/social/follow/:userId
- DELETE /api/social/unfollow/:userId
- GET /api/social/followers/:userId
- GET /api/social/following/:userId
- GET /api/social/is-following/:userId

### Social - Friend Requests
- POST /api/social/friend-request/:userId
- POST /api/social/friend-request/:requestId/accept
- POST /api/social/friend-request/:requestId/decline
- DELETE /api/social/friend-request/:requestId
- GET /api/social/friend-requests

### Social - Feed
- GET /api/social/feed
- POST /api/social/feed
- POST /api/social/feed/:eventId/like
- POST /api/social/feed/:eventId/comment
- GET /api/social/feed/:eventId/comments
- DELETE /api/social/feed/:eventId

### Notifications
- GET /api/notifications
- PUT /api/notifications/:notificationId/read
- PUT /api/notifications/read-all
- GET /api/notifications/unread-count

### Badges
- GET /api/badges
- POST /api/badges/check

### Privacy Settings
- GET /api/privacy
- PUT /api/privacy
- POST /api/privacy/mute/:userId
- DELETE /api/privacy/mute/:userId

### Statistics
- GET /api/stats/user/:userId
- GET /api/stats/leaderboard

### Search
- GET /api/search/users
- GET /api/search/courses

### Mutual Courses
- GET /api/social/mutual-courses/:userId

## Integration Status

✅ Database schema designed
✅ API endpoints specified
⏳ Backend implementation pending
⏳ Frontend integration pending

## Next Steps

1. Backend team will implement all endpoints
2. Frontend will integrate API calls
3. Replace AsyncStorage with API calls
4. Add authentication flow
5. Test all social features
6. Deploy to production

## Notes

- All authenticated endpoints require JWT token in Authorization header
- Passwords hashed with bcrypt
- JWT tokens expire after 7 days
- Object storage for photos and avatars
- Proper error handling and validation
- Database indexes on foreign keys
