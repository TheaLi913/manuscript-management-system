import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'Editor' | 'Reviewer';

export interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get user credentials from localStorage or use defaults
const getStoredUsers = () => {
  const stored = localStorage.getItem('systemUsers');
  if (stored) {
    return JSON.parse(stored);
  }
  // Default users
  const defaultUsers = [
    { username: 'Thea', password: '1998', role: 'Editor' as UserRole },
    { username: 'Xinan', password: '0913', role: 'Reviewer' as UserRole },
  ];
  localStorage.setItem('systemUsers', JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const users = getStoredUsers();
    const foundUser = users.find((u: any) => u.username === username && u.password === password);
    
    if (foundUser) {
      setUser({ username: foundUser.username, role: foundUser.role });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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