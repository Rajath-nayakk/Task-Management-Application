import React, { createContext, useContext, useState } from 'react';
import { User } from '../types/task';
import { mockUser } from '../mocks/tasks';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  register: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with mockUser logged in by default for seamless exploration in Phase 2
  const [user, setUser] = useState<User | null>(mockUser);

  const login = async (_email: string): Promise<boolean> => {
    setUser(mockUser);
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    setUser({
      id: 'usr-' + Math.random().toString(36).substring(2, 7),
      name,
      email,
      role: 'user',
      createdAt: new Date().toISOString(),
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
