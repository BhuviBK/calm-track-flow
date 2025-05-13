
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";

import Index from "./pages/Index";
import MeditatePage from "./pages/MeditatePage";
import TrackPage from "./pages/TrackPage";
import TodoPage from "./pages/TodoPage";
import CalendarPage from "./pages/CalendarPage";
import ExercisePage from "./pages/ExercisePage";
import ExpensePage from "./pages/ExpensePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/meditate" element={<MeditatePage />} />
            <Route path="/exercise" element={<ExercisePage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/expense" element={<ExpensePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
