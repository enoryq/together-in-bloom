
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Connect from "./pages/Connect";
import JournalPage from "./pages/JournalPage";
import ToolkitPage from "./pages/ToolkitPage";
import AboutPage from "./pages/AboutPage";
import LoveLanguagesPage from "./pages/LoveLanguagesPage";
import EmotionsWheelPage from "./pages/EmotionsWheelPage";
import Auth from "./pages/Auth";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AppSidebar from "./components/AppSidebar";
import OnboardingGuide from "./components/OnboardingGuide";
import { SidebarProvider } from "./components/ui/sidebar";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppLayout = ({ children, requireAuth = false }: { children: React.ReactNode; requireAuth?: boolean }) => {
  const { isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Only show onboarding after component mounted to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (requireAuth) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {isAuthenticated && <AppSidebar />}
          <div className="flex-1">
            <Navbar />
            <main className="container px-4 py-6">
              <ProtectedRoute>{children}</ProtectedRoute>
              {isMounted && isAuthenticated && <OnboardingGuide />}
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Index /></AppLayout>} />
            <Route path="/auth" element={<AppLayout><Auth /></AppLayout>} />
            <Route path="/dashboard" element={<AppLayout requireAuth><Dashboard /></AppLayout>} />
            <Route path="/profile" element={<AppLayout requireAuth><Profile /></AppLayout>} />
            <Route path="/connect" element={<AppLayout requireAuth><Connect /></AppLayout>} />
            <Route path="/journal" element={<AppLayout requireAuth><JournalPage /></AppLayout>} />
            <Route path="/toolkit" element={<AppLayout requireAuth><ToolkitPage /></AppLayout>} />
            <Route path="/love-languages" element={<AppLayout requireAuth><LoveLanguagesPage /></AppLayout>} />
            <Route path="/emotions-wheel" element={<AppLayout requireAuth><EmotionsWheelPage /></AppLayout>} />
            <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
            <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
