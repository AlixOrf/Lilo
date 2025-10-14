import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function ProfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page Profil</Text>
      <Text style={styles.text}>
        Ici, l’utilisateur pourra consulter et modifier ses informations personnelles.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC', // couleur de ta charte graphique
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
