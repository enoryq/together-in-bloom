
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { toast } = useToast();
  // Mock data - in a real app this would come from a database
  const [profile, setProfile] = useState({
    name: "Jamie Smith",
    email: "jamie@example.com",
    avatar: "",
    partnerName: "Alex Johnson",
    partnerAvatar: "",
    relationshipDuration: "2 years, 3 months",
    connectionCode: "BLOOM-123",
    anniversaries: [
      { title: "First Date", date: "March 15, 2021" },
      { title: "Relationship Anniversary", date: "April 10, 2021" },
    ],
    stats: [
      { title: "Journal Entries", count: 24, icon: <Calendar className="h-4 w-4" /> },
      { title: "Activities Completed", count: 15, icon: <Heart className="h-4 w-4" /> },
      { title: "Messages Exchanged", count: 128, icon: <MessageCircle className="h-4 w-4" /> },
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedEmail, setEditedEmail] = useState(profile.email);

  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      name: editedName,
      email: editedEmail,
    });
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center sm:items-start">
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Manage your account information and settings
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)} 
              variant={isEditing ? "outline" : "default"}
              className="bloom-btn"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="text-2xl bg-primary/20">{profile.name.substring(0, 1)}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-4 flex-1">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={editedName} 
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bloom-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={editedEmail} 
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="bloom-input"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-medium">{profile.name}</h3>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      Connection Code: {profile.connectionCode}
                    </Badge>
                    <Badge variant="outline" className="bg-secondary/20">
                      Together for {profile.relationshipDuration}
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {isEditing && (
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveProfile}
                className="bloom-btn-primary"
              >
                Save Changes
              </Button>
            </div>
          )}

          {!isEditing && (
            <>
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-3">Connected with</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.partnerAvatar} alt={profile.partnerName} />
                    <AvatarFallback className="bg-secondary/20">{profile.partnerName.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{profile.partnerName}</p>
                    <p className="text-sm text-muted-foreground">Connected since April 2021</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-3">Important Dates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.anniversaries.map((anniversary, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg border">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{anniversary.title}</p>
                        <p className="text-sm text-muted-foreground">{anniversary.date}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="flex items-center justify-center gap-2 h-[72px]">
                    <Calendar className="h-5 w-5" />
                    <span>Add Important Date</span>
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-3">Relationship Activity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {profile.stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center p-4 rounded-lg border bg-muted/30">
                      <div className="rounded-full bg-primary/10 p-3 mb-2">
                        {stat.icon}
                      </div>
                      <p className="text-2xl font-bold">{stat.count}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
