
import { supabase } from './supabase';
import { UserProfile, Round, Badge } from '@/types/golf';
import { CourseRating } from '@/types/rating';
import { FeedEvent, FeedComment } from '@/types/social';

// ============================================
// PROFILE OPERATIONS
// ============================================

const saveProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
  console.log('SupabaseStorage.saveProfile: Starting profile save with data:', {
    username: profileData.username,
    displayName: profileData.displayName,
    has_bio: !!profileData.bio,
    has_avatar: !!profileData.avatarUrl,
  });
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('SupabaseStorage.saveProfile: Error getting current user:', userError);
    throw new Error('Failed to get authenticated user');
  }
  
  if (!user) {
    console.error('SupabaseStorage.saveProfile: No authenticated user');
    throw new Error('No authenticated user');
  }

  console.log('SupabaseStorage.saveProfile: Authenticated user ID:', user.id);

  // Prepare profile data
  const profile = {
    user_id: user.id,
    username: profileData.username,
    display_name: profileData.displayName || profileData.username,
    bio: profileData.bio || null,
    handicap: profileData.handicap || null,
    phone_number: profileData.phoneNumber || null,
    avatar_url: profileData.avatarUrl || null,
    updated_at: new Date().toISOString(),
  };

  console.log('SupabaseStorage.saveProfile: Upserting profile to database');
  
  // Use upsert to handle both insert and update cases
  // The trigger might have already created a profile, so we update it
  const { error } = await supabase
    .from('profiles')
    .upsert(profile, { 
      onConflict: 'user_id',
      ignoreDuplicates: false 
    });

  if (error) {
    console.error('SupabaseStorage.saveProfile: Error saving profile:', error.message, error.details, error.hint);
    throw error;
  }

  console.log('SupabaseStorage.saveProfile: Profile saved successfully');
};

const getProfile = async (userId?: string): Promise<UserProfile | null> => {
  console.log('SupabaseStorage.getProfile: Starting profile fetch for user:', userId || 'current user');
  
  let targetUserId = userId;
  
  if (!targetUserId) {
    console.log('SupabaseStorage.getProfile: No userId provided, getting current user');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('SupabaseStorage.getProfile: Error getting current user:', userError);
      return null;
    }
    
    if (!user) {
      console.error('SupabaseStorage.getProfile: No authenticated user found');
      return null;
    }
    
    targetUserId = user.id;
    console.log('SupabaseStorage.getProfile: Current user ID:', targetUserId);
  }

  console.log('SupabaseStorage.getProfile: Querying profiles table for user_id:', targetUserId);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', targetUserId)
    .maybeSingle();

  if (error) {
    console.error('SupabaseStorage.getProfile: Error fetching profile:', error.message, error.details, error.hint);
    return null;
  }

  if (!data) {
    console.log('SupabaseStorage.getProfile: No profile found in database - this is normal for new users');
    return null;
  }

  console.log('SupabaseStorage.getProfile: Profile data retrieved:', {
    username: data.username,
    display_name: data.display_name,
    has_bio: !!data.bio,
    has_avatar: !!data.avatar_url,
  });

  // Map database fields to UserProfile interface
  const profile: UserProfile = {
    username: data.username,
    displayName: data.display_name || data.username,
    email: '', // Email is stored in auth.users, not profiles
    phoneNumber: data.phone_number || '',
    bio: data.bio || undefined,
    handicap: data.handicap ? parseFloat(data.handicap) : undefined,
    avatarUrl: data.avatar_url || undefined,
    totalRounds: 0, // Will be calculated from rounds table
    totalCourses: 0, // Will be calculated from rounds table
    contactsSynced: false,
  };

  console.log('SupabaseStorage.getProfile: Profile mapped successfully');
  return profile;
};

// ============================================
// ROUND OPERATIONS
// ============================================

const saveRound = async (roundData: Omit<Round, 'id'>): Promise<void> => {
  console.log('Saving round to Supabase:', roundData);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No authenticated user');
  }

  const round = {
    user_id: user.id,
    course_id: roundData.courseId,
    course_name: roundData.courseName,
    course_location: roundData.courseLocation,
    date_played: roundData.datePlayed,
    score: roundData.score || null,
    tee_box: roundData.teeBox || null,
    yardage: roundData.yardage || null,
    review: roundData.review || null,
  };

  const { error } = await supabase
    .from('rounds')
    .insert(round);

  if (error) {
    console.error('Error saving round:', error);
    throw error;
  }

  console.log('Round saved successfully');
};

const getRounds = async (userId?: string): Promise<Round[]> => {
  console.log('Fetching rounds from Supabase');
  
  let targetUserId = userId;
  
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user');
      return [];
    }
    targetUserId = user.id;
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

  const rounds: Round[] = (data || []).map((row: any) => ({
    id: row.id,
    courseId: row.course_id,
    courseName: row.course_name,
    courseLocation: row.course_location,
    datePlayed: row.date_played,
    score: row.score,
    teeBox: row.tee_box,
    yardage: row.yardage,
    review: row.review,
  }));

  console.log(`Fetched ${rounds.length} rounds`);
  return rounds;
};

// ============================================
// RATING OPERATIONS
// ============================================

const saveRating = async (ratingData: CourseRating): Promise<void> => {
  console.log('Saving rating to Supabase:', ratingData);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No authenticated user');
  }

  const rating = {
    user_id: user.id,
    course_id: ratingData.courseId,
    course_name: ratingData.courseName,
    course_location: ratingData.courseLocation,
    play_again_response: ratingData.playAgainResponse || null,
    comparison_wins: ratingData.comparisonWins || 0,
    comparison_losses: ratingData.comparisonLosses || 0,
    compared_course_ids: ratingData.comparedCourseIds || [],
    rank_position: ratingData.rankPosition || null,
    total_courses: ratingData.totalCourses || null,
    final_score: ratingData.finalScore || null,
    play_count: ratingData.playCount || 1,
  };

  const { error } = await supabase
    .from('ratings')
    .upsert(rating, { 
      onConflict: 'user_id,course_id',
      ignoreDuplicates: false 
    });

  if (error) {
    console.error('Error saving rating:', error);
    throw error;
  }

  console.log('Rating saved successfully');
};

const getRatings = async (userId?: string): Promise<CourseRating[]> => {
  console.log('Fetching ratings from Supabase');
  
  let targetUserId = userId;
  
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user');
      return [];
    }
    targetUserId = user.id;
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

  const ratings: CourseRating[] = (data || []).map((row: any) => ({
    courseId: row.course_id,
    courseName: row.course_name,
    courseLocation: row.course_location,
    playAgainResponse: row.play_again_response,
    comparisonWins: row.comparison_wins || 0,
    comparisonLosses: row.comparison_losses || 0,
    comparedCourseIds: row.compared_course_ids || [],
    rankPosition: row.rank_position,
    totalCourses: row.total_courses,
    finalScore: row.final_score ? parseFloat(row.final_score) : undefined,
    playCount: row.play_count || 1,
  }));

  console.log(`Fetched ${ratings.length} ratings`);
  return ratings;
};

// ============================================
// SOCIAL FEED OPERATIONS
// ============================================

const saveFeedEvent = async (eventData: Omit<FeedEvent, 'id' | 'timestamp'>): Promise<void> => {
  console.log('Saving feed event to Supabase:', eventData);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No authenticated user');
  }

  const event = {
    user_id: user.id,
    event_type: eventData.type,
    course_id: eventData.courseId || null,
    course_name: eventData.courseName || null,
    course_location: eventData.courseLocation || null,
    round_id: eventData.roundId || null,
    rating: eventData.rating ? parseFloat(eventData.rating.toString()) : null,
    score: eventData.score || null,
    photo_url: eventData.photoUrl || null,
    comment: eventData.comment || null,
    likes_count: 0,
    comments_count: 0,
  };

  const { error } = await supabase
    .from('feed_events')
    .insert(event);

  if (error) {
    console.error('Error saving feed event:', error);
    throw error;
  }

  console.log('Feed event saved successfully');
};

const getFeedEvents = async (): Promise<FeedEvent[]> => {
  console.log('Fetching feed events from Supabase');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('No authenticated user');
    return [];
  }

  // Get feed events from followed users and self
  const { data, error } = await supabase
    .from('feed_events')
    .select(`
      *,
      profiles:user_id (username, display_name, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching feed events:', error);
    return [];
  }

  const events: FeedEvent[] = (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    username: row.profiles?.username || 'Unknown',
    displayName: row.profiles?.display_name || row.profiles?.username || 'Unknown',
    avatarUrl: row.profiles?.avatar_url,
    type: row.event_type,
    courseId: row.course_id,
    courseName: row.course_name,
    courseLocation: row.course_location,
    roundId: row.round_id,
    rating: row.rating ? parseFloat(row.rating) : undefined,
    score: row.score,
    photoUrl: row.photo_url,
    comment: row.comment,
    timestamp: new Date(row.created_at),
    likes: [], // Changed from number to array to match FeedEvent type
    comments: [],
  }));

  console.log(`Fetched ${events.length} feed events`);
  return events;
};

// ============================================
// BADGE OPERATIONS
// ============================================

const saveBadge = async (badgeData: Omit<Badge, 'earnedAt'>): Promise<void> => {
  console.log('Saving badge to Supabase:', badgeData);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No authenticated user');
  }

  const badge = {
    user_id: user.id,
    badge_id: badgeData.id,
    badge_name: badgeData.name,
    badge_description: badgeData.description,
    badge_icon: badgeData.icon,
  };

  const { error } = await supabase
    .from('badges')
    .insert(badge);

  if (error) {
    console.error('Error saving badge:', error);
    throw error;
  }

  console.log('Badge saved successfully');
};

const getBadges = async (userId?: string): Promise<Badge[]> => {
  console.log('Fetching badges from Supabase');
  
  let targetUserId = userId;
  
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user');
      return [];
    }
    targetUserId = user.id;
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

  const badges: Badge[] = (data || []).map((row: any) => ({
    id: row.badge_id,
    name: row.badge_name,
    description: row.badge_description,
    icon: row.badge_icon,
    earnedAt: new Date(row.earned_at),
  }));

  console.log(`Fetched ${badges.length} badges`);
  return badges;
};

// ============================================
// SOCIAL OPERATIONS
// ============================================

const followUser = async (userId: string): Promise<void> => {
  console.log('Following user in Supabase:', userId);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No authenticated user');
  }

  const { error } = await supabase
    .from('followers')
    .insert({
      follower_id: user.id,
      following_id: userId,
    });

  if (error) {
    console.error('Error following user:', error);
    throw error;
  }

  console.log('User followed successfully');
};

const unfollowUser = async (userId: string): Promise<void> => {
  console.log('Unfollowing user in Supabase:', userId);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No authenticated user');
  }

  const { error } = await supabase
    .from('followers')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', userId);

  if (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }

  console.log('User unfollowed successfully');
};

const createFeedEvent = async (event: Omit<FeedEvent, 'id' | 'timestamp'>): Promise<void> => {
  await saveFeedEvent(event);
};

const likeFeedEvent = async (eventId: string): Promise<void> => {
  console.log('Liking feed event in Supabase:', eventId);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No authenticated user');
  }

  // Call the increment_likes function
  const { error } = await supabase.rpc('increment_likes', { event_id: eventId });

  if (error) {
    console.error('Error liking feed event:', error);
    throw error;
  }

  console.log('Feed event liked successfully');
};

// ============================================
// EXPORT ALL OPERATIONS AS A SERVICE
// ============================================

export const SupabaseStorageService = {
  // Profile operations
  saveProfile,
  getProfile,
  
  // Round operations
  saveRound,
  getRounds,
  updateRound: async (roundId: string, updatedRound: Round): Promise<void> => {
    console.log('Updating round in Supabase:', roundId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    const round = {
      course_id: updatedRound.courseId,
      course_name: updatedRound.courseName,
      course_location: updatedRound.courseLocation,
      date_played: updatedRound.datePlayed,
      score: updatedRound.score || null,
      tee_box: updatedRound.teeBox || null,
      yardage: updatedRound.yardage || null,
      review: updatedRound.review || null,
    };

    const { error } = await supabase
      .from('rounds')
      .update(round)
      .eq('id', roundId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating round:', error);
      throw error;
    }

    console.log('Round updated successfully');
  },
  
  deleteRound: async (roundId: string): Promise<void> => {
    console.log('Deleting round from Supabase:', roundId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    const { error } = await supabase
      .from('rounds')
      .delete()
      .eq('id', roundId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting round:', error);
      throw error;
    }

    console.log('Round deleted successfully');
  },
  
  // Rating operations
  saveRating,
  getRatings,
  
  // Social feed operations
  saveFeedEvent,
  getFeedEvents,
  createFeedEvent,
  likeFeedEvent,
  
  // Social operations
  followUser,
  unfollowUser,
  
  // Badge operations
  awardBadge: saveBadge,
  getBadges,
};
