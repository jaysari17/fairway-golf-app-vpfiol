
# GolfCourseAPI Integration Setup Guide

## Overview

FAIRWAY now integrates with GolfCourseAPI to provide real-time course search functionality. This allows users to search for any golf course in the world when logging rounds.

## Getting Your API Key

1. **Visit GolfCourseAPI**
   - Go to [https://golfcourseapi.com/](https://golfcourseapi.com/)
   - Sign up for an account

2. **Choose a Plan**
   - Free Tier: 100 requests/month (good for testing)
   - Starter: $9/month - 1,000 requests/month
   - Pro: $29/month - 10,000 requests/month
   - Enterprise: Custom pricing

3. **Get Your API Key**
   - After signing up, navigate to your dashboard
   - Copy your API key

## Configuration

### Option 1: Environment Variable (Recommended)

Create a `.env` file in your project root:

```bash
EXPO_PUBLIC_GOLF_COURSE_API_KEY=your_api_key_here
```

**Important:** Add `.env` to your `.gitignore` to keep your API key secure:

```
# .gitignore
.env
.env.local
```

### Option 2: Direct Configuration (Not Recommended for Production)

Edit `utils/golfCourseApi.ts` and replace the API_KEY constant:

```typescript
const API_KEY = 'your_api_key_here';
```

⚠️ **Warning:** Never commit API keys directly to your repository!

## Features

### Course Search
- Real-time search as you type
- Searches by course name, city, or state
- Returns up to 20 results per search
- Debounced to prevent excessive API calls

### Course Details
- Course name and location
- Number of holes and par
- Yardage information
- Course type (links, parkland, desert, mountain)

### Fallback Behavior
- If no API key is configured, the app uses sample courses
- Users can still rate and track rounds with sample data
- Search functionality is hidden when API key is not present

## API Endpoints Used

### Search Courses
```
GET /v1/courses?name={query}&limit={limit}
```

### Get Course by ID
```
GET /v1/courses/{id}
```

### Search Nearby (Future Feature)
```
GET /v1/courses?lat={lat}&lng={lng}&radius={radius}&limit={limit}
```

## Rate Limits

- Free: 100 requests/month
- Starter: 1,000 requests/month
- Pro: 10,000 requests/month

### Optimization Tips

1. **Debouncing**: Search is debounced by 500ms to reduce API calls
2. **Caching**: Consider implementing local caching for frequently searched courses
3. **Sample Data**: Use sample courses for testing to preserve API quota

## Testing

### Without API Key
1. Run the app without configuring an API key
2. You'll see sample courses only
3. Search bar will not appear

### With API Key
1. Configure your API key as described above
2. Run the app
3. Navigate to "Add Round" (+ button)
4. You'll see a search bar at the top
5. Type any course name to search

## Troubleshooting

### "No courses found"
- Check your API key is correct
- Verify you have remaining API quota
- Try a different search term

### Search not appearing
- Ensure `EXPO_PUBLIC_GOLF_COURSE_API_KEY` is set
- Restart your development server after adding the API key
- Check the console for any error messages

### API Errors
- Check your network connection
- Verify your API key is active
- Check GolfCourseAPI status page

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate keys regularly** if exposed
4. **Monitor usage** to detect unauthorized access
5. **Use different keys** for development and production

## Production Deployment

### EAS Build

When building with EAS, add your API key to `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_GOLF_COURSE_API_KEY": "your_production_api_key"
      }
    }
  }
}
```

Or use EAS Secrets:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_GOLF_COURSE_API_KEY --value your_api_key
```

## Future Enhancements

- **Location-based search**: Find courses near user's current location
- **Course details page**: Show full course information, reviews, photos
- **Favorites**: Save frequently played courses
- **Offline support**: Cache searched courses for offline access
- **Course photos**: Display course images from API

## Support

For API-related issues:
- GolfCourseAPI Documentation: [https://golfcourseapi.com/docs](https://golfcourseapi.com/docs)
- Support: support@golfcourseapi.com

For app-related issues:
- Check the console logs for error messages
- Review this documentation
- Contact the development team
