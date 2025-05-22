
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, HeartHandshake, Send, Clock, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    language: string;
  }[];
}

interface LoveAction {
  id: string;
  user_id: string;
  language: string;
  description: string;
  completed: boolean;
  created_at: string;
  for_partner?: boolean;
}

interface LoveLanguageRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  language: string;
  message: string;
  fulfilled: boolean;
  created_at: string;
}

interface PartnerLanguages {
  words: number;
  service: number;
  gifts: number;
  time: number;
  touch: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Which would you appreciate more from your partner?",
    options: [
      { text: "Being told how much they love and appreciate you", language: "words" },
      { text: "Receiving a thoughtful gift", language: "gifts" },
    ],
  },
  {
    id: 2,
    text: "What makes you feel more loved?",
    options: [
      { text: "When your partner helps with tasks without being asked", language: "service" },
      { text: "When your partner gives you their undivided attention", language: "time" },
    ],
  },
  {
    id: 3,
    text: "Which is more meaningful to you?",
    options: [
      { text: "A long hug from your partner", language: "touch" },
      { text: "Hearing your partner say they're proud of you", language: "words" },
    ],
  },
  {
    id: 4,
    text: "What would you prefer after a difficult day?",
    options: [
      { text: "Your partner sitting with you and listening", language: "time" },
      { text: "Your partner bringing you a small gift to cheer you up", language: "gifts" },
    ],
  },
  {
    id: 5,
    text: "Which gesture means more to you?",
    options: [
      { text: "Your partner doing a chore you normally do", language: "service" },
      { text: "Your partner putting their arm around you in public", language: "touch" },
    ],
  },
  // Add more questions as needed
];

const languages = [
  { id: "words", name: "Words of Affirmation", description: "You value verbal expressions of love and appreciation." },
  { id: "service", name: "Acts of Service", description: "You feel loved when your partner does helpful things for you." },
  { id: "gifts", name: "Receiving Gifts", description: "Thoughtful gifts make you feel special and remembered." },
  { id: "time", name: "Quality Time", description: "You value focused, undivided attention from your partner." },
  { id: "touch", name: "Physical Touch", description: "Physical contact and closeness is important to you." },
];

const languageToSuggestions = {
  words: [
    "Write a heartfelt note expressing your appreciation",
    "Send encouraging text messages throughout the day",
    "Verbally recognize their efforts and accomplishments",
    "Tell them specific things you love about them",
    "Express gratitude for the small things they do"
  ],
  service: [
    "Take care of a chore they normally do",
    "Prepare their favorite meal",
    "Offer to run an errand for them",
    "Fix something that's been bothering them",
    "Help them with a project they're working on"
  ],
  gifts: [
    "Surprise them with their favorite treat",
    "Give them something that reminds you of a shared memory",
    "Find a meaningful book or item related to their interests",
    "Create a custom playlist of songs that remind you of them",
    "Plan a small surprise that shows you were thinking of them"
  ],
  time: [
    "Plan a distraction-free date night",
    "Take a walk together with no phones",
    "Set aside time for a deep conversation",
    "Do an activity they enjoy, giving your full attention",
    "Create a regular ritual of connection like morning coffee together"
  ],
  touch: [
    "Hold hands while walking or watching TV",
    "Offer a shoulder or foot massage after a long day",
    "Give a long, meaningful hug when greeting or saying goodbye",
    "Sit close to them during movies or when relaxing",
    "Initiate physical affection throughout the day"
  ]
};

const LoveLanguages = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("quiz");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({
    words: 0,
    service: 0,
    gifts: 0,
    time: 0,
    touch: 0,
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [loveActions, setLoveActions] = useState<LoveAction[]>([]);
  const [actionDescription, setActionDescription] = useState("");
  const [actionLanguage, setActionLanguage] = useState("words");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partnerLanguages, setPartnerLanguages] = useState<PartnerLanguages | null>(null);
  const [partnerInfo, setPartnerInfo] = useState<{ id: string; name: string } | null>(null);
  const [requests, setRequests] = useState<LoveLanguageRequest[]>([]);
  const [newRequestMessage, setNewRequestMessage] = useState("");
  const [newRequestLanguage, setNewRequestLanguage] = useState("words");
  const [forPartner, setForPartner] = useState(false);

  // Fetch user's love language results and saved actions
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user has completed the quiz before
      fetchQuizResults();
      // Fetch saved actions
      fetchLoveActions();
      // Fetch partner info
      fetchPartnerInfo();
      // Fetch love language requests
      fetchRequests();
    }
  }, [isAuthenticated, user]);

  const fetchQuizResults = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('love_languages')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        setAnswers({
          words: data.words || 0,
          service: data.service || 0,
          gifts: data.gifts || 0,
          time: data.time || 0,
          touch: data.touch || 0,
        });
        setIsComplete(true);
      }
    } catch (error) {
      console.error("Error fetching quiz results:", error);
    }
  };

  const fetchLoveActions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('love_actions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setLoveActions(data);
      }
    } catch (error) {
      console.error("Error fetching love actions:", error);
    }
  };

  const fetchPartnerInfo = async () => {
    if (!user) return;
    
    try {
      // First get the partner relationship
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*, profile:profiles!partner_id(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      
      if (partnerError) throw partnerError;
      
      if (partnerData) {
        // Set partner info
        setPartnerInfo({
          id: partnerData.partner_id,
          name: partnerData.profile?.display_name || 'Partner'
        });
        
        // Fetch partner's love languages
        const { data: languageData, error: languageError } = await supabase
          .from('love_languages')
          .select('*')
          .eq('user_id', partnerData.partner_id)
          .maybeSingle();
          
        if (languageError) throw languageError;
        
        if (languageData) {
          setPartnerLanguages({
            words: languageData.words || 0,
            service: languageData.service || 0,
            gifts: languageData.gifts || 0,
            time: languageData.time || 0,
            touch: languageData.touch || 0,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching partner info:", error);
    }
  };

  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('love_language_requests')
        .select('*')
        .or(`to_user_id.eq.${user.id},from_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setRequests(data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleAnswer = async () => {
    if (selectedOption) {
      const language = selectedOption;
      const updatedAnswers = {
        ...answers,
        [language]: answers[language] + 1,
      };
      
      setAnswers(updatedAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Quiz complete - calculate results
        setIsComplete(true);
        toast({
          title: "Assessment Complete!",
          description: "Your Love Language results are ready.",
        });
        
        // Save results to database if user is logged in
        if (user) {
          try {
            const { error } = await supabase
              .from('love_languages')
              .upsert({
                user_id: user.id,
                words: updatedAnswers.words,
                service: updatedAnswers.service,
                gifts: updatedAnswers.gifts,
                time: updatedAnswers.time,
                touch: updatedAnswers.touch,
              }, { onConflict: 'user_id' });
              
            if (error) throw error;
          } catch (error) {
            console.error("Error saving quiz results:", error);
            toast({
              title: "Error",
              description: "Failed to save your results. Please try again.",
              variant: "destructive",
            });
          }
        }
      }
    }
  };

  const addLoveAction = async () => {
    if (!user || !actionDescription.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('love_actions')
        .insert({
          user_id: user.id,
          language: actionLanguage,
          description: actionDescription,
          completed: false,
          for_partner: forPartner
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setLoveActions([data, ...loveActions]);
      setActionDescription("");
      setForPartner(false);
      
      toast({
        title: "Action Added",
        description: "Your love action has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding love action:", error);
      toast({
        title: "Error",
        description: "Failed to add your love action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActionCompleted = async (action: LoveAction) => {
    try {
      const { error } = await supabase
        .from('love_actions')
        .update({ completed: !action.completed })
        .eq('id', action.id);
        
      if (error) throw error;
      
      setLoveActions(loveActions.map(a => 
        a.id === action.id ? { ...a, completed: !a.completed } : a
      ));
      
      toast({
        title: action.completed ? "Action Uncompleted" : "Action Completed",
        description: action.completed 
          ? "You've marked this action as not done." 
          : "Great job! You've completed this love action.",
      });
    } catch (error) {
      console.error("Error toggling action status:", error);
      toast({
        title: "Error",
        description: "Failed to update the action status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendLoveLanguageRequest = async () => {
    if (!user || !partnerInfo || !newRequestMessage.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('love_language_requests')
        .insert({
          from_user_id: user.id,
          to_user_id: partnerInfo.id,
          language: newRequestLanguage,
          message: newRequestMessage,
          fulfilled: false
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setRequests([data, ...requests]);
      setNewRequestMessage("");
      
      toast({
        title: "Request Sent",
        description: `You've sent a ${languages.find(l => l.id === newRequestLanguage)?.name} request to your partner.`,
      });
    } catch (error) {
      console.error("Error sending request:", error);
      toast({
        title: "Error",
        description: "Failed to send your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fulfillRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('love_language_requests')
        .update({ fulfilled: true })
        .eq('id', requestId);
        
      if (error) throw error;
      
      setRequests(requests.map(r => 
        r.id === requestId ? { ...r, fulfilled: true } : r
      ));
      
      toast({
        title: "Request Fulfilled",
        description: "You've marked this request as fulfilled. Thank you!",
      });
    } catch (error) {
      console.error("Error fulfilling request:", error);
      toast({
        title: "Error",
        description: "Failed to update the request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTopLanguages = () => {
    const sortedLanguages = Object.entries(answers)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => languages.find((lang) => lang.id === id));
    
    return sortedLanguages;
  };

  const getPrimaryLanguage = () => {
    const sortedLanguages = Object.entries(answers)
      .sort((a, b) => b[1] - a[1]);
    return sortedLanguages.length > 0 ? sortedLanguages[0][0] : "words";
  };

  const getSuggestionsByLanguage = (languageId: string) => {
    return languageToSuggestions[languageId as keyof typeof languageToSuggestions] || [];
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="quiz">Assessment</TabsTrigger>
        <TabsTrigger value="actions">Actions</TabsTrigger>
        <TabsTrigger value="comparison" disabled={!partnerLanguages}>Compare</TabsTrigger>
        <TabsTrigger value="requests" disabled={!partnerInfo}>Requests</TabsTrigger>
      </TabsList>
      
      <TabsContent value="quiz">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>5 Love Languages Assessment</CardTitle>
            <CardDescription>
              Discover how you prefer to give and receive love
            </CardDescription>
            {!isComplete && (
              <div className="mt-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!isComplete ? (
              <div className="space-y-6">
                <h3 className="text-xl font-medium">{questions[currentQuestion].text}</h3>
                <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={option.language} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-base font-normal">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <Button 
                  onClick={handleAnswer} 
                  disabled={!selectedOption}
                  className="w-full bloom-btn-primary"
                >
                  {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Assessment"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-medium">Your Love Languages</h3>
                <div className="space-y-4">
                  {getTopLanguages().map((language, index) => (
                    language && (
                      <div key={language.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{index + 1}. {language.name}</span>
                          <span className="text-sm">{Math.round((answers[language.id] / questions.length) * 100)}%</span>
                        </div>
                        <Progress value={(answers[language.id] / questions.length) * 100} className="h-2" />
                        <p className="text-sm text-muted-foreground">{language.description}</p>
                      </div>
                    )
                  ))}
                </div>
                
                {/* Suggested actions section */}
                <div className="pt-4 border-t">
                  <h4 className="text-lg font-medium mb-3">Suggested Actions for Your Primary Language</h4>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h5 className="font-medium mb-2">
                      {languages.find(l => l.id === getPrimaryLanguage())?.name}:
                    </h5>
                    <ul className="space-y-2 list-disc pl-5">
                      {getSuggestionsByLanguage(getPrimaryLanguage()).map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    // Reset the quiz
                    setCurrentQuestion(0);
                    setAnswers({
                      words: 0,
                      service: 0,
                      gifts: 0,
                      time: 0,
                      touch: 0,
                    });
                    setSelectedOption(null);
                    setIsComplete(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Retake Assessment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="actions">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Love Language Actions</CardTitle>
            <CardDescription>
              Record and track acts of love based on love languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAuthenticated ? (
              <>
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-medium">Add a New Love Action</h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="actionLanguage">Love Language</Label>
                      <select 
                        id="actionLanguage"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={actionLanguage}
                        onChange={(e) => setActionLanguage(e.target.value)}
                      >
                        {languages.map(lang => (
                          <option key={lang.id} value={lang.id}>{lang.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="actionDescription">Description</Label>
                      <Textarea 
                        id="actionDescription" 
                        placeholder="Describe the love action..." 
                        value={actionDescription}
                        onChange={(e) => setActionDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="forPartner" 
                        checked={forPartner}
                        onChange={() => setForPartner(!forPartner)} 
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <Label htmlFor="forPartner">This is an action I'll do for my partner</Label>
                    </div>
                    <Button 
                      onClick={addLoveAction} 
                      disabled={!actionDescription.trim() || isSubmitting}
                      className="bloom-btn-primary"
                    >
                      {isSubmitting ? "Adding..." : "Add Action"}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Your Love Actions</h3>
                  {loveActions.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>You haven't added any love actions yet.</p>
                      <p>Start tracking how you express and receive love!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {loveActions.map((action) => (
                        <div 
                          key={action.id} 
                          className={`p-4 rounded-lg border flex items-start justify-between ${
                            action.completed ? "bg-primary/5 border-primary/20" : ""
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-full">
                                {languages.find(l => l.id === action.language)?.name}
                              </span>
                              {action.for_partner && (
                                <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded-full">
                                  For Partner
                                </span>
                              )}
                            </div>
                            <p className={action.completed ? "line-through text-muted-foreground" : ""}>
                              {action.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(action.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            variant={action.completed ? "outline" : "default"} 
                            size="sm"
                            onClick={() => toggleActionCompleted(action)}
                          >
                            {action.completed ? "Undo" : "Complete"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="mb-4">Please sign in to track your love actions.</p>
                <Button asChild>
                  <NavLink to="/auth">Sign In</NavLink>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="comparison">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Compare Love Languages</CardTitle>
            <CardDescription>
              See how your love languages compare with your partner's
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAuthenticated && partnerLanguages && partnerInfo ? (
              <div className="space-y-6">
                {languages.map(language => {
                  const yourScore = Math.round((answers[language.id] / questions.length) * 100);
                  const partnerScore = partnerLanguages 
                    ? Math.round((partnerLanguages[language.id as keyof typeof partnerLanguages] / questions.length) * 100) 
                    : 0;
                  
                  return (
                    <div key={language.id} className="space-y-4">
                      <h3 className="text-lg font-medium">{language.name}</h3>
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                        <div>
                          <p className="text-sm mb-1">You: {yourScore}%</p>
                          <Progress value={yourScore} className="h-3 bg-muted" />
                        </div>
                        <HeartHandshake className="h-5 w-5 text-primary mx-2" />
                        <div>
                          <p className="text-sm mb-1">{partnerInfo.name}: {partnerScore}%</p>
                          <Progress value={partnerScore} className="h-3 bg-secondary/30" />
                        </div>
                      </div>
                      {Math.abs(yourScore - partnerScore) > 30 && (
                        <div className="bg-muted/30 p-3 rounded-lg text-sm">
                          <p className="font-medium">Note:</p>
                          <p>
                            {yourScore > partnerScore 
                              ? `You value ${language.name} more than your partner. Consider communicating how important this is to you.`
                              : `Your partner values ${language.name} more than you. Consider making extra effort in this area.`
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">What This Means</h3>
                  <p className="mb-3">
                    Understanding where you align and differ helps communicate love more effectively.
                    Focus on expressing love in ways that resonate with your partner, while also
                    sharing what makes you feel most loved.
                  </p>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium">Tips for Successful Communication:</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Discuss your results together openly</li>
                      <li>Schedule regular check-ins about emotional needs</li>
                      <li>Be willing to step outside your comfort zone</li>
                      <li>Appreciate efforts even when they don't match your primary language</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="mb-2">No partner comparison available.</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {isAuthenticated 
                    ? "Connect with your partner to see their love languages." 
                    : "Please sign in and connect with your partner to enable this feature."
                  }
                </p>
                {!isAuthenticated && (
                  <Button asChild>
                    <NavLink to="/auth">Sign In</NavLink>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="requests">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Love Language Requests</CardTitle>
            <CardDescription>
              Exchange specific love requests with your partner
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAuthenticated && partnerInfo ? (
              <>
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-medium">Send a Request to {partnerInfo.name}</h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="requestLanguage">Love Language</Label>
                      <select 
                        id="requestLanguage"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={newRequestLanguage}
                        onChange={(e) => setNewRequestLanguage(e.target.value)}
                      >
                        {languages.map(lang => (
                          <option key={lang.id} value={lang.id}>{lang.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="requestMessage">Message</Label>
                      <Textarea 
                        id="requestMessage" 
                        placeholder="What would make you feel loved?" 
                        value={newRequestMessage}
                        onChange={(e) => setNewRequestMessage(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={sendLoveLanguageRequest} 
                      disabled={!newRequestMessage.trim() || isSubmitting}
                      className="bloom-btn-primary flex gap-2 items-center"
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Sending..." : "Send Request"}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Love Requests</h3>
                  {requests.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No love language requests yet.</p>
                      <p>Send a request to let your partner know what would make you feel loved!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {requests.map((request) => {
                        const isIncoming = request.to_user_id === user?.id;
                        return (
                          <div 
                            key={request.id} 
                            className={`p-4 rounded-lg border ${
                              request.fulfilled ? "bg-primary/5 border-primary/20" : ""
                            } ${isIncoming ? "border-l-4 border-l-secondary" : ""}`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-full">
                                    {languages.find(l => l.id === request.language)?.name}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                                    {isIncoming ? "From Partner" : "To Partner"}
                                  </span>
                                  {request.fulfilled && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" /> Fulfilled
                                    </span>
                                  )}
                                </div>
                                <p>{request.message}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(request.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              {isIncoming && !request.fulfilled && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => fulfillRequest(request.id)}
                                >
                                  Mark Fulfilled
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="mb-4">
                  {isAuthenticated 
                    ? "Connect with a partner to exchange love language requests." 
                    : "Please sign in and connect with a partner to use this feature."
                  }
                </p>
                {!isAuthenticated ? (
                  <Button asChild>
                    <NavLink to="/auth">Sign In</NavLink>
                  </Button>
                ) : (
                  <Button asChild>
                    <NavLink to="/connect">Connect with Partner</NavLink>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default LoveLanguages;
