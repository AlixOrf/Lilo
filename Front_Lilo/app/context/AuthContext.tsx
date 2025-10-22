// app/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- TYPES ---
type User = {
  idUtilisateur: number; // champ Strapi
  Nom?: string;
  Mail?: string;
  jwt?: string;
  [key: string]: any;
} | null;

type Manager = {
  Idman: string;
  [key: string]: any;
} | null;

type AuthContextValue = {
  user: User;
  manager: Manager;
  setUser: (u: User) => void;
  setManager: (m: Manager) => void;
  logout: () => Promise<void>;
  loading: boolean;
};

// --- VALEUR PAR DÉFAUT ---
const defaultValue: AuthContextValue = {
  user: null,
  manager: null,
  setUser: () => {},
  setManager: () => {},
  logout: async () => {},
  loading: true,
};

export const AuthContext = createContext<AuthContextValue>(defaultValue);

// --- PROVIDER ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User>(null);
  const [manager, setManagerState] = useState<Manager>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔄 CHARGEMENT INITIAL user + manager
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const [rawUser, rawManager] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('manager'),
        ]);

        if (rawUser) {
          const parsedUser = JSON.parse(rawUser);
          console.log('💡 AuthContext loaded user:', parsedUser);
          setUserState(parsedUser);
        }

        if (rawManager) {
          const parsedManager = JSON.parse(rawManager);
          console.log('💡 AuthContext loaded manager:', parsedManager);
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

  // ✅ PERSISTANCE DU USER
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

  // ✅ PERSISTANCE DU MANAGER
  const setManager = async (m: Manager) => {
    try {
      if (m) {
        await AsyncStorage.setItem('manager', JSON.stringify(m));
        console.log('💡 AuthContext saved manager:', m);
      } else {
        await AsyncStorage.removeItem('manager');
      }
    } catch (err) {
      console.warn('AuthContext: error persisting manager', err);
    }
    setManagerState(m);
  };

  // 🚪 DÉCONNEXION COMPLÈTE
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['user', 'manager']);
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

// --- HOOK PRATIQUE ---
export const useAuth = () => useContext(AuthContext);