import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AlumniDashboard from "./pages/AlumniDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CollegeDashboard from "./pages/CollegeDashboard";
import UniversityDashboard from "./pages/UniversityDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/alumni" element={<ProtectedRoute><AlumniDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/college" element={<ProtectedRoute><CollegeDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/university" element={<ProtectedRoute><UniversityDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/recruiter" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
