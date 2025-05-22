
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal, Mic, Image, Smile, Paperclip } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MessageInputProps {
  partnerId: string;
  onSendMessage: (content: string) => void;
  className?: string;
}

const MessageInput = ({ partnerId, onSendMessage, className = '' }: MessageInputProps) => {
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Function to broadcast typing status
  const broadcastTypingStatus = (typing: boolean) => {
    // In a real implementation, this would use Supabase Realtime to broadcast typing status
    console.log('Broadcasting typing status:', typing);
    
    // Example with Supabase Realtime (commented out as it requires channel setup)
    /*
    const channel = supabase.channel('chat:' + partnerId);
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { typing }
    });
    */
  };
  
  // Handle typing indicator
  useEffect(() => {
    if (content && !isTyping) {
      setIsTyping(true);
      broadcastTypingStatus(true);
    }
    
    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set a new timeout
    const timeout = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        broadcastTypingStatus(false);
      }
    }, 2000); // Stop showing typing indicator after 2 seconds of inactivity
    
    setTypingTimeout(timeout);
    
    // Cleanup function
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [content]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSendMessage(content);
      setContent('');
      setIsTyping(false);
      broadcastTypingStatus(false);
      
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 relative">
        <Input
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="pr-10"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button variant="ghost" size="icon" type="button" className="h-6 w-6">
            <Smile className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
      
      <div className="flex gap-1">
        <Button variant="outline" size="icon" type="button">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button type="submit" disabled={!content.trim()}>
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
