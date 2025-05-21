
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Heart, 
  Menu,
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Since we've wrapped the entire app in SidebarProvider,
  // useSidebar() is now safe to use, but we'll catch any potential errors
  const sidebarContext = (() => {
    try {
      return useSidebar();
    } catch (e) {
      // Return a default object if the sidebar context isn't available
      return { toggleSidebar: () => {} };
    }
  })();

  const { toggleSidebar } = sidebarContext;

  const toolsNavItems = [
    { to: "/toolkit", text: "All Tools" },
    { to: "/love-languages", text: "Love Languages" },
    { to: "/emotions-wheel", text: "Emotions Wheel" },
  ];

  const mainNavItems = [
    { to: "/dashboard", text: "Dashboard" },
    { to: "/journal", text: "Journal" },
    { to: "/connect", text: "Partner" },
    { to: "/profile", text: "Profile" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-2">
          {isAuthenticated && !isMobile && (
            <SidebarTrigger className="h-8 w-8" />
          )}
          
          <NavLink to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary animate-pulse-gentle" />
            <span className="font-bold text-lg">Together In Bloom</span>
          </NavLink>
        </div>
        
        {isAuthenticated ? (
          // For mobile authenticated users, we have a simpler top nav
          isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  {mainNavItems.map((item) => (
                    <SheetClose asChild key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) => 
                          `text-lg py-2 px-4 rounded-md transition-colors
                          ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.text}
                      </NavLink>
                    </SheetClose>
                  ))}
                  <div className="my-2 border-t"></div>
                  {toolsNavItems.map((item) => (
                    <SheetClose asChild key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) => 
                          `text-lg py-2 px-4 rounded-md transition-colors
                          ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.text}
                      </NavLink>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )
        ) : (
          // For non-authenticated users, show login buttons
          <div className="flex items-center space-x-2">
            <NavLink 
              to="/about"
              className={({ isActive }) => 
                `px-3 py-2 rounded-lg transition-colors
                ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`
              }
            >
              About
            </NavLink>
            <NavLink to="/auth" className="bloom-btn-primary">
              Get Started
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
