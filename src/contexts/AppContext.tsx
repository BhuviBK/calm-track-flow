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

interface UserHistoryItem {
  page: string;
  action: string;
  timestamp: Date;
}

interface User {
  username: string;
  password: string; // In a real app, this should be hashed
  history: UserHistoryItem[];
  lastLogin: Date;
  lastPage?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AppContextType {
  moodEntries: MoodData[];
  meditationSessions: MeditationData[];
  expenses: ExpenseData[];
  users: User[];
  currentUser: User | null;
  addMoodEntry: (entry: MoodData) => void;
  addMeditationSession: (session: MeditationData) => void;
  addExpense: (expense: ExpenseData) => void;
  deleteExpense: (id: string) => void;
  registerUser: (credentials: LoginCredentials) => boolean;
  loginUser: (credentials: LoginCredentials) => boolean;
  logoutUser: () => void;
  addUserHistory: (historyItem: UserHistoryItem) => void;
  updateLastPage: (page: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [moodEntries, setMoodEntries] = useState<MoodData[]>([]);
  const [meditationSessions, setMeditationSessions] = useState<MeditationData[]>([]);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedMoods = localStorage.getItem('moodEntries');
      const storedSessions = localStorage.getItem('meditationSessions');
      const storedExpenses = localStorage.getItem('expenses');
      const storedUsers = localStorage.getItem('users');
      const storedCurrentUser = localStorage.getItem('currentUser');
      
      if (storedMoods) {
        const parsedMoods = JSON.parse(storedMoods);
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
      
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        setExpenses(parsedExpenses.map((expense: any) => ({
          ...expense,
          date: new Date(expense.date)
        })));
      }
      
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers.map((user: any) => ({
          ...user,
          lastLogin: new Date(user.lastLogin),
          history: user.history.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }))
        })));
      }
      
      if (storedCurrentUser) {
        const parsedCurrentUser = JSON.parse(storedCurrentUser);
        if (parsedCurrentUser) {
          setCurrentUser({
            ...parsedCurrentUser,
            lastLogin: new Date(parsedCurrentUser.lastLogin),
            history: parsedCurrentUser.history.map((item: any) => ({
              ...item,
              timestamp: new Date(item.timestamp)
            }))
          });
        }
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
  
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);
  
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
  
  const addExpense = (expense: ExpenseData) => {
    setExpenses((prev) => [...prev, expense]);
  };
  
  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter(expense => expense.id !== id));
  };
  
  const registerUser = (credentials: LoginCredentials): boolean => {
    // Check if username already exists
    if (users.some(user => user.username === credentials.username)) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      username: credentials.username,
      password: credentials.password, // In a real app, this should be hashed
      history: [],
      lastLogin: new Date(),
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    return true;
  };
  
  const loginUser = (credentials: LoginCredentials): boolean => {
    const user = users.find(
      u => u.username === credentials.username && u.password === credentials.password
    );
    
    if (user) {
      // Update user's last login time and add login event to history
      const updatedUser = {
        ...user,
        lastLogin: new Date(),
        history: [
          ...user.history,
          {
            page: "Login",
            action: "User logged in",
            timestamp: new Date(),
          }
        ]
      };
      
      // Update the user in the users array
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.username === user.username ? updatedUser : u
        )
      );
      
      // Set as current user
      setCurrentUser(updatedUser);
      return true;
    }
    
    return false;
  };
  
  const logoutUser = () => {
    setCurrentUser(null);
  };
  
  const addUserHistory = (historyItem: UserHistoryItem) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      history: [...currentUser.history, historyItem]
    };
    
    setCurrentUser(updatedUser);
    
    // Also update in the users array
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.username === currentUser.username ? updatedUser : user
      )
    );
  };
  
  const updateLastPage = (page: string) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      lastPage: page
    };
    
    setCurrentUser(updatedUser);
    
    // Also update in the users array
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.username === currentUser.username ? updatedUser : user
      )
    );
  };
  
  const value = {
    moodEntries,
    meditationSessions,
    expenses,
    users,
    currentUser,
    addMoodEntry,
    addMeditationSession,
    addExpense,
    deleteExpense,
    registerUser,
    loginUser,
    logoutUser,
    addUserHistory,
    updateLastPage,
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
