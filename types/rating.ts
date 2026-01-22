
export interface CourseRating {
  id: string;
  courseId: string;
  courseName: string;
  courseLocation: string;
  userId?: string;
  
  // Step 1: Play Again Response
  playAgainResponse?: 'definitely' | 'maybe' | 'no'; // play_again_response in database
  
  // Step 2: Comparison Results
  comparisonWins?: number; // comparison_wins in database
  comparisonLosses?: number; // comparison_losses in database
  comparedCourseIds?: string[]; // compared_course_ids in database
  
  // Step 3: Ranking Position
  rankPosition?: number; // rank_position in database - Position in user's list (0-based)
  totalCourses?: number; // total_courses in database - Total courses at time of rating
  
  // Step 4: Final Score
  finalScore?: number; // final_score in database - 1-10 score
  
  // Play count
  playCount?: number; // play_count in database - Number of times played
  
  // Metadata
  createdAt?: Date; // created_at in database
  updatedAt?: Date; // updated_at in database
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
