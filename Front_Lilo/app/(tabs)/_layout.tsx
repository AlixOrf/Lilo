// app/(tabs)/_layout.tsx
import { Stack, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import CustomNavbar from '../components/navbar';
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Si pas d'utilisateur et chargement terminé => renvoyer vers l'auth
  useEffect(() => {
    if (!loading && !user) {
      // protection des routes (tabs)
      router.replace('/login/debut');
    }
  }, [loading, user, router]);

  return (
    <View style={styles.container}>
      {/* On garde l'app navigation stack (les écrans contenus dans (tabs)) */}
      <Stack screenOptions={{ headerShown: false }} />
      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
});
