
import { useAuth } from '@/contexts/AuthContext';
import { usePartnerConnections } from './usePartnerConnections';
import { usePartnerMessages } from './usePartnerMessages';

export function usePartner() {
  const { user } = useAuth();
  
  const {
    loading,
    partnerConnections,
    activePartner,
    fetchPartnerConnections,
    sendPartnerRequest,
    acceptPartnerRequest,
    declinePartnerRequest
  } = usePartnerConnections(user?.id);

  const {
    messages,
    loadingMessages,
    fetchMessages,
    sendMessage
  } = usePartnerMessages(user?.id);

  return {
    // Partner connection related
    loading,
    partnerConnections,
    activePartner,
    fetchPartnerConnections,
    sendPartnerRequest,
    acceptPartnerRequest,
    declinePartnerRequest,
    
    // Message related
    messages,
    loadingMessages,
    fetchMessages,
    sendMessage
  };
}
