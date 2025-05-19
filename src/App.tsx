
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { useEffect } from "react";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
          <Route path="/connect" element={<AppLayout><Connect /></AppLayout>} />
          <Route path="/journal" element={<AppLayout><JournalPage /></AppLayout>} />
          <Route path="/toolkit" element={<AppLayout><ToolkitPage /></AppLayout>} />
          <Route path="/love-languages" element={<AppLayout><LoveLanguagesPage /></AppLayout>} />
          <Route path="/emotions-wheel" element={<AppLayout><EmotionsWheelPage /></AppLayout>} />
          <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
          <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
