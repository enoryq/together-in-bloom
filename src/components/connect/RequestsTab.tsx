
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Clock } from 'lucide-react';
import { Partner, Profile } from '@/types';

interface RequestsTabProps {
  incomingRequests: Partner[];
  outgoingRequests: Partner[];
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
}

const RequestsTab = ({ 
  incomingRequests, 
  outgoingRequests, 
  onAcceptRequest, 
  onDeclineRequest 
}: RequestsTabProps) => {
  
  // Helper to extract profile from connection
  const getPartnerProfile = (connection: Partner): Profile => {
    return connection.profile as Profile;
  };
  
  return (
    <div className="space-y-6">
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
                      <Button variant="outline" size="sm" onClick={() => onAcceptRequest(request.id)}>
                        <Check className="h-4 w-4 mr-1" /> Accept
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onDeclineRequest(request.id)}>
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
    </div>
  );
};

export default RequestsTab;
