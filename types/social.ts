
export interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  handicap?: number;
  totalRounds: number;
  totalCourses: number;
  status: 'pending' | 'accepted' | 'blocked';
  requestedBy?: string; // user ID who sent the request
  requestedAt: Date;
  acceptedAt?: Date;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromDisplayName: string;
  fromAvatar?: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: Date;
  respondedAt?: Date;
}

export type FeedEventType = 
  | 'round_logged'
  | 'course_rated'
  | 'list_updated'
  | 'personal_best'
  | 'mutual_course'
  | 'live_round'
  | 'photo_posted';

export interface FeedEvent {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  userAvatar?: string;
  type: FeedEventType;
  timestamp: Date;
  courseId?: string;
  courseName?: string;
  courseLocation?: string;
  rating?: number;
  score?: number;
  photo?: string;
  comment?: string;
  likes: string[]; // array of user IDs who liked
  comments: FeedComment[];
}

export interface FeedComment {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  userAvatar?: string;
  text: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: 'friend_request' | 'friend_accepted' | 'activity' | 'reaction';
  fromUserId: string;
  fromUsername: string;
  fromDisplayName: string;
  fromAvatar?: string;
  message: string;
  timestamp: Date;
  read: boolean;
  relatedId?: string; // friend request ID, event ID, etc.
}

export interface PrivacySettings {
  accountVisibility: 'public' | 'friends' | 'private';
  showHandicap: boolean;
  showCourseMap: boolean;
  showRankingList: boolean;
  showRecentActivity: boolean;
  mutedFriends: string[]; // array of user IDs
}

export interface UserSocialProfile {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  handicap?: number;
  totalRounds: number;
  totalCourses: number;
  topCourses: Array<{
    courseId: string;
    courseName: string;
    courseLocation: string;
    rating: number;
    rank: number;
  }>;
  recentRatings: Array<{
    courseId: string;
    courseName: string;
    courseLocation: string;
    rating: number;
    date: Date;
  }>;
  privacySettings: PrivacySettings;
}

export interface MutualCourse {
  courseId: string;
  courseName: string;
  courseLocation: string;
  yourRating: number;
  friendRating: number;
  yourRounds: number;
  friendRounds: number;
}
