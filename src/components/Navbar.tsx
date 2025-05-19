
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Heart, 
  Book, 
  MessageCircle, 
  User, 
  Calendar,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would be replaced by real auth logic
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { to: "/dashboard", text: "Dashboard", icon: <Heart size={20} /> },
    { to: "/journal", text: "Journal", icon: <Book size={20} /> },
  ];
  
  const toolsNavItems = [
    { to: "/toolkit", text: "All Tools", icon: <MessageCircle size={20} /> },
    { to: "/love-languages", text: "Love Languages", icon: <Heart size={16} /> },
    { to: "/emotions-wheel", text: "Emotions Wheel", icon: <Heart size={16} /> },
  ];

  const profileNavItems = [
    { to: "/profile", text: "Profile", icon: <User size={20} /> },
    { to: "/about", text: "About", icon: null },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <NavLink to="/" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary animate-pulse-gentle" />
          <span className="font-bold text-lg">Together In Bloom</span>
        </NavLink>
        
        {isLoggedIn ? (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 ml-auto">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors
                    ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`
                  }
                >
                  {item.icon}
                  <span>{item.text}</span>
                </NavLink>
              ))}
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-3 p-4">
                        {toolsNavItems.map((item) => (
                          <li key={item.to}>
                            <NavigationMenuLink asChild>
                              <NavLink
                                to={item.to}
                                className={({ isActive }) => 
                                  `flex items-center space-x-2 p-2 rounded-md w-full
                                  ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`
                                }
                              >
                                {item.icon && <span>{item.icon}</span>}
                                <span>{item.text}</span>
                              </NavLink>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              {profileNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors
                    ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`
                  }
                >
                  {item.icon}
                  <span>{item.text}</span>
                </NavLink>
              ))}
            </nav>
            
            {/* Mobile Navigation */}
            {isMobile && (
              <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 flex justify-around z-50">
                {mainNavItems.concat(toolsNavItems[0], profileNavItems[0]).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => 
                      `flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors text-xs
                      ${isActive ? "bg-primary/10 text-primary" : ""}`
                    }
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </NavLink>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex flex-col items-center space-y-1 px-2 py-1 h-auto"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu size={20} />
                  <span className="text-xs">More</span>
                </Button>
              </nav>
            )}
            
            {/* Mobile Expanded Menu */}
            {isMobile && isMobileMenuOpen && (
              <div className="fixed inset-0 bg-background/95 z-50 flex flex-col items-center justify-center">
                <Button 
                  variant="ghost" 
                  className="absolute top-4 right-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ✕
                </Button>
                <div className="flex flex-col space-y-4 w-full max-w-xs p-4">
                  {[...toolsNavItems, ...profileNavItems].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                        ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
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
            <NavLink to="/connect" className="bloom-btn-primary">
              Get Started
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
