// app/(tabs)/home.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmotionItem from '../components/emotionItem';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

// 🧱 Première série (Mood)
const emotions1 = ['Super_Happy', 'Happy', 'Neutre', 'Depressed', 'Super_Depressed'];
const gridImages1 = [
  require('../(tabs)/assets/Super_Happy.png'),
  require('../(tabs)/assets/Happy.png'),
  require('../(tabs)/assets/Neutre.png'),
  require('../(tabs)/assets/Depressed.png'),
  require('../(tabs)/assets/Super_Depressed.png'),
];

// 🧱 Deuxième série (Emotion)
const emotions2 = [
  'Excité', 'Détendu', 'Fier', 'Optimiste', 'Heureux', 'Enthousiaste', 'Reconnaissant',
  'Déprimé', 'Solitaire', 'Anxieux', 'Triste', 'En_Colère', 'Agacé', 'Fatigué', 'Stressé', 'Ennuyé'
];
const gridImages2 = [
  require('../(tabs)/assets/Excité.png'),
  require('../(tabs)/assets/Détendu.png'),
  require('../(tabs)/assets/Fier.png'),
  require('../(tabs)/assets/Optimiste.png'),
  require('../(tabs)/assets/Heureux.png'),
  require('../(tabs)/assets/Enthousiaste.png'),
  require('../(tabs)/assets/Reconnaissant.png'),
  require('../(tabs)/assets/Déprimé.png'),
  require('../(tabs)/assets/Solitaire.png'),
  require('../(tabs)/assets/Anxieux.png'),
  require('../(tabs)/assets/Triste.png'),
  require('../(tabs)/assets/En_Colère.png'),
  require('../(tabs)/assets/Agacé.png'),
  require('../(tabs)/assets/Fatigué.png'),
  require('../(tabs)/assets/Stressé.png'),
  require('../(tabs)/assets/Ennuyé.png'),
];

// 🧱 Troisième série (Boissons)
const drinks = [
  { key: 'Eau', label: 'Eau' },
  { key: 'Cafe', label: 'Café' },
  { key: 'The', label: 'Thé' },
  { key: 'Sirop', label: 'Sirop' },
  { key: 'Soda', label: 'Soda' },
  { key: 'Jus', label: 'Jus' },
];
const gridImages3 = [
  require('../(tabs)/assets/Eau.png'),
  require('../(tabs)/assets/Cafe.png'),
  require('../(tabs)/assets/The.png'),
  require('../(tabs)/assets/Sirop.png'),
  require('../(tabs)/assets/Soda.png'),
  require('../(tabs)/assets/Jus.png'),
];

export default function HomeScreen() {
  // 🧭 Récupération de l’utilisateur connecté depuis le context
  const { user } = useAuth();
  const utilisateur = user;
  const utilisateurId = utilisateur?.id;

  const [selectedEmotion1, setSelectedEmotion1] = useState<number | null>(null);
  const [selectedEmotion2, setSelectedEmotion2] = useState<number[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<number | null>(null);
  const [journalEntry, setJournalEntry] = useState<string>('');

  const sendSelectionToBackend = async () => {
    if (!utilisateurId) {
      Alert.alert('❌ Erreur', 'Utilisateur non reconnu. Veuillez vous reconnecter.');
      return;
    }

    if (
      selectedEmotion1 === null &&
      selectedEmotion2.length === 0 &&
      selectedDrink === null &&
      journalEntry.trim() === ''
    ) {
      Alert.alert('⚠️ Veuillez saisir ou sélectionner au moins une information avant de valider.');
      return;
    }

    try {
      const dataToSend: any = {
        data: {
          utilisateur: utilisateurId,
        },
      };

      if (selectedEmotion1 !== null) dataToSend.data.Mood = emotions1[selectedEmotion1];
      if (selectedEmotion2.length > 0) dataToSend.data.Emotion = selectedEmotion2.map(i => emotions2[i]);
      if (selectedDrink !== null) dataToSend.data.Boisson = drinks[selectedDrink].key;
      if (journalEntry.trim() !== '') dataToSend.data.Journal = journalEntry.trim();

      console.log('🛰️ Données envoyées à Strapi :', dataToSend);

      const response = await fetch('http://10.109.253.227:1337/api/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        Alert.alert('✅ Données enregistrées avec succès !');
        setSelectedEmotion1(null);
        setSelectedEmotion2([]);
        setSelectedDrink(null);
        setJournalEntry('');
      } else {
        const errorText = await response.text();
        console.error('Erreur Strapi :', errorText);
        Alert.alert('⚠️ Erreur lors de l’envoi des données.');
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
  const handlePress3 = (index: number) => setSelectedDrink(selectedDrink === index ? null : index);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Bienvenue {utilisateur?.Nom || 'Utilisateur'} 👋</Text>

        {/* 🧱 Première section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quel Lilo êtes-vous ?</Text>
          <View style={styles.grid}>
            {gridImages1.map((img, i) => (
              <EmotionItem
                key={`first-${i}`}
                imgSource={img}
                selected={selectedEmotion1 === i}
                onPress={() => handlePress1(i)}
                isRounded={false}
                highlightColor="#3dbf86"
                dimOthers={selectedEmotion1 !== null}
              />
            ))}
          </View>
        </View>

        {/* 🧱 Deuxième section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Comment vous sentez-vous aujourd’hui ?</Text>
          <View style={styles.grid}>
            {gridImages2.map((img, i) => (
              <EmotionItem
                key={`second-${i}`}
                imgSource={img}
                selected={selectedEmotion2.includes(i)}
                onPress={() => handlePress2(i)}
                isRounded={true}
                highlightColor="#3dbf86"
              />
            ))}
          </View>
        </View>

        {/* 🧱 Troisième section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quelle boisson avez-vous le plus bue ?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gridRow}>
            {gridImages3.map((img, i) => (
              <EmotionItem
                key={`third-${i}`}
                imgSource={img}
                selected={selectedDrink === i}
                onPress={() => handlePress3(i)}
                isRounded={false}
                highlightColor="#3dbf86"
                dimOthers={selectedDrink !== null}
              />
            ))}
          </ScrollView>
        </View>

        {/* 🧱 Journal */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Avez-vous une anecdote à raconter ?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Écrivez ici votre anecdote..."
            placeholderTextColor="#949190"
            multiline
            value={journalEntry}
            onChangeText={setJournalEntry}
          />
        </View>

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
    backgroundColor: '#e8e2deff',
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
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 16,
    paddingHorizontal: 8,
  },
  textInput: {
    width: '90%',
    minHeight: 100,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#262524',
    borderWidth: 1,
    borderColor: '#b6b0ae',
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#3dbf86',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
});
