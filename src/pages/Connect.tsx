
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConnectionTab from '@/components/connect/ConnectionTab';
import RequestsTab from '@/components/connect/RequestsTab';
import MessageArea from '@/components/connect/MessageArea';
import { usePartner } from '@/hooks/use-partner';

const Connect = () => {
  const { 
    activePartner,
    partnerConnections,
    loading,
    sendPartnerRequest,
    acceptPartnerRequest,
    declinePartnerRequest,
    messages,
    loadingMessages,
    sendMessage
  } = usePartner();

  // Filter connections by status for RequestsTab
  const pendingRequests = partnerConnections.filter(conn => conn.status === 'pending');
  const activeConnections = partnerConnections.filter(conn => conn.status === 'active');
  const declinedConnections = partnerConnections.filter(conn => conn.status === 'declined');

  // Separate incoming and outgoing requests
  const incomingRequests = pendingRequests; // For now, treating all pending as incoming
  const outgoingRequests: typeof pendingRequests = []; // We'll implement this logic later

  // Handle message sending with proper signature
  const handleSendMessage = (content: string) => {
    if (activePartner) {
      sendMessage(activePartner.id, content);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Connect with Your Partner</h1>
      <p className="text-muted-foreground mb-8">
        Build stronger relationships through shared experiences and communication.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Management */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Partner Connection</CardTitle>
              <CardDescription>
                Connect with your partner to share your relationship journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="connection" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="connection">Connection</TabsTrigger>
                  <TabsTrigger value="requests">
                    Requests ({pendingRequests.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="connection" className="space-y-4">
                  <ConnectionTab
                    activeConnections={activeConnections}
                    onSendRequest={sendPartnerRequest}
                  />
                </TabsContent>
                
                <TabsContent value="requests" className="space-y-4">
                  <RequestsTab
                    incomingRequests={incomingRequests}
                    outgoingRequests={outgoingRequests}
                    onAcceptRequest={acceptPartnerRequest}
                    onDeclineRequest={declinePartnerRequest}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        <div>
          <MessageArea
            activePartner={activePartner}
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loadingMessages}
          />
        </div>
      </div>
    </div>
  );
};

export default Connect;
