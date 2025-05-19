
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Heart, MessageCircle, Calendar } from "lucide-react";

interface ToolCategory {
  id: string;
  name: string;
  icon: JSX.Element;
  items: ToolItem[];
}

interface ToolItem {
  id: string;
  title: string;
  description: string;
  content?: string[];
}

const toolCategories: ToolCategory[] = [
  {
    id: "conversations",
    name: "Conversation Starters",
    icon: <MessageCircle className="h-5 w-5" />,
    items: [
      {
        id: "deep",
        title: "Deep Connection",
        description: "Questions that foster emotional intimacy",
        content: [
          "What makes you feel most loved in our relationship?",
          "When was a moment you felt particularly proud of us as a couple?",
          "What's something you've always wanted to try together?",
          "How do you think we've grown together since we first met?",
          "What's one thing I do that makes you feel especially appreciated?"
        ]
      },
      {
        id: "fun",
        title: "Fun & Playful",
        description: "Lighthearted questions to spark joy",
        content: [
          "If we could travel anywhere tomorrow, where would you want to go?",
          "What's the most adventurous thing you'd like us to try together?",
          "If we had a theme song as a couple, what would it be?",
          "What fictional couple do you think we're most similar to?",
          "If you could have any superpower, what would it be and how would you use it?"
        ]
      },
      {
        id: "future",
        title: "Future Planning",
        description: "Questions about dreams and goals",
        content: [
          "What's one goal you'd like us to accomplish together in the next year?",
          "How do you envision our ideal life together in 5 years?",
          "What tradition would you like to establish in our relationship?",
          "What's one way we could better support each other's personal growth?",
          "If resources weren't a constraint, what would you want our life to look like?"
        ]
      }
    ]
  },
  {
    id: "activities",
    name: "Connection Activities",
    icon: <Heart className="h-5 w-5" />,
    items: [
      {
        id: "daily",
        title: "Daily Rituals",
        description: "Small moments to connect every day",
        content: [
          "6-second kiss: Share a real, 6-second kiss when greeting or saying goodbye",
          "Appreciation practice: Share one specific thing you appreciate about each other daily",
          "Screen-free time: Spend 30 minutes each day without digital devices, focusing only on each other",
          "Check-in ritual: Take 10 minutes to share your highs and lows of the day",
          "Synchronized breathing: Spend 2 minutes face-to-face, synchronizing your breath"
        ]
      },
      {
        id: "weekly",
        title: "Weekly Experiences",
        description: "Activities to deepen your connection",
        content: [
          "Partner-led date: Take turns planning a surprise date for each other",
          "New experience challenge: Try something neither of you has done before",
          "Memory lane: Look through old photos or videos of your relationship",
          "Skill exchange: Teach each other something you're good at",
          "Progress celebration: Acknowledge ways you've grown together recently"
        ]
      }
    ]
  },
  {
    id: "challenges",
    name: "Relationship Challenges",
    icon: <Calendar className="h-5 w-5" />,
    items: [
      {
        id: "gratitude",
        title: "7-Day Gratitude",
        description: "Express appreciation for 7 days",
        content: [
          "Day 1: Share a quality you admire in your partner",
          "Day 2: Express thanks for a way they support you",
          "Day 3: Acknowledge something thoughtful they did recently",
          "Day 4: Appreciate a strength they bring to the relationship",
          "Day 5: Thank them for a way they've helped you grow",
          "Day 6: Express gratitude for a sacrifice they've made",
          "Day 7: Share how your life is better with them in it"
        ]
      },
      {
        id: "reconnect",
        title: "Reconnection Challenge",
        description: "Rebuild closeness after distance",
        content: [
          "Day 1: Share 3 memories that make you smile when you think of your partner",
          "Day 2: Identify a challenge you've overcome together",
          "Day 3: Express a vulnerability or fear you haven't shared before",
          "Day 4: Give a genuine compliment about something non-physical",
          "Day 5: Discuss one way you'd like to grow together",
          "Day 6: Share your favorite quality about your relationship",
          "Day 7: Create a vision statement for your future together"
        ]
      }
    ]
  }
];

const Toolkit = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>(toolCategories[0].id);
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);

  const handleToolSelect = (tool: ToolItem) => {
    setSelectedTool(tool);
    toast({
      title: `${tool.title} selected`,
      description: "Scroll down to view the content",
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Relationship Toolkit
        </CardTitle>
        <CardDescription>
          Resources and activities to strengthen your connection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            {toolCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {category.icon}
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {toolCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {category.items.map((tool) => (
                  <Button
                    key={tool.id}
                    variant="outline"
                    className={`h-auto min-h-24 p-4 flex flex-col items-center justify-center text-center gap-2 rounded-xl border ${
                      selectedTool?.id === tool.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleToolSelect(tool)}
                  >
                    <div className="font-medium">{tool.title}</div>
                    <div className="text-xs text-muted-foreground">{tool.description}</div>
                  </Button>
                ))}
              </div>
              
              {selectedTool && selectedTool.content && (
                <Card className="mt-6 border-primary/20 animate-bloom">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{selectedTool.title}</CardTitle>
                    <CardDescription>{selectedTool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {selectedTool.content.map((item, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="text-primary font-bold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Toolkit;
