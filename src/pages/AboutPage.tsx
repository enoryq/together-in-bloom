
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="container px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">About Together In Bloom</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Our Mission
          </CardTitle>
          <CardDescription>
            Helping couples build stronger, healthier relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Together In Bloom was created with one mission in mind: to provide couples 
            with science-backed tools and resources that strengthen their bonds and deepen 
            their connection.
          </p>
          <p>
            We believe that healthy relationships require ongoing nurturing, communication, 
            and mutual understanding. Our platform offers various interactive tools designed 
            to help couples better understand each other, express their feelings effectively, 
            and continuously grow together.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Our Approach</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our toolkit and resources are based on established relationship psychology 
              principles and research. We focus on practical, actionable tools that couples 
              can easily integrate into their daily lives.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Privacy First</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We understand that relationship matters are deeply personal. That's why 
              we prioritize your privacy and security, ensuring that your data and 
              personal reflections remain private between you and your partner.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
