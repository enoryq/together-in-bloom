
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    language: string;
  }[];
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

const LoveLanguages = () => {
  const { toast } = useToast();
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

  const handleAnswer = () => {
    if (selectedOption) {
      const language = selectedOption;
      setAnswers({
        ...answers,
        [language]: answers[language] + 1,
      });

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
      }
    }
  };

  const getTopLanguages = () => {
    const sortedLanguages = Object.entries(answers)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => languages.find((lang) => lang.id === id));
    
    return sortedLanguages;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="w-full max-w-lg mx-auto">
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
  );
};

export default LoveLanguages;
