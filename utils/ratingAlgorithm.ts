
import { CourseRating } from '@/types/rating';

export class RatingAlgorithm {
  /**
   * Calculate final 1-10 score based on all rating inputs
   */
  static calculateFinalScore(
    playAgainResponse: 'definitely' | 'maybe' | 'no',
    comparisonWins: number,
    comparisonLosses: number,
    rankPosition: number,
    totalCourses: number,
    neighborRatings: { above?: number; below?: number }
  ): number {
    // Base score from play again response
    let baseScore = this.getBaseScoreFromPlayAgain(playAgainResponse);
    
    // Adjustment from comparison wins/losses
    const comparisonAdjustment = this.getComparisonAdjustment(comparisonWins, comparisonLosses);
    
    // Score from rank position
    const positionScore = this.getScoreFromPosition(rankPosition, totalCourses);
    
    // Interpolate between neighbors if available
    const neighborScore = this.interpolateNeighborScore(
      rankPosition,
      totalCourses,
      neighborRatings
    );
    
    // Weighted average of all factors
    let finalScore = (
      baseScore * 0.3 +
      comparisonAdjustment * 0.2 +
      positionScore * 0.3 +
      (neighborScore || positionScore) * 0.2
    );
    
    // Clamp to 1-10 range
    finalScore = Math.max(1, Math.min(10, finalScore));
    
    // Round to 1 decimal place
    return Math.round(finalScore * 10) / 10;
  }

  private static getBaseScoreFromPlayAgain(response: 'definitely' | 'maybe' | 'no'): number {
    switch (response) {
      case 'definitely':
        return 8.5;
      case 'maybe':
        return 6.0;
      case 'no':
        return 3.5;
    }
  }

  private static getComparisonAdjustment(wins: number, losses: number): number {
    const total = wins + losses;
    if (total === 0) return 6.0;
    
    const winRate = wins / total;
    // Map win rate (0-1) to score (2-9)
    return 2 + (winRate * 7);
  }

  private static getScoreFromPosition(position: number, total: number): number {
    if (total === 0) return 6.0;
    
    // Position 0 = top of list = highest score
    // Position (total-1) = bottom of list = lowest score
    const percentile = 1 - (position / Math.max(1, total - 1));
    
    // Map percentile to 1-10 scale
    // Top 10% -> 9-10
    // Bottom 10% -> 1-2
    return 1 + (percentile * 9);
  }

  private static interpolateNeighborScore(
    position: number,
    total: number,
    neighbors: { above?: number; below?: number }
  ): number | null {
    const { above, below } = neighbors;
    
    if (above !== undefined && below !== undefined) {
      // Interpolate between neighbors
      return (above + below) / 2;
    } else if (above !== undefined) {
      // Only above neighbor, place slightly below
      return Math.max(1, above - 0.5);
    } else if (below !== undefined) {
      // Only below neighbor, place slightly above
      return Math.min(10, below + 0.5);
    }
    
    return null;
  }

  /**
   * Select comparison courses based on algorithm
   */
  static selectComparisonCourses(
    allRatedCourses: CourseRating[],
    targetCourseId: string,
    count: number = 3
  ): string[] {
    if (allRatedCourses.length === 0) return [];
    
    const selected: string[] = [];
    const available = allRatedCourses.filter(c => c.courseId !== targetCourseId);
    
    if (available.length === 0) return [];
    
    // 1. Tier-Match: Similar rating (if we have a preliminary score)
    const tierMatch = this.findTierMatch(available);
    if (tierMatch && selected.length < count) {
      selected.push(tierMatch.courseId);
    }
    
    // 2. Top Favorite: Highest rated
    const topFavorite = this.findTopFavorite(available, selected);
    if (topFavorite && selected.length < count) {
      selected.push(topFavorite.courseId);
    }
    
    // 3. Low Favorite: Lowest rated
    const lowFavorite = this.findLowFavorite(available, selected);
    if (lowFavorite && selected.length < count) {
      selected.push(lowFavorite.courseId);
    }
    
    // 4. Boundary Tester: Random from remaining
    while (selected.length < count && selected.length < available.length) {
      const remaining = available.filter(c => !selected.includes(c.courseId));
      if (remaining.length === 0) break;
      
      const random = remaining[Math.floor(Math.random() * remaining.length)];
      selected.push(random.courseId);
    }
    
    return selected;
  }

  private static findTierMatch(courses: CourseRating[]): CourseRating | null {
    if (courses.length === 0) return null;
    
    // Find course with median score
    const sorted = [...courses].sort((a, b) => a.finalScore - b.finalScore);
    return sorted[Math.floor(sorted.length / 2)];
  }

  private static findTopFavorite(courses: CourseRating[], exclude: string[]): CourseRating | null {
    const available = courses.filter(c => !exclude.includes(c.courseId));
    if (available.length === 0) return null;
    
    return available.reduce((top, current) => 
      current.finalScore > top.finalScore ? current : top
    );
  }

  private static findLowFavorite(courses: CourseRating[], exclude: string[]): CourseRating | null {
    const available = courses.filter(c => !exclude.includes(c.courseId));
    if (available.length === 0) return null;
    
    return available.reduce((low, current) => 
      current.finalScore < low.finalScore ? current : low
    );
  }
}
