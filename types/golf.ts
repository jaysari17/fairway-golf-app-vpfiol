
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
  date: Date;
  rating: number; // 1-100
  review?: string;
  score?: number;
  teeBox?: string;
  yardage?: number;
  photos?: string[];
}

export interface UserProfile {
  username: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  bio?: string;
  handicap?: number;
  totalRounds: number;
  totalCourses: number;
  contactsSynced?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
}
