
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const journalPrompts = [
  "What am I grateful for in my relationship today?",
  "What made me feel closer to my partner recently?",
  "When did I last feel truly connected with my partner?",
  "What challenge are we facing, and how can we overcome it?",
  "What is one thing I appreciate about the way my partner communicates?",
  "How can I better support my partner's goals?",
  "What memory with my partner brings me joy?",
  "What am I looking forward to experiencing with my partner?",
];

const Journal = () => {
  const { toast } = useToast();
  const [journalEntry, setJournalEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePromptChange = (value: string) => {
    setSelectedPrompt(value);
    if (value) {
      setJournalEntry((prev) => prev ? prev : value);
    }
  };

  const handleSubmit = () => {
    if (!journalEntry.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Journal entry saved",
        description: "Your thoughts have been recorded.",
      });
      
      // Reset form
      setJournalEntry("");
      setSelectedPrompt("");
      setIsSubmitting(false);
    }, 1000);
  };

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * journalPrompts.length);
    setSelectedPrompt(journalPrompts[randomIndex]);
    setJournalEntry(journalPrompts[randomIndex]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Relationship Journal</CardTitle>
            <CardDescription>
              Record your thoughts, feelings, and experiences
            </CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => day && setDate(day)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-grow">
            <Select value={selectedPrompt} onValueChange={handlePromptChange}>
              <SelectTrigger className="bloom-input">
                <SelectValue placeholder="Choose a journal prompt (optional)" />
              </SelectTrigger>
              <SelectContent>
                {journalPrompts.map((prompt, index) => (
                  <SelectItem key={index} value={prompt}>
                    {prompt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="bloom-btn-outline whitespace-nowrap"
            onClick={getRandomPrompt}
          >
            Random Prompt
          </Button>
        </div>
        
        <Textarea
          placeholder="Start writing your journal entry..."
          className="min-h-[200px] bloom-input"
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
        />
        
        <Button 
          onClick={handleSubmit} 
          className="w-full bloom-btn-primary"
          disabled={!journalEntry.trim() || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Journal Entry"}
        </Button>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        <p className="mx-auto">
          Regular journaling helps strengthen your relationship by increasing self-awareness
        </p>
      </CardFooter>
    </Card>
  );
};

export default Journal;
