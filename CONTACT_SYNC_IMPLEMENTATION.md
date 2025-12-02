
# Contact Sync Implementation - Complete Guide

## Overview

FAIRWAY now includes a comprehensive contact syncing feature that allows users to:

- Connect their phone contacts during onboarding
- Find friends who are already using FAIRWAY
- Send friend requests to matched contacts
- Build their social network seamlessly

## User Flow

### 1. Onboarding
- User goes through the welcome screens
- User creates their profile with username, email, and phone number
- User is prompted to sync contacts

### 2. Profile Setup
- User enters required information:
  - Username (required)
  - Email (required) - used for contact matching
  - Phone Number (required) - used for contact matching
  - Handicap (optional)

### 3. Contact Sync
- User is presented with the contact sync screen
- User can choose to "Sync Contacts" or "Skip for Now"
- If syncing:
  - App requests contacts permission
  - App fetches phone contacts
  - App matches contacts against FAIRWAY users (currently mock data)
  - App displays matched users
  - User can select which friends to add
  - Friend requests are sent

### 4. Completion
- User is taken to the social feed
- Friend requests are visible in the social tab

## Technical Implementation

### Files Modified/Created

1. **app/profile-setup.tsx**
   - Added email and phone number fields
   - Added validation for email and phone
   - Saves profile with contact information
   - Navigates to contact-sync screen

2. **app/contact-sync.tsx**
   - Displays contact sync UI
   - Handles permission requests
   - Shows matched contacts
   - Allows user to select friends
   - Sends friend requests
   - Allows skipping

3. **utils/contactSync.ts**
   - Handles contact permission requests
   - Fetches device contacts
   - Normalizes phone numbers and emails
   - Matches contacts against user database (mock)
   - Sends friend requests

4. **types/golf.ts**
   - Updated UserProfile to include email, phoneNumber, and contactsSynced

5. **app.json**
   - Added expo-contacts plugin
   - Added contacts permissions for iOS and Android
   - Added permission descriptions

6. **app/_layout.tsx**
   - Added profile-setup and contact-sync screens to navigation stack

## Permissions

### iOS
- `NSContactsUsageDescription`: "FAIRWAY needs access to your contacts to help you find and connect with friends who are already using the app."

### Android
- `READ_CONTACTS`: Automatically added by expo-contacts

## Current State (Mock Data)

The contact sync feature currently uses mock data for demonstration purposes. The mock users are:

1. Tiger Woods (+15551234567, tiger@example.com)
2. Rory McIlroy (+15559876543, rory@example.com)
3. Jordan Spieth (+15555551234, jordan@example.com)

To test the feature:
1. Add one of these phone numbers or emails to your device contacts
2. Go through the onboarding flow
3. When you reach the contact sync screen, tap "Sync Contacts"
4. You should see the matched user(s)

## Production Deployment

To make this feature production-ready, you need to:

1. **Set up a backend** (see CONTACT_SYNC_BACKEND_GUIDE.md)
   - Create user database
   - Implement contact matching API
   - Implement friend request system
   - Set up push notifications

2. **Update the frontend**
   - Replace mock data with real API calls
   - Add authentication
   - Handle errors properly
   - Add loading states

3. **Privacy & Security**
   - Update privacy policy
   - Implement data encryption
   - Add rate limiting
   - Implement proper authentication

4. **Testing**
   - Test with real users
   - Test various phone number formats
   - Test edge cases
   - Test on both iOS and Android

## Features

### Contact Matching
- Matches by phone number (normalized)
- Matches by email (case-insensitive)
- Handles various phone number formats
- Removes duplicates

### User Experience
- Clear permission requests
- Helpful error messages
- Loading indicators
- Ability to skip
- Select multiple friends at once
- Visual feedback for selections

### Privacy
- Contacts are only used for matching
- Contact data is not stored on device
- Users control who they add
- Can skip contact sync entirely

## Future Enhancements

1. **Re-sync Contacts**
   - Allow users to re-sync contacts later
   - Add "Find Friends" feature in settings

2. **Invite Non-Users**
   - Allow users to invite contacts who aren't on FAIRWAY
   - Send SMS/email invitations

3. **Smart Suggestions**
   - Suggest friends based on mutual connections
   - Suggest friends based on location
   - Suggest friends based on similar courses played

4. **Contact Sync Settings**
   - Auto-sync new contacts
   - Sync frequency settings
   - Privacy controls

## Troubleshooting

### Contacts Permission Denied
- User will see a message explaining they can enable it later
- User can skip and continue using the app
- User can enable permission in device settings

### No Matches Found
- User sees a friendly message
- User can skip and continue
- User can add friends manually later

### API Errors (Production)
- Implement retry logic
- Show user-friendly error messages
- Log errors for debugging
- Provide fallback options

## App Store Requirements

### Privacy Policy
Update your privacy policy to include:
- What contact data is collected
- How contact data is used
- How contact data is stored
- User's rights regarding their data

### App Store Description
Mention the contact sync feature:
- "Find friends who are already on FAIRWAY"
- "Connect with your golf buddies"
- "Build your golf network"

### Screenshots
Include screenshots showing:
- Contact sync permission request
- Matched contacts screen
- Friend requests sent confirmation

## Testing Checklist

- [ ] Onboarding flow completes successfully
- [ ] Profile setup validates email and phone
- [ ] Contact permission request appears
- [ ] Contacts are fetched correctly
- [ ] Phone numbers are normalized properly
- [ ] Email matching works (case-insensitive)
- [ ] Multiple friends can be selected
- [ ] Friend requests are sent successfully
- [ ] Skip functionality works
- [ ] User can complete onboarding without syncing
- [ ] App works on iOS
- [ ] App works on Android
- [ ] Permissions are properly configured
- [ ] Error handling works correctly
- [ ] Loading states are shown

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the backend integration guide
3. Check the console logs for errors
4. Test with mock data first
5. Verify permissions are configured correctly
