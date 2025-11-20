
export interface CourseRating {
  id: string;
  courseId: string;
  courseName: string;
  courseLocation: string;
  userId?: string;
  
  // Step 1: Play Again Response
  playAgainResponse: 'definitely' | 'maybe' | 'no';
  
  // Step 2: Comparison Results
  comparisonWins: number;
  comparisonLosses: number;
  comparedCourseIds: string[];
  
  // Step 3: Ranking Position
  rankPosition: number; // Position in user's list (0-based)
  totalCourses: number; // Total courses at time of rating
  
  // Step 4: Final Score
  finalScore: number; // 1-10 score
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface RatingTrigger {
  courseId: string;
  courseName: string;
  roundId: string;
  triggerType: 'after_log' | 'revisit_course' | 'next_session';
  triggeredAt: Date;
  completed: boolean;
}

export interface ComparisonCourse {
  courseId: string;
  courseName: string;
  courseLocation: string;
  userRating?: number;
  playCount: number;
  lastPlayed?: Date;
  photo?: string;
}
