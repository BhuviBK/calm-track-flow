
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
  moodEntries: MoodData[];
  meditationSessions: MeditationData[];
  expenses: ExpenseData[];
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
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Derived state from current user
  const moodEntries = currentUser?.moodEntries || [];
  const meditationSessions = currentUser?.meditationSessions || [];
  const expenses = currentUser?.expenses || [];
  
  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('zenmind_users');
      const storedCurrentUser = localStorage.getItem('zenmind_currentUser');
      
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        const usersWithDates = parsedUsers.map((user: any) => ({
          ...user,
          lastLogin: new Date(user.lastLogin),
          history: user.history.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          })),
          moodEntries: (user.moodEntries || []).map((mood: any) => ({
            ...mood,
            date: new Date(mood.date)
          })),
          meditationSessions: (user.meditationSessions || []).map((session: any) => ({
            ...session,
            date: new Date(session.date)
          })),
          expenses: (user.expenses || []).map((expense: any) => ({
            ...expense,
            date: new Date(expense.date)
          }))
        }));
        setUsers(usersWithDates);
      }
      
      if (storedCurrentUser) {
        const parsedCurrentUser = JSON.parse(storedCurrentUser);
        if (parsedCurrentUser) {
          const userWithDates = {
            ...parsedCurrentUser,
            lastLogin: new Date(parsedCurrentUser.lastLogin),
            history: parsedCurrentUser.history.map((item: any) => ({
              ...item,
              timestamp: new Date(item.timestamp)
            })),
            moodEntries: (parsedCurrentUser.moodEntries || []).map((mood: any) => ({
              ...mood,
              date: new Date(mood.date)
            })),
            meditationSessions: (parsedCurrentUser.meditationSessions || []).map((session: any) => ({
              ...session,
              date: new Date(session.date)
            })),
            expenses: (parsedCurrentUser.expenses || []).map((expense: any) => ({
              ...expense,
              date: new Date(expense.date)
            }))
          };
          setCurrentUser(userWithDates);
        }
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    }
  }, []);
  
  // Save users to localStorage whenever it changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('zenmind_users', JSON.stringify(users));
    }
  }, [users]);
  
  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('zenmind_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('zenmind_currentUser');
    }
  }, [currentUser]);
  
  const updateUserData = (updatedUser: User) => {
    // Update current user
    setCurrentUser(updatedUser);
    
    // Update in users array
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.username === updatedUser.username ? updatedUser : user
      )
    );
  };
  
  const addMoodEntry = (entry: MoodData) => {
    if (!currentUser) return;
    
    const existingIndex = currentUser.moodEntries.findIndex(
      (item) => new Date(item.date).toDateString() === new Date(entry.date).toDateString()
    );
    
    let updatedMoodEntries;
    if (existingIndex !== -1) {
      updatedMoodEntries = [...currentUser.moodEntries];
      updatedMoodEntries[existingIndex] = entry;
    } else {
      updatedMoodEntries = [...currentUser.moodEntries, entry];
    }
    
    const updatedUser = {
      ...currentUser,
      moodEntries: updatedMoodEntries
    };
    
    updateUserData(updatedUser);
  };
  
  const addMeditationSession = (session: MeditationData) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      meditationSessions: [...currentUser.meditationSessions, session]
    };
    
    updateUserData(updatedUser);
  };
  
  const addExpense = (expense: ExpenseData) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      expenses: [...currentUser.expenses, expense]
    };
    
    updateUserData(updatedUser);
  };
  
  const deleteExpense = (id: string) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      expenses: currentUser.expenses.filter(expense => expense.id !== id)
    };
    
    updateUserData(updatedUser);
  };
  
  const registerUser = (credentials: LoginCredentials): boolean => {
    // Check if username already exists
    if (users.some(user => user.username === credentials.username)) {
      return false;
    }
    
    // Create new user with empty data arrays
    const newUser: User = {
      username: credentials.username,
      password: credentials.password,
      history: [],
      lastLogin: new Date(),
      moodEntries: [],
      meditationSessions: [],
      expenses: []
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
      
      updateUserData(updatedUser);
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
    
    updateUserData(updatedUser);
  };
  
  const updateLastPage = (page: string) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      lastPage: page
    };
    
    updateUserData(updatedUser);
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
