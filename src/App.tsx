
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { NotificationService } from "./services/notificationService";
import { useEffect } from "react";

import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import MeditatePage from "./pages/MeditatePage";
import TrackPage from "./pages/TrackPage";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import ExercisePage from "./pages/ExercisePage";
import ExpensePage from "./pages/ExpensePage";
import FoodPage from "./pages/FoodPage";
import PomodoroPage from "./pages/PomodoroPage";
import ExerciseTimerPage from "./pages/ExerciseTimerPage";
import TodoPage from "./pages/TodoPage";
import BudgetPage from "./pages/BudgetPage";
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
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/meditate" element={<ProtectedRoute><MeditatePage /></ProtectedRoute>} />
                <Route path="/exercise" element={<ProtectedRoute><ExercisePage /></ProtectedRoute>} />
                <Route path="/track" element={<ProtectedRoute><TrackPage /></ProtectedRoute>} />
                <Route path="/expense" element={<ProtectedRoute><ExpensePage /></ProtectedRoute>} />
                <Route path="/food" element={<ProtectedRoute><FoodPage /></ProtectedRoute>} />
                <Route path="/pomodoro" element={<ProtectedRoute><PomodoroPage /></ProtectedRoute>} />
                <Route path="/exercise-timer" element={<ProtectedRoute><ExerciseTimerPage /></ProtectedRoute>} />
                <Route path="/todo" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
                <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
