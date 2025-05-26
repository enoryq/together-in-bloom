
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile } from '@/types';
import { MessageSquare } from 'lucide-react';
import MessageList from '@/components/connect/MessageList';
import MessageInput from '@/components/connect/MessageInput';
import { Message } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface MessageAreaProps {
  activePartner: Profile | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  loading: boolean;
}

const MessageArea = ({
  activePartner,
  messages,
  onSendMessage,
  loading
}: MessageAreaProps) => {
  const { user } = useAuth();
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">Messages</CardTitle>
        <CardDescription>
          {activePartner 
            ? `Conversation with ${activePartner.display_name}`
            : "Connect with a partner to start messaging"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {!activePartner ? (
          <div className="h-full flex items-center justify-center text-center p-6">
            <div>
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Connect with a partner to view your conversation</p>
            </div>
          </div>
        ) : (
          <MessageList 
            messages={messages}
            currentUserId={user?.id || ''}
            loading={loading}
          />
        )}
      </CardContent>
      {activePartner && (
        <CardFooter className="border-t p-3">
          <MessageInput
            partnerId={activePartner.id}
            onSendMessage={onSendMessage}
            className="w-full"
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default MessageArea;
