
# GolfCourseAPI Integration - CONFIGURED ✅

## Overview

FAIRWAY is now fully integrated with GolfCourseAPI to provide real-time worldwide golf course search functionality. Users can search for any golf course globally when logging rounds.

## Current Configuration

✅ **API Key Configured:** U2RVDJNGLFSNE5B2MAOAZGX2SM
✅ **API Endpoint:** https://api.golfcourseapi.com/v1
✅ **Status:** Active and ready to use

The API key is configured directly in `utils/golfCourseApi.ts` and is ready for production use.

## How It Works

### Search Functionality
Users can now search for golf courses worldwide by:
- **Course Name:** "Pebble Beach", "Augusta National", "St Andrews"
- **City:** "San Francisco", "London", "Sydney"
- **State/Province:** "California", "Scotland", "New South Wales"
- **Country:** "USA", "United Kingdom", "Australia"

### Available Functions

1. **searchGolfCourses(query, limit)**
   - General search by course name or location
   - Returns up to `limit` courses (default: 20)

2. **getGolfCourseById(courseId)**
   - Get detailed information about a specific course

3. **searchGolfCoursesByState(state, limit)**
   - Search courses in a specific state/province

4. **searchGolfCoursesByCity(city, state, limit)**
   - Search courses in a specific city

5. **searchGolfCoursesByCountry(country, limit)**
   - Search courses in a specific country

## User Experience

When users tap the "+" button to add a round:
1. They see a search bar at the top
2. As they type (minimum 2 characters), the app searches worldwide courses
3. Results appear in real-time with a "Real Course" badge
4. They can select any course and continue to rating

### Features
- ✅ Real-time search with 500ms debounce
- ✅ Worldwide course database access
- ✅ Course details (holes, par, yardage, location)
- ✅ Fallback to popular courses if search is empty
- ✅ Clear visual indicators for API vs sample courses

## API Response Format

The API returns courses with the following data:
- Course ID
- Name
- City, State, Country
- Number of holes
- Par
- Yardage
- Course type
- Website and phone (if available)
- Latitude/Longitude (if available)

## Testing the Integration

### How to Test
1. Open the FAIRWAY app
2. Tap the "+" button (Add Round)
3. You'll see a search bar at the top
4. Type any course name (e.g., "Pebble Beach", "Augusta", "St Andrews")
5. Real courses from the worldwide database will appear with a "Real Course" badge
6. Select a course and continue to rating

### Example Searches
- **Famous US Courses:** "Pebble Beach", "Augusta National", "Pinehurst"
- **International:** "St Andrews", "Royal Melbourne", "Carnoustie"
- **By City:** "San Francisco", "London", "Dubai"
- **By State:** "California", "Florida", "Texas"

## API Endpoints Used

The app uses the following Golf Course API endpoints:

### Search Courses
```
GET /v1/courses?name={query}&limit={limit}
Authorization: Bearer U2RVDJNGLFSNE5B2MAOAZGX2SM
```

### Get Course by ID
```
GET /v1/courses/{id}
Authorization: Bearer U2RVDJNGLFSNE5B2MAOAZGX2SM
```

### Search by Location
```
GET /v1/courses?city={city}&state={state}&country={country}&limit={limit}
Authorization: Bearer U2RVDJNGLFSNE5B2MAOAZGX2SM
```

## Performance Optimizations

1. **Debouncing:** Search is debounced by 500ms to reduce API calls
2. **Minimum Query Length:** Search only triggers with 2+ characters
3. **Result Limiting:** Default limit of 20 courses per search (configurable up to 50)
4. **Error Handling:** Graceful fallback to sample courses if API is unavailable

## Troubleshooting

### "No courses found"
- The API might be temporarily unavailable
- Try a different search term
- Check your internet connection
- The app will show sample courses as a fallback

### API Errors in Console
If you see errors in the console:
- **401/403:** API key authentication issue (already configured correctly)
- **429:** Rate limit exceeded (contact golfcourseapi.com to upgrade plan)
- **500:** API server error (temporary, try again later)

### Search Not Working
1. Check the console logs for error messages
2. Verify internet connection
3. Try restarting the app
4. Sample courses will still be available

## Rate Limits & Usage

The configured API key has usage limits based on the golfcourseapi.com plan.
Monitor usage to ensure you don't exceed limits:
- Each search = 1 API call
- Debouncing reduces unnecessary calls
- Sample courses don't use API calls

## Security Notes

⚠️ **Important:** The API key is currently hardcoded in `utils/golfCourseApi.ts` for simplicity.

For production deployment, consider:
1. Moving the API key to environment variables
2. Using a backend proxy to hide the API key
3. Implementing rate limiting on the client side
4. Monitoring API usage regularly

## Future Enhancements

Potential improvements for the golf course search:
- **Location-based search:** Find courses near user's GPS location
- **Advanced filters:** Price range, course type, difficulty
- **Course details page:** Full information, photos, reviews
- **Favorites:** Save frequently played courses
- **Offline caching:** Store searched courses locally
- **Course photos:** Display images from the API

## Support

For issues with the Golf Course API:
- Documentation: [https://golfcourseapi.com/docs](https://golfcourseapi.com/docs)
- Support: support@golfcourseapi.com

For app-related issues:
- Check console logs for detailed error messages
- Review this documentation
- Test with sample courses to isolate API issues
