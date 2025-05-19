
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ConnectPartner = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [partnerCode, setPartnerCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Connection requested",
        description: "Your partner will need to approve the connection request.",
      });
      setIsLoading(false);
      // Redirect to the homepage
      navigate("/");
    }, 1500);
  };

  const handleCreate = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Account created",
        description: "Your unique connection code is: BLOOM-123",
      });
      setIsLoading(false);
      // Redirect to the homepage
      navigate("/");
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Connect with Your Partner
        </CardTitle>
        <CardDescription>
          Create an account or enter your partner's code to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="join" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="join">Join Partner</TabsTrigger>
            <TabsTrigger value="create">Create Account</TabsTrigger>
          </TabsList>
          <TabsContent value="join" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="partnerCode">Partner Connection Code</Label>
                <Input
                  id="partnerCode"
                  placeholder="Enter your partner's code (e.g. BLOOM-123)"
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value)}
                  className="bloom-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bloom-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bloom-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bloom-input"
                />
              </div>
            </div>
            <Button 
              onClick={handleConnect} 
              className="w-full mt-6 bloom-btn-primary"
              disabled={isLoading || !partnerCode || !name || !email || !password}
            >
              {isLoading ? "Connecting..." : "Connect with Partner"}
            </Button>
          </TabsContent>

          <TabsContent value="create" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="createName">Your Name</Label>
                <Input
                  id="createName"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bloom-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="createEmail">Email</Label>
                <Input
                  id="createEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bloom-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="createPassword">Password</Label>
                <Input
                  id="createPassword"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bloom-input"
                />
              </div>
            </div>
            <Button 
              onClick={handleCreate} 
              className="w-full mt-6 bloom-btn-primary"
              disabled={isLoading || !name || !email || !password}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <p>You'll be able to customize your profile after connecting</p>
      </CardFooter>
    </Card>
  );
};

export default ConnectPartner;
