
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  // Start with no user logged in
  const [user, setUser] = useState(null);

  const login = (email, password) => {
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
