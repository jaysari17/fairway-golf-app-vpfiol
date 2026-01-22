
import { GolfCourse } from '@/types/golf';

// Golf Course API Configuration
// API Key for golfcourseapi.com
const GOLF_COURSE_API_KEY = 'U2RVDJNGLFSNE5B2MAOAZGX2SM';
const GOLF_COURSE_API_BASE_URL = 'https://api.golfcourseapi.com/v1';

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
  const city = apiCourse.city || '';
  const state = apiCourse.state_or_province || apiCourse.state || '';
  const country = apiCourse.country || '';
  
  // Build location string
  const locationParts = [city, state, country].filter(Boolean);
  const location = locationParts.join(', ');

  return {
    id: String(apiCourse.id || Math.random().toString(36).substr(2, 9)),
    name: apiCourse.name || 'Unknown Course',
    location: location || 'Unknown Location',
    city: city,
    state: state,
    country: country,
    type: (apiCourse.course_type?.toLowerCase() || 'public') as any,
    holes: apiCourse.holes || 18,
    par: apiCourse.par || 72,
    yardage: apiCourse.yardage || 6500,
    rating: 0, // User rating, not set yet
    difficulty: 'Medium', // Default difficulty
    website: apiCourse.website,
    phone: apiCourse.phone,
    latitude: apiCourse.latitude,
    longitude: apiCourse.longitude,
  };
}

/**
 * Search for golf courses worldwide using the Golf Course API
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
    
    // Build the API URL with query parameters
    const url = `${GOLF_COURSE_API_BASE_URL}/courses?name=${encodeURIComponent(query)}&limit=${limit}`;
    
    console.log('Golf Course Search: Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GOLF_COURSE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Golf Course Search: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Golf Course Search error:', response.status, response.statusText, errorText);
      
      if (response.status === 401 || response.status === 403) {
        console.error('Golf Course API: Invalid API key or unauthorized');
      } else if (response.status === 429) {
        console.error('Golf Course API: Rate limit exceeded');
      }
      
      return [];
    }

    const data = await response.json();
    console.log('Golf Course Search: Raw API response:', data);
    
    // The API might return courses in different formats, handle both
    const courses = data.courses || data.data || data || [];
    console.log('Golf Course Search: Found', courses.length, 'courses');

    // Transform API courses to our format
    const transformedCourses = courses.map(transformApiCourse);
    
    return transformedCourses;
  } catch (error) {
    console.error('Error searching golf courses:', error);
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
    
    const url = `${GOLF_COURSE_API_BASE_URL}/courses/${courseId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GOLF_COURSE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Golf Course Search error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    const course = data.course || data.data || data;
    
    if (!course) {
      return null;
    }
    
    return transformApiCourse(course);
  } catch (error) {
    console.error('Error fetching golf course:', error);
    return null;
  }
}

/**
 * Search for golf courses by state
 * @param state - State abbreviation (e.g., "CA", "NY", "FL")
 * @param limit - Maximum number of results (default: 20)
 * @returns Array of golf courses in the specified state
 */
export async function searchGolfCoursesByState(
  state: string,
  limit: number = 20
): Promise<GolfCourse[]> {
  if (!state || state.trim().length === 0) {
    console.log('Golf Course Search: Empty state query');
    return [];
  }

  try {
    console.log('Golf Course Search: Searching by state:', state);
    
    const url = `${GOLF_COURSE_API_BASE_URL}/courses?state=${encodeURIComponent(state)}&limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GOLF_COURSE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Golf Course Search error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    const courses = data.courses || data.data || data || [];
    console.log('Golf Course Search: Found', courses.length, 'courses in', state);

    return courses.map(transformApiCourse);
  } catch (error) {
    console.error('Error searching golf courses by state:', error);
    return [];
  }
}

/**
 * Search for golf courses by city
 * @param city - City name
 * @param state - Optional state abbreviation to narrow results
 * @param limit - Maximum number of results (default: 20)
 * @returns Array of golf courses in the specified city
 */
export async function searchGolfCoursesByCity(
  city: string,
  state?: string,
  limit: number = 20
): Promise<GolfCourse[]> {
  if (!city || city.trim().length === 0) {
    console.log('Golf Course Search: Empty city query');
    return [];
  }

  try {
    console.log('Golf Course Search: Searching by city:', city, state ? `in ${state}` : '');
    
    let url = `${GOLF_COURSE_API_BASE_URL}/courses?city=${encodeURIComponent(city)}&limit=${limit}`;
    if (state) {
      url += `&state=${encodeURIComponent(state)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GOLF_COURSE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Golf Course Search error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    const courses = data.courses || data.data || data || [];
    console.log('Golf Course Search: Found', courses.length, 'courses in', city);

    return courses.map(transformApiCourse);
  } catch (error) {
    console.error('Error searching golf courses by city:', error);
    return [];
  }
}

/**
 * Search for golf courses by country
 * @param country - Country name or code (e.g., "USA", "United Kingdom", "Australia")
 * @param limit - Maximum number of results (default: 20)
 * @returns Array of golf courses in the specified country
 */
export async function searchGolfCoursesByCountry(
  country: string,
  limit: number = 20
): Promise<GolfCourse[]> {
  if (!country || country.trim().length === 0) {
    console.log('Golf Course Search: Empty country query');
    return [];
  }

  try {
    console.log('Golf Course Search: Searching by country:', country);
    
    const url = `${GOLF_COURSE_API_BASE_URL}/courses?country=${encodeURIComponent(country)}&limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GOLF_COURSE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Golf Course Search error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    const courses = data.courses || data.data || data || [];
    console.log('Golf Course Search: Found', courses.length, 'courses in', country);

    return courses.map(transformApiCourse);
  } catch (error) {
    console.error('Error searching golf courses by country:', error);
    return [];
  }
}
