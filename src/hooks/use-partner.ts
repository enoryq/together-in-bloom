
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Partner, Profile, Message } from '@/types';

export function usePartner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [partnerConnections, setPartnerConnections] = useState<Partner[]>([]);
  const [activePartner, setActivePartner] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch partner connections
  const fetchPartnerConnections = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('partners')
        .select(`
          *,
          profile:partner_id(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Also get connections where the current user is the partner
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select(`
          *,
          profile:user_id(*)
        `)
        .eq('partner_id', user.id);

      if (partnerError) throw partnerError;

      const allConnections = [...(data || []), ...(partnerData || [])];
      setPartnerConnections(allConnections);

      // Set the active partner if there's an active connection
      const activeConnection = allConnections.find(conn => conn.status === 'active');
      if (activeConnection) {
        setActivePartner(activeConnection.profile as Profile);
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
    if (!user) return;

    try {
      // First find the user with this email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', partnerEmail)
        .single();

      if (profileError) {
        toast({
          title: "User not found",
          description: "No user with that email address exists",
          variant: "destructive",
        });
        return;
      }

      const partnerId = profiles.id;

      // Check if a connection already exists
      const { data: existingConnection, error: connectionError } = await supabase
        .from('partners')
        .select('*')
        .or(`and(user_id.eq.${user.id},partner_id.eq.${partnerId}),and(user_id.eq.${partnerId},partner_id.eq.${user.id})`)
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
          user_id: user.id,
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

  // Fetch messages with partner
  const fetchMessages = async (partnerId: string) => {
    if (!user) return;
    setLoadingMessages(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(*),
          receiver:receiver_id(*)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      // Mark messages as read
      const unreadMessages = data?.filter(msg => msg.receiver_id === user.id && !msg.read) || [];
      if (unreadMessages.length > 0) {
        const unreadIds = unreadMessages.map(msg => msg.id);
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadIds);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load messages: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send message to partner
  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content
        });

      if (error) throw error;

      // Refresh messages
      fetchMessages(receiverId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchPartnerConnections();
    }
  }, [user]);

  return {
    loading,
    partnerConnections,
    activePartner,
    messages,
    loadingMessages,
    fetchPartnerConnections,
    sendPartnerRequest,
    acceptPartnerRequest,
    declinePartnerRequest,
    fetchMessages,
    sendMessage
  };
}
