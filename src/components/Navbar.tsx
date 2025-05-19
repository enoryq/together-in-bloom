
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Heart, Book, MessageCircle, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would be replaced by real auth logic

  const navItems = [
    { to: "/dashboard", text: "Dashboard", icon: <Heart size={20} /> },
    { to: "/journal", text: "Journal", icon: <Book size={20} /> },
    { to: "/toolkit", text: "Toolkit", icon: <MessageCircle size={20} /> },
    { to: "/profile", text: "Profile", icon: <User size={20} /> },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <NavLink to="/" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary animate-pulse-gentle" />
          <span className="font-bold text-lg">Together In Bloom</span>
        </NavLink>
        
        {isLoggedIn ? (
          <nav className={isMobile ? "fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 flex justify-around z-50" : "ml-auto flex items-center space-x-1"}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors
                  ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}
                  ${isMobile ? "flex-col space-x-0 text-xs" : ""}`
                }
              >
                {item.icon}
                {isMobile ? <span>{item.text}</span> : <span className="hidden sm:inline">{item.text}</span>}
              </NavLink>
            ))}
          </nav>
        ) : (
          <div className="flex items-center space-x-2">
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
