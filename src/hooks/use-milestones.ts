
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Milestone } from '@/types';

export function useMilestones() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [upcomingMilestones, setUpcomingMilestones] = useState<Milestone[]>([]);

  // Fetch user's milestones
  const fetchMilestones = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      
      setMilestones(data || []);
      
      // Calculate upcoming milestones (next 30 days)
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      
      const upcoming = (data || []).filter(milestone => {
        const milestoneDate = new Date(milestone.date);
        return milestoneDate >= today && milestoneDate <= thirtyDaysFromNow;
      });
      
      setUpcomingMilestones(upcoming);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load milestones: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a milestone
  const addMilestone = async (milestone: Partial<Milestone>) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('milestones')
        .insert({
          user_id: user.id,
          title: milestone.title,
          date: milestone.date,
          description: milestone.description || null,
          type: milestone.type || 'custom',
          is_recurring: milestone.is_recurring || false
        });

      if (error) throw error;

      toast({
        title: "Milestone Added",
        description: "Your milestone has been added successfully!",
      });

      // Refresh milestones
      fetchMilestones();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to add milestone: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Delete a milestone
  const deleteMilestone = async (id: string) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Milestone Deleted",
        description: "Milestone has been removed successfully",
      });

      // Refresh milestones
      fetchMilestones();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete milestone: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchMilestones();
    }
  }, [user]);

  return {
    loading,
    milestones,
    upcomingMilestones,
    fetchMilestones,
    addMilestone,
    deleteMilestone
  };
}
