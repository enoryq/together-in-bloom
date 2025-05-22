
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Check } from 'lucide-react';
import { Partner, Profile } from '@/types';

interface ConnectionTabProps {
  activeConnections: Partner[];
  selectedPartnerId: string | null;
  onSelectPartner: (partnerId: string) => void;
  onSendRequest: (e: React.FormEvent) => void;
  partnerEmail: string;
  onPartnerEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConnectionTab = ({
  activeConnections,
  selectedPartnerId,
  onSelectPartner,
  onSendRequest,
  partnerEmail,
  onPartnerEmailChange
}: ConnectionTabProps) => {
  
  // Helper to extract profile from connection
  const getPartnerProfile = (connection: Partner): Profile => {
    return connection.profile as Profile;
  };
  
  return (
    <div className="space-y-4">
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
                  onClick={() => onSelectPartner(profile.id)}
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
          <form className="w-full" onSubmit={onSendRequest}>
            <div className="flex w-full gap-2">
              <Input 
                placeholder="partner@email.com" 
                value={partnerEmail}
                onChange={onPartnerEmailChange}
                className="flex-1"
              />
              <Button type="submit">Connect</Button>
            </div>
          </form>
        </CardFooter>
      </Card>
      
      <DatePlannerCard />
    </div>
  );
};

const UserPlus = ({ className }: { className?: string }) => (
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
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const DatePlannerCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-primary" />
        Date Planner
      </CardTitle>
      <CardDescription>Schedule time together</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm mb-3">
        Plan your next date or special moment together
      </p>
      <div className="bg-muted rounded p-3 mb-2">
        <p className="font-medium">Weekend Movie Night</p>
        <p className="text-sm text-muted-foreground">Saturday, 7:00 PM</p>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" size="sm" className="w-full">
        Plan New Date
      </Button>
    </CardFooter>
  </Card>
);

export default ConnectionTab;
