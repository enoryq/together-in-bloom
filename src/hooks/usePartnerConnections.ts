
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PartnerProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface PartnerConnection {
  id: string;
  user_id: string;
  partner_id: string;
  status: 'active' | 'pending' | 'declined';
  connection_date?: string;
  created_at: string;
  profile?: PartnerProfile;
}

interface PartnerConnectionsResponse {
  id: string;
  user_id: string;
  partner_id: string;
  status: string;
  connection_date?: string;
  created_at: string;
  profile?: {
    id: string;
    display_name: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
  };
}

export function usePartnerConnections(userId: string | undefined) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [partnerConnections, setPartnerConnections] = useState<PartnerConnection[]>([]);
  const [activePartner, setActivePartner] = useState<PartnerProfile | null>(null);

  // Fetch partner connections
  const fetchPartnerConnections = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      // Get connections where the current user is the initiator
      const { data: userConnections, error: userError } = await supabase
        .from('partners')
        .select(`
          *,
          profile:profiles!partner_id(id, display_name, avatar_url, created_at, updated_at)
        `)
        .eq('user_id', userId);

      if (userError) throw userError;

      // Also get connections where the current user is the partner
      const { data: partnerConnections, error: partnerError } = await supabase
        .from('partners')
        .select(`
          *,
          profile:profiles!user_id(id, display_name, avatar_url, created_at, updated_at)
        `)
        .eq('partner_id', userId);

      if (partnerError) throw partnerError;

      // Transform the data to match the PartnerConnection type
      const allConnections: PartnerConnection[] = [
        ...(userConnections || []).map((conn: PartnerConnectionsResponse) => ({
          id: conn.id,
          user_id: conn.user_id,
          partner_id: conn.partner_id,
          status: conn.status as 'active' | 'pending' | 'declined',
          connection_date: conn.connection_date,
          created_at: conn.created_at,
          profile: conn.profile ? {
            id: conn.profile.id,
            display_name: conn.profile.display_name || '',
            avatar_url: conn.profile.avatar_url,
            created_at: conn.profile.created_at,
            updated_at: conn.profile.updated_at
          } : undefined
        })),
        ...(partnerConnections || []).map((conn: PartnerConnectionsResponse) => ({
          id: conn.id,
          user_id: conn.user_id,
          partner_id: conn.partner_id,
          status: conn.status as 'active' | 'pending' | 'declined',
          connection_date: conn.connection_date,
          created_at: conn.created_at,
          profile: conn.profile ? {
            id: conn.profile.id,
            display_name: conn.profile.display_name || '',
            avatar_url: conn.profile.avatar_url,
            created_at: conn.profile.created_at,
            updated_at: conn.profile.updated_at
          } : undefined
        }))
      ];
      
      setPartnerConnections(allConnections);

      // Set the active partner if there's an active connection
      const activeConnection = allConnections.find(conn => conn.status === 'active');
      if (activeConnection && activeConnection.profile) {
        setActivePartner(activeConnection.profile);
      }
    } catch (error: any) {
      console.error('Error fetching partner connections:', error);
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
      console.error('Error sending partner request:', error);
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
      console.error('Error accepting request:', error);
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
      console.error('Error declining request:', error);
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
