
import { GolfCourse } from '@/types/golf';

// Golf Course API Configuration
// Documentation: https://rapidapi.com/apininjas/api/golf-course-api
const GOLF_COURSE_API_BASE_URL = 'https://golf-course-api.p.rapidapi.com/courses';

// Your RapidAPI key for Golf Course API
const API_KEY = 'U2RVDJNGLFSNE5B2MAOAZGX2SM';

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
 * Search for golf courses using the Golf Course API (RapidAPI)
 * @param query - Search query (course name, city, state, etc.)
 * @param limit - Maximum number of results to return (default: 20)
 * @returns Array of golf courses matching the search query
 */
export async function searchGolfCourses(
  query: string,
  limit: number = 20
): Promise<GolfCourse[]> {
  if (!query || query.trim().length === 0) {
    console.log('Golf Course API: Empty search query');
    return [];
  }

  if (!API_KEY) {
    console.warn('Golf Course API key not configured. Using sample data only.');
    return [];
  }

  try {
    console.log('Golf Course API: Searching for:', query);
    
    // RapidAPI uses a different URL structure
    const url = `${GOLF_COURSE_API_BASE_URL}?name=${encodeURIComponent(query)}`;
    
    console.log('Golf Course API: Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'golf-course-api.p.rapidapi.com',
      },
    });

    console.log('Golf Course API: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Golf Course API error:', response.status, response.statusText, errorText);
      return [];
    }

    const data: GolfCourseApiResponse[] = await response.json();
    console.log('Golf Course API: Found', data.length, 'courses');

    // Transform API response to our GolfCourse type
    const courses = data.slice(0, limit).map((course, index) => ({
      id: course.id ? `api-${course.id}` : `api-search-${Date.now()}-${index}`,
      name: course.name,
      location: `${course.city}, ${course.state_or_province}`,
      city: course.city,
      state: course.state_or_province,
      country: course.country,
      type: mapCourseType(course.course_type),
      holes: course.holes,
      par: course.par,
      yardage: course.yardage,
    }));

    console.log('Golf Course API: Returning', courses.length, 'transformed courses');
    return courses;
  } catch (error) {
    console.error('Error searching golf courses:', error);
    return [];
  }
}

/**
 * Get a specific golf course by ID
 * @param courseId - The course ID from Golf Course API
 * @returns Golf course details or null if not found
 */
export async function getGolfCourseById(courseId: string): Promise<GolfCourse | null> {
  if (!API_KEY) {
    console.warn('Golf Course API key not configured.');
    return null;
  }

  // Extract numeric ID from our prefixed ID format
  const numericId = courseId.replace('api-', '').split('-')[0];

  try {
    console.log('Golf Course API: Fetching course by ID:', numericId);
    
    const url = `${GOLF_COURSE_API_BASE_URL}/${numericId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'golf-course-api.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      console.error('Golf Course API error:', response.status, response.statusText);
      return null;
    }

    const course: GolfCourseApiResponse = await response.json();

    return {
      id: `api-${course.id || numericId}`,
      name: course.name,
      location: `${course.city}, ${course.state_or_province}`,
      city: course.city,
      state: course.state_or_province,
      country: course.country,
      type: mapCourseType(course.course_type),
      holes: course.holes,
      par: course.par,
      yardage: course.yardage,
    };
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
    console.log('Golf Course API: Empty state query');
    return [];
  }

  if (!API_KEY) {
    console.warn('Golf Course API key not configured.');
    return [];
  }

  try {
    console.log('Golf Course API: Searching by state:', state);
    
    const url = `${GOLF_COURSE_API_BASE_URL}?state=${encodeURIComponent(state)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'golf-course-api.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      console.error('Golf Course API error:', response.status, response.statusText);
      return [];
    }

    const data: GolfCourseApiResponse[] = await response.json();
    console.log('Golf Course API: Found', data.length, 'courses in', state);

    return data.slice(0, limit).map((course, index) => ({
      id: course.id ? `api-${course.id}` : `api-state-${Date.now()}-${index}`,
      name: course.name,
      location: `${course.city}, ${course.state_or_province}`,
      city: course.city,
      state: course.state_or_province,
      country: course.country,
      type: mapCourseType(course.course_type),
      holes: course.holes,
      par: course.par,
      yardage: course.yardage,
    }));
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
    console.log('Golf Course API: Empty city query');
    return [];
  }

  if (!API_KEY) {
    console.warn('Golf Course API key not configured.');
    return [];
  }

  try {
    console.log('Golf Course API: Searching by city:', city, state ? `in ${state}` : '');
    
    let url = `${GOLF_COURSE_API_BASE_URL}?city=${encodeURIComponent(city)}`;
    if (state) {
      url += `&state=${encodeURIComponent(state)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'golf-course-api.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      console.error('Golf Course API error:', response.status, response.statusText);
      return [];
    }

    const data: GolfCourseApiResponse[] = await response.json();
    console.log('Golf Course API: Found', data.length, 'courses in', city);

    return data.slice(0, limit).map((course, index) => ({
      id: course.id ? `api-${course.id}` : `api-city-${Date.now()}-${index}`,
      name: course.name,
      location: `${course.city}, ${course.state_or_province}`,
      city: course.city,
      state: course.state_or_province,
      country: course.country,
      type: mapCourseType(course.course_type),
      holes: course.holes,
      par: course.par,
      yardage: course.yardage,
    }));
  } catch (error) {
    console.error('Error searching golf courses by city:', error);
    return [];
  }
}

/**
 * Map course type from API to our internal type
 */
function mapCourseType(apiType?: string): 'parkland' | 'links' | 'desert' | 'mountain' | 'other' {
  if (!apiType) return 'other';
  
  const type = apiType.toLowerCase();
  
  if (type.includes('links')) return 'links';
  if (type.includes('parkland') || type.includes('park')) return 'parkland';
  if (type.includes('desert')) return 'desert';
  if (type.includes('mountain')) return 'mountain';
  
  return 'other';
}
