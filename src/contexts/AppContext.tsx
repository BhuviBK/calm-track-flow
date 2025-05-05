
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

interface AppContextType {
  moodEntries: MoodData[];
  meditationSessions: MeditationData[];
  addMoodEntry: (entry: MoodData) => void;
  addMeditationSession: (session: MeditationData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [moodEntries, setMoodEntries] = useState<MoodData[]>([]);
  const [meditationSessions, setMeditationSessions] = useState<MeditationData[]>([]);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedMoods = localStorage.getItem('moodEntries');
      const storedSessions = localStorage.getItem('meditationSessions');
      
      if (storedMoods) {
        const parsedMoods = JSON.parse(storedMoods);
        // Convert string dates back to Date objects
        setMoodEntries(parsedMoods.map((mood: any) => ({
          ...mood,
          date: new Date(mood.date)
        })));
      }
      
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        setMeditationSessions(parsedSessions.map((session: any) => ({
          ...session,
          date: new Date(session.date)
        })));
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);
  
  useEffect(() => {
    localStorage.setItem('meditationSessions', JSON.stringify(meditationSessions));
  }, [meditationSessions]);
  
  const addMoodEntry = (entry: MoodData) => {
    setMoodEntries((prev) => {
      // Check if an entry already exists for this date
      const existingIndex = prev.findIndex(
        (item) => new Date(item.date).toDateString() === new Date(entry.date).toDateString()
      );
      
      if (existingIndex !== -1) {
        // Replace existing entry for the same day
        const updated = [...prev];
        updated[existingIndex] = entry;
        return updated;
      } else {
        // Add new entry
        return [...prev, entry];
      }
    });
  };
  
  const addMeditationSession = (session: MeditationData) => {
    setMeditationSessions((prev) => [...prev, session]);
  };
  
  const value = {
    moodEntries,
    meditationSessions,
    addMoodEntry,
    addMeditationSession,
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
