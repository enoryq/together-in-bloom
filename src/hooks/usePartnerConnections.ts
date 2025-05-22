
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Partner, Profile } from '@/types';

export function usePartnerConnections(userId: string | undefined) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [partnerConnections, setPartnerConnections] = useState<Partner[]>([]);
  const [activePartner, setActivePartner] = useState<Profile | null>(null);

  // Fetch partner connections
  const fetchPartnerConnections = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      // Get connections where the current user is the initiator
      const { data: userConnections, error: userError } = await supabase
        .from('partners')
        .select('*, profile:profiles!partner_id(*)')
        .eq('user_id', userId);

      if (userError) throw userError;

      // Also get connections where the current user is the partner
      const { data: partnerConnections, error: partnerError } = await supabase
        .from('partners')
        .select('*, profile:profiles!user_id(*)')
        .eq('partner_id', userId);

      if (partnerError) throw partnerError;

      // Combine connections and transform to match Partner type
      const allConnections = [
        ...(userConnections || []).map(conn => ({
          ...conn,
          status: conn.status as 'pending' | 'active' | 'declined',
          profile: conn.profile as Profile
        })),
        ...(partnerConnections || []).map(conn => ({
          ...conn,
          status: conn.status as 'pending' | 'active' | 'declined',
          profile: conn.profile as Profile
        }))
      ];
      
      setPartnerConnections(allConnections);

      // Set the active partner if there's an active connection
      const activeConnection = allConnections.find(conn => conn.status === 'active');
      if (activeConnection && activeConnection.profile) {
        setActivePartner(activeConnection.profile);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load partner connections: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Send partner request
  const sendPartnerRequest = async (partnerEmail: string) => {
    if (!userId) return;

    try {
      // First find the user with this email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', partnerEmail)
        .maybeSingle();

      if (profileError) {
        toast({
          title: "User not found",
          description: "No user with that email address exists",
          variant: "destructive",
        });
        return;
      }

      if (!profiles) {
        toast({
          title: "User not found",
          description: "No user with that email address exists",
          variant: "destructive",
        });
        return;
      }

      const partnerId = profiles.id;

      // Check for existing connections
      const { data: existingConnection, error: connectionError } = await supabase
        .from('partners')
        .select('*')
        .or(`and(user_id.eq.${userId},partner_id.eq.${partnerId}),and(user_id.eq.${partnerId},partner_id.eq.${userId})`)
        .maybeSingle();

      if (existingConnection) {
        toast({
          title: "Connection exists",
          description: "You already have a connection with this user",
          variant: "destructive",
        });
        return;
      }

      // Create the partner connection
      const { error } = await supabase
        .from('partners')
        .insert({
          user_id: userId,
          partner_id: partnerId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Request Sent",
        description: "Partner request sent successfully",
      });

      // Refresh connections
      fetchPartnerConnections();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to send partner request: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Accept partner request
  const acceptPartnerRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({
          status: 'active',
          connection_date: new Date().toISOString()
        })
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Connected!",
        description: "You are now connected with your partner",
      });

      // Refresh connections
      fetchPartnerConnections();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to accept request: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Decline partner request
  const declinePartnerRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ status: 'declined' })
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Request Declined",
        description: "Partner request has been declined",
      });

      // Refresh connections
      fetchPartnerConnections();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to decline request: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Initial load
  useEffect(() => {
    if (userId) {
      fetchPartnerConnections();
    }
  }, [userId]);

  return {
    loading,
    partnerConnections,
    activePartner,
    fetchPartnerConnections,
    sendPartnerRequest,
    acceptPartnerRequest,
    declinePartnerRequest
  };
}
