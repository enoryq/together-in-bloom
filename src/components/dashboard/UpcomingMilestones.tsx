
import { useMilestones } from '@/hooks/use-milestones';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarHeart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UpcomingMilestones = () => {
  const { upcomingMilestones, loading } = useMilestones();
  const navigate = useNavigate();
  
  // Calculate days until a date
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <CalendarHeart className="h-5 w-5 mr-2 text-primary" />
          Upcoming Milestones
        </CardTitle>
        <CardDescription>Special moments to look forward to</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-6 text-muted-foreground">Loading milestones...</p>
        ) : upcomingMilestones.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-2">No upcoming milestones</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/profile')}
              className="mt-2"
            >
              Add milestone
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingMilestones.slice(0, 3).map((milestone) => {
              const daysUntil = getDaysUntil(milestone.date);
              return (
                <div 
                  key={milestone.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(milestone.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      daysUntil <= 7 ? 'bg-red-100 text-red-800' : 
                      daysUntil <= 14 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {daysUntil === 0 ? 'Today!' : 
                       daysUntil === 1 ? 'Tomorrow' : 
                       `${daysUntil} days`}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {upcomingMilestones.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full flex justify-center items-center" 
                onClick={() => navigate('/profile')}
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingMilestones;
