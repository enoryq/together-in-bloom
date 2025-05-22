
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, RefreshCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const prompts = [
  "What made you smile about your relationship today?",
  "Share one thing you appreciate about your partner right now.",
  "What's one way your partner made you feel supported recently?",
  "What's a quality in your partner that you admire?",
  "What's one way you could show more affection to your partner?",
  "Share a memory that makes you both laugh.",
  "What's something new you'd like to try together?",
  "What's one goal you'd like to achieve together this year?",
  "What conversation topic would you like to explore more deeply with your partner?",
  "How has your partner helped you grow as a person?",
];

const DailyPrompt = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);
  const [response, setResponse] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getNewPrompt = () => {
    // Get a different prompt than the current one
    let newPrompt;
    do {
      newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    } while (newPrompt === prompt && prompts.length > 1);
    
    setPrompt(newPrompt);
    setResponse("");
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    if (!response.trim()) return;
    
    // Here you would typically save the response to the database
    toast({
      title: "Response saved",
      description: "Your reflection has been saved and shared with your partner.",
    });
    setIsSubmitted(true);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-primary" />
            Daily Reflection
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={getNewPrompt} 
            disabled={isSubmitted}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Take a moment to reflect on your relationship</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium mb-4">{prompt}</p>
        
        {isSubmitted ? (
          <div className="bg-muted p-3 rounded-lg">
            <p className="italic text-sm">{response}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Shared with your partner • {new Date().toLocaleDateString()}
            </p>
          </div>
        ) : (
          <Textarea
            placeholder="Share your thoughts..."
            className="min-h-[100px]"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
        )}
      </CardContent>
      
      {!isSubmitted && (
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={!response.trim()}
          >
            Share with partner
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DailyPrompt;
