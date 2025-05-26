
import { NavLink, useLocation } from "react-router-dom";
import { 
  Heart, 
  Book, 
  MessageCircle, 
  User, 
  Settings,
  Home,
  Users,
  Target,
  Trophy,
  Bot,
  Calendar,
  Sparkles
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";

const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  
  const mainNavItems = [
    { to: "/dashboard", text: "Dashboard", icon: <Home size={20} /> },
    { to: "/connect", text: "Partner Hub", icon: <Users size={20} /> },
    { to: "/journal", text: "Journal", icon: <Book size={20} /> },
    { to: "/ai-companion", text: "AI Coach", icon: <Bot size={20} /> },
  ];
  
  const toolsNavItems = [
    { to: "/toolkit", text: "All Tools", icon: <Target size={20} /> },
    { to: "/love-languages", text: "Love Languages", icon: <Heart size={16} /> },
    { to: "/emotions-wheel", text: "Emotions Wheel", icon: <Sparkles size={16} /> },
  ];

  const personalNavItems = [
    { to: "/profile", text: "Profile & Milestones", icon: <Calendar size={20} /> },
    { to: "/about", text: "About App", icon: <Settings size={20} /> },
  ];

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarHeader>
        <div className="flex items-center pl-2 py-3">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-semibold">Together In Bloom</span>
            </div>
          )}
          {isCollapsed && <Heart className="h-5 w-5 text-primary mx-auto" />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.text : undefined}>
                    <NavLink to={item.to} end className={getNavCls}>
                      {item.icon}
                      {!isCollapsed && <span>{item.text}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Relationship Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsNavItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.text : undefined}>
                    <NavLink to={item.to} className={getNavCls}>
                      {item.icon}
                      {!isCollapsed && <span>{item.text}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Personal Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Personal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {personalNavItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.text : undefined}>
                    <NavLink to={item.to} className={getNavCls}>
                      {item.icon}
                      {!isCollapsed && <span>{item.text}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <div className={`p-2 ${isCollapsed ? 'text-center' : ''}`}>
            <Button 
              variant="ghost" 
              onClick={signOut} 
              className="w-full justify-start"
              size="sm"
            >
              {isCollapsed ? (
                <span>🚪</span>
              ) : (
                <>
                  <span className="mr-2">🚪</span>
                  <span>Sign Out</span>
                </>
              )}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
