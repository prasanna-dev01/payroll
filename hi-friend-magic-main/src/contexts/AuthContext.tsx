import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { sampleUsers } from '@/utils/sampleData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Initialize users if not exists
      const users = await storage.get<User[]>(STORAGE_KEYS.USERS, []);
      if (users.length === 0) {
        await storage.set(STORAGE_KEYS.USERS, sampleUsers);
      }

      // Check if user is already logged in
      const savedUser = await storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
      if (savedUser) {
        setCurrentUser(savedUser);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = await storage.get<User[]>(STORAGE_KEYS.USERS, sampleUsers);
      
      // For demo purposes, accept any password for existing users
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        setCurrentUser(user);
        await storage.set(STORAGE_KEYS.CURRENT_USER, user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    await storage.remove(STORAGE_KEYS.CURRENT_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
