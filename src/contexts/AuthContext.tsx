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

// Mock user credentials
const MOCK_CREDENTIALS = {
  'Thea': { password: '1998', role: 'Editor' as UserRole },
  'Xinan': { password: '0913', role: 'Reviewer' as UserRole },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const userCredentials = MOCK_CREDENTIALS[username as keyof typeof MOCK_CREDENTIALS];
    
    if (userCredentials && userCredentials.password === password) {
      setUser({ username, role: userCredentials.role });
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