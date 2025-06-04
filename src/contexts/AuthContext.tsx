
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'doctor' | 'caretaker'; // Added role field
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
  // Mock user for development
  const [user, setUser] = useState<User | null>({
    id: '3', // Using caretaker ID as default
    name: 'Alice Johnson',
    role: 'caretaker',
    email: 'alice@example.com'
  });

  const login = (email: string, password: string) => {
    // This is just a mock login function
    if (email === 'admin@example.com') {
      setUser({
        id: '1',
        name: 'Admin User',
        role: 'admin',
        email: 'admin@example.com'
      });
    } else if (email === 'doctor@example.com') {
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
