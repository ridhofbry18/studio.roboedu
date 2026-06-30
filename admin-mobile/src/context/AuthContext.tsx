import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { api } from '../services/api';

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token on app load
    const loadToken = async () => {
      try {
        let storedToken = null;
        if (Platform.OS === 'web') {
          storedToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
        } else {
          storedToken = await SecureStore.getItemAsync('admin_token');
        }
        
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const signIn = async (newToken: string) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') localStorage.setItem('admin_token', newToken);
    } else {
      await SecureStore.setItemAsync('admin_token', newToken);
    }
    setToken(newToken);
  };

  const signOut = async () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') localStorage.removeItem('admin_token');
    } else {
      await SecureStore.deleteItemAsync('admin_token');
    }
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
