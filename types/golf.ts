
export interface GolfCourse {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  country: string;
  type?: 'parkland' | 'links' | 'desert' | 'mountain' | 'public' | 'private' | 'resort' | 'other';
  holes?: number;
  par?: number;
  yardage?: number;
  rating?: number; // User's rating (0-100)
  difficulty?: string;
  website?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export interface Round {
  id: string;
  courseId: string;
  courseName: string;
  courseLocation: string;
  datePlayed: Date; // Changed from 'date' to match database column 'date_played'
  rating?: number; // 1-100 (optional since not all rounds have ratings)
  review?: string;
  score?: number;
  teeBox?: string;
  yardage?: number;
  photos?: string[];
}

export interface UserProfile {
  id?: string; // Database ID
  userId?: string; // Auth user ID (user_id in database)
  username: string;
  email?: string; // Email is stored in auth.users, not profiles
  displayName?: string; // display_name in database
  phoneNumber?: string; // phone_number in database
  avatarUrl?: string; // avatar_url in database
  bio?: string;
  handicap?: number;
  totalRounds?: number; // Calculated field, not in database
  totalCourses?: number; // Calculated field, not in database
  contactsSynced?: boolean; // Local field, not in database
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Badge {
  id: string; // Database ID
  userId?: string; // user_id in database
  badgeId?: string; // badge_id in database (identifier for badge type)
  name: string; // badge_name in database
  description?: string; // badge_description in database
  icon?: string; // badge_icon in database
  earned?: boolean; // Calculated field (if earnedAt exists)
  earnedAt?: Date; // earned_at in database
}
