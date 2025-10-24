import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/ui/theme-provider";
import MainLayout from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NewInterview from "./pages/NewInterview";
import { InterviewSession } from "./pages/InterviewSession";
import Interview from "./pages/Interview";
import Practice from "./pages/Practice";
import Interviews from "./pages/Interviews";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Help from "./pages/Help";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import Features from "./pages/Features";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="prepwise-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/interview/new" element={<ProtectedRoute><NewInterview /></ProtectedRoute>} />
                <Route path="/interview/:id" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
                <Route path="/interview/:id/session" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
                <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
                <Route path="/interviews" element={<ProtectedRoute><Interviews /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/help" element={<Help />} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/features" element={<Features />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
