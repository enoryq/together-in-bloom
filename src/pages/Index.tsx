
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HeartHandshake, MessageSquareHeart, CalendarHeart, Trophy, PieChart, ShieldCheck, Users, BookOpen, Bot, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Together In Bloom
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your relationship with AI-powered tools, personalized exercises, and meaningful connections. 
              Build deeper understanding, strengthen communication, and create lasting love.
            </p>
            {isAuthenticated ? (
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/dashboard">Continue Your Journey</Link>
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link to="/auth">Start Your Journey</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* App Preview Section */}
        <section className="py-16 bg-white rounded-3xl shadow-lg border mb-16">
          <div className="px-8">
            <h2 className="text-3xl font-bold text-center mb-12">See It In Action</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Bloom - AI Relationship Companion</h3>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Get personalized relationship advice, exercises, and insights from Bloom, your AI companion. 
                  Available 24/7 to help you navigate relationship challenges and strengthen your bond.
                </p>
                <div className="bg-gray-50 rounded-lg border shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Bot className="h-6 w-6 text-primary" />
                    <span className="font-medium">Bloom - AI Companion</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-sm">"How can we improve our communication during conflicts?"</p>
                    </div>
                    <div className="bg-gray-200 rounded-lg p-3">
                      <p className="text-sm">Here are 3 proven techniques for healthy conflict resolution...</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Partner Connection</h3>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Connect with your partner to share progress, send messages, and complete challenges together. 
                  Build your relationship as a team with shared goals and experiences.
                </p>
                <div className="bg-gray-50 rounded-lg border shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-6 w-6 text-primary" />
                    <span className="font-medium">Connected Partners</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">A</div>
                      <span className="text-sm font-medium">Alex Johnson - Connected</span>
                    </div>
                    <Button size="sm" className="w-full">Send Message</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white rounded-3xl shadow-lg border mb-16">
          <div className="px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Everything You Need to Thrive</h2>
            <p className="text-center text-muted-foreground mb-12 text-lg max-w-2xl mx-auto">
              Discover powerful tools and features designed by relationship experts to help couples grow stronger together.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Bot className="h-10 w-10 text-primary" />}
                title="Bloom - AI Relationship Coach"
                description="Get personalized advice, exercises, and insights from Bloom, your AI companion available 24/7."
                highlight="NEW"
              />
              <FeatureCard 
                icon={<MessageSquareHeart className="h-10 w-10 text-primary" />}
                title="Secure Partner Messaging"
                description="Private, encrypted communication with your partner through our secure platform."
              />
              <FeatureCard 
                icon={<BookOpen className="h-10 w-10 text-primary" />}
                title="Relationship Journal"
                description="Document your journey, track emotions, and reflect on your growth together."
              />
              <FeatureCard 
                icon={<Trophy className="h-10 w-10 text-primary" />}
                title="Interactive Challenges"
                description="Fun, science-based activities designed to strengthen your bond and deepen connection."
              />
              <FeatureCard 
                icon={<HeartHandshake className="h-10 w-10 text-primary" />}
                title="Love Languages Assessment"
                description="Discover how you and your partner prefer to give and receive love."
              />
              <FeatureCard 
                icon={<Sparkles className="h-10 w-10 text-primary" />}
                title="Emotions Wheel"
                description="Explore and understand complex emotions to improve emotional intelligence."
              />
              <FeatureCard 
                icon={<CalendarHeart className="h-10 w-10 text-primary" />}
                title="Milestone Tracking"
                description="Never forget important dates and celebrate your journey together with reminders."
              />
              <FeatureCard 
                icon={<PieChart className="h-10 w-10 text-primary" />}
                title="Progress Analytics"
                description="Visual insights into your relationship growth and areas for improvement."
              />
              <FeatureCard 
                icon={<ShieldCheck className="h-10 w-10 text-primary" />}
                title="Privacy First"
                description="Your relationship data is encrypted and protected with industry-standard security."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white rounded-3xl shadow-lg border mb-16">
          <div className="px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
                <p className="text-muted-foreground">Sign up and complete your relationship profile to get personalized recommendations.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-3">Connect With Your Partner</h3>
                <p className="text-muted-foreground">Invite your partner to join and start your journey together with shared goals.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-3">Grow Together</h3>
                <p className="text-muted-foreground">Use tools, complete challenges, and track your progress as you strengthen your bond.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white rounded-3xl shadow-lg border mb-16">
          <div className="px-8">
            <h2 className="text-3xl font-bold text-center mb-12">What Couples Are Saying</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard 
                quote="Bloom helped us navigate our biggest challenge yet. It's like having a relationship therapist available anytime."
                author="Sarah & Mike"
                relationship="Together 3 years"
              />
              <TestimonialCard 
                quote="We've learned so much about each other through the love languages quiz and challenges. Our communication has never been better."
                author="Jessica & David"
                relationship="Married 7 years"
              />
              <TestimonialCard 
                quote="The milestone tracking keeps us connected to our journey. We love celebrating our progress together!"
                author="Alex & Jordan"
                relationship="Together 2 years"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-purple-600 py-16 text-white text-center rounded-3xl shadow-lg mb-16">
          <div className="px-8">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Relationship?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of couples who are building stronger, happier relationships every day with Together In Bloom.
            </p>
            {isAuthenticated ? (
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <Link to="/auth">Start Free Today</Link>
              </Button>
            )}
            <p className="text-sm mt-4 opacity-75">No credit card required • Start in under 2 minutes</p>
          </div>
        </section>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

const FeatureCard = ({ icon, title, description, highlight }: FeatureCardProps) => (
  <div className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative">
    {highlight && (
      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
        {highlight}
      </span>
    )}
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

interface TestimonialCardProps {
  quote: string;
  author: string;
  relationship: string;
}

const TestimonialCard = ({ quote, author, relationship }: TestimonialCardProps) => (
  <div className="bg-card rounded-lg border p-6 shadow-sm">
    <p className="text-muted-foreground mb-4 italic">"{quote}"</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-muted-foreground">{relationship}</p>
    </div>
  </div>
);

export default Index;
