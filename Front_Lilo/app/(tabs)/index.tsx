import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmotionItem from './../components/emotionItem';

const { width } = Dimensions.get('window');

// 🧱 Première série (Mood)
const emotions1 = ['Super_Happy', 'Happy', 'Neutre', 'Depressed', 'Super_Depressed'];
const gridImages1 = [
  require('./assets/Super_Happy.png'),
  require('./assets/Happy.png'),
  require('./assets/Neutre.png'),
  require('./assets/Depressed.png'),
  require('./assets/Super_Depressed.png'),
];

// 🧱 Deuxième série (Emotion)
const emotions2 = [
  'Excité', 'Détendu', 'Fier', 'Optimiste', 'Heureux', 'Enthousiaste', 'Reconnaissant',
  'Déprimé', 'Solitaire', 'Anxieux', 'Triste', 'En_Colère', 'Agacé', 'Fatigué', 'Stressé', 'Ennuyé'
];

const gridImages2 = [
  require('./assets/Excité.png'),
  require('./assets/Détendu.png'),
  require('./assets/Fier.png'),
  require('./assets/Optimiste.png'),
  require('./assets/Heureux.png'),
  require('./assets/Enthousiaste.png'),
  require('./assets/Reconnaissant.png'),
  require('./assets/Déprimé.png'),
  require('./assets/Solitaire.png'),
  require('./assets/Anxieux.png'),
  require('./assets/Triste.png'),
  require('./assets/En_Colère.png'),
  require('./assets/Agacé.png'),
  require('./assets/Fatigué.png'),
  require('./assets/Stressé.png'),
  require('./assets/Ennuyé.png'),
];

export default function HomeScreen() {
  const [selectedEmotion1, setSelectedEmotion1] = useState<number | null>(null);
  const [selectedEmotion2, setSelectedEmotion2] = useState<number[]>([]);

  const sendSelectionToBackend = async () => {
    if (selectedEmotion1 === null && selectedEmotion2.length === 0) {
      Alert.alert('⚠️ Veuillez sélectionner au moins une émotion avant de valider.');
      return;
    }

    try {
      const dataToSend: any = { data: {} };
      if (selectedEmotion1 !== null) dataToSend.data.Mood = emotions1[selectedEmotion1];
      if (selectedEmotion2.length > 0) dataToSend.data.Emotion = selectedEmotion2.map(i => emotions2[i]);

      console.log('🛰️ Data envoyée à Strapi :', dataToSend);

      const response = await fetch('http://10.109.253.227:1337/api/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        Alert.alert('✅ Émotions enregistrées avec succès !');
        setSelectedEmotion1(null);
        setSelectedEmotion2([]);
      } else {
        const errorText = await response.text();
        console.error('Erreur Strapi :', errorText);
        Alert.alert('⚠️ Erreur lors de l’envoi des émotions.');
      }
    } catch (err) {
      console.error('Erreur réseau', err);
      Alert.alert('❌ Impossible de se connecter au serveur Strapi.');
    }
  };

  const handlePress1 = (index: number) => setSelectedEmotion1(selectedEmotion1 === index ? null : index);

  const handlePress2 = (index: number) => {
    if (selectedEmotion2.includes(index)) {
      setSelectedEmotion2(selectedEmotion2.filter(i => i !== index));
    } else {
      setSelectedEmotion2([...selectedEmotion2, index]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Jeudi 15 Octobre</Text>

        {/* 🧱 Première section */}
        <View style={[styles.card, { minHeight: 100 }]}>
          <Text style={styles.cardTitle}>Quel Lilo êtes-vous ?</Text>
          <View style={styles.grid}>
            {gridImages1.map((img, i) => (
              <EmotionItem
                key={`first-${i}`}
                imgSource={img}
                selected={selectedEmotion1 === i}
                onPress={() => handlePress1(i)}
                isRounded={false}
                highlightColor="#ffffffff" // Rouge principal pour le Mood
                dimOthers={selectedEmotion1 !== null}
              />
            ))}
          </View>
        </View>

        {/* 🧱 Deuxième section */}
        <View style={[styles.card, { minHeight: 100 }]}>
          <Text style={styles.cardTitle}>Comment vous sentez-vous aujourd’hui ?</Text>
          <View style={styles.grid}>
            {gridImages2.map((img, i) => (
              <EmotionItem
                key={`second-${i}`}
                imgSource={img}
                selected={selectedEmotion2.includes(i)}
                onPress={() => handlePress2(i)}
                isRounded={true}
                highlightColor="#262524" // 💚 Vert pastel pour émotions multiples
              />
            ))}
          </View>
        </View>

        {/* ✅ Bouton de validation */}
        <TouchableOpacity style={styles.button} onPress={sendSelectionToBackend}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { paddingTop: 18, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 25, color: '#262524' },
  card: {
    width: width * 0.93,
    backgroundColor: '#f0ece9ff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardTitle: { marginBottom: 12, fontSize: 14, color: '#262524', textAlign: 'center' },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    rowGap: 18,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#b6b0ae', // Vert principal
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
});
