
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import ConnectPartner from "@/components/ConnectPartner";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm mb-4">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="text-primary">Strengthen Your Relationship</span>
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Together In Bloom
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Nurture your relationship with tools designed to deepen your connection, 
                improve communication, and help your love flourish.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mx-auto">
              <Button className="bloom-btn-primary" size="lg" asChild>
                <Link to="/connect">
                  Get Started
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Tools to Help Your Relationship Flourish
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Our science-backed features are designed to strengthen your emotional bond, 
                improve communication, and deepen intimacy.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Link to="/love-languages" className="block">
              <div className="bloom-card hover:scale-105 transition-transform">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Love Languages</h3>
                <p className="text-muted-foreground">
                  Discover how you and your partner prefer to give and receive love with our 
                  5 Love Languages assessment.
                </p>
              </div>
            </Link>
            <Link to="/emotions-wheel" className="block">
              <div className="bloom-card hover:scale-105 transition-transform">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><circle cx="12" cy="12" r="10"/><path d="M12 2a5 5 0 0 0-2.45 9.33 5 5 0 0 1-3.91 4.61 10 10 0 0 0 12.71 0 5 5 0 0 1-3.9-4.62A5 5 0 0 0 12 2Z"/></svg>
                </div>
                <h3 className="text-xl font-bold">Emotions Wheel</h3>
                <p className="text-muted-foreground">
                  Identify and express your emotions more clearly, enhancing empathy and understanding 
                  in your relationship.
                </p>
              </div>
            </Link>
            <Link to="/journal" className="block">
              <div className="bloom-card hover:scale-105 transition-transform">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <h3 className="text-xl font-bold">Relationship Journal</h3>
                <p className="text-muted-foreground">
                  Document your journey together with guided prompts that encourage reflection 
                  and appreciation.
                </p>
              </div>
            </Link>
            <Link to="/connect" className="block">
              <div className="bloom-card hover:scale-105 transition-transform">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M16 22h2a2 2 0 0 0 2-2v-1a7 7 0 0 0-7-7h-2a7 7 0 0 0-7 7v1a2 2 0 0 0 2 2h2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <h3 className="text-xl font-bold">Partner Connection</h3>
                <p className="text-muted-foreground">
                  Link accounts with your partner to track your growth together and celebrate 
                  relationship milestones.
                </p>
              </div>
            </Link>
            <Link to="/toolkit" className="block">
              <div className="bloom-card hover:scale-105 transition-transform">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
                </div>
                <h3 className="text-xl font-bold">Conversation Starters</h3>
                <p className="text-muted-foreground">
                  Spark meaningful discussions with curated questions that build intimacy 
                  and deepen your connection.
                </p>
              </div>
            </Link>
            <Link to="/toolkit" className="block">
              <div className="bloom-card hover:scale-105 transition-transform">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                </div>
                <h3 className="text-xl font-bold">Relationship Challenges</h3>
                <p className="text-muted-foreground">
                  Participate in guided activities designed to strengthen your bond and create 
                  shared experiences.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section with Sign Up Form */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Start Your Journey Together Today
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Create an account or connect with your partner's code to begin nurturing your 
                relationship with our suite of tools and resources.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Free account creation</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Simple partner connection process</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Access to all relationship tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Track your progress together</span>
                </li>
              </ul>
            </div>
            
            <div className="rounded-xl overflow-hidden border bg-card">
              <ConnectPartner />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full border-t bg-muted/30 py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                © 2025 Together In Bloom. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
