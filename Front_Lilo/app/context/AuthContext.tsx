// app/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Manager = {
  Idman: string;
  [key: string]: any;
} | null;

type AuthContextValue = {
  user: Record<string, any> | null;
  manager: Manager;
  setUser: (u: Record<string, any> | null) => void;
  setManager: (m: Manager) => void;
  logout: () => Promise<void>;
  loading: boolean;
};

const defaultValue: AuthContextValue = {
  user: null,
  manager: null,
  setUser: () => {},
  setManager: () => {},
  logout: async () => {},
  loading: true,
};

export const AuthContext = createContext<AuthContextValue>(defaultValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<Record<string, any> | null>(null);
  const [manager, setManagerState] = useState<Manager>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // charge user et manager au démarrage
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const rawUser = await AsyncStorage.getItem('user');
        const rawManager = await AsyncStorage.getItem('manager');

        if (rawUser) {
          const parsedUser = JSON.parse(rawUser);
          console.log('LOG AuthContext: loaded user', parsedUser);
          setUserState(parsedUser);
        }

        if (rawManager) {
          const parsedManager = JSON.parse(rawManager);
          console.log('LOG AuthContext: loaded manager', parsedManager);
          setManagerState(parsedManager);
        }
      } catch (err) {
        console.error('AuthContext: failed to load auth', err);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  const setUser = async (u: Record<string, any> | null) => {
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

  const setManager = async (m: Manager) => {
    try {
      if (m) {
        await AsyncStorage.setItem('manager', JSON.stringify(m));
        console.log('LOG AuthContext: manager saved', m);
      } else {
        await AsyncStorage.removeItem('manager');
      }
    } catch (err) {
      console.warn('AuthContext: error persisting manager', err);
    }
    setManagerState(m);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('manager');
    } catch (err) {
      console.warn('AuthContext: error removing auth', err);
    } finally {
      setUserState(null);
      setManagerState(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, manager, setUser, setManager, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pratique
export const useAuth = () => useContext(AuthContext);
