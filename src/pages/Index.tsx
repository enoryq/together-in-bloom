
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HeartHandshake, MessageSquareHeart, CalendarHeart, Trophy, PieChart, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/20 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Grow Your Relationship</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Tools and activities designed to strengthen your connection,
            foster understanding, and help your relationship bloom.
          </p>
          {isAuthenticated ? (
            <Button size="lg" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features to Help Your Relationship Thrive</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<MessageSquareHeart className="h-10 w-10 text-primary" />}
            title="Partner Communication"
            description="Send messages and share thoughts with your partner through our secure platform."
          />
          <FeatureCard 
            icon={<Trophy className="h-10 w-10 text-primary" />}
            title="Relationship Challenges"
            description="Fun activities designed to strengthen your bond and deepen your connection."
          />
          <FeatureCard 
            icon={<CalendarHeart className="h-10 w-10 text-primary" />}
            title="Milestone Tracking"
            description="Never forget important dates and celebrate your journey together."
          />
          <FeatureCard 
            icon={<PieChart className="h-10 w-10 text-primary" />}
            title="Progress Analytics"
            description="Track your relationship growth and see how far you've come together."
          />
          <FeatureCard 
            icon={<HeartHandshake className="h-10 w-10 text-primary" />}
            title="Connection Tools"
            description="Practical exercises to improve communication and understanding."
          />
          <FeatureCard 
            icon={<ShieldCheck className="h-10 w-10 text-primary" />}
            title="Private & Secure"
            description="Your relationship data is private and protected with industry-standard security."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Together?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of couples who are strengthening their relationships every day.
          </p>
          {isAuthenticated ? (
            <Button size="lg" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link to="/auth">Get Started for Free</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-md transition-shadow">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
