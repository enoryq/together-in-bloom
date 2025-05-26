
import { useAuth } from '@/contexts/AuthContext';
import { usePartnerConnections } from '@/hooks/usePartnerConnections';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { CalendarHeart, Clock4, Heart, MessageSquareText, Trophy, Bot, Users, BookOpen, Target, Sparkles } from 'lucide-react';
import RelationshipHealth from '@/components/dashboard/RelationshipHealth';
import UpcomingMilestones from '@/components/dashboard/UpcomingMilestones';
import DailyPrompt from '@/components/dashboard/DailyPrompt';

const Dashboard = () => {
  const { user } = useAuth();
  const { activePartner, loading } = usePartnerConnections(user?.id);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          {getGreeting()}!
        </h1>
        <p className="text-lg text-muted-foreground">
          {activePartner 
            ? `Continue growing your relationship with ${activePartner.display_name}` 
            : "Start your journey to a stronger, healthier relationship"
          }
        </p>
        {!loading && !activePartner && (
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" className="text-sm">
              <Users className="h-3 w-3 mr-1" />
              No partner connected
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link to="/connect">Connect with Partner</Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Featured Widgets - Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RelationshipHealth />
        <UpcomingMilestones />
        <DailyPrompt />
      </div>
      
      {/* Main Actions Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Partner Connection Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Heart className="h-5 w-5 mr-2 text-primary" />
                Partner Connection
              </CardTitle>
              <CardDescription>
                {activePartner ? `Connected with ${activePartner.display_name}` : "Link with your significant other"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {activePartner 
                  ? "Manage your connection and view shared progress together."
                  : "Send a connection request to your partner to share progress and experiences together."
                }
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/connect">
                  {activePartner ? "View Connection" : "Find Your Partner"}
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Messages Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <MessageSquareText className="h-5 w-5 mr-2 text-primary" />
                Partner Messages
              </CardTitle>
              <CardDescription>
                {activePartner ? "Private conversations" : "Connect to start messaging"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {activePartner 
                  ? "Send private messages, share your thoughts, and stay connected throughout the day."
                  : "Once connected, you can send private messages and share thoughts with your partner."
                }
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={!activePartner}
                asChild={!!activePartner}
              >
                {activePartner ? (
                  <Link to="/connect">View Messages</Link>
                ) : (
                  "Connect to Message"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* AI Companion Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Bot className="h-5 w-5 mr-2 text-primary" />
                AI Relationship Coach
              </CardTitle>
              <CardDescription>Get personalized guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Chat with your AI companion for advice, exercises, and insights tailored to your relationship.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/ai-companion">Start Conversation</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Journal Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Relationship Journal
              </CardTitle>
              <CardDescription>Document your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Write about your relationship experiences, track emotional growth, and reflect on your journey.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/journal">Open Journal</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Relationship Tools */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Relationship Tools
              </CardTitle>
              <CardDescription>Interactive exercises & assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore love languages, emotions wheel, and other tools to understand yourself and your partner better.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/toolkit">Explore Tools</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Challenges Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                Relationship Challenges
              </CardTitle>
              <CardDescription>Fun activities to strengthen your bond</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete guided activities designed to deepen your connection and understanding with your partner.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/toolkit">View Challenges</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Secondary Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Clock4 className="h-6 w-6 mr-2 text-primary" />
          Track Your Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Milestones Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <CalendarHeart className="h-5 w-5 mr-2 text-primary" />
                Relationship Milestones
              </CardTitle>
              <CardDescription>Important dates and celebrations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Never forget important dates and celebrate your journey together with personalized milestones.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/profile">Manage Milestones</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Progress Tracking */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                Your Growth Journey
              </CardTitle>
              <CardDescription>See how far you've come</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track your relationship growth, completed challenges, and personal development over time.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/profile">View Progress</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
