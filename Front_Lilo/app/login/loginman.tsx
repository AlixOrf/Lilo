import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';

const API_URL = 'http://10.109.253.227:1337/api'; // ton IP Strapi

export default function ManagerLogin() {
  const router = useRouter(); // ✅ Correction principale
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Conditions requises', 'Vous devez accepter les conditions d’utilisation.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/managers?filters[Mail][$eq]=${encodeURIComponent(email)}`
      );
      const data = await response.json();
      setLoading(false);

      if (!data.data || data.data.length === 0) {
        Alert.alert('Erreur', 'Aucun manager trouvé avec cet e-mail.');
        return;
      }

      // Selon ta structure Strapi, les données sont peut-être dans .attributes :
      const utilisateur = data.data[0].attributes || data.data[0];

      // Vérification du mot de passe
      if (utilisateur.Mot_de_passe !== password) {
        Alert.alert('Erreur', 'Mot de passe incorrect.');
        return;
      }

      const nom = utilisateur.Nom || utilisateur.Mail || 'Manager';

      // Pop-up et redirection
      Alert.alert('Bienvenue', `Bonjour ${nom} 👋`, [
        {
          text: 'Continuer',
          onPress: () => {
            router.push(
              `../man/profilman?user=${encodeURIComponent(JSON.stringify(utilisateur))}`
            );
          },
        },
      ]);
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../(tabs)/assets/Super_Happy.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Connexion Managers</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.showPasswordButton}
        >
          <Text style={styles.showPasswordText}>
            {showPassword ? 'Cacher' : 'Afficher'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        <Switch
          value={acceptedTerms}
          onValueChange={setAcceptedTerms}
          trackColor={{ false: '#d1d5db', true: '#76efa3' }}
          thumbColor={acceptedTerms ? '#34d399' : '#f4f3f4'}
        />
        <Text style={styles.checkboxLabel}>
          J’ai pris connaissance des conditions d’utilisation
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !acceptedTerms && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading || !acceptedTerms}
      >
        {loading ? (
          <ActivityIndicator color="#262524" />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>

        <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => router.replace('/login/debut')}
        >
        <Text style={styles.buttonText}>Retour à l'accueil</Text>
        </TouchableOpacity>


      <Text style={styles.footerText}>
        Vous êtes sur la page de connexion managers !
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    color: '#262524',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#b6b0ae',
    color: '#262524',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#b6b0ae',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    color: '#262524',
    fontSize: 16,
    paddingVertical: 12,
  },
  showPasswordButton: {
    paddingLeft: 10,
  },
  showPasswordText: {
    color: '#262524',
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    justifyContent: 'center',
    width: '100%',
  },
  checkboxLabel: {
    color: '#262524',
    fontSize: 14,
    marginLeft: 10,
    flexShrink: 1,
  },
  button: {
    backgroundColor: '#76efa3',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    backgroundColor: '#b6b0ae',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#b6b0ae',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 25,
    color: '#b6b0ae',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
  backgroundColor: '#b6b0ae', // gris
  marginTop: 10,
  },

});
