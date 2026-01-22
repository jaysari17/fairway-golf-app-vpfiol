
# Backend Integration Required for Golf Course Search

## Issue
The app is currently limited to sample/test courses because the frontend was trying to use a hardcoded API key that doesn't work properly.

## Solution Implemented
✅ Updated `utils/golfCourseApi.ts` to call backend endpoints instead of directly calling external APIs
✅ Updated `.env.example` to include backend API URL configuration

## Backend Endpoint Needed

The backend needs to create a golf course search endpoint that integrates with a real golf course API (like RapidAPI's Golf Course API or similar service).

### Required Endpoint:

**GET /api/golf-courses/search**
- Query parameters:
  - `query` (string): Search term (course name, city, state, etc.)
  - `limit` (number, optional): Maximum results to return (default: 20)
  - `state` (string, optional): Filter by state
  - `city` (string, optional): Filter by city
  
- Returns:
```json
{
  "courses": [
    {
      "id": "string",
      "name": "string",
      "location": "string",
      "city": "string",
      "state": "string",
      "country": "string",
      "type": "parkland" | "links" | "desert" | "mountain" | "other",
      "holes": number,
      "par": number,
      "yardage": number
    }
  ]
}
```

**GET /api/golf-courses/:id**
- Returns single course details in the same format

### Recommended API Integration
Use RapidAPI's Golf Course API or a similar service:
- API: https://rapidapi.com/apininjas/api/golf-course-api
- Provides worldwide golf course data
- Supports search by name, city, state, country
- Returns comprehensive course information

### Implementation Notes
- Store the API key securely on the backend (environment variable)
- Transform the external API response to match our GolfCourse type
- Handle errors gracefully and return empty array on failure
- Add caching if needed to reduce API calls
- Support international courses (not just USA)

## Next Steps
1. Backend team needs to implement the `/api/golf-courses/search` endpoint
2. Backend should integrate with a real golf course API service
3. Once deployed, the frontend will automatically connect to real worldwide course data
4. Users will be able to search for any golf course globally, not just test courses
