
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Emotion {
  name: string;
  color: string;
  subEmotions: string[];
}

const emotions: Emotion[] = [
  {
    name: "Joy",
    color: "bg-yellow-200 hover:bg-yellow-300",
    subEmotions: ["Proud", "Happy", "Excited", "Content"]
  },
  {
    name: "Sadness",
    color: "bg-blue-200 hover:bg-blue-300",
    subEmotions: ["Disappointed", "Lonely", "Vulnerable", "Grief"]
  },
  {
    name: "Anger",
    color: "bg-red-200 hover:bg-red-300",
    subEmotions: ["Frustrated", "Annoyed", "Resentful", "Critical"]
  },
  {
    name: "Fear",
    color: "bg-purple-200 hover:bg-purple-300",
    subEmotions: ["Anxious", "Insecure", "Worried", "Rejected"]
  },
  {
    name: "Love",
    color: "bg-pink-200 hover:bg-pink-300",
    subEmotions: ["Grateful", "Tender", "Compassionate", "Admiration"]
  },
  {
    name: "Surprise",
    color: "bg-green-200 hover:bg-green-300",
    subEmotions: ["Amazed", "Confused", "Stunned", "Curious"]
  }
];

const EmotionsWheel = () => {
  const { toast } = useToast();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [selectedSubEmotion, setSelectedSubEmotion] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [step, setStep] = useState(1);

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setSelectedSubEmotion(null);
    setStep(2);
  };

  const handleSubEmotionSelect = (subEmotion: string) => {
    setSelectedSubEmotion(subEmotion);
    setStep(3);
  };

  const handleSubmit = () => {
    // Here you would save the emotion data
    toast({
      title: "Emotion logged",
      description: `You're feeling ${selectedSubEmotion} (${selectedEmotion?.name})`,
    });
    
    // Reset form
    setSelectedEmotion(null);
    setSelectedSubEmotion(null);
    setNote("");
    setStep(1);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Emotions Wheel</CardTitle>
        <CardDescription>
          Identify and share how you're feeling with your partner
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {emotions.map((emotion) => (
              <Button
                key={emotion.name}
                onClick={() => handleEmotionSelect(emotion)}
                className={`h-20 rounded-xl ${emotion.color} text-foreground hover:scale-105 transition-transform`}
                variant="outline"
              >
                {emotion.name}
              </Button>
            ))}
          </div>
        )}

        {step === 2 && selectedEmotion && (
          <>
            <div className="mb-4">
              <Button 
                variant="ghost" 
                onClick={() => setStep(1)}
                className="mb-2"
              >
                ← Back to emotions
              </Button>
              <h3 className="text-lg font-medium">You selected: {selectedEmotion.name}</h3>
              <p className="text-muted-foreground">Choose a more specific feeling:</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {selectedEmotion.subEmotions.map((subEmotion) => (
                <Button
                  key={subEmotion}
                  onClick={() => handleSubEmotionSelect(subEmotion)}
                  className={`h-16 ${selectedEmotion.color} text-foreground hover:scale-105 transition-transform`}
                  variant="outline"
                >
                  {subEmotion}
                </Button>
              ))}
            </div>
          </>
        )}

        {step === 3 && selectedEmotion && selectedSubEmotion && (
          <>
            <div className="mb-4">
              <Button 
                variant="ghost" 
                onClick={() => setStep(2)}
                className="mb-2"
              >
                ← Back to {selectedEmotion.name}
              </Button>
              <h3 className="text-lg font-medium">
                You're feeling: {selectedSubEmotion} ({selectedEmotion.name})
              </h3>
              <p className="text-muted-foreground">Would you like to add any notes?</p>
            </div>
            <Textarea
              placeholder="Share more about how you're feeling..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px] mb-4 bloom-input"
            />
            <Button 
              onClick={handleSubmit}
              className="w-full bloom-btn-primary"
            >
              Share with Partner
            </Button>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <p>Sharing your emotions helps build emotional intimacy</p>
      </CardFooter>
    </Card>
  );
};

export default EmotionsWheel;
