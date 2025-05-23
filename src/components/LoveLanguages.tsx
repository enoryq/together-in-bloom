import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

// Love Language types
type LoveLanguage = 'words' | 'service' | 'gifts' | 'time' | 'touch';

interface LoveLanguageScore {
  words: number;
  service: number;
  gifts: number;
  time: number;
  touch: number;
}

interface LoveAction {
  id?: string;
  user_id: string;
  language: LoveLanguage;
  description: string;
  completed: boolean;
  created_at?: string;
}

// Function to get suggestions based on love language
const getSuggestions = (language: LoveLanguage): string[] => {
  const suggestions = {
    words: [
      "Write a heartfelt note expressing your appreciation",
      "Send an unexpected text message with compliments",
      "Tell them specifically what you love about them",
      "Share how they've impacted your life positively",
      "Leave sticky notes with encouraging words"
    ],
    service: [
      "Take over a chore they usually do",
      "Prepare their favorite meal",
      "Run an errand they've been putting off",
      "Fix something in the house that needs attention",
      "Make their coffee/tea just how they like it"
    ],
    gifts: [
      "Get them something small that shows you listened",
      "Find an item related to their hobby or interest",
      "Create a handmade gift with personal meaning",
      "Surprise them with their favorite treat",
      "Give them something practical they've mentioned needing"
    ],
    time: [
      "Plan a date night focused on their interests",
      "Set aside distraction-free time to talk",
      "Do their favorite activity together",
      "Take a walk and be fully present",
      "Create a ritual of connection daily"
    ],
    touch: [
      "Offer a massage after a long day",
      "Hold hands while walking",
      "Sit close during movies or TV time",
      "Give a long, meaningful hug",
      "Initiate non-sexual physical affection regularly"
    ]
  };
  
  return suggestions[language];
};

const languageColors = {
  words: "#FF6384",
  service: "#36A2EB",
  gifts: "#FFCE56",
  time: "#4BC0C0",
  touch: "#9966FF"
};

const languageLabels = {
  words: "Words of Affirmation",
  service: "Acts of Service",
  gifts: "Receiving Gifts",
  time: "Quality Time",
  touch: "Physical Touch"
};

const questions = [
  {
    id: 1,
    text: "I feel most loved when someone...",
    options: [
      { language: 'words', text: "Tells me they appreciate me" },
      { language: 'service', text: "Does something helpful for me" },
      { language: 'gifts', text: "Gives me a thoughtful gift" },
      { language: 'time', text: "Spends quality time with me" },
      { language: 'touch', text: "Gives me a hug or holds my hand" }
    ]
  },
  {
    id: 2,
    text: "When I'm having a bad day, what helps most is...",
    options: [
      { language: 'words', text: "Hearing words of encouragement" },
      { language: 'touch', text: "Getting a comforting hug" },
      { language: 'time', text: "Someone sitting with me" },
      { language: 'gifts', text: "Receiving a small gift to cheer me up" },
      { language: 'service', text: "Someone helping with my responsibilities" }
    ]
  },
  {
    id: 3,
    text: "I feel most connected to others when...",
    options: [
      { language: 'time', text: "We spend uninterrupted time together" },
      { language: 'words', text: "We have deep conversations" },
      { language: 'service', text: "They offer to help me with tasks" },
      { language: 'touch', text: "We share physical closeness" },
      { language: 'gifts', text: "We exchange meaningful items" }
    ]
  },
  {
    id: 4,
    text: "I know someone cares when they...",
    options: [
      { language: 'service', text: "Go out of their way to help me" },
      { language: 'gifts', text: "Remember special occasions with gifts" },
      { language: 'words', text: "Express their feelings verbally" },
      { language: 'touch', text: "Show affection physically" },
      { language: 'time', text: "Make time for me despite being busy" }
    ]
  },
  {
    id: 5,
    text: "What makes me feel most appreciated is...",
    options: [
      { language: 'gifts', text: "Receiving a thoughtful present" },
      { language: 'touch', text: "Getting a pat on the back or a hug" },
      { language: 'time', text: "Having someone's full attention" },
      { language: 'words', text: "Hearing specific compliments" },
      { language: 'service', text: "When someone helps without being asked" }
    ]
  }
];

const LoveLanguages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<LoveLanguageScore>({
    words: 0,
    service: 0,
    gifts: 0,
    time: 0,
    touch: 0
  });
  const [quizComplete, setQuizComplete] = useState(false);
  const [partnerScores, setPartnerScores] = useState<LoveLanguageScore | null>(null);
  const [hasPartner, setHasPartner] = useState(false);
  const [loveActions, setLoveActions] = useState<LoveAction[]>([]);
  const [newActionDescription, setNewActionDescription] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<LoveLanguage>("words");

  const totalQuestions = questions.length;
  const progress = ((currentQuestion) / totalQuestions) * 100;

  // Helper function to validate and convert Json to LoveLanguageScore
  const validateLoveLanguageScore = (data: any): LoveLanguageScore | null => {
    if (!data || typeof data !== 'object') return null;
    
    const requiredKeys: (keyof LoveLanguageScore)[] = ['words', 'service', 'gifts', 'time', 'touch'];
    
    for (const key of requiredKeys) {
      if (typeof data[key] !== 'number') return null;
    }
    
    return {
      words: data.words,
      service: data.service,
      gifts: data.gifts,
      time: data.time,
      touch: data.touch
    };
  };

  useEffect(() => {
    // Try to load saved results if quiz is complete
    const loadSavedResults = async () => {
      if (!user) return;

      try {
        // Check if user has love language data
        const { data: languageData, error: languageError } = await supabase
          .from("profiles")
          .select("love_languages")
          .eq("id", user.id)
          .maybeSingle();

        if (languageData?.love_languages) {
          const validatedScores = validateLoveLanguageScore(languageData.love_languages);
          if (validatedScores) {
            setScores(validatedScores);
            setQuizComplete(true);
          }
        }

        // Check if user has a partner
        const { data: partnerData, error: partnerError } = await supabase
          .from("partners")
          .select("partner_id")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (partnerData?.partner_id) {
          setHasPartner(true);
          // Get partner's love language data
          const { data: partnerLanguageData } = await supabase
            .from("profiles")
            .select("love_languages")
            .eq("id", partnerData.partner_id)
            .maybeSingle();

          if (partnerLanguageData?.love_languages) {
            const validatedPartnerScores = validateLoveLanguageScore(partnerLanguageData.love_languages);
            if (validatedPartnerScores) {
              setPartnerScores(validatedPartnerScores);
            }
          }
        }

        // Load love actions
        const { data: actionsData } = await supabase
          .from("love_actions")
          .select("*")
          .eq("user_id", user.id);

        if (actionsData) {
          setLoveActions(actionsData as LoveAction[]);
        }
      } catch (error) {
        console.error("Error loading love language data:", error);
      }
    };

    loadSavedResults();
  }, [user]);

  const handleAnswer = (language: LoveLanguage) => {
    const updatedScores = { ...scores };
    updatedScores[language] += 1;
    setScores(updatedScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete
      setQuizComplete(true);
      saveResults(updatedScores);
    }
  };

  const saveResults = async (finalScores: LoveLanguageScore) => {
    if (!user) return;

    try {
      // Convert LoveLanguageScore to a plain object for JSON storage
      const scoresForDb = {
        words: finalScores.words,
        service: finalScores.service,
        gifts: finalScores.gifts,
        time: finalScores.time,
        touch: finalScores.touch
      };

      const { error } = await supabase
        .from("profiles")
        .update({ love_languages: scoresForDb })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Results saved!",
        description: "Your love language preferences have been saved.",
      });
    } catch (error) {
      console.error("Error saving results:", error);
      toast({
        title: "Error saving results",
        description: "There was a problem saving your preferences.",
        variant: "destructive",
      });
    }
  };

  const resetQuiz = () => {
    setQuizComplete(false);
    setCurrentQuestion(0);
    setScores({
      words: 0,
      service: 0,
      gifts: 0,
      time: 0,
      touch: 0
    });
  };

  const addLoveAction = async () => {
    if (!user || !newActionDescription.trim()) return;

    try {
      const newAction: LoveAction = {
        user_id: user.id,
        language: selectedLanguage,
        description: newActionDescription.trim(),
        completed: false
      };

      const { data, error } = await supabase
        .from("love_actions")
        .insert(newAction)
        .select();

      if (error) throw error;

      setLoveActions([...loveActions, data[0] as LoveAction]);
      setNewActionDescription("");
      
      toast({
        title: "Action added!",
        description: "Your love language action has been added.",
      });
    } catch (error) {
      console.error("Error adding action:", error);
      toast({
        title: "Error adding action",
        description: "There was a problem adding your action.",
        variant: "destructive",
      });
    }
  };

  const toggleActionComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("love_actions")
        .update({ completed: !completed })
        .eq("id", id);

      if (error) throw error;

      setLoveActions(
        loveActions.map((action) =>
          action.id === id ? { ...action, completed: !completed } : action
        )
      );
    } catch (error) {
      console.error("Error updating action:", error);
      toast({
        title: "Error updating action",
        description: "There was a problem updating your action.",
        variant: "destructive",
      });
    }
  };

  // Prepare chart data
  const getPrimaryLanguage = (loveScores: LoveLanguageScore): LoveLanguage => {
    let highest: LoveLanguage = 'words';
    let highestScore = 0;
    
    (Object.keys(loveScores) as LoveLanguage[]).forEach(lang => {
      if (loveScores[lang] > highestScore) {
        highest = lang;
        highestScore = loveScores[lang];
      }
    });
    
    return highest;
  };

  const chartData = Object.keys(scores).map(key => ({
    name: languageLabels[key as LoveLanguage],
    value: scores[key as LoveLanguage],
    color: languageColors[key as LoveLanguage]
  }));

  // Quiz content
  const renderQuiz = () => {
    const question = questions[currentQuestion];
    
    return (
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Question {currentQuestion + 1} of {questions.length}</h3>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="mb-6">
          <p className="text-lg mb-4">{question.text}</p>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start py-4 h-auto"
                onClick={() => handleAnswer(option.language as LoveLanguage)}
              >
                {option.text}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  // Results content
  const renderResults = () => {
    const primaryLanguage = getPrimaryLanguage(scores);
    const suggestions = getSuggestions(primaryLanguage);
    
    return (
      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="results">Your Results</TabsTrigger>
          <TabsTrigger value="actions" className="relative">
            Actions
            {loveActions.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {loveActions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="compare" disabled={!hasPartner}>
            Compare
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="results">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Your Love Language Profile</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-2">Your primary love language is:</h4>
              <p className="text-xl font-bold text-primary">
                {languageLabels[primaryLanguage]}
              </p>
              <p className="mt-4 text-muted-foreground">
                Understanding your love language can help you communicate your needs more effectively
                and recognize how you naturally express love to others.
              </p>
              <Button onClick={resetQuiz} variant="outline" className="mt-4">
                Retake Quiz
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Track Love Language Actions</h3>
            
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as LoveLanguage)}
                >
                  <option value="words">Words of Affirmation</option>
                  <option value="service">Acts of Service</option>
                  <option value="gifts">Receiving Gifts</option>
                  <option value="time">Quality Time</option>
                  <option value="touch">Physical Touch</option>
                </select>
                
                <Button onClick={addLoveAction}>Add</Button>
              </div>
              
              <input
                type="text"
                placeholder="Describe your act of love..."
                className="w-full p-2 border rounded mb-4"
                value={newActionDescription}
                onChange={(e) => setNewActionDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-3">
              {loveActions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No actions added yet. Add your first act of love!
                </p>
              ) : (
                loveActions.map((action) => (
                  <div 
                    key={action.id} 
                    className={`p-3 border rounded-md flex justify-between items-center ${
                      action.completed ? "bg-muted/50" : ""
                    }`}
                  >
                    <div>
                      <p className={action.completed ? "line-through text-muted-foreground" : ""}>
                        {action.description}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {languageLabels[action.language]}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActionComplete(action.id!, action.completed)}
                    >
                      {action.completed ? "Undo" : "Complete"}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="suggestions">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Suggestions for {languageLabels[primaryLanguage]}
            </h3>
            
            <ul className="space-y-3">
              {getSuggestions(primaryLanguage).map((suggestion, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="bg-primary/10 text-primary font-medium w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <p>{suggestion}</p>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-md">
              <h4 className="font-medium mb-2">Want more personalized suggestions?</h4>
              {hasPartner ? (
                <p>
                  Share your results with your partner and discover each other's love languages!
                </p>
              ) : (
                <p>
                  <Link to="/connect" className="text-primary hover:underline">
                    Connect with your partner
                  </Link>{" "}
                  to share your love languages and get personalized suggestions.
                </p>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="compare">
          <Card className="p-6">
            {partnerScores ? (
              <>
                <h3 className="text-xl font-semibold mb-4">Compare Love Languages</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Your Love Languages</h4>
                    <div className="space-y-2">
                      {(Object.keys(scores) as LoveLanguage[]).map(lang => (
                        <div key={lang} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: languageColors[lang] }}></div>
                          <span className="text-sm">{languageLabels[lang]}</span>
                          <Progress value={(scores[lang] / 5) * 100} className="h-2 ml-2 flex-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Partner's Love Languages</h4>
                    <div className="space-y-2">
                      {(Object.keys(partnerScores) as LoveLanguage[]).map(lang => (
                        <div key={lang} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: languageColors[lang] }}></div>
                          <span className="text-sm">{languageLabels[lang]}</span>
                          <Progress value={(partnerScores[lang] / 5) * 100} className="h-2 ml-2 flex-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-md">
                  <h4 className="font-medium mb-2">Key Insights</h4>
                  <p>
                    Your primary language is {languageLabels[getPrimaryLanguage(scores)]}, while your partner's is {languageLabels[getPrimaryLanguage(partnerScores)]}.
                  </p>
                  <p className="mt-2">
                    Try to express love in ways that match your partner's love language, even if it's different from yours.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p>Your partner hasn't completed the love languages quiz yet.</p>
                <p className="text-muted-foreground mt-2">
                  Encourage them to take the quiz to see your comparison.
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">The 5 Love Languages</h2>
      
      <div className="mb-6">
        <p className="text-muted-foreground">
          The concept of Love Languages, developed by Dr. Gary Chapman, suggests that people express and experience love in different ways. Understanding your own and your partner's primary love language can significantly improve how you communicate and show affection.
        </p>
      </div>
      
      {quizComplete ? renderResults() : renderQuiz()}
    </div>
  );
};

export default LoveLanguages;
