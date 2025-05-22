
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { SendHorizontal, Bot, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Types for our messages
interface Message {
  id: string;
  content: string;
  role: "assistant" | "user";
  createdAt: Date;
}

const AiCompanion = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  // Add initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your relationship companion. How can I help you today?",
        role: "assistant",
        createdAt: new Date(),
      },
    ]);
  }, []);

  // Function to send a message to the AI
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Create a user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input.trim(),
      role: "user",
      createdAt: new Date(),
    };
    
    // Add user message to the conversation
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input
    setInput("");
    
    // Focus input for next message
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    setIsLoading(true);
    
    try {
      // Call the AI Companion API
      const { data, error } = await supabase.functions.invoke('ai-companion', {
        body: {
          message: userMessage.content,
          // Send conversation history for context
          history: messages
            .slice(-10) // Limit history to last 10 messages
            .map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
        },
      });
      
      if (error) throw error;
      
      // Add the AI response to messages
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: data.response || "I'm sorry, I couldn't process your request.",
          role: "assistant",
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error calling AI Companion:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from the AI companion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-18rem)]">
      <Card className="flex-grow flex flex-col overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="flex-grow p-4">
          <div className="space-y-4 min-h-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.role === "assistant"
                      ? "bg-secondary/50 rounded-br-lg"
                      : "bg-primary/10 rounded-bl-lg"
                  } p-3 rounded-t-lg`}
                >
                  <div className="mt-1">
                    {message.role === "assistant" ? (
                      <Bot size={18} className="text-primary" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-secondary/50 p-3 rounded-lg">
                  <Loader2 size={18} className="animate-spin text-primary" />
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="mt-2 text-xs text-center text-muted-foreground">
            Your AI companion uses your conversation history to provide personalized advice.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AiCompanion;
