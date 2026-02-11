
export interface FeedEvent {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string; // Consistent naming with UserProfile
  type: 'course_rated' | 'round_logged' | 'badge_earned' | 'friend_added';
  timestamp: Date;
  courseId?: string;
  courseName?: string;
  courseLocation?: string;
  roundId?: string;
  rating?: number;
  score?: number;
  photoUrl?: string;
  comment?: string;
  likes: string[]; // Array of user IDs who liked
  comments: FeedComment[];
}

export interface FeedComment {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string; // Consistent naming
  comment: string;
  timestamp: Date;
}

export interface FriendRequest {
  id: string;
  fromUserId: string; // Maps to from_user_id in database
  fromUsername: string;
  fromDisplayName: string;
  fromAvatar?: string; // Maps to avatar_url from profiles
  fromAvatarUrl?: string; // Alias for compatibility
  toUserId: string; // Maps to to_user_id in database
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  respondedAt?: Date;
}

export interface Friend {
  id: string; // User ID
  userId?: string; // Alias for compatibility
  username: string;
  displayName: string;
  avatar?: string; // Maps to avatar_url from profiles
  avatarUrl?: string; // Alias for compatibility
  totalRounds?: number;
  totalCourses?: number;
  mutualFriends?: number;
  status?: 'pending' | 'accepted' | 'rejected';
  requestedBy?: string;
  requestedAt?: Date;
  acceptedAt?: Date;
}
