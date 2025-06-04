
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'doctor' | 'caretaker';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Start with no user logged in
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Handle different login types
    if (email === 'admin@example.com' || email === 'admin') {
      setUser({
        id: '1',
        name: 'Admin User',
        role: 'admin',
        email: 'admin@example.com'
      });
    } else if (email === 'doctor@example.com' || email === 'doctor') {
      setUser({
        id: '2',
        name: 'Dr. Sarah Wilson',
        role: 'doctor',
        email: 'doctor@example.com'
      });
    } else {
      setUser({
        id: '3',
        name: 'Alice Johnson',
        role: 'caretaker',
        email: 'alice@example.com'
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
