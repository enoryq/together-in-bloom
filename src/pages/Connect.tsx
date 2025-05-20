
import { useState } from 'react';
import { usePartner } from '@/hooks/use-partner';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Partner, Profile, Message } from '@/types';
import { SendHorizonal, UserPlus, UserCheck, Clock, Check, X } from 'lucide-react';

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
  const [messageContent, setMessageContent] = useState('');

  // Helper to extract profile from connection
  const getPartnerProfile = (connection: Partner): Profile => {
    return connection.profile as Profile;
  };

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
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPartnerId && messageContent.trim()) {
      sendMessage(selectedPartnerId, messageContent);
      setMessageContent('');
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
            
            <TabsContent value="connections" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Your Partner</CardTitle>
                  <CardDescription>
                    {activeConnections.length > 0 
                      ? "Message your connected partner" 
                      : "You don't have any active connections yet"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeConnections.length === 0 ? (
                    <div className="text-center py-6">
                      <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Send a connection request to get started</p>
                    </div>
                  ) : (
                    activeConnections.map(connection => {
                      const profile = getPartnerProfile(connection);
                      const isSelected = selectedPartnerId === profile.id;
                      
                      return (
                        <div 
                          key={connection.id} 
                          className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${
                            isSelected ? 'bg-primary/10' : 'hover:bg-muted'
                          }`}
                          onClick={() => handleSelectPartner(profile.id)}
                        >
                          <Avatar>
                            <AvatarImage src={profile.avatar_url || ''} />
                            <AvatarFallback>{profile.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{profile.display_name}</p>
                            <p className="text-sm text-muted-foreground">Connected</p>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </div>
                      );
                    })
                  )}
                </CardContent>
                <CardFooter>
                  <form className="w-full" onSubmit={handleSendRequest}>
                    <div className="flex w-full gap-2">
                      <Input 
                        placeholder="partner@email.com" 
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit">Connect</Button>
                    </div>
                  </form>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="requests" className="space-y-6">
              {/* Incoming Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Incoming Requests</CardTitle>
                  <CardDescription>
                    People who want to connect with you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {incomingRequests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No pending requests</p>
                  ) : (
                    <div className="space-y-3">
                      {incomingRequests.map(request => {
                        const profile = getPartnerProfile(request);
                        
                        return (
                          <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={profile.avatar_url || ''} />
                                <AvatarFallback>{profile.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{profile.display_name}</p>
                                <p className="text-sm text-muted-foreground">Wants to connect</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => acceptPartnerRequest(request.id)}>
                                <Check className="h-4 w-4 mr-1" /> Accept
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => declinePartnerRequest(request.id)}>
                                <X className="h-4 w-4 mr-1" /> Decline
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Outgoing Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Sent Requests</CardTitle>
                  <CardDescription>
                    Pending connection requests you've sent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {outgoingRequests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No pending requests</p>
                  ) : (
                    <div className="space-y-3">
                      {outgoingRequests.map(request => {
                        const profile = getPartnerProfile(request);
                        
                        return (
                          <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={profile.avatar_url || ''} />
                                <AvatarFallback>{profile.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{profile.display_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  Awaiting response
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">Messages</CardTitle>
              <CardDescription>
                {selectedPartnerId 
                  ? `Conversation with ${activeConnections.find(conn => 
                      getPartnerProfile(conn).id === selectedPartnerId)?.profile?.display_name}`
                  : "Select a partner to start messaging"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              {!selectedPartnerId ? (
                <div className="h-full flex items-center justify-center text-center p-6">
                  <div>
                    <MessageSquareHeart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Select a partner to view your conversation</p>
                  </div>
                </div>
              ) : loadingMessages ? (
                <div className="h-full flex items-center justify-center p-6">
                  <p>Loading messages...</p>
                </div>
              ) : (
                <div className="h-[400px] overflow-y-auto pr-2">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-6">
                      <div>
                        <MessageSquareHeart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No messages yet. Send the first one!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(message => {
                        const isCurrentUser = message.sender_id === user?.id;
                        
                        return (
                          <div 
                            key={message.id} 
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[70%] p-3 rounded-lg text-sm ${
                                isCurrentUser 
                                  ? 'bg-primary text-primary-foreground rounded-br-none' 
                                  : 'bg-muted rounded-bl-none'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            {selectedPartnerId && (
              <CardFooter className="border-t p-3">
                <form className="w-full" onSubmit={handleSendMessage}>
                  <div className="flex w-full gap-2">
                    <Input 
                      placeholder="Type your message..." 
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!messageContent.trim()}>
                      <SendHorizonal className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

const MessageSquareHeart = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M14.8 7.5a1 1 0 0 0-1.4 0l-1.9 2-1.9-2a1 1 0 1 0-1.4 1.4l1.9 2-1.9 2a1 1 0 0 0 1.4 1.4l1.9-2 1.9 2a1 1 0 0 0 1.4-1.4l-1.9-2 1.9-2a1 1 0 0 0 0-1.4z" />
  </svg>
);

export default Connect;
