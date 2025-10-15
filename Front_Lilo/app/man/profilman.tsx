import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfilMan() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Manager</Text>
      <Text style={styles.text}>Bienvenue sur votre espace manager 👋</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5DC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#262524',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
});
