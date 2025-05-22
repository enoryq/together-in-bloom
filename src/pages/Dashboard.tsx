import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CalendarHeart, Clock4, Heart, MessageSquareText, Trophy } from 'lucide-react';
import RelationshipHealth from '@/components/dashboard/RelationshipHealth';
import UpcomingMilestones from '@/components/dashboard/UpcomingMilestones';
import DailyPrompt from '@/components/dashboard/DailyPrompt';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
      <p className="text-muted-foreground mb-8">
        Grow your relationship with these tools and features
      </p>
      
      {/* Featured Widgets - Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <RelationshipHealth />
        <UpcomingMilestones />
        <DailyPrompt />
      </div>
      
      {/* Quick Access Cards - Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Partner Connection Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-primary" />
              Connect with Partner
            </CardTitle>
            <CardDescription>Link with your significant other</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Send a connection request to your partner to share progress and experiences together.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/connect">Find Your Partner</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Messages Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <MessageSquareText className="h-5 w-5 mr-2 text-primary" />
              Partner Messages
            </CardTitle>
            <CardDescription>Communicate with your partner</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Send private messages, share your thoughts, and stay connected throughout the day.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/connect">View Messages</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Relationship Challenges */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-primary" />
              Relationship Challenges
            </CardTitle>
            <CardDescription>Strengthen your bond together</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Complete fun activities designed to deepen your connection and understanding.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/toolkit">View Challenges</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Milestones Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CalendarHeart className="h-5 w-5 mr-2 text-primary" />
              Relationship Milestones
            </CardTitle>
            <CardDescription>Track important dates and moments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Never forget important dates and celebrate your journey together.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/profile">View Milestones</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Progress Tracking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clock4 className="h-5 w-5 mr-2 text-primary" />
              Progress Tracking
            </CardTitle>
            <CardDescription>See how far you've come</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Track your growth and accomplishments on your relationship journey.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/profile">View Progress</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Journal */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Relationship Journal</CardTitle>
            <CardDescription>Document your thoughts and feelings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Write about your relationship experiences and track emotional growth.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/journal">Open Journal</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
