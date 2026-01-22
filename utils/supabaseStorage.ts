
import { supabase } from './supabase';
import { UserProfile, Round, Badge } from '@/types/golf';
import { CourseRating } from '@/types/rating';
import { FeedEvent, FeedComment } from '@/types/social';

/**
 * Supabase Storage Service
 * 
 * This service provides methods to interact with Supabase database.
 * It replaces AsyncStorage calls with real database operations.
 * 
 * SETUP REQUIRED:
 * 1. Create tables in your Supabase project:
 *    - profiles (id, user_id, username, display_name, bio, handicap, phone_number, avatar_url, created_at, updated_at)
 *    - rounds (id, user_id, course_id, course_name, course_location, date_played, score, tee_box, yardage, review, created_at)
 *    - ratings (id, user_id, course_id, course_name, course_location, play_again_response, comparison_wins, comparison_losses, compared_course_ids, rank_position, total_courses, final_score, play_count, created_at, updated_at)
 *    - feed_events (id, user_id, event_type, course_id, round_id, rating, score, photo_url, comment, likes_count, comments_count, created_at)
 *    - feed_comments (id, event_id, user_id, text, created_at)
 *    - followers (id, follower_id, following_id, created_at)
 *    - badges (id, user_id, badge_id, badge_name, badge_description, badge_icon, earned_at)
 * 
 * 2. Set up Row Level Security (RLS) policies for each table
 * 3. Add your Supabase URL and anon key to .env file
 */

export const SupabaseStorageService = {
  // ==================== PROFILES ====================
  
  async getProfile(userId?: string): Promise<UserProfile | null> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!targetUserId) {
        console.error('No user ID provided');
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched from Supabase:', data?.username);
      
      // Get email from auth.users
      const user = (await supabase.auth.getUser()).data.user;
      
      return {
        ...data,
        email: user?.email,
      } as UserProfile;
    } catch (error) {
      console.error('Error in getProfile:', error);
      return null;
    }
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Don't save email to profiles table - it's stored in auth.users
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username: profile.username,
          display_name: profile.displayName,
          bio: profile.bio,
          handicap: profile.handicap,
          phone_number: profile.phoneNumber,
          avatar_url: profile.avatar,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving profile to Supabase:', error);
        throw error;
      }

      console.log('Profile saved to Supabase:', profile.username);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  },

  // ==================== ROUNDS ====================
  
  async getRounds(userId?: string): Promise<Round[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!targetUserId) {
        console.error('No user ID provided');
        return [];
      }

      const { data, error } = await supabase
        .from('rounds')
        .select('*')
        .eq('user_id', targetUserId)
        .order('date_played', { ascending: false });

      if (error) {
        console.error('Error fetching rounds:', error);
        return [];
      }

      console.log('Rounds fetched from Supabase:', data?.length);
      return data as Round[];
    } catch (error) {
      console.error('Error in getRounds:', error);
      return [];
    }
  },

  async saveRound(round: Round): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('rounds')
        .insert({
          id: round.id,
          user_id: user.id,
          course_id: round.courseId,
          course_name: round.courseName,
          course_location: round.courseLocation,
          date_played: round.datePlayed,
          score: round.score,
          tee_box: round.teeBox,
          yardage: round.yardage,
          review: round.review,
        });

      if (error) {
        throw error;
      }

      console.log('Round saved to Supabase:', round.id);
    } catch (error) {
      console.error('Error saving round:', error);
      throw error;
    }
  },

  async updateRound(roundId: string, updatedRound: Round): Promise<void> {
    try {
      const { error } = await supabase
        .from('rounds')
        .update({
          course_id: updatedRound.courseId,
          course_name: updatedRound.courseName,
          course_location: updatedRound.courseLocation,
          date_played: updatedRound.datePlayed,
          score: updatedRound.score,
          tee_box: updatedRound.teeBox,
          yardage: updatedRound.yardage,
          review: updatedRound.review,
        })
        .eq('id', roundId);

      if (error) {
        throw error;
      }

      console.log('Round updated in Supabase:', roundId);
    } catch (error) {
      console.error('Error updating round:', error);
      throw error;
    }
  },

  async deleteRound(roundId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('rounds')
        .delete()
        .eq('id', roundId);

      if (error) {
        throw error;
      }

      console.log('Round deleted from Supabase:', roundId);
    } catch (error) {
      console.error('Error deleting round:', error);
      throw error;
    }
  },

  // ==================== RATINGS ====================
  
  async getRatings(userId?: string): Promise<CourseRating[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!targetUserId) {
        console.error('No user ID provided');
        return [];
      }

      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ratings:', error);
        return [];
      }

      console.log('Ratings fetched from Supabase:', data?.length);
      return data as CourseRating[];
    } catch (error) {
      console.error('Error in getRatings:', error);
      return [];
    }
  },

  async saveRating(rating: CourseRating): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('ratings')
        .upsert({
          id: rating.id,
          user_id: user.id,
          course_id: rating.courseId,
          course_name: rating.courseName,
          course_location: rating.courseLocation,
          play_again_response: rating.playAgainResponse,
          comparison_wins: rating.comparisonWins,
          comparison_losses: rating.comparisonLosses,
          compared_course_ids: rating.comparedCourseIds,
          rank_position: rating.rankPosition,
          total_courses: rating.totalCourses,
          final_score: rating.finalScore,
          play_count: rating.playCount,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      console.log('Rating saved to Supabase:', rating.id);
    } catch (error) {
      console.error('Error saving rating:', error);
      throw error;
    }
  },

  // ==================== SOCIAL FEED ====================
  
  async getFeedEvents(limit = 50, offset = 0): Promise<FeedEvent[]> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        console.error('No authenticated user');
        return [];
      }

      // Get feed events from users the current user follows
      const { data, error } = await supabase
        .from('feed_events')
        .select(`
          *,
          profiles:user_id (username, display_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching feed events:', error);
        return [];
      }

      console.log('Feed events fetched from Supabase:', data?.length);
      return data as FeedEvent[];
    } catch (error) {
      console.error('Error in getFeedEvents:', error);
      return [];
    }
  },

  async createFeedEvent(event: FeedEvent): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('feed_events')
        .insert({
          id: event.id,
          user_id: user.id,
          event_type: event.eventType,
          course_id: event.courseId,
          round_id: event.roundId,
          rating: event.rating,
          score: event.score,
          photo_url: event.photoUrl,
          comment: event.comment,
          likes_count: 0,
          comments_count: 0,
        });

      if (error) {
        throw error;
      }

      console.log('Feed event created in Supabase:', event.id);
    } catch (error) {
      console.error('Error creating feed event:', error);
      throw error;
    }
  },

  async likeFeedEvent(eventId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_likes', {
        event_id: eventId,
      });

      if (error) {
        throw error;
      }

      console.log('Feed event liked:', eventId);
    } catch (error) {
      console.error('Error liking feed event:', error);
      throw error;
    }
  },

  // ==================== FOLLOWERS ====================
  
  async followUser(targetUserId: string): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('followers')
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
        });

      if (error) {
        throw error;
      }

      console.log('User followed:', targetUserId);
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  },

  async unfollowUser(targetUserId: string): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

      if (error) {
        throw error;
      }

      console.log('User unfollowed:', targetUserId);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  },

  async getFollowers(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('followers')
        .select(`
          follower_id,
          profiles:follower_id (username, display_name, avatar_url)
        `)
        .eq('following_id', userId);

      if (error) {
        console.error('Error fetching followers:', error);
        return [];
      }

      console.log('Followers fetched from Supabase:', data?.length);
      return data || [];
    } catch (error) {
      console.error('Error in getFollowers:', error);
      return [];
    }
  },

  async getFollowing(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('followers')
        .select(`
          following_id,
          profiles:following_id (username, display_name, avatar_url)
        `)
        .eq('follower_id', userId);

      if (error) {
        console.error('Error fetching following:', error);
        return [];
      }

      console.log('Following fetched from Supabase:', data?.length);
      return data || [];
    } catch (error) {
      console.error('Error in getFollowing:', error);
      return [];
    }
  },

  // ==================== BADGES ====================
  
  async getBadges(userId?: string): Promise<Badge[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!targetUserId) {
        console.error('No user ID provided');
        return [];
      }

      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', targetUserId)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error fetching badges:', error);
        return [];
      }

      console.log('Badges fetched from Supabase:', data?.length);
      return data as Badge[];
    } catch (error) {
      console.error('Error in getBadges:', error);
      return [];
    }
  },

  async awardBadge(badge: Badge): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('badges')
        .insert({
          user_id: user.id,
          badge_id: badge.id,
          badge_name: badge.name,
          badge_description: badge.description,
          badge_icon: badge.icon,
          earned_at: badge.earnedAt,
        });

      if (error) {
        throw error;
      }

      console.log('Badge awarded in Supabase:', badge.name);
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw error;
    }
  },

  // ==================== FILE UPLOAD ====================
  
  async uploadAvatar(file: File | Blob, userId: string): Promise<string> {
    try {
      const fileExt = 'jpg';
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Avatar uploaded to Supabase:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },
};
