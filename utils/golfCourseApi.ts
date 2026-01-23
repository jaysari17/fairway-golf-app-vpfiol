
import { GolfCourse } from '@/types/golf';

// Golf Course API Configuration
const GOLF_COURSE_API_KEY = process.env.EXPO_PUBLIC_GOLF_COURSE_API_KEY || 'U2RVDJNGLFSNE5B2MAOAZGX2SM';

// Try multiple API endpoints in case one is down
const API_ENDPOINTS = [
  'https://api.golfcourseapi.com/v1',
  'https://golf-courses-api.herokuapp.com/courses',
  'https://api.opengolf.io/v1',
];

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
 * Try fetching from multiple API endpoints
 */
async function fetchWithFallback(path: string, options: RequestInit = {}): Promise<Response | null> {
  const errors: string[] = [];
  
  // Try primary endpoint with API key
  try {
    console.log('Trying primary API endpoint with key authentication...');
    const url = `${API_ENDPOINTS[0]}${path}${path.includes('?') ? '&' : '?'}key=${GOLF_COURSE_API_KEY}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });
    
    if (response.ok) {
      console.log('Primary API endpoint succeeded');
      return response;
    }
    
    const errorText = await response.text();
    errors.push(`Primary API (${response.status}): ${errorText}`);
    console.warn('Primary API failed:', response.status, errorText);
  } catch (error) {
    errors.push(`Primary API error: ${error instanceof Error ? error.message : 'Unknown'}`);
    console.error('Primary API error:', error);
  }
  
  // Try with Bearer token authentication
  try {
    console.log('Trying Bearer token authentication...');
    const url = `${API_ENDPOINTS[0]}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${GOLF_COURSE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });
    
    if (response.ok) {
      console.log('Bearer token authentication succeeded');
      return response;
    }
    
    const errorText = await response.text();
    errors.push(`Bearer auth (${response.status}): ${errorText}`);
    console.warn('Bearer auth failed:', response.status, errorText);
  } catch (error) {
    errors.push(`Bearer auth error: ${error instanceof Error ? error.message : 'Unknown'}`);
    console.error('Bearer auth error:', error);
  }
  
  // Try with X-API-Key header
  try {
    console.log('Trying X-API-Key header authentication...');
    const url = `${API_ENDPOINTS[0]}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-API-Key': GOLF_COURSE_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });
    
    if (response.ok) {
      console.log('X-API-Key authentication succeeded');
      return response;
    }
    
    const errorText = await response.text();
    errors.push(`X-API-Key (${response.status}): ${errorText}`);
    console.warn('X-API-Key failed:', response.status, errorText);
  } catch (error) {
    errors.push(`X-API-Key error: ${error instanceof Error ? error.message : 'Unknown'}`);
    console.error('X-API-Key error:', error);
  }
  
  console.error('All API authentication methods failed:', errors);
  return null;
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
    
    // Try different query parameter names
    const queryParams = [
      `/courses?q=${encodeURIComponent(query)}&limit=${limit}`,
      `/courses?name=${encodeURIComponent(query)}&limit=${limit}`,
      `/courses?search=${encodeURIComponent(query)}&limit=${limit}`,
    ];
    
    for (const params of queryParams) {
      console.log('Trying query params:', params);
      const response = await fetchWithFallback(params);
      
      if (response && response.ok) {
        const data = await response.json();
        console.log('Golf Course Search: Raw API response type:', typeof data);
        console.log('Golf Course Search: Raw API response keys:', Object.keys(data || {}));
        console.log('Golf Course Search: Raw API response sample:', JSON.stringify(data).substring(0, 500));
        
        // The API might return courses in different formats
        let courses = [];
        if (Array.isArray(data)) {
          courses = data;
        } else if (data.courses && Array.isArray(data.courses)) {
          courses = data.courses;
        } else if (data.data && Array.isArray(data.data)) {
          courses = data.data;
        } else if (data.results && Array.isArray(data.results)) {
          courses = data.results;
        }
        
        console.log('Golf Course Search: Found', courses.length, 'courses from API');

        if (courses.length > 0) {
          const transformedCourses = courses.map(transformApiCourse);
          console.log('Golf Course Search: Successfully transformed', transformedCourses.length, 'courses');
          return transformedCourses;
        }
      }
    }
    
    console.log('Golf Course Search: No courses found for query:', query);
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
    
    const response = await fetchWithFallback(`/courses/${courseId}`);
    
    if (!response || !response.ok) {
      console.error('Golf Course Search error: Failed to fetch course');
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
 */
export async function searchGolfCoursesByState(
  state: string,
  limit: number = 20
): Promise<GolfCourse[]> {
  if (!state || state.trim().length === 0) {
    return [];
  }

  try {
    const response = await fetchWithFallback(`/courses?state=${encodeURIComponent(state)}&limit=${limit}`);
    
    if (!response || !response.ok) {
      return [];
    }

    const data = await response.json();
    const courses = data.courses || data.data || data || [];
    return courses.map(transformApiCourse);
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
    let path = `/courses?city=${encodeURIComponent(city)}&limit=${limit}`;
    if (state) {
      path += `&state=${encodeURIComponent(state)}`;
    }
    
    const response = await fetchWithFallback(path);
    
    if (!response || !response.ok) {
      return [];
    }

    const data = await response.json();
    const courses = data.courses || data.data || data || [];
    return courses.map(transformApiCourse);
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
    const response = await fetchWithFallback(`/courses?country=${encodeURIComponent(country)}&limit=${limit}`);
    
    if (!response || !response.ok) {
      return [];
    }

    const data = await response.json();
    const courses = data.courses || data.data || data || [];
    return courses.map(transformApiCourse);
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
  console.log('API Key present:', !!GOLF_COURSE_API_KEY);
  console.log('API Key length:', GOLF_COURSE_API_KEY?.length);
  console.log('API Key first 10 chars:', GOLF_COURSE_API_KEY?.substring(0, 10));
  
  try {
    const testQuery = 'Pebble';
    const response = await fetchWithFallback(`/courses?q=${encodeURIComponent(testQuery)}&limit=5`);
    
    if (!response) {
      return {
        success: false,
        message: 'All API authentication methods failed. The API may be down or the API key is invalid.',
      };
    }
    
    if (!response.ok) {
      const errorText = await response.text();
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
