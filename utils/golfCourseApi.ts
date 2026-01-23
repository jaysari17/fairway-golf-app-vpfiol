
import { GolfCourse } from '@/types/golf';

// Golf Course API Configuration
// API Key for golfcourseapi.com
const GOLF_COURSE_API_KEY = process.env.EXPO_PUBLIC_GOLF_COURSE_API_KEY || 'U2RVDJNGLFSNE5B2MAOAZGX2SM';
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
    rating: 0, // User rating, not set yet
    difficulty: 'Medium', // Default difficulty
    website: apiCourse.website,
    phone: apiCourse.phone,
    latitude: apiCourse.latitude,
    longitude: apiCourse.longitude,
  };
  
  console.log('Transformed course:', transformed.name, '-', transformed.location);
  return transformed;
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
    console.log('Golf Course Search: API Key present:', !!GOLF_COURSE_API_KEY);
    console.log('Golf Course Search: API Key length:', GOLF_COURSE_API_KEY?.length);
    
    // Build the API URL with query parameters
    // Try multiple search parameters to increase results
    const url = `${GOLF_COURSE_API_BASE_URL}/courses?name=${encodeURIComponent(query)}&limit=${limit}`;
    
    console.log('Golf Course Search: Request URL (without key):', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GOLF_COURSE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Golf Course Search: Response status:', response.status);
    console.log('Golf Course Search: Response ok:', response.ok);
    console.log('Golf Course Search: Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Golf Course Search API error:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        url: url,
      });
      
      if (response.status === 401 || response.status === 403) {
        console.error('Golf Course API: Invalid API key or unauthorized - Please check your API key');
      } else if (response.status === 429) {
        console.error('Golf Course API: Rate limit exceeded - Please try again later');
      } else if (response.status === 404) {
        console.error('Golf Course API: Endpoint not found - API URL may have changed');
      } else if (response.status === 500) {
        console.error('Golf Course API: Server error - The API service may be down');
      }
      
      // Return empty array instead of throwing
      return [];
    }

    const data = await response.json();
    console.log('Golf Course Search: Raw API response type:', typeof data);
    console.log('Golf Course Search: Raw API response keys:', Object.keys(data || {}));
    console.log('Golf Course Search: Raw API response sample:', JSON.stringify(data).substring(0, 500));
    
    // The API might return courses in different formats, handle all possibilities
    let courses = [];
    if (Array.isArray(data)) {
      courses = data;
      console.log('Golf Course Search: Data is array');
    } else if (data.courses && Array.isArray(data.courses)) {
      courses = data.courses;
      console.log('Golf Course Search: Data has courses array');
    } else if (data.data && Array.isArray(data.data)) {
      courses = data.data;
      console.log('Golf Course Search: Data has data array');
    } else if (data.results && Array.isArray(data.results)) {
      courses = data.results;
      console.log('Golf Course Search: Data has results array');
    } else {
      console.warn('Golf Course Search: Unknown response format:', data);
    }
    
    console.log('Golf Course Search: Found', courses.length, 'courses from API');

    if (courses.length === 0) {
      console.log('Golf Course Search: No courses found for query:', query);
      return [];
    }

    // Transform API courses to our format
    const transformedCourses = courses.map(transformApiCourse);
    console.log('Golf Course Search: Successfully transformed', transformedCourses.length, 'courses');
    console.log('Golf Course Search: First course sample:', transformedCourses[0]);
    
    return transformedCourses;
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

/**
 * Test the Golf Course API connection
 * This function tests if the API is accessible and returns data
 * @returns Object with status and message
 */
export async function testGolfCourseApi(): Promise<{ success: boolean; message: string; data?: any }> {
  console.log('=== TESTING GOLF COURSE API ===');
  console.log('API Base URL:', GOLF_COURSE_API_BASE_URL);
  console.log('API Key present:', !!GOLF_COURSE_API_KEY);
  console.log('API Key length:', GOLF_COURSE_API_KEY?.length);
  console.log('API Key first 10 chars:', GOLF_COURSE_API_KEY?.substring(0, 10));
  
  try {
    // Test with a simple search for "Pebble"
    const testQuery = 'Pebble';
    const url = `${GOLF_COURSE_API_BASE_URL}/courses?name=${encodeURIComponent(testQuery)}&limit=5`;
    
    console.log('Test URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GOLF_COURSE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('Test Response Status:', response.status);
    console.log('Test Response OK:', response.ok);
    console.log('Test Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Test API Error Response:', errorText);
      return {
        success: false,
        message: `API returned status ${response.status}: ${response.statusText}. Error: ${errorText}`,
      };
    }
    
    const data = await response.json();
    console.log('Test API Response:', JSON.stringify(data).substring(0, 500));
    
    return {
      success: true,
      message: 'API connection successful',
      data: data,
    };
  } catch (error) {
    console.error('Test API Error:', error);
    return {
      success: false,
      message: `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
