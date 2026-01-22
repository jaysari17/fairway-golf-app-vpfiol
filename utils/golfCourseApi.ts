
import { GolfCourse } from '@/types/golf';

const GOLF_COURSE_API_BASE_URL = 'https://api.golfcourseapi.com/v1';


const API_KEY = 'U2RVDJNGLFSNE5B2MAOAZGX2SM';

export interface GolfCourseApiResponse {
  id: number;
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
 * Search for golf courses using the GolfCourseAPI
 * @param query - Search query (course name, city, state, etc.)
 * @param limit - Maximum number of results to return (default: 20)
 * @returns Array of golf courses matching the search query
 */
export async function searchGolfCourses(
  query: string,
  limit: number = 20
): Promise<GolfCourse[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  if (!API_KEY) {
    console.warn('Golf Course API key not configured. Using sample data only.');
    return [];
  }

  try {
    const url = `${GOLF_COURSE_API_BASE_URL}/courses?name=${encodeURIComponent(query)}&limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Golf Course API error:', response.status, response.statusText);
      return [];
    }

    const data: GolfCourseApiResponse[] = await response.json();

    // Transform API response to our GolfCourse type
    return data.map((course) => ({
      id: `api-${course.id}`,
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
    console.error('Error searching golf courses:', error);
    return [];
  }
}

/**
 * Get a specific golf course by ID
 * @param courseId - The course ID from GolfCourseAPI
 * @returns Golf course details or null if not found
 */
export async function getGolfCourseById(courseId: string): Promise<GolfCourse | null> {
  if (!API_KEY) {
    console.warn('Golf Course API key not configured.');
    return null;
  }

  // Extract numeric ID from our prefixed ID format
  const numericId = courseId.replace('api-', '');

  try {
    const url = `${GOLF_COURSE_API_BASE_URL}/courses/${numericId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Golf Course API error:', response.status, response.statusText);
      return null;
    }

    const course: GolfCourseApiResponse = await response.json();

    return {
      id: `api-${course.id}`,
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
 * Search for golf courses near a specific location
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param radius - Search radius in miles (default: 25)
 * @param limit - Maximum number of results (default: 20)
 * @returns Array of nearby golf courses
 */
export async function searchNearbyGolfCourses(
  latitude: number,
  longitude: number,
  radius: number = 25,
  limit: number = 20
): Promise<GolfCourse[]> {
  if (!API_KEY) {
    console.warn('Golf Course API key not configured.');
    return [];
  }

  try {
    const url = `${GOLF_COURSE_API_BASE_URL}/courses?lat=${latitude}&lng=${longitude}&radius=${radius}&limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Golf Course API error:', response.status, response.statusText);
      return [];
    }

    const data: GolfCourseApiResponse[] = await response.json();

    return data.map((course) => ({
      id: `api-${course.id}`,
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
    console.error('Error searching nearby golf courses:', error);
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
