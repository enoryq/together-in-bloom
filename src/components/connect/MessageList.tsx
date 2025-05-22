
import { useEffect, useRef } from 'react';
import { Message, Profile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  loading: boolean;
  typingIndicator?: { userId: string; displayName: string; avatarUrl?: string };
}

const MessageList = ({ messages, currentUserId, loading, typingIndicator }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingIndicator]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <p>Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-center p-6">
        <div>
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No messages yet. Send the first one!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-[400px] overflow-y-auto pr-2">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === currentUserId;
        const sender = message.sender as Profile;
        
        return (
          <div 
            key={message.id} 
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            {!isCurrentUser && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={sender?.avatar_url || ''} />
                <AvatarFallback>{sender?.display_name?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
            )}
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
      
      {/* Typing indicator */}
      {typingIndicator && (
        <div className="flex justify-start">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={typingIndicator.avatarUrl || ''} />
            <AvatarFallback>{typingIndicator.displayName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="bg-muted p-3 rounded-lg rounded-bl-none">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '600ms' }} />
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
