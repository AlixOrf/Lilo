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

const API_URL = 'http://localhost:1337/api/utilisateurs';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
      const response = await fetch(`${API_URL}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        Alert.alert('Erreur', data.error?.message || 'Identifiants incorrects.');
        return;
      }

      Alert.alert('Bienvenue', `Bonjour ${data.user.username} 👋`);
      // navigation.navigate('Home', { user: data.user });

    } catch (error) {
      setLoading(false);
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5087/5087579.png' }}
        style={styles.logo}
      />
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* ✅ Case à cocher des conditions */}
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

      {/* ✅ Footer centré */}
      <Text style={styles.footerText}>
        Pas encore de compte ?{'\n'}Demandez à votre manager de vous en créer un !
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
    width: 100,
    height: 100,
    marginBottom: 30,
    tintColor: '#76efa3',
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
});
