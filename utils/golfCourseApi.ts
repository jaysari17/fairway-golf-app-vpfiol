
import { GolfCourse } from '@/types/golf';

// Golf Course API Configuration
const GOLF_COURSE_API_KEY = process.env.EXPO_PUBLIC_GOLF_COURSE_API_KEY || 'U2RVDJNGLFSNE5B2MAOAZGX2SM';

// Backend API endpoint (will be created)
const BACKEND_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface GolfCourseApiResponse {
  id?: number;
  name: string;
  city: string;
  state_or_province: string;
  country: string;
  website?: string;
  phone?: string;
  holes?: number;
  par?: number;
  yardage?: number;
  course_type?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Transform Golf Course API response to our GolfCourse format
 */
function transformApiCourse(apiCourse: any): GolfCourse {
  console.log('Transforming API course:', apiCourse.name);
  
  const city = apiCourse.city || '';
  const state = apiCourse.state_or_province || apiCourse.state || '';
  const country = apiCourse.country || '';
  
  // Build location string
  const locationParts = [city, state, country].filter(Boolean);
  const location = locationParts.join(', ');

  const transformed = {
    id: `api-${apiCourse.id || Math.random().toString(36).substr(2, 9)}`,
    name: apiCourse.name || 'Unknown Course',
    location: location || 'Unknown Location',
    city: city,
    state: state,
    country: country,
    type: (apiCourse.course_type?.toLowerCase() || 'public') as any,
    holes: apiCourse.holes || 18,
    par: apiCourse.par || 72,
    yardage: apiCourse.yardage || 6500,
    rating: 0,
    difficulty: 'Medium',
    website: apiCourse.website,
    phone: apiCourse.phone,
    latitude: apiCourse.latitude,
    longitude: apiCourse.longitude,
  };
  
  console.log('Transformed course:', transformed.name, '-', transformed.location);
  return transformed;
}

/**
 * Search for golf courses worldwide using the backend API
 * @param query - Search query (course name, city, state, etc.)
 * @param limit - Maximum number of results to return (default: 20)
 * @returns Array of golf courses matching the search query
 */
export async function searchGolfCourses(
  query: string,
  limit: number = 20
): Promise<GolfCourse[]> {
  if (!query || query.trim().length === 0) {
    console.log('Golf Course Search: Empty search query');
    return [];
  }

  try {
    console.log('Golf Course Search: Searching for:', query);
    
    // TODO: Backend Integration - GET /api/golf-courses/search?q={query}&limit={limit}
    // This endpoint should:
    // - Accept query parameter 'q' for search term
    // - Accept query parameter 'limit' for max results (default 20)
    // - Return array of golf courses: [{ id, name, city, state, country, holes, par, yardage, type, website, phone, latitude, longitude }]
    // - Handle authentication with the Golf Course API on the backend
    // - Implement caching to avoid rate limits
    // - Return empty array if no results found
    
    console.log('Golf Course Search: Backend integration pending');
    console.log('Golf Course Search: Would call:', `${BACKEND_API_URL}/api/golf-courses/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    // For now, return empty array until backend is ready
    // The UI will show the "No results from API" message and suggest popular courses
    return [];
  } catch (error) {
    console.error('Error searching golf courses:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown',
    });
    return [];
  }
}

/**
 * Get a specific golf course by ID
 * @param courseId - The course ID
 * @returns Golf course details or null if not found
 */
export async function getGolfCourseById(courseId: string): Promise<GolfCourse | null> {
  try {
    console.log('Golf Course Search: Fetching course by ID:', courseId);
    
    // TODO: Backend Integration - GET /api/golf-courses/{courseId}
    // This endpoint should:
    // - Accept courseId as path parameter
    // - Return single golf course object or 404 if not found
    // - Return: { id, name, city, state, country, holes, par, yardage, type, website, phone, latitude, longitude }
    
    console.log('Golf Course Search: Backend integration pending');
    return null;
  } catch (error) {
    console.error('Error fetching golf course:', error);
    return null;
  }
}

/**
 * Search for golf courses by state
 */
export async function searchGolfCoursesByState(
  state: string,
  limit: number = 20
): Promise<GolfCourse[]> {
  if (!state || state.trim().length === 0) {
    return [];
  }

  try {
    // TODO: Backend Integration - GET /api/golf-courses/search?state={state}&limit={limit}
    console.log('Golf Course Search: Backend integration pending for state search');
    return [];
  } catch (error) {
    console.error('Error searching golf courses by state:', error);
    return [];
  }
}

/**
 * Search for golf courses by city
 */
export async function searchGolfCoursesByCity(
  city: string,
  state?: string,
  limit: number = 20
): Promise<GolfCourse[]> {
  if (!city || city.trim().length === 0) {
    return [];
  }

  try {
    // TODO: Backend Integration - GET /api/golf-courses/search?city={city}&state={state}&limit={limit}
    console.log('Golf Course Search: Backend integration pending for city search');
    return [];
  } catch (error) {
    console.error('Error searching golf courses by city:', error);
    return [];
  }
}

/**
 * Search for golf courses by country
 */
export async function searchGolfCoursesByCountry(
  country: string,
  limit: number = 20
): Promise<GolfCourse[]> {
  if (!country || country.trim().length === 0) {
    return [];
  }

  try {
    // TODO: Backend Integration - GET /api/golf-courses/search?country={country}&limit={limit}
    console.log('Golf Course Search: Backend integration pending for country search');
    return [];
  } catch (error) {
    console.error('Error searching golf courses by country:', error);
    return [];
  }
}

/**
 * Test the Golf Course API connection
 */
export async function testGolfCourseApi(): Promise<{ success: boolean; message: string; data?: any }> {
  console.log('=== TESTING GOLF COURSE API ===');
  
  try {
    // TODO: Backend Integration - GET /api/golf-courses/test
    // This endpoint should test the Golf Course API connection and return status
    // Return: { success: boolean, message: string, data?: any }
    
    return {
      success: false,
      message: 'Golf Course API integration is pending. The backend endpoint needs to be created to handle golf course searches securely. For now, please use the popular courses shown below.',
    };
  } catch (error) {
    console.error('Test API Error:', error);
    return {
      success: false,
      message: `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
