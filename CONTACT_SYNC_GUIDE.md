
# Contact Sync Feature - Developer Guide

## Overview
The contact sync feature allows users to find and connect with friends who are already using FAIRWAY by matching phone numbers from their device contacts.

## User Flow

### 1. Onboarding
```
Welcome Screens → Profile Setup → Contact Sync → Main App
```

### 2. Profile Setup
- User enters username, email, and phone number
- Email and phone are validated
- Profile is saved to AsyncStorage
- User proceeds to contact sync

### 3. Contact Sync
- User is prompted to sync contacts
- App requests contacts permission
- If granted:
  - Retrieves all contacts with phone numbers
  - Normalizes phone numbers
  - Matches against user database
  - Displays matched users
  - User selects friends to add
  - Friend requests are sent
- If denied or skipped:
  - User proceeds to main app
  - Can sync contacts later from settings

## Technical Architecture

### Files Structure
```
utils/
  contactSync.ts          # Contact sync service
app/
  profile-setup.tsx       # Profile creation screen
  contact-sync.tsx        # Contact sync screen
types/
  golf.ts                 # Updated UserProfile type
```

### Key Functions

#### `ContactSyncService.requestPermission()`
Requests contacts permission from the user.

```typescript
const hasPermission = await ContactSyncService.requestPermission();
```

#### `ContactSyncService.getPhoneContacts()`
Retrieves all contacts with phone numbers.

```typescript
const contacts = await ContactSyncService.getPhoneContacts();
// Returns: [{ name: string, phoneNumbers: string[] }]
```

#### `ContactSyncService.findMatchingUsers(phoneNumbers)`
Matches phone numbers against user database.

```typescript
const matches = await ContactSyncService.findMatchingUsers(phoneNumbers);
// Returns: ContactMatch[]
```

#### `ContactSyncService.syncContactsAndFindFriends()`
Complete sync flow: request permission, get contacts, find matches.

```typescript
const matches = await ContactSyncService.syncContactsAndFindFriends();
```

#### `ContactSyncService.sendFriendRequest(userId, username, displayName, avatar)`
Sends a friend request to a matched user.

```typescript
await ContactSyncService.sendFriendRequest(
  'user_123',
  'john_doe',
  'John Doe',
  'https://...'
);
```

## Data Models

### UserProfile (Updated)
```typescript
interface UserProfile {
  username: string;
  email: string;              // NEW: Required
  phoneNumber: string;        // NEW: Required
  avatar?: string;
  bio?: string;
  handicap?: number;
  totalRounds: number;
  totalCourses: number;
  contactsSynced?: boolean;   // NEW: Tracks sync status
}
```

### ContactMatch
```typescript
interface ContactMatch {
  contactId: string;
  contactName: string;
  phoneNumber: string;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
}
```

## Phone Number Normalization

Phone numbers are normalized to ensure consistent matching:

```typescript
normalizePhoneNumber(phoneNumber: string): string {
  // Removes all non-digit characters
  return phoneNumber.replace(/\D/g, '');
}
```

Examples:
- `+1 (555) 123-4567` → `15551234567`
- `555-123-4567` → `5551234567`
- `+44 20 1234 5678` → `442012345678`

## Mock Implementation

The current implementation uses mock data for demonstration:

```typescript
async getMockUsers() {
  return [
    {
      userId: 'user_mock_1',
      username: 'tiger_woods',
      displayName: 'Tiger Woods',
      phoneNumber: '+15551234567',
      avatar: 'https://...',
    },
    // More mock users...
  ];
}
```

## Production Implementation

### Backend Requirements

For production, replace the mock implementation with real API calls:

```typescript
async findMatchingUsers(phoneNumbers: string[]): Promise<ContactMatch[]> {
  // Replace with actual API call
  const response = await fetch('https://api.fairway.com/users/match', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify({ phoneNumbers }),
  });
  
  const data = await response.json();
  return data.matches;
}
```

### API Endpoints Needed

#### 1. User Registration
```
POST /api/auth/register
Body: { username, email, phoneNumber, password }
Response: { userId, token }
```

#### 2. Contact Matching
```
POST /api/users/match
Body: { phoneNumbers: string[] }
Response: { matches: ContactMatch[] }
```

#### 3. Friend Request
```
POST /api/friends/request
Body: { toUserId }
Response: { requestId, status }
```

#### 4. Get Friend Requests
```
GET /api/friends/requests
Response: { requests: FriendRequest[] }
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  handicap DECIMAL(4,1),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for phone number lookups
CREATE INDEX idx_users_phone ON users(phone_number);
```

#### Friend Requests Table
```sql
CREATE TABLE friend_requests (
  id UUID PRIMARY KEY,
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  UNIQUE(from_user_id, to_user_id)
);
```

#### Friends Table
```sql
CREATE TABLE friends (
  user_id UUID REFERENCES users(id),
  friend_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, friend_id)
);
```

## Privacy & Security

### Best Practices

1. **Phone Number Hashing**
   - Hash phone numbers before sending to server
   - Use one-way hashing (SHA-256)
   - Never store raw phone numbers in logs

2. **Permission Handling**
   - Always request permission before accessing contacts
   - Explain why permission is needed
   - Provide skip option
   - Don't repeatedly ask if denied

3. **Data Minimization**
   - Only send phone numbers, not full contact data
   - Don't store contact names on server
   - Delete matched data after processing

4. **User Control**
   - Allow users to disconnect contacts
   - Provide option to hide phone number
   - Let users control who can find them

### Privacy Policy Requirements

Your privacy policy must include:
- What contact data is collected
- How it's used (friend matching only)
- How long it's stored
- User's rights to delete data
- Third-party sharing (if any)

## Testing

### Test Cases

1. **Permission Granted**
   - User grants contacts permission
   - Contacts are retrieved
   - Matches are found and displayed
   - Friend requests can be sent

2. **Permission Denied**
   - User denies contacts permission
   - Graceful fallback to skip
   - User can proceed to app
   - Can retry later from settings

3. **No Matches Found**
   - Contacts are scanned
   - No matches found
   - User is informed
   - Can skip to app

4. **Multiple Matches**
   - Multiple friends found
   - All displayed correctly
   - Can select/deselect
   - Batch friend requests sent

5. **Edge Cases**
   - No contacts on device
   - Contacts without phone numbers
   - Invalid phone numbers
   - Duplicate phone numbers
   - International phone numbers

### Manual Testing

```bash
# Test on iOS
npx expo run:ios

# Test on Android
npx expo run:android

# Test permissions
# 1. Grant permission → verify contacts load
# 2. Deny permission → verify graceful handling
# 3. Reset permissions and retry
```

## Troubleshooting

### Common Issues

#### 1. Permission Not Requested
**Problem**: Permission dialog doesn't appear
**Solution**: 
- Check app.json has expo-contacts plugin
- Rebuild app with `npx expo prebuild --clean`
- Verify Info.plist has NSContactsUsageDescription

#### 2. No Contacts Retrieved
**Problem**: Permission granted but no contacts returned
**Solution**:
- Check device has contacts
- Verify contacts have phone numbers
- Check console for errors
- Test on physical device (not simulator)

#### 3. Matches Not Found
**Problem**: Contacts scanned but no matches
**Solution**:
- Verify mock users have correct phone format
- Check phone number normalization
- Ensure test contacts match mock data

#### 4. Friend Requests Not Sent
**Problem**: Selection works but requests fail
**Solution**:
- Check SocialStorageService is working
- Verify AsyncStorage permissions
- Check console for errors

## Future Enhancements

### Planned Features

1. **Contact Sync Settings**
   - Re-sync contacts from settings
   - View sync history
   - Manage synced friends

2. **Invite Non-Users**
   - Send SMS invites to contacts not on FAIRWAY
   - Track invite status
   - Reward for successful referrals

3. **Smart Matching**
   - Match by email as well as phone
   - Fuzzy matching for name similarity
   - Social graph suggestions

4. **Privacy Controls**
   - Hide from contact sync
   - Block specific contacts
   - Private mode

5. **Notifications**
   - Push notification when friend joins
   - Weekly friend activity digest
   - Friend milestone celebrations

## Support

For questions or issues:
- Check the main README.md
- Review APP_STORE_READY_FINAL.md
- Contact: support@fairwayapp.com

## License

This feature is part of the FAIRWAY app.
All rights reserved.
