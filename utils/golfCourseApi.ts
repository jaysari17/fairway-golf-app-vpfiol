
import { GolfCourse } from '@/types/golf';

// Backend API base URL - will be set by the backend integration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

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
    
    // Call backend endpoint for golf course search
    const url = `${API_BASE_URL}/api/golf-courses/search?query=${encodeURIComponent(query)}&limit=${limit}`;
    
    console.log('Golf Course Search: Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Golf Course Search: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Golf Course Search error:', response.status, response.statusText, errorText);
      return [];
    }

    const data = await response.json();
    console.log('Golf Course Search: Found', data.courses?.length || 0, 'courses');

    // The backend returns courses in our GolfCourse format
    return data.courses || [];
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
    
    const url = `${API_BASE_URL}/api/golf-courses/${courseId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Golf Course Search error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.course || null;
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
    
    const url = `${API_BASE_URL}/api/golf-courses/search?state=${encodeURIComponent(state)}&limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Golf Course Search error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('Golf Course Search: Found', data.courses?.length || 0, 'courses in', state);

    return data.courses || [];
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
    
    let url = `${API_BASE_URL}/api/golf-courses/search?city=${encodeURIComponent(city)}&limit=${limit}`;
    if (state) {
      url += `&state=${encodeURIComponent(state)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Golf Course Search error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('Golf Course Search: Found', data.courses?.length || 0, 'courses in', city);

    return data.courses || [];
  } catch (error) {
    console.error('Error searching golf courses by city:', error);
    return [];
  }
}
