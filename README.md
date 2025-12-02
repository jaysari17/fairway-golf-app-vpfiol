
# FAIRWAY ⛳

A comprehensive golf course tracking and social app built with React Native and Expo.

## Overview

FAIRWAY is a mobile app that helps golfers track their rounds, rate courses, and connect with friends. Think of it as "Beli for golf courses" - a social platform for discovering and sharing golf experiences.

## Features

### 🎯 Core Features
- **Course Tracking**: Log every round you play
- **Smart Rating System**: Unique comparative rating flow
  - "Would you play again?" prompt
  - Side-by-side course comparisons
  - Drag-to-rank placement
  - Auto-generated 1-10 scores
- **Course Search**: Integrated with GolfCourseAPI
- **Social Feed**: See what friends are playing
- **Friend System**: Connect via contact sync or manual search
- **Statistics**: Track your golf journey with detailed stats
- **Badges**: Earn achievements as you play

### 🆕 Latest Features
- **Contact Sync**: Find friends during onboarding by syncing phone contacts
- **Profile Setup**: Required email and phone number for friend discovery
- **Friend Discovery**: Automatic matching with existing FAIRWAY users
- **Batch Friend Requests**: Add multiple friends at once

### 🎨 Design
- Clean, modern mint-green brand identity
- Dark mode support
- Smooth animations
- Intuitive user interface
- Cross-platform (iOS & Android)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
GOLF_COURSE_API_KEY=your_api_key_here
```

Get your API key from [GolfCourseAPI](https://rapidapi.com/golfcourseapi/api/golf-course-api)

## Project Structure

```
fairway/
├── app/                      # Screens and navigation
│   ├── (tabs)/              # Tab navigation
│   ├── onboarding.tsx       # Welcome screens
│   ├── profile-setup.tsx    # Profile creation
│   ├── contact-sync.tsx     # Contact sync
│   ├── modal.tsx            # Course selection
│   └── rating-flow.tsx      # Rating system
├── components/              # Reusable components
│   ├── rating/             # Rating flow components
│   └── social/             # Social components
├── utils/                   # Utilities and services
│   ├── storage.ts          # Data storage
│   ├── contactSync.ts      # Contact sync service
│   └── golfCourseApi.ts    # API integration
├── types/                   # TypeScript types
├── hooks/                   # Custom React hooks
└── styles/                  # Shared styles
```

## User Flow

### First-Time User
1. **Onboarding**: Welcome screens introducing the app
2. **Profile Setup**: Create profile with username, email, and phone
3. **Contact Sync**: Find and add friends from contacts
4. **Main App**: Start logging rounds and rating courses

### Logging a Round
1. Tap the "+" button
2. Search for a golf course
3. Select the course
4. Complete the rating flow:
   - Would you play again?
   - Compare with other courses
   - Drag to rank
   - View final score
5. Round is logged and shared with friends

## Tech Stack

- **Framework**: React Native with Expo 54
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based)
- **Storage**: AsyncStorage (local)
- **Animations**: React Native Reanimated
- **Icons**: Expo Symbols (SF Symbols for iOS, Material for Android)
- **API**: GolfCourseAPI via RapidAPI

## Permissions

### iOS
- Camera (for course photos)
- Photo Library (for course photos)
- Location (for course discovery)
- Contacts (for friend discovery)

### Android
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION
- READ_CONTACTS

## Building for Production

### iOS
```bash
# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### Android
```bash
# Build for Android
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android
```

## Documentation

- **[APP_STORE_READY_FINAL.md](./APP_STORE_READY_FINAL.md)** - Complete app store submission guide
- **[CONTACT_SYNC_GUIDE.md](./CONTACT_SYNC_GUIDE.md)** - Contact sync feature documentation
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Development guidelines
- **[PRIVACY_POLICY.md](./PRIVACY_POLICY.md)** - Privacy policy
- **[TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md)** - Terms of service

## Testing

```bash
# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web (limited functionality)
npm run web
```

## Future Enhancements

### Backend Integration (Recommended)
- User authentication
- Cloud data sync
- Real-time friend requests
- Push notifications
- Actual contact matching API

### Additional Features
- Invite friends via SMS
- Share rounds on social media
- Community course photos
- Leaderboards and tournaments
- Handicap tracking
- GPS course tracking
- Apple Watch app

## Contributing

This is a private project. For questions or suggestions, please contact the development team.

## Privacy & Security

- All data currently stored locally
- Contacts accessed only with permission
- Phone numbers normalized for matching
- No data sent to external servers (except GolfCourseAPI)
- Users can skip contact sync
- Full privacy policy available in app

## Support

For issues or questions:
- Check the documentation files
- Review the troubleshooting guides
- Contact: support@fairwayapp.com

## License

All rights reserved.

## Acknowledgments

- Built with [Natively.dev](https://natively.dev)
- Course data from [GolfCourseAPI](https://rapidapi.com/golfcourseapi/api/golf-course-api)
- Icons from SF Symbols (iOS) and Material Icons (Android)

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Ready for App Store Submission ✅

Made with 💚 for golfers everywhere ⛳
