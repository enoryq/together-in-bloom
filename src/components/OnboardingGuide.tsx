
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Book, Heart, MessageCircle, User, Calendar } from "lucide-react";

const steps = [
  {
    title: "Welcome to Together In Bloom",
    description: "We're excited to help you grow your relationship. Let's take a quick tour of the app's features.",
    icon: <Heart className="h-12 w-12 text-primary mb-2" />,
  },
  {
    title: "Connect with Your Partner",
    description: "Send a connection request to your partner to share your journey together.",
    icon: <User className="h-12 w-12 text-primary mb-2" />,
    route: "/connect",
  },
  {
    title: "Relationship Journal",
    description: "Document your thoughts and feelings about your relationship.",
    icon: <Book className="h-12 w-12 text-primary mb-2" />,
    route: "/journal",
  },
  {
    title: "Partner Communication",
    description: "Exchange messages with your partner directly through the app.",
    icon: <MessageCircle className="h-12 w-12 text-primary mb-2" />,
    route: "/connect",
  },
  {
    title: "Track Important Dates",
    description: "Never forget important milestones and anniversaries.",
    icon: <Calendar className="h-12 w-12 text-primary mb-2" />,
    route: "/profile",
  },
];

export function OnboardingGuide() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if onboarding was completed before
  useEffect(() => {
    if (user) {
      const onboardingCompleted = localStorage.getItem(`onboarding-completed-${user.id}`);
      if (!onboardingCompleted) {
        setOpen(true);
      }
    }
  }, [user]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    completeOnboarding();
  };
  
  const completeOnboarding = () => {
    if (user) {
      localStorage.setItem(`onboarding-completed-${user.id}`, "true");
    }
    setOpen(false);
    toast({
      title: "Onboarding completed!",
      description: "You're all set to use Together In Bloom.",
    });
  };
  
  const goToFeature = () => {
    const route = steps[currentStep].route;
    if (route) {
      navigate(route);
      setOpen(false);
    }
  };
  
  const step = steps[currentStep];
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center justify-center text-center">
            {step.icon}
            <DialogTitle className="text-xl">{step.title}</DialogTitle>
          </div>
          <DialogDescription className="text-center pt-2">
            {step.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center mt-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${
                index === currentStep ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between mt-6">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep < steps.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
          <div className="flex gap-2">
            {step.route && (
              <Button variant="secondary" onClick={goToFeature}>
                Go to {step.title.split(" ").pop()}
              </Button>
            )}
            <Button variant="ghost" onClick={handleSkip}>
              Skip Tour
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingGuide;
