import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function StatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page Statistiques</Text>
      <Text style={styles.text}>
        Ici seront affichées les statistiques de l’utilisateur (progression, activité, etc.).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F494F',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2F494F',
  },
});
