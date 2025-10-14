import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmotionItem from './../components/emotionItem';

const { width } = Dimensions.get('window');

const emotions = ['Super_Happy', 'Happy', 'Neutre', 'Depressed', 'Super_Depressed'];

const gridImages = [
  require('./assets/Super_Happy.png'),
  require('./assets/Happy.png'),
  require('./assets/Neutre.png'),
  require('./assets/Depressed.png'),
  require('./assets/Super_Depressed.png'),
];

export default function HomeScreen() {
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);

  // ✅ La fonction ne sera appelée que par le bouton
  const sendSelectionToBackend = async () => {
    if (selectedEmotion === null) {
      Alert.alert('⚠️ Veuillez sélectionner une émotion avant de valider.');
      return;
    }
    try {
      const response = await fetch('http://10.109.253.227:1337/api/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { Mood: emotions[selectedEmotion] } }),
      });
      const result = await response.json();
      if (response.ok) Alert.alert('✅ Emotion enregistrée !');
      else Alert.alert('⚠️ Erreur API');
    } catch {
      Alert.alert('❌ Impossible de se connecter au serveur');
    }
  };

  const handlePress = (index: number) => {
    if (selectedEmotion === index) {
      // ✅ toggle : désélectionne si déjà sélectionné
      setSelectedEmotion(null);
    } else {
      setSelectedEmotion(index); // ✅ sélection
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Jeudi 15 Octobre</Text>

        <View style={[styles.card, { minHeight: 100 }]}>
          <Text style={styles.cardTitle}>Quelles sont les émotions que vous avez ressenties ?</Text>

          <View style={styles.grid}>
            {gridImages.map((img, i) => (
              <EmotionItem
                key={i}
                imgSource={img}
                selected={selectedEmotion === i} // ✅ sélection persistante
                onPress={() => handlePress(i)}
              />
            ))}
          </View>
        </View>

        {/* ✅ Bouton pour valider la sélection */}
        <TouchableOpacity style={styles.button} onPress={sendSelectionToBackend}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffffff' },
  scroll: { paddingTop: 18, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  card: {
    width: width * 0.93, // ✅ carte moins large (90% de l'écran)
    backgroundColor: '#e2e2e2ff',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardTitle: { marginBottom: 12, fontSize: 14, color: '#222', textAlign: 'center' },
  grid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', rowGap: 18 },

  // ✅ Styles bouton
  button: {
    marginTop: 20,
    backgroundColor: '#FF7DAF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
