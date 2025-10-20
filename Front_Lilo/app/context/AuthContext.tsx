// app/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = Record<string, any> | null;

type AuthContextValue = {
  user: User;
  setUser: (u: User) => void;
  logout: () => Promise<void>;
  loading: boolean;
};

const defaultValue: AuthContextValue = {
  user: null,
  setUser: () => {},
  logout: async () => {},
  loading: true,
};

export const AuthContext = createContext<AuthContextValue>(defaultValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // charge user au démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem('user');
        if (raw) {
          setUserState(JSON.parse(raw));
        }
      } catch (err) {
        console.error('AuthContext: failed to load user', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const setUser = async (u: User) => {
    try {
      if (u) {
        await AsyncStorage.setItem('user', JSON.stringify(u));
      } else {
        await AsyncStorage.removeItem('user');
      }
    } catch (err) {
      console.warn('AuthContext: error persisting user', err);
    }
    setUserState(u);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (err) {
      console.warn('AuthContext: error removing user', err);
    } finally {
      setUserState(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pratique
export const useAuth = () => useContext(AuthContext);
