
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HeartPulse } from "lucide-react";

type HealthCategory = {
  name: string;
  score: number;
  color: string;
};

const RelationshipHealth = () => {
  const [overallScore, setOverallScore] = useState(0);
  const [categories, setCategories] = useState<HealthCategory[]>([
    { name: "Communication", score: 0, color: "bg-blue-500" },
    { name: "Quality Time", score: 0, color: "bg-green-500" },
    { name: "Intimacy", score: 0, color: "bg-purple-500" },
    { name: "Conflict Resolution", score: 0, color: "bg-yellow-500" },
    { name: "Shared Goals", score: 0, color: "bg-red-500" },
  ]);

  useEffect(() => {
    // Simulate fetching scores from API or database
    // In a real app, this would come from user data
    const mockScores = [
      { name: "Communication", score: 75, color: "bg-blue-500" },
      { name: "Quality Time", score: 80, color: "bg-green-500" },
      { name: "Intimacy", score: 70, color: "bg-purple-500" },
      { name: "Conflict Resolution", score: 65, color: "bg-yellow-500" },
      { name: "Shared Goals", score: 85, color: "bg-red-500" },
    ];
    
    setCategories(mockScores);
    
    // Calculate overall score (average)
    const total = mockScores.reduce((sum, category) => sum + category.score, 0);
    setOverallScore(Math.round(total / mockScores.length));
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <HeartPulse className="h-5 w-5 mr-2 text-primary" />
          Relationship Health
        </CardTitle>
        <CardDescription>Your relationship vitality score</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Overall Health</span>
            <span className="text-sm font-medium">{overallScore}%</span>
          </div>
          <Progress value={overallScore} className="h-2" />
        </div>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">{category.name}</span>
                <span className="text-xs">{category.score}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${category.color}`} 
                  style={{ width: `${category.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelationshipHealth;
