
import { GolfCourse } from '@/types/golf';
import { sampleCourses } from '@/data/sampleCourses';

const SUPABASE_URL = 'https://hwpiblxpxghuzpkaenwg.supabase.co';
const EDGE_FUNCTION_NAME = 'golf-courses-search';

interface SearchResponse {
  success: boolean;
  courses: GolfCourse[];
  count: number;
  total: number;
  error?: string;
  rateLimited?: boolean;
}

/**
 * Search for golf courses using the Supabase Edge Function
 * Falls back to sample data if API is rate-limited
 */
export async function searchGolfCourses(
  query: string,
  limit: number = 100,
  offset: number = 0
): Promise<SearchResponse> {
  console.log('Golf Course Search: Searching for:', query, 'limit:', limit, 'offset:', offset);

  if (!query || query.trim().length === 0) {
    console.log('Golf Course Search: Empty query, returning empty results');
    return {
      success: true,
      courses: [],
      count: 0,
      total: 0,
    };
  }

  try {
    const apiUrl = `${SUPABASE_URL}/functions/v1/${EDGE_FUNCTION_NAME}`;
    console.log('Golf Course Search: API URL:', apiUrl);

    const url = `${apiUrl}?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
    console.log('Golf Course Search: Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Golf Course Search: Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Golf Course Search: API error:', response.status, errorData);

      // Check if it's a rate limit error
      if (errorData.error && errorData.error.includes('429')) {
        console.log('Golf Course Search: Rate limited, falling back to sample data');
        return searchSampleCourses(query, limit, offset);
      }

      return {
        success: false,
        courses: [],
        count: 0,
        total: 0,
        error: errorData.error || 'Failed to fetch golf courses',
        rateLimited: false,
      };
    }

    const data: SearchResponse = await response.json();
    console.log('Golf Course Search: Success, found', data.count, 'courses');

    return data;
  } catch (error) {
    console.error('Golf Course Search: Network error:', error);
    
    // Fall back to sample data on network errors
    console.log('Golf Course Search: Network error, falling back to sample data');
    return searchSampleCourses(query, limit, offset);
  }
}

/**
 * Search through sample courses as a fallback when API is unavailable
 */
function searchSampleCourses(
  query: string,
  limit: number = 100,
  offset: number = 0
): SearchResponse {
  const lowerQuery = query.toLowerCase().trim();
  
  // Filter sample courses by name or location
  const filtered = sampleCourses.filter((course) => {
    const nameMatch = course.name.toLowerCase().includes(lowerQuery);
    const locationMatch = course.location.toLowerCase().includes(lowerQuery);
    const cityMatch = course.city?.toLowerCase().includes(lowerQuery);
    const stateMatch = course.state?.toLowerCase().includes(lowerQuery);
    const countryMatch = course.country?.toLowerCase().includes(lowerQuery);
    
    return nameMatch || locationMatch || cityMatch || stateMatch || countryMatch;
  });

  // Apply pagination
  const paginatedCourses = filtered.slice(offset, offset + limit);

  console.log('Golf Course Search: Sample data search found', filtered.length, 'courses');

  return {
    success: true,
    courses: paginatedCourses,
    count: paginatedCourses.length,
    total: filtered.length,
    rateLimited: true,
  };
}

/**
 * Test the golf course API connection
 */
export async function testGolfCourseApi(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Testing Golf Course API...');
    const result = await searchGolfCourses('test', 1, 0);
    
    if (result.rateLimited) {
      return {
        success: false,
        message: 'API is rate-limited. Using sample data as fallback.',
      };
    }
    
    if (result.success) {
      return {
        success: true,
        message: `API is working! Found ${result.total} courses.`,
      };
    }
    
    return {
      success: false,
      message: result.error || 'API test failed',
    };
  } catch (error) {
    console.error('API test error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
