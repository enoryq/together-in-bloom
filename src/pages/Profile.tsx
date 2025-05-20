
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMilestones } from '@/hooks/use-milestones';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Milestone } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

const Profile = () => {
  const { user } = useAuth();
  const { milestones, upcomingMilestones, loading, addMilestone, deleteMilestone } = useMilestones();
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'custom',
    is_recurring: false
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [submitting, setSubmitting] = useState(false);

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.title || !date) return;
    
    setSubmitting(true);
    try {
      await addMilestone({
        ...newMilestone,
        date: format(date, 'yyyy-MM-dd')
      });
      
      // Reset form
      setNewMilestone({
        title: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'custom',
        is_recurring: false
      });
      setDate(new Date());
      setIsAddingMilestone(false);
    } catch (error) {
      console.error('Failed to add milestone:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    await deleteMilestone(id);
  };

  const displayName = user?.user_metadata?.display_name || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{displayName}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account created</p>
                  <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestones Section */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Relationship Milestones</CardTitle>
                <CardDescription>Keep track of your important dates</CardDescription>
              </div>
              <Dialog open={isAddingMilestone} onOpenChange={setIsAddingMilestone}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Milestone
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleAddMilestone}>
                    <DialogHeader>
                      <DialogTitle>Add New Milestone</DialogTitle>
                      <DialogDescription>
                        Record important dates and events in your relationship.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                          id="title" 
                          value={newMilestone.title} 
                          onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                          placeholder="e.g., First Date, Anniversary" 
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select 
                          value={newMilestone.type} 
                          onValueChange={(value) => setNewMilestone({...newMilestone, type: value as any})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="anniversary">Anniversary</SelectItem>
                            <SelectItem value="birthday">Birthday</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="recurring"
                          checked={newMilestone.is_recurring}
                          onCheckedChange={(checked) => setNewMilestone({...newMilestone, is_recurring: checked})}
                        />
                        <Label htmlFor="recurring">Annual Recurring Event</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea 
                          id="description" 
                          value={newMilestone.description || ''}
                          onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                          placeholder="Add more details about this milestone"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" /> Save Milestone
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="upcoming">
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="all">All Milestones</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  {loading ? (
                    <div className="text-center py-6">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Loading milestones...</p>
                    </div>
                  ) : upcomingMilestones.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No upcoming milestones in the next 30 days</p>
                      <Button variant="outline" className="mt-4" onClick={() => setIsAddingMilestone(true)}>
                        Add Your First Milestone
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingMilestones.map(milestone => (
                        <MilestoneCard 
                          key={milestone.id} 
                          milestone={milestone} 
                          onDelete={handleDeleteMilestone} 
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="all">
                  {loading ? (
                    <div className="text-center py-6">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Loading milestones...</p>
                    </div>
                  ) : milestones.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">You haven't added any milestones yet</p>
                      <Button variant="outline" className="mt-4" onClick={() => setIsAddingMilestone(true)}>
                        Add Your First Milestone
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {milestones.map(milestone => (
                        <MilestoneCard 
                          key={milestone.id} 
                          milestone={milestone} 
                          onDelete={handleDeleteMilestone} 
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface MilestoneCardProps {
  milestone: Milestone;
  onDelete: (id: string) => Promise<void>;
}

const MilestoneCard = ({ milestone, onDelete }: MilestoneCardProps) => {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(milestone.id);
    } catch (error) {
      console.error('Error deleting milestone:', error);
      setDeleting(false);
    }
  };
  
  // Calculate days until milestone
  const daysUntil = () => {
    const today = new Date();
    const milestoneDate = new Date(milestone.date);
    const diffTime = Math.abs(milestoneDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (milestoneDate < today) {
      return 'Past';
    } else if (diffDays === 0) {
      return 'Today!';
    } else {
      return `${diffDays} days`;
    }
  };
  
  const getTypeIcon = () => {
    switch (milestone.type) {
      case 'anniversary':
        return '🎉';
      case 'birthday':
        return '🎂';
      default:
        return '📅';
    }
  };

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{getTypeIcon()}</div>
        <div>
          <h3 className="font-medium">{milestone.title}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {new Date(milestone.date).toLocaleDateString()}
              {milestone.is_recurring && ' (Yearly)'}
            </p>
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-primary/20 text-primary">
              {daysUntil()}
            </span>
          </div>
          {milestone.description && (
            <p className="text-sm mt-1">{milestone.description}</p>
          )}
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default Profile;
