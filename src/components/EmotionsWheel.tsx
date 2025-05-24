
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, RefreshCw, Share2 } from "lucide-react";

interface Emotion {
  name: string;
  color: string;
  borderColor: string;
  textColor: string;
  subEmotions: string[];
  description: string;
}

const emotions: Emotion[] = [
  {
    name: "Joy",
    color: "bg-yellow-100 hover:bg-yellow-200",
    borderColor: "border-yellow-300",
    textColor: "text-yellow-800",
    subEmotions: ["Ecstatic", "Proud", "Happy", "Excited", "Content", "Cheerful", "Optimistic", "Playful"],
    description: "Feelings of happiness, satisfaction, and positive energy"
  },
  {
    name: "Sadness",
    color: "bg-blue-100 hover:bg-blue-200",
    borderColor: "border-blue-300",
    textColor: "text-blue-800",
    subEmotions: ["Devastated", "Disappointed", "Lonely", "Vulnerable", "Grief", "Melancholy", "Dejected", "Sorrowful"],
    description: "Feelings of loss, disappointment, or emotional pain"
  },
  {
    name: "Anger",
    color: "bg-red-100 hover:bg-red-200",
    borderColor: "border-red-300",
    textColor: "text-red-800",
    subEmotions: ["Furious", "Frustrated", "Annoyed", "Resentful", "Critical", "Irritated", "Outraged", "Hostile"],
    description: "Feelings of displeasure, hostility, or antagonism"
  },
  {
    name: "Fear",
    color: "bg-purple-100 hover:bg-purple-200",
    borderColor: "border-purple-300",
    textColor: "text-purple-800",
    subEmotions: ["Terrified", "Anxious", "Insecure", "Worried", "Rejected", "Nervous", "Panicked", "Threatened"],
    description: "Feelings of anxiety, worry, or being threatened"
  },
  {
    name: "Love",
    color: "bg-pink-100 hover:bg-pink-200",
    borderColor: "border-pink-300",
    textColor: "text-pink-800",
    subEmotions: ["Adoring", "Grateful", "Tender", "Compassionate", "Admiration", "Affectionate", "Devoted", "Cherishing"],
    description: "Feelings of deep affection, care, and connection"
  },
  {
    name: "Surprise",
    color: "bg-green-100 hover:bg-green-200",
    borderColor: "border-green-300",
    textColor: "text-green-800",
    subEmotions: ["Amazed", "Confused", "Stunned", "Curious", "Bewildered", "Astonished", "Perplexed", "Intrigued"],
    description: "Feelings of wonder, confusion, or unexpected discovery"
  },
  {
    name: "Disgust",
    color: "bg-orange-100 hover:bg-orange-200",
    borderColor: "border-orange-300",
    textColor: "text-orange-800",
    subEmotions: ["Revolted", "Repulsed", "Contempt", "Loathing", "Aversion", "Distaste", "Sickened", "Offended"],
    description: "Feelings of revulsion or strong disapproval"
  },
  {
    name: "Trust",
    color: "bg-teal-100 hover:bg-teal-200",
    borderColor: "border-teal-300",
    textColor: "text-teal-800",
    subEmotions: ["Confident", "Secure", "Reliable", "Faithful", "Assured", "Certain", "Trusting", "Dependable"],
    description: "Feelings of confidence, security, and reliability"
  }
];

const EmotionsWheel = () => {
  const { toast } = useToast();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [selectedSubEmotion, setSelectedSubEmotion] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [step, setStep] = useState(1);
  const [intensity, setIntensity] = useState(5);
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null);

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
    toast({
      title: "Emotion shared! 💝",
      description: `You're feeling ${selectedSubEmotion} (${selectedEmotion?.name}) with intensity ${intensity}/10`,
    });
    
    // Reset form with animation
    setSelectedEmotion(null);
    setSelectedSubEmotion(null);
    setNote("");
    setIntensity(5);
    setStep(1);
  };

  const resetForm = () => {
    setSelectedEmotion(null);
    setSelectedSubEmotion(null);
    setNote("");
    setIntensity(5);
    setStep(1);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Heart className="h-6 w-6 text-pink-500" />
          Emotions Wheel
        </CardTitle>
        <CardDescription>
          Identify and share how you're feeling with your partner
        </CardDescription>
        {step > 1 && (
          <div className="flex justify-center gap-2 mt-2">
            <Badge variant="outline" className="animate-fade-in">
              Step {step} of 3
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Choose the emotion that best describes how you're feeling right now
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {emotions.map((emotion) => (
                <Button
                  key={emotion.name}
                  onClick={() => handleEmotionSelect(emotion)}
                  onMouseEnter={() => setHoveredEmotion(emotion.name)}
                  onMouseLeave={() => setHoveredEmotion(null)}
                  className={`h-24 rounded-xl ${emotion.color} ${emotion.borderColor} ${emotion.textColor} border-2 hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center gap-1`}
                  variant="outline"
                >
                  <span className="font-semibold">{emotion.name}</span>
                  {hoveredEmotion === emotion.name && (
                    <span className="text-xs opacity-75 animate-fade-in">
                      {emotion.subEmotions.length} variants
                    </span>
                  )}
                </Button>
              ))}
            </div>
            {hoveredEmotion && (
              <div className="text-center p-3 bg-muted rounded-lg animate-fade-in">
                <p className="text-sm">
                  {emotions.find(e => e.name === hoveredEmotion)?.description}
                </p>
              </div>
            )}
          </div>
        )}

        {step === 2 && selectedEmotion && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setStep(1)}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
            
            <div className="text-center p-4 rounded-lg border-2" style={{
              backgroundColor: selectedEmotion.color.split(' ')[0].replace('bg-', 'bg-').replace('100', '50'),
              borderColor: selectedEmotion.borderColor.split('-')[1] + '-200'
            }}>
              <h3 className="text-xl font-semibold mb-2">
                You selected: {selectedEmotion.name}
              </h3>
              <p className="text-sm opacity-80 mb-3">{selectedEmotion.description}</p>
              <p className="font-medium">Choose a more specific feeling:</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedEmotion.subEmotions.map((subEmotion) => (
                <Button
                  key={subEmotion}
                  onClick={() => handleSubEmotionSelect(subEmotion)}
                  className={`h-16 ${selectedEmotion.color} ${selectedEmotion.borderColor} ${selectedEmotion.textColor} border hover:scale-105 transition-all duration-200`}
                  variant="outline"
                >
                  {subEmotion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && selectedEmotion && selectedSubEmotion && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setStep(2)}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
            
            <div className="text-center p-4 rounded-lg border-2" style={{
              backgroundColor: selectedEmotion.color.split(' ')[0].replace('bg-', 'bg-').replace('100', '50'),
              borderColor: selectedEmotion.borderColor.split('-')[1] + '-200'
            }}>
              <h3 className="text-xl font-semibold mb-2">
                You're feeling: {selectedSubEmotion}
              </h3>
              <Badge className="mb-3">{selectedEmotion.name}</Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  How intense is this feeling? ({intensity}/10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Intense</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Would you like to add any notes? (Optional)
                </label>
                <Textarea
                  placeholder="Share more about how you're feeling or what triggered this emotion..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSubmit}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share with Partner
              </Button>
              <Button 
                variant="outline"
                onClick={resetForm}
                size="icon"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <p className="text-center">
          💕 Sharing your emotions helps build deeper emotional intimacy in your relationship
        </p>
      </CardFooter>
    </Card>
  );
};

export default EmotionsWheel;
