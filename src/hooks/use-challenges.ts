
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Challenge, ChallengeActivity, UserChallenge, UserChallengeProgress } from '@/types';

export function useChallenges() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<UserChallenge[]>([]);

  // Fetch all challenges (predefined and user created)
  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          activities:challenge_activities(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load challenges: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's challenges
  const fetchUserChallenges = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenge:challenge_id(*),
          progress:user_challenge_progress(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUserChallenges(data || []);
      setActiveChallenges((data || []).filter(c => c.status === 'in_progress'));
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load your challenges: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Start a challenge
  const startChallenge = async (challengeId: string) => {
    if (!user) return;
    try {
      // Check if user already started this challenge
      const { data: existingChallenge } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId)
        .maybeSingle();

      if (existingChallenge) {
        toast({
          title: "Challenge Already Started",
          description: "You have already started this challenge",
        });
        return;
      }

      // Create the user challenge entry
      const { data: userChallenge, error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          status: 'in_progress',
          current_day: 1,
          start_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Get the challenge activities for day 1
      const { data: activities } = await supabase
        .from('challenge_activities')
        .select('*')
        .eq('challenge_id', challengeId)
        .eq('day_number', 1);

      // Create progress entry for day 1
      if (activities && activities.length > 0) {
        await supabase
          .from('user_challenge_progress')
          .insert({
            user_challenge_id: userChallenge.id,
            day_number: 1,
            is_completed: false
          });
      }

      toast({
        title: "Challenge Started",
        description: "Your challenge has been started successfully!",
      });

      // Refresh user challenges
      fetchUserChallenges();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to start challenge: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Complete a challenge day
  const completeDay = async (userChallengeId: string, dayNumber: number, notes?: string) => {
    try {
      // Update the progress entry
      await supabase
        .from('user_challenge_progress')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          notes: notes || null
        })
        .eq('user_challenge_id', userChallengeId)
        .eq('day_number', dayNumber);

      // Get the challenge details
      const { data: userChallenge } = await supabase
        .from('user_challenges')
        .select('*, challenge:challenge_id(*)')
        .eq('id', userChallengeId)
        .single();

      // Check if the next day exists
      const nextDayNumber = dayNumber + 1;
      
      if (userChallenge && userChallenge.challenge && nextDayNumber <= userChallenge.challenge.duration_days) {
        // Update the user challenge to the next day
        await supabase
          .from('user_challenges')
          .update({ current_day: nextDayNumber })
          .eq('id', userChallengeId);

        // Create a progress entry for the next day
        await supabase
          .from('user_challenge_progress')
          .insert({
            user_challenge_id: userChallengeId,
            day_number: nextDayNumber,
            is_completed: false
          });
      } else if (userChallenge) {
        // This was the last day, mark the challenge as completed
        await supabase
          .from('user_challenges')
          .update({ status: 'completed' })
          .eq('id', userChallengeId);
          
        toast({
          title: "Challenge Completed!",
          description: "Congratulations on completing the challenge!",
        });
      }

      toast({
        title: "Day Completed",
        description: "You've completed today's activity!",
      });

      // Refresh user challenges
      fetchUserChallenges();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to complete day: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Create a custom challenge
  const createCustomChallenge = async (title: string, description: string, durationDays: number, activities: Partial<ChallengeActivity>[]) => {
    if (!user) return;
    try {
      // Create the challenge
      const { data: challenge, error } = await supabase
        .from('challenges')
        .insert({
          title,
          description,
          duration_days: durationDays,
          created_by: user.id,
          is_predefined: false
        })
        .select()
        .single();

      if (error) throw error;

      // Create the activities
      const challengeActivities = activities.map((activity, index) => ({
        challenge_id: challenge.id,
        day_number: index + 1,
        title: activity.title || `Day ${index + 1}`,
        description: activity.description || null
      }));

      await supabase
        .from('challenge_activities')
        .insert(challengeActivities);

      toast({
        title: "Challenge Created",
        description: "Your custom challenge has been created successfully!",
      });

      // Refresh challenges
      fetchChallenges();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create challenge: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Initial load
  useEffect(() => {
    fetchChallenges();
    if (user) {
      fetchUserChallenges();
    }
  }, [user]);

  return {
    loading,
    challenges,
    userChallenges,
    activeChallenges,
    fetchChallenges,
    fetchUserChallenges,
    startChallenge,
    completeDay,
    createCustomChallenge
  };
}
