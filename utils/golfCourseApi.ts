
import { GolfCourse } from '@/types/golf';

// Supabase Edge Function URL
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hwpiblxpxghuzpkaenwg.supabase.co';
const GOLF_COURSE_API_URL = `${SUPABASE_URL}/functions/v1/golf-courses-search`;

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
  const state = apiCourse.state || apiCourse.state_or_province || '';
  const country = apiCourse.country || '';
  
  // Build location string
  const locationParts = [city, state, country].filter(Boolean);
  const location = locationParts.join(', ');

  const transformed = {
    id: apiCourse.id || `api-${Math.random().toString(36).substr(2, 9)}`,
    name: apiCourse.name || 'Unknown Course',
    location: location || 'Unknown Location',
    city: city,
    state: state,
    country: country,
    type: (apiCourse.type?.toLowerCase() || apiCourse.course_type?.toLowerCase() || 'public') as any,
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
 * @param query - Search query (course name, city, state, country, etc.)
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
    console.log('Golf Course Search: API URL:', GOLF_COURSE_API_URL);
    
    const url = `${GOLF_COURSE_API_URL}?q=${encodeURIComponent(query)}&limit=${limit}`;
    console.log('Golf Course Search: Fetching from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Golf Course Search: Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Golf Course Search: API error:', response.status, errorText);
      return [];
    }
    
    const data = await response.json();
    console.log('Golf Course Search: Response data:', {
      success: data.success,
      count: data.count,
      coursesLength: data.courses?.length || 0,
    });
    
    if (!data.success || !data.courses) {
      console.log('Golf Course Search: No courses in response');
      return [];
    }
    
    const transformedCourses = data.courses.map(transformApiCourse);
    console.log('Golf Course Search: Transformed', transformedCourses.length, 'courses');
    
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
    
    // Search by ID (the backend will match it)
    const results = await searchGolfCourses(courseId, 1);
    
    if (results.length > 0) {
      return results[0];
    }
    
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
    return await searchGolfCourses(state, limit);
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
    const query = state ? `${city} ${state}` : city;
    return await searchGolfCourses(query, limit);
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
    return await searchGolfCourses(country, limit);
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
    console.log('Testing with query: "Pebble Beach"');
    const results = await searchGolfCourses('Pebble Beach', 5);
    
    if (results.length > 0) {
      console.log('✅ API Test Successful!');
      console.log('Found courses:', results.map(c => c.name).join(', '));
      
      return {
        success: true,
        message: `✅ Golf Course Search is working!\n\nFound ${results.length} courses for "Pebble Beach".\n\n🌍 Worldwide Golf Course Database:\n• 400+ famous courses from 50+ countries\n• USA, UK, Ireland, Scotland, Australia, Canada, Spain, France, Portugal, South Africa, New Zealand, Japan, Dubai, Mexico, Caribbean, China, South Korea, Thailand, Singapore, Malaysia, Indonesia, India, Argentina, Brazil, Chile, Germany, Netherlands, Belgium, Sweden, Denmark, Norway, Finland, Austria, Switzerland, Italy, Turkey, Morocco, Egypt, Kenya, Zimbabwe, Mauritius, Vietnam, Philippines\n• Search by course name, city, state, or country\n\nTry searching for:\n• "St Andrews" (Scotland)\n• "Augusta" (Georgia, USA)\n• "Royal Melbourne" (Australia)\n• "Valderrama" (Spain)\n• "Pebble Beach" (California, USA)\n• "Cabot Cliffs" (Nova Scotia, Canada)\n• "Cape Kidnappers" (New Zealand)\n• "Emirates Golf Club" (Dubai)`,
        data: results,
      };
    } else {
      return {
        success: false,
        message: '⚠️ API returned no results for test query. The backend is running but may need more data.',
      };
    }
  } catch (error) {
    console.error('Test API Error:', error);
    return {
      success: false,
      message: `❌ API test failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check your internet connection and try again.`,
    };
  }
}
