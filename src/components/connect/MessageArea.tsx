
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile } from '@/types';
import { MessageSquare } from 'lucide-react';
import MessageList from '@/components/connect/MessageList';
import MessageInput from '@/components/connect/MessageInput';
import { Message } from '@/types';

interface MessageAreaProps {
  selectedPartnerId: string | null;
  messages: Message[];
  loadingMessages: boolean;
  currentUserId: string;
  typingPartner?: { userId: string; displayName: string; avatarUrl?: string };
  activeConnections: any[];
  onSendMessage: (content: string) => void;
}

const MessageArea = ({
  selectedPartnerId,
  messages,
  loadingMessages,
  currentUserId,
  typingPartner,
  activeConnections,
  onSendMessage
}: MessageAreaProps) => {
  // Get partner display name if one is selected
  const partnerName = selectedPartnerId 
    ? activeConnections.find(conn => 
        conn.profile?.id === selectedPartnerId)?.profile?.display_name
    : '';
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">Messages</CardTitle>
        <CardDescription>
          {selectedPartnerId 
            ? `Conversation with ${partnerName}`
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
        ) : (
          <MessageList 
            messages={messages}
            currentUserId={currentUserId}
            loading={loadingMessages}
            typingIndicator={typingPartner?.userId === selectedPartnerId ? typingPartner : undefined}
          />
        )}
      </CardContent>
      {selectedPartnerId && (
        <CardFooter className="border-t p-3">
          <MessageInput
            partnerId={selectedPartnerId}
            onSendMessage={onSendMessage}
            className="w-full"
          />
        </CardFooter>
      )}
    </Card>
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

export default MessageArea;
