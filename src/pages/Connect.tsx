
import { useState } from 'react';
import { usePartner } from '@/hooks/use-partner';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConnectionTab from '@/components/connect/ConnectionTab';
import RequestsTab from '@/components/connect/RequestsTab';
import MessageArea from '@/components/connect/MessageArea';

const Connect = () => {
  const { user } = useAuth();
  const { 
    loading, 
    partnerConnections, 
    activePartner,
    messages,
    loadingMessages,
    sendPartnerRequest,
    acceptPartnerRequest,
    declinePartnerRequest,
    fetchMessages,
    sendMessage
  } = usePartner();
  const [partnerEmail, setPartnerEmail] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [typingPartner, setTypingPartner] = useState<{userId: string; displayName: string; avatarUrl?: string} | null>(null);

  // Handle partner request submission
  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerEmail.trim()) {
      sendPartnerRequest(partnerEmail);
      setPartnerEmail('');
    }
  };

  // Handle selecting a partner for messaging
  const handleSelectPartner = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    fetchMessages(partnerId);
  };

  // Handle sending a message
  const handleSendMessage = (content: string) => {
    if (selectedPartnerId) {
      sendMessage(selectedPartnerId, content);
      simulatePartnerTyping(selectedPartnerId);
    }
  };

  // Simulate partner typing (for demo purposes)
  const simulatePartnerTyping = (partnerId: string) => {
    if (partnerConnections.length > 0) {
      const partner = partnerConnections.find(conn => 
        (conn.user_id === partnerId || conn.partner_id === partnerId) && 
        conn.profile
      );
      
      if (partner && partner.profile) {
        setTypingPartner({
          userId: partnerId,
          displayName: partner.profile.display_name,
          avatarUrl: partner.profile.avatar_url || undefined
        });
        
        // Clear after 3 seconds
        setTimeout(() => setTypingPartner(null), 3000);
      }
    }
  };

  // Get pending incoming/outgoing requests
  const incomingRequests = partnerConnections.filter(
    conn => conn.partner_id === user?.id && conn.status === 'pending'
  );
  
  const outgoingRequests = partnerConnections.filter(
    conn => conn.user_id === user?.id && conn.status === 'pending'
  );
  
  // Get active connections
  const activeConnections = partnerConnections.filter(conn => conn.status === 'active');

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Connect with Your Partner</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Tabs defaultValue="connections">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connections">
              <ConnectionTab
                activeConnections={activeConnections}
                selectedPartnerId={selectedPartnerId}
                onSelectPartner={handleSelectPartner}
                onSendRequest={handleSendRequest}
                partnerEmail={partnerEmail}
                onPartnerEmailChange={(e) => setPartnerEmail(e.target.value)}
              />
            </TabsContent>
            
            <TabsContent value="requests">
              <RequestsTab
                incomingRequests={incomingRequests}
                outgoingRequests={outgoingRequests}
                onAcceptRequest={acceptPartnerRequest}
                onDeclineRequest={declinePartnerRequest}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-2">
          <MessageArea
            selectedPartnerId={selectedPartnerId}
            messages={messages}
            loadingMessages={loadingMessages}
            currentUserId={user?.id || ''}
            typingPartner={typingPartner || undefined}
            activeConnections={activeConnections}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Connect;
