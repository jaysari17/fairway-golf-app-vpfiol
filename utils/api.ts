
// TODO: Backend Integration - API client for FAIRWAY backend
// This file will contain all API calls to the backend server
// Replace AsyncStorage calls with real API calls once backend is deployed

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    console.log('API token set for authenticated requests');
  }

  clearToken() {
    this.token = null;
    console.log('API token cleared');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      console.log(`API Request: ${options.method || 'GET'} ${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`API Error: ${response.status}`, data);
        return { error: data.message || 'Request failed' };
      }

      console.log(`API Success: ${endpoint}`, data);
      return { data };
    } catch (error) {
      console.error(`API Network Error: ${endpoint}`, error);
      return { error: 'Network error occurred' };
    }
  }

  // TODO: Backend Integration - Authentication endpoints
  async register(email: string, username: string, displayName: string, password: string) {
    // POST /api/auth/register
    // Body: { email, username, displayName, password }
    // Returns: { user, token }
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, displayName, password }),
    });
  }

  async login(email: string, password: string) {
    // POST /api/auth/login
    // Body: { email, password }
    // Returns: { user, token }
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    // GET /api/auth/me
    // Headers: Authorization: Bearer {token}
    // Returns: { user }
    return this.request('/api/auth/me');
  }

  // TODO: Backend Integration - User profile endpoints
  async getUser(userId: string) {
    // GET /api/users/:userId
    // Returns: user profile with stats
    return this.request(`/api/users/${userId}`);
  }

  async updateProfile(updates: any) {
    // PUT /api/users/profile
    // Body: { displayName?, bio?, handicap?, phoneNumber?, avatar? }
    // Returns: updated user
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async uploadAvatar(formData: FormData) {
    // POST /api/users/avatar
    // Body: multipart form data with 'avatar' field
    // Returns: { avatarUrl }
    return fetch(`${API_BASE_URL}/api/users/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    }).then(res => res.json());
  }

  // TODO: Backend Integration - Rounds endpoints
  async getRounds(userId?: string) {
    // GET /api/rounds?userId={userId}
    // Returns: array of rounds
    const query = userId ? `?userId=${userId}` : '';
    return this.request(`/api/rounds${query}`);
  }

  async createRound(roundData: any) {
    // POST /api/rounds
    // Body: { courseId, datePlayed, score?, teeBox?, yardage?, review? }
    // Returns: created round
    return this.request('/api/rounds', {
      method: 'POST',
      body: JSON.stringify(roundData),
    });
  }

  async updateRound(roundId: string, updates: any) {
    // PUT /api/rounds/:roundId
    // Body: { datePlayed?, score?, teeBox?, yardage?, review? }
    // Returns: updated round
    return this.request(`/api/rounds/${roundId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteRound(roundId: string) {
    // DELETE /api/rounds/:roundId
    // Returns: { success: true }
    return this.request(`/api/rounds/${roundId}`, {
      method: 'DELETE',
      body: JSON.stringify({}),
    });
  }

  // TODO: Backend Integration - Ratings endpoints
  async getRatings(userId?: string) {
    // GET /api/ratings?userId={userId}
    // Returns: array of ratings
    const query = userId ? `?userId=${userId}` : '';
    return this.request(`/api/ratings${query}`);
  }

  async createRating(ratingData: any) {
    // POST /api/ratings
    // Body: { courseId, playAgainResponse, comparisonWins, comparisonLosses, comparedCourseIds, rankPosition, totalCourses, finalScore }
    // Returns: created rating
    return this.request('/api/ratings', {
      method: 'POST',
      body: JSON.stringify(ratingData),
    });
  }

  async getRatingForCourse(courseId: string) {
    // GET /api/ratings/course/:courseId
    // Returns: rating object or null
    return this.request(`/api/ratings/course/${courseId}`);
  }

  // TODO: Backend Integration - Social followers endpoints
  async followUser(userId: string) {
    // POST /api/social/follow/:userId
    // Returns: { success: true, followersCount, followingCount }
    return this.request(`/api/social/follow/${userId}`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async unfollowUser(userId: string) {
    // DELETE /api/social/unfollow/:userId
    // Returns: { success: true, followersCount, followingCount }
    return this.request(`/api/social/unfollow/${userId}`, {
      method: 'DELETE',
      body: JSON.stringify({}),
    });
  }

  async getFollowers(userId: string) {
    // GET /api/social/followers/:userId
    // Returns: array of followers
    return this.request(`/api/social/followers/${userId}`);
  }

  async getFollowing(userId: string) {
    // GET /api/social/following/:userId
    // Returns: array of following
    return this.request(`/api/social/following/${userId}`);
  }

  async isFollowing(userId: string) {
    // GET /api/social/is-following/:userId
    // Returns: { isFollowing: boolean }
    return this.request(`/api/social/is-following/${userId}`);
  }

  // TODO: Backend Integration - Social feed endpoints
  async getFeed(limit = 50, offset = 0) {
    // GET /api/social/feed?limit={limit}&offset={offset}
    // Returns: array of feed events
    return this.request(`/api/social/feed?limit=${limit}&offset=${offset}`);
  }

  async createFeedEvent(eventData: any) {
    // POST /api/social/feed
    // Body: { eventType, courseId?, roundId?, rating?, score?, photoUrl?, comment? }
    // Returns: created feed event
    return this.request('/api/social/feed', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async likeFeedEvent(eventId: string) {
    // POST /api/social/feed/:eventId/like
    // Returns: { liked: boolean, likesCount: number }
    return this.request(`/api/social/feed/${eventId}/like`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async commentOnFeedEvent(eventId: string, text: string) {
    // POST /api/social/feed/:eventId/comment
    // Body: { text }
    // Returns: created comment
    return this.request(`/api/social/feed/${eventId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async getFeedComments(eventId: string) {
    // GET /api/social/feed/:eventId/comments
    // Returns: array of comments
    return this.request(`/api/social/feed/${eventId}/comments`);
  }

  // TODO: Backend Integration - Notifications endpoints
  async getNotifications() {
    // GET /api/notifications
    // Returns: array of notifications
    return this.request('/api/notifications');
  }

  async markNotificationRead(notificationId: string) {
    // PUT /api/notifications/:notificationId/read
    // Returns: { success: true }
    return this.request(`/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      body: JSON.stringify({}),
    });
  }

  async markAllNotificationsRead() {
    // PUT /api/notifications/read-all
    // Returns: { success: true }
    return this.request('/api/notifications/read-all', {
      method: 'PUT',
      body: JSON.stringify({}),
    });
  }

  async getUnreadNotificationsCount() {
    // GET /api/notifications/unread-count
    // Returns: { count: number }
    return this.request('/api/notifications/unread-count');
  }

  // TODO: Backend Integration - Search endpoints
  async searchUsers(query: string, limit = 20) {
    // GET /api/search/users?query={query}&limit={limit}
    // Returns: array of users
    return this.request(`/api/search/users?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async searchCourses(query: string, limit = 20) {
    // GET /api/search/courses?query={query}&limit={limit}
    // Returns: array of courses
    return this.request(`/api/search/courses?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // TODO: Backend Integration - Mutual courses endpoint
  async getMutualCourses(userId: string) {
    // GET /api/social/mutual-courses/:userId
    // Returns: array of mutual courses with ratings
    return this.request(`/api/social/mutual-courses/${userId}`);
  }

  // TODO: Backend Integration - Golf courses endpoints
  async getCourses(search?: string, limit = 20) {
    // GET /api/courses?search={search}&limit={limit}
    // Returns: array of courses
    const query = search ? `?search=${encodeURIComponent(search)}&limit=${limit}` : `?limit=${limit}`;
    return this.request(`/api/courses${query}`);
  }

  async getCourse(courseId: string) {
    // GET /api/courses/:courseId
    // Returns: course details
    return this.request(`/api/courses/${courseId}`);
  }

  async createCourse(courseData: any) {
    // POST /api/courses
    // Body: { externalId?, name, location, city?, state?, country?, type?, holes?, par?, yardage?, difficulty?, website?, phone?, latitude?, longitude? }
    // Returns: created course
    return this.request('/api/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }
}

export const apiClient = new ApiClient();
