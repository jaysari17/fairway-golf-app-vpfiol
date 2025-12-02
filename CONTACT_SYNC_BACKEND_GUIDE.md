
# Contact Sync Backend Integration Guide

This guide explains how to integrate the contact syncing feature with a real backend (e.g., Supabase) for production use.

## Overview

The contact sync feature currently uses mock data. To make it production-ready, you need to:

1. Set up a user database
2. Create an API endpoint for matching contacts
3. Implement friend request notifications
4. Update the frontend to use the real API

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  handicap DECIMAL,
  total_rounds INTEGER DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  contacts_synced BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
```

### Friend Requests Table

```sql
CREATE TABLE friend_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(from_user_id, to_user_id)
);

CREATE INDEX idx_friend_requests_to_user ON friend_requests(to_user_id, status);
CREATE INDEX idx_friend_requests_from_user ON friend_requests(from_user_id, status);
```

### Friends Table

```sql
CREATE TABLE friends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

CREATE INDEX idx_friends_user ON friends(user_id);
CREATE INDEX idx_friends_friend ON friends(friend_id);
```

## API Endpoints

### 1. Match Contacts Endpoint

**POST /api/contacts/match**

Request body:
```json
{
  "phoneNumbers": ["+15551234567", "+15559876543"],
  "emails": ["user@example.com", "friend@example.com"]
}
```

Response:
```json
{
  "matches": [
    {
      "userId": "uuid-here",
      "username": "tiger_woods",
      "displayName": "Tiger Woods",
      "avatar": "https://...",
      "matchedBy": "phone" // or "email"
    }
  ]
}
```

Implementation (Supabase Edge Function):
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { phoneNumbers, emails } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Normalize phone numbers (remove non-digits, handle country codes)
  const normalizedPhones = phoneNumbers.map(phone => 
    phone.replace(/\D/g, '').replace(/^1/, '')
  )

  // Normalize emails
  const normalizedEmails = emails.map(email => email.toLowerCase().trim())

  // Query users by phone or email
  const { data: matches, error } = await supabase
    .from('users')
    .select('id, username, display_name, avatar_url')
    .or(`phone_number.in.(${normalizedPhones.join(',')}),email.in.(${normalizedEmails.join(',')})`)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ matches }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### 2. Send Friend Request Endpoint

**POST /api/friends/request**

Request body:
```json
{
  "toUserId": "uuid-here"
}
```

Response:
```json
{
  "success": true,
  "requestId": "uuid-here"
}
```

### 3. Accept/Decline Friend Request Endpoint

**POST /api/friends/respond**

Request body:
```json
{
  "requestId": "uuid-here",
  "action": "accept" // or "decline"
}
```

## Frontend Integration

Update `utils/contactSync.ts`:

```typescript
async findMatchingUsers(phoneNumbers: string[], emails: string[]): Promise<ContactMatch[]> {
  try {
    const normalizedNumbers = phoneNumbers.map(num => this.normalizePhoneNumber(num));
    const normalizedEmails = emails.map(email => this.normalizeEmail(email));
    
    // Call your backend API
    const response = await fetch('YOUR_API_URL/api/contacts/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`, // Your auth token
      },
      body: JSON.stringify({
        phoneNumbers: normalizedNumbers,
        emails: normalizedEmails,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to match contacts');
    }

    const { matches } = await response.json();
    
    return matches.map(match => ({
      contactId: match.userId,
      contactName: match.displayName,
      phoneNumber: '', // Not returned for privacy
      email: '', // Not returned for privacy
      userId: match.userId,
      username: match.username,
      displayName: match.displayName,
      avatar: match.avatar,
    }));
  } catch (error) {
    console.error('Error finding matching users:', error);
    return [];
  }
}

async sendFriendRequest(toUserId: string, toUsername: string, toDisplayName: string, toAvatar?: string): Promise<void> {
  try {
    const response = await fetch('YOUR_API_URL/api/friends/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({ toUserId }),
    });

    if (!response.ok) {
      throw new Error('Failed to send friend request');
    }

    console.log(`Friend request sent to ${toUsername}`);
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
}
```

## Privacy & Security Considerations

1. **Phone Number Hashing**: Consider hashing phone numbers before storing/comparing for additional privacy
2. **Rate Limiting**: Implement rate limiting on the contact matching endpoint to prevent abuse
3. **Authentication**: Always verify the user's identity before processing requests
4. **Data Minimization**: Only return necessary user information in API responses
5. **Consent**: Ensure users consent to contact syncing in your privacy policy

## Push Notifications

When a friend request is sent, notify the recipient:

```typescript
// In your backend, after creating a friend request
await sendPushNotification({
  userId: toUserId,
  title: 'New Friend Request',
  body: `${fromUser.displayName} wants to connect on FAIRWAY`,
  data: {
    type: 'friend_request',
    requestId: request.id,
  },
});
```

## Testing

1. Create test users with known phone numbers and emails
2. Test contact matching with various formats (international, with/without country codes)
3. Test edge cases (duplicate contacts, invalid data, etc.)
4. Test privacy: ensure users can't access data they shouldn't

## Deployment Checklist

- [ ] Database tables created with proper indexes
- [ ] API endpoints implemented and tested
- [ ] Authentication integrated
- [ ] Rate limiting configured
- [ ] Push notifications set up
- [ ] Privacy policy updated
- [ ] Frontend updated to use real API
- [ ] Error handling and logging implemented
- [ ] Load testing completed
- [ ] Security audit performed

## Alternative: Supabase Quick Setup

If using Supabase, you can use their built-in features:

1. Create the tables in Supabase Dashboard
2. Use Row Level Security (RLS) policies
3. Create Edge Functions for the API endpoints
4. Use Supabase Auth for authentication
5. Use Supabase Realtime for instant friend request notifications

Example RLS policy:
```sql
-- Users can only see their own data and their friends' data
CREATE POLICY "Users can view friends"
ON users FOR SELECT
USING (
  id = auth.uid() OR
  id IN (
    SELECT friend_id FROM friends WHERE user_id = auth.uid()
  )
);
```
