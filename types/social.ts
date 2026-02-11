
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
  fromUserId: string;
  fromUsername: string;
  fromDisplayName: string;
  fromAvatarUrl?: string; // Consistent naming
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Friend {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string; // Consistent naming
  totalRounds: number;
  totalCourses: number;
  mutualFriends: number;
}
