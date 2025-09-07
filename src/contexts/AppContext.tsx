import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MoodData {
  date: Date;
  mood: number;
  note: string;
}

interface MeditationData {
  date: Date;
  duration: number;
}

interface ExpenseData {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
}

interface FoodData {
  id: string;
  date: Date;
  name: string;
  calories: number;
  quantity: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface AppContextType {
  moodEntries: MoodData[];
  meditationSessions: MeditationData[];
  expenses: ExpenseData[];
  foodEntries: FoodData[];
  addMoodEntry: (entry: MoodData) => void;
  addMeditationSession: (session: MeditationData) => void;
  addExpense: (expense: ExpenseData) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (expense: ExpenseData) => void;
  addFoodEntry: (food: FoodData) => void;
  deleteFoodEntry: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [moodEntries, setMoodEntries] = useState<MoodData[]>([]);
  const [meditationSessions, setMeditationSessions] = useState<MeditationData[]>([]);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodData[]>([]);
  
  // Load data from Supabase when user changes
  useEffect(() => {
    if (!user) {
      // Clear data when user logs out
      setMoodEntries([]);
      setMeditationSessions([]);
      setExpenses([]);
      setFoodEntries([]);
      return;
    }

    loadAllData();
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;

    try {
      // Load mood entries
      const { data: moods } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (moods) {
        setMoodEntries(moods.map(mood => ({
          ...mood,
          date: new Date(mood.date)
        })));
      }

      // Load meditation sessions
      const { data: sessions } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (sessions) {
        setMeditationSessions(sessions.map(session => ({
          ...session,
          date: new Date(session.date)
        })));
      }

      // Load expenses
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (expensesData) {
        setExpenses(expensesData.map(expense => ({
          ...expense,
          date: new Date(expense.date)
        })));
      }

      // Load food entries
      const { data: foods } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (foods) {
        setFoodEntries(foods.map(food => ({
          ...food,
          date: new Date(food.date),
          meal: food.meal as 'breakfast' | 'lunch' | 'dinner' | 'snack'
        })));
      }
    } catch (error) {
      console.error('Failed to load data from Supabase', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your data. Please try again.",
      });
    }
  };
  
  // Supabase functions for data management
  
  const addMoodEntry = async (entry: MoodData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('mood_entries')
        .upsert({
          user_id: user.id,
          date: entry.date.toISOString().split('T')[0],
          mood: entry.mood,
          note: entry.note
        });

      if (error) throw error;

      // Update local state
      const existingIndex = moodEntries.findIndex(
        (item) => new Date(item.date).toDateString() === new Date(entry.date).toDateString()
      );
      
      if (existingIndex !== -1) {
        const updatedEntries = [...moodEntries];
        updatedEntries[existingIndex] = entry;
        setMoodEntries(updatedEntries);
      } else {
        setMoodEntries(prev => [...prev, entry]);
      }

      toast({
        title: "Success",
        description: "Mood entry saved successfully.",
      });
    } catch (error) {
      console.error('Error adding mood entry:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
      });
    }
  };
  
  const addMeditationSession = async (session: MeditationData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('meditation_sessions')
        .insert({
          user_id: user.id,
          date: session.date.toISOString(),
          duration: session.duration
        });

      if (error) throw error;

      setMeditationSessions(prev => [...prev, session]);

      toast({
        title: "Success",
        description: "Meditation session saved successfully.",
      });
    } catch (error) {
      console.error('Error adding meditation session:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save meditation session. Please try again.",
      });
    }
  };
  
  const addExpense = async (expense: ExpenseData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          date: expense.date.toISOString().split('T')[0],
          amount: expense.amount,
          category: expense.category,
          description: expense.description
        });

      if (error) throw error;

      setExpenses(prev => [...prev, expense]);

      toast({
        title: "Success",
        description: "Expense added successfully.",
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add expense. Please try again.",
      });
    }
  };
  
  const deleteExpense = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setExpenses(prev => prev.filter(expense => expense.id !== id));

      toast({
        title: "Success",
        description: "Expense deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete expense. Please try again.",
      });
    }
  };

  const updateExpense = async (expense: ExpenseData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          date: expense.date.toISOString().split('T')[0],
          amount: expense.amount,
          category: expense.category,
          description: expense.description
        })
        .eq('id', expense.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));

      toast({
        title: "Success",
        description: "Expense updated successfully.",
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update expense. Please try again.",
      });
    }
  };

  const addFoodEntry = async (food: FoodData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('food_entries')
        .insert({
          user_id: user.id,
          date: food.date.toISOString().split('T')[0],
          name: food.name,
          calories: food.calories,
          quantity: food.quantity,
          meal: food.meal
        });

      if (error) throw error;

      setFoodEntries(prev => [...prev, food]);

      toast({
        title: "Success",
        description: "Food entry added successfully.",
      });
    } catch (error) {
      console.error('Error adding food entry:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add food entry. Please try again.",
      });
    }
  };

  const deleteFoodEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setFoodEntries(prev => prev.filter(food => food.id !== id));

      toast({
        title: "Success",
        description: "Food entry deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting food entry:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete food entry. Please try again.",
      });
    }
  };
  
  const value = {
    moodEntries,
    meditationSessions,
    expenses,
    foodEntries,
    addMoodEntry,
    addMeditationSession,
    addExpense,
    deleteExpense,
    updateExpense,
    addFoodEntry,
    deleteFoodEntry,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
