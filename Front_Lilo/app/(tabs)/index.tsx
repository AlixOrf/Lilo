// HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);

  // Tes émotions (doivent correspondre EXACTEMENT aux valeurs de ton enum dans Strapi)
  const emotions = [
    'Super_Happy',
    'Happy',
    'Neutre',
    'Depressed',
    'Super_Depressed',
  ];

  const gridImages = [
    require('./assets/Super_Happy.png'),
    require('./assets/Happy.png'),
    require('./assets/Neutre.png'),
    require('./assets/Depressed.png'),
    require('./assets/Super_Depressed.png'),
  ];

  // ✅ Envoi au backend Strapi
  const sendSelectionToBackend = async (index: number) => {
    try {
      const response = await fetch('http://10.109.253.227:1337/api/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            Mood: emotions[index], // 🟢 le bon nom du champ pour Strapi
            // tu peux ajouter d'autres champs si nécessaires (Emotion, Boisson, etc.)
          },
        }),
      });

      const result = await response.json();
      console.log('Réponse du serveur:', result);

      if (response.ok) {
        Alert.alert('✅ Emotion enregistrée !');
      } else {
        console.log('Erreur API:', result);
        Alert.alert('⚠️ Erreur lors de l’envoi au serveur');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('❌ Impossible de se connecter au serveur');
    }
  };

  // Gestion du clic
  const handlePress = (index: number) => {
    setSelectedEmotion(index);
    sendSelectionToBackend(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Jeudi 15 Octobre</Text>

        <View style={[styles.card, { minHeight: 220 }]}>
          <Text style={styles.cardTitle}>
            Quelles sont les émotions que vous avez ressenties ?
          </Text>

          <View style={styles.grid}>
            {gridImages.map((img, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.gridDot,
                  selectedEmotion === i && styles.selectedDot,
                ]}
                onPress={() => handlePress(i)}
                activeOpacity={0.8}
              >
                <Image source={img} style={styles.gridImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// 🧱 Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  scroll: {
    paddingTop: 18,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    width: width - 50,
    backgroundColor: '#e2e2e2ff',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardTitle: {
    marginBottom: 10,
    fontSize: 14,
    color: '#222',
  },
  grid: {
    width: '97%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  gridDot: {
    width: 75,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#bdbdbd',
    marginBottom: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDot: {
    borderColor: '#ff7ca3', // 🩷 fond rose quand sélectionné
    borderWidth: 3,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 22,
  },
});
