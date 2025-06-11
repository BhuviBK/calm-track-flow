
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { NotificationService } from "./services/notificationService";
import { useEffect } from "react";

import Index from "./pages/Index";
import MeditatePage from "./pages/MeditatePage";
import TrackPage from "./pages/TrackPage";
import TodoPage from "./pages/TodoPage";
import CalendarPage from "./pages/CalendarPage";
import ExercisePage from "./pages/ExercisePage";
import ExpensePage from "./pages/ExpensePage";
import FoodPage from "./pages/FoodPage";
import PomodoroPage from "./pages/PomodoroPage";
import ExerciseTimerPage from "./pages/ExerciseTimerPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize notifications when app starts
    NotificationService.initialize();
    NotificationService.handleNotificationClick();
  }, []);

  return (
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
              <Route path="/food" element={<FoodPage />} />
              <Route path="/pomodoro" element={<PomodoroPage />} />
              <Route path="/exercise-timer" element={<ExerciseTimerPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
