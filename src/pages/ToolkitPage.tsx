
import { useState } from 'react';
import { useChallenges } from '@/hooks/use-challenges';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronRight, Clock, FilePlus, Loader2, Trophy } from "lucide-react";
import { format } from 'date-fns';
import { Challenge, ChallengeActivity, UserChallenge } from '@/types';

const ToolkitPage = () => {
  const { 
    loading, 
    challenges, 
    userChallenges, 
    activeChallenges,
    startChallenge, 
    completeDay,
    createCustomChallenge 
  } = useChallenges();

  const [activeChallenge, setActiveChallenge] = useState<UserChallenge | null>(null);
  const [viewingChallenge, setViewingChallenge] = useState<Challenge | null>(null);
  const [creatingChallenge, setCreatingChallenge] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  
  // New challenge form state
  const [newChallenge, setNewChallenge] = useState<{
    title: string;
    description: string;
    duration: number;
    activities: { title: string; description: string }[];
  }>({
    title: '',
    description: '',
    duration: 7,
    activities: Array(7).fill(null).map(() => ({ title: '', description: '' }))
  });

  const handleStartChallenge = async (challengeId: string) => {
    setSubmitting(true);
    try {
      await startChallenge(challengeId);
    } catch (error) {
      console.error('Error starting challenge:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteDay = async () => {
    if (!activeChallenge) return;
    
    setSubmitting(true);
    try {
      await completeDay(
        activeChallenge.id, 
        activeChallenge.current_day, 
        completionNotes
      );
      setCompletionNotes('');
      setActiveChallenge(null);
    } catch (error) {
      console.error('Error completing day:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Filter out empty activities
      const validActivities = newChallenge.activities
        .slice(0, newChallenge.duration)
        .map((activity, index) => ({
          ...activity,
          title: activity.title || `Day ${index + 1}`,
        }));
      
      await createCustomChallenge(
        newChallenge.title,
        newChallenge.description,
        newChallenge.duration,
        validActivities
      );
      
      // Reset form
      setNewChallenge({
        title: '',
        description: '',
        duration: 7,
        activities: Array(7).fill(null).map(() => ({ title: '', description: '' }))
      });
      setCreatingChallenge(false);
    } catch (error) {
      console.error('Error creating challenge:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const updateActivityField = (index: number, field: 'title' | 'description', value: string) => {
    const updatedActivities = [...newChallenge.activities];
    updatedActivities[index] = { 
      ...updatedActivities[index],
      [field]: value 
    };
    
    setNewChallenge({
      ...newChallenge,
      activities: updatedActivities
    });
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Relationship Toolkit</h1>
      <p className="text-muted-foreground mb-8">Tools and challenges to strengthen your relationship</p>
      
      <Tabs defaultValue="challenges">
        <TabsList className="mb-8">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="active">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="challenges">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Available Challenges</h2>
            <Dialog open={creatingChallenge} onOpenChange={setCreatingChallenge}>
              <DialogTrigger asChild>
                <Button>
                  <FilePlus className="mr-2 h-4 w-4" /> Create Challenge
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <form onSubmit={handleCreateChallenge}>
                  <DialogHeader>
                    <DialogTitle>Create New Challenge</DialogTitle>
                    <DialogDescription>
                      Design a custom relationship challenge for you and your partner.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Challenge Title</Label>
                      <Input 
                        id="title"
                        value={newChallenge.title}
                        onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                        placeholder="e.g., Communication Week"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description"
                        value={newChallenge.description}
                        onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                        placeholder="What is this challenge about?"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (Days)</Label>
                      <Input 
                        id="duration"
                        type="number"
                        min="1"
                        max="30"
                        value={newChallenge.duration}
                        onChange={(e) => {
                          const duration = parseInt(e.target.value);
                          if (duration >= 1 && duration <= 30) {
                            setNewChallenge({
                              ...newChallenge, 
                              duration,
                              activities: Array(duration).fill(null).map((_, i) => 
                                newChallenge.activities[i] || { title: '', description: '' }
                              )
                            });
                          }
                        }}
                        required
                      />
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <Label>Daily Activities</Label>
                      {newChallenge.activities.slice(0, newChallenge.duration).map((activity, index) => (
                        <div key={index} className="space-y-3 border rounded-lg p-4">
                          <h4 className="font-medium">Day {index + 1}</h4>
                          <div className="space-y-2">
                            <Label htmlFor={`activity-${index}-title`}>Activity Title</Label>
                            <Input 
                              id={`activity-${index}-title`}
                              value={activity.title}
                              onChange={(e) => updateActivityField(index, 'title', e.target.value)}
                              placeholder={`Day ${index + 1} Activity`}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`activity-${index}-description`}>Instructions</Label>
                            <Textarea 
                              id={`activity-${index}-description`}
                              value={activity.description}
                              onChange={(e) => updateActivityField(index, 'description', e.target.value)}
                              placeholder="What should partners do on this day?"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" disabled={submitting || !newChallenge.title}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Create Challenge
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading challenges...</p>
            </div>
          ) : challenges.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No challenges available</p>
              <Button variant="outline" className="mt-4" onClick={() => setCreatingChallenge(true)}>
                Create Your First Challenge
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map(challenge => {
                const isStarted = userChallenges.some(uc => uc.challenge_id === challenge.id);
                
                return (
                  <Card key={challenge.id} className="overflow-hidden border">
                    <CardHeader className="pb-2">
                      <CardTitle>{challenge.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> {challenge.duration_days} days
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">
                        {challenge.description || "Complete daily activities to strengthen your relationship."}
                      </p>
                      {challenge.activities && challenge.activities.length > 0 && (
                        <div className="space-y-1 mb-2">
                          <p className="text-xs text-muted-foreground">Sample activities:</p>
                          <ul className="text-sm list-disc pl-5">
                            {challenge.activities
                              .slice(0, 2)
                              .map((activity) => (
                                <li key={activity.id}>{activity.title}</li>
                              ))}
                            {challenge.activities.length > 2 && (
                              <li className="text-muted-foreground">
                                ...and {challenge.activities.length - 2} more
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setViewingChallenge(challenge)}
                      >
                        View Details
                      </Button>
                      <Button 
                        disabled={isStarted || submitting} 
                        size="sm"
                        onClick={() => handleStartChallenge(challenge.id)}
                      >
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isStarted ? (
                          "Already Started"
                        ) : (
                          "Start Challenge"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* Challenge Details Dialog */}
          {viewingChallenge && (
            <Dialog open={!!viewingChallenge} onOpenChange={(open) => !open && setViewingChallenge(null)}>
              <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{viewingChallenge.title}</DialogTitle>
                  <DialogDescription>
                    {viewingChallenge.duration_days} day challenge
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <p className="text-sm mb-6">
                    {viewingChallenge.description || "Complete daily activities to strengthen your relationship."}
                  </p>
                  
                  <h4 className="text-sm font-medium mb-3">Daily Activities:</h4>
                  <div className="space-y-4">
                    {viewingChallenge.activities?.sort((a, b) => a.day_number - b.day_number).map((activity) => (
                      <div key={activity.id} className="border rounded-lg p-4">
                        <h5 className="font-medium mb-1">Day {activity.day_number}: {activity.title}</h5>
                        {activity.description && <p className="text-sm text-muted-foreground">{activity.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button onClick={() => handleStartChallenge(viewingChallenge.id)}>
                    Start Challenge
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
        
        <TabsContent value="active">
          <h2 className="text-2xl font-bold mb-6">Your Active Challenges</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading your challenges...</p>
            </div>
          ) : activeChallenges.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You don't have any active challenges</p>
              <Button variant="outline" className="mt-4" onClick={() => document.getElementById('challenges-tab')?.click()}>
                Browse Available Challenges
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {activeChallenges.map(userChallenge => {
                const challenge = userChallenge.challenge;
                if (!challenge) return null;
                
                const progressPercentage = (userChallenge.current_day - 1) / challenge.duration_days * 100;
                
                // Find the current day activity
                const currentActivity = challenge.activities?.find(
                  a => a.day_number === userChallenge.current_day
                );
                
                return (
                  <Card key={userChallenge.id} className="border">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{challenge.title}</CardTitle>
                          <CardDescription>
                            Started on {format(new Date(userChallenge.start_date), 'MMM d, yyyy')}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            Day {userChallenge.current_day} of {challenge.duration_days}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round(progressPercentage)}% Complete
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={progressPercentage} className="h-2" />
                      
                      {currentActivity && (
                        <div className="border rounded-lg p-4 bg-muted/40">
                          <h3 className="font-medium mb-1">Today's Activity: {currentActivity.title}</h3>
                          {currentActivity.description && (
                            <p className="text-sm">{currentActivity.description}</p>
                          )}
                          
                          <Button 
                            className="mt-4"
                            onClick={() => setActiveChallenge(userChallenge)}
                          >
                            Complete Today's Activity
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* Complete Activity Dialog */}
          {activeChallenge && (
            <Dialog open={!!activeChallenge} onOpenChange={(open) => !open && setActiveChallenge(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Complete Day {activeChallenge.current_day}</DialogTitle>
                  <DialogDescription>
                    {activeChallenge.challenge?.title}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">
                      {activeChallenge.challenge?.activities?.find(
                        a => a.day_number === activeChallenge.current_day
                      )?.title}
                    </h3>
                    <p className="text-sm">
                      {activeChallenge.challenge?.activities?.find(
                        a => a.day_number === activeChallenge.current_day
                      )?.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="completion-notes">Reflections (Optional)</Label>
                    <Textarea 
                      id="completion-notes"
                      placeholder="Share your thoughts on today's activity..."
                      value={completionNotes}
                      onChange={(e) => setCompletionNotes(e.target.value)}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    onClick={handleCompleteDay}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Completing...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Mark as Complete
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          <h2 className="text-2xl font-bold mb-6">Completed Challenges</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading completed challenges...</p>
            </div>
          ) : userChallenges.filter(uc => uc.status === 'completed').length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't completed any challenges yet</p>
              <Button variant="outline" className="mt-4" onClick={() => document.getElementById('challenges-tab')?.click()}>
                Browse Available Challenges
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userChallenges
                .filter(uc => uc.status === 'completed')
                .map(userChallenge => (
                  <Card key={userChallenge.id} className="overflow-hidden">
                    <CardHeader className="bg-primary/10 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>{userChallenge.challenge?.title}</CardTitle>
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <CardDescription>
                        Completed on {format(
                          new Date(
                            new Date(userChallenge.start_date).getTime() + 
                            (userChallenge.challenge?.duration_days || 0) * 24 * 60 * 60 * 1000
                          ), 
                          'MMM d, yyyy'
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm mb-2">
                        {userChallenge.challenge?.description}
                      </p>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {userChallenge.challenge?.duration_days} days
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              }
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ToolkitPage;
