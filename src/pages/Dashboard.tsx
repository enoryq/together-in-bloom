import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import EmotionsWheel from "@/components/EmotionsWheel";
import LoveLanguages from "@/components/LoveLanguages";

const Dashboard = () => {
  // Mock data
  const recentActivities = [
    { id: 1, type: "journal", title: "Journal Entry", date: "Today", description: "What I appreciate about our relationship..." },
    { id: 2, type: "emotion", title: "Emotion Shared", date: "Yesterday", description: "Feeling: Grateful" },
    { id: 3, type: "conversation", title: "Conversation Starter", date: "2 days ago", description: "Discussed future goals together" },
  ];

  const upcomingMilestones = [
    { id: 1, title: "Anniversary", date: "June 15", daysAway: 5 },
    { id: 2, title: "Birthday: Alex", date: "July 3", daysAway: 23 },
    { id: 3, title: "Vacation Together", date: "August 10", daysAway: 61 },
  ];

  const relationshipGoals = [
    { id: 1, title: "Complete a 7-day challenge", progress: 70 },
    { id: 2, title: "Journal 5 times per month", progress: 40 },
    { id: 3, title: "Have a weekly date night", progress: 60 },
  ];

  const partnerStatus = {
    name: "Alex",
    lastActive: "2 hours ago",
    latestEmotion: "Content",
    latestJournal: "Yesterday",
  };

  return (
    <div className="container px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Partner Status Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Partner Status</CardTitle>
            <CardDescription>Stay updated with your partner</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-semibold">{partnerStatus.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium">{partnerStatus.name}</p>
                <p className="text-sm text-muted-foreground">Last active: {partnerStatus.lastActive}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Latest emotion:</span>
                <span className="text-sm font-medium">{partnerStatus.latestEmotion}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Latest journal:</span>
                <span className="text-sm font-medium">{partnerStatus.latestJournal}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Milestones */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Milestones</CardTitle>
            <CardDescription>Important dates and events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingMilestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground">{milestone.date}</p>
                  </div>
                </div>
                <Badge className={milestone.daysAway < 7 ? "bg-accent text-accent-foreground" : "bg-muted"}>
                  {milestone.daysAway} days
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Relationship Goals */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Relationship Goals</CardTitle>
            <CardDescription>Track your progress together</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {relationshipGoals.map((goal) => (
              <div key={goal.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{goal.title}</span>
                  <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
            <Button variant="outline" className="w-full flex items-center justify-center gap-1 mt-2">
              <span>Add Goal</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>
              Latest interactions between you and your partner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="rounded-full p-2 bg-primary/10">
                    {activity.type === "journal" && <Calendar className="h-4 w-4 text-primary" />}
                    {activity.type === "emotion" && <Heart className="h-4 w-4 text-primary" />}
                    {activity.type === "conversation" && <MessageCircle className="h-4 w-4 text-primary" />}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{activity.title}</p>
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="emotions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="emotions">Express Emotions</TabsTrigger>
              <TabsTrigger value="languages">Love Languages</TabsTrigger>
            </TabsList>
            <TabsContent value="emotions" className="mt-4">
              <EmotionsWheel />
            </TabsContent>
            <TabsContent value="languages" className="mt-4">
              <LoveLanguages />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Quick Access Tools */}
      <h2 className="text-2xl font-bold mb-4">Quick Access Tools</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/journal">
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Journal</h3>
              <p className="text-xs text-muted-foreground mt-1">Record your thoughts</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/toolkit">
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Conversation</h3>
              <p className="text-xs text-muted-foreground mt-1">Start meaningful talks</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/toolkit">
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Challenges</h3>
              <p className="text-xs text-muted-foreground mt-1">Fun relationship activities</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/profile">
          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Profile</h3>
              <p className="text-xs text-muted-foreground mt-1">Manage your account</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

// Fix imports
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { User, Book, MessageCircle } from "lucide-react";

export default Dashboard;
