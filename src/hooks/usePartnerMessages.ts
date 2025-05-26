
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Message, Profile } from '@/types';

export function usePartnerMessages(userId: string | undefined) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch messages with partner
  const fetchMessages = async (partnerId: string) => {
    if (!userId) return;
    setLoadingMessages(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, content, sender_id, receiver_id, read, created_at, sender:profiles!sender_id(id, display_name, avatar_url), receiver:profiles!receiver_id(id, display_name, avatar_url)')
        .or(`sender_id.eq.${userId}.and.receiver_id.eq.${partnerId},sender_id.eq.${partnerId}.and.receiver_id.eq.${userId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform data to ensure it matches the Message type
      const typedMessages = (data || []).map(msg => ({
        ...msg,
        sender: msg.sender as Profile,
        receiver: msg.receiver as Profile
      }));

      setMessages(typedMessages);

      // Mark messages as read
      const unreadMessages = typedMessages.filter(msg => msg.receiver_id === userId && !msg.read) || [];
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
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
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

  return {
    messages,
    loadingMessages,
    fetchMessages,
    sendMessage
  };
}
