
import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface AppContextType {
  moodEntries: MoodData[];
  meditationSessions: MeditationData[];
  expenses: ExpenseData[];
  addMoodEntry: (entry: MoodData) => void;
  addMeditationSession: (session: MeditationData) => void;
  addExpense: (expense: ExpenseData) => void;
  deleteExpense: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [moodEntries, setMoodEntries] = useState<MoodData[]>([]);
  const [meditationSessions, setMeditationSessions] = useState<MeditationData[]>([]);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedMoodEntries = localStorage.getItem('zenmind_moodEntries');
      const storedMeditationSessions = localStorage.getItem('zenmind_meditationSessions');
      const storedExpenses = localStorage.getItem('zenmind_expenses');
      
      if (storedMoodEntries) {
        const parsedMoods = JSON.parse(storedMoodEntries);
        const moodsWithDates = parsedMoods.map((mood: any) => ({
          ...mood,
          date: new Date(mood.date)
        }));
        setMoodEntries(moodsWithDates);
      }
      
      if (storedMeditationSessions) {
        const parsedSessions = JSON.parse(storedMeditationSessions);
        const sessionsWithDates = parsedSessions.map((session: any) => ({
          ...session,
          date: new Date(session.date)
        }));
        setMeditationSessions(sessionsWithDates);
      }
      
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        const expensesWithDates = parsedExpenses.map((expense: any) => ({
          ...expense,
          date: new Date(expense.date)
        }));
        setExpenses(expensesWithDates);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('zenmind_moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);
  
  useEffect(() => {
    localStorage.setItem('zenmind_meditationSessions', JSON.stringify(meditationSessions));
  }, [meditationSessions]);
  
  useEffect(() => {
    localStorage.setItem('zenmind_expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  const addMoodEntry = (entry: MoodData) => {
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
  };
  
  const addMeditationSession = (session: MeditationData) => {
    setMeditationSessions(prev => [...prev, session]);
  };
  
  const addExpense = (expense: ExpenseData) => {
    setExpenses(prev => [...prev, expense]);
  };
  
  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };
  
  const value = {
    moodEntries,
    meditationSessions,
    expenses,
    addMoodEntry,
    addMeditationSession,
    addExpense,
    deleteExpense,
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
