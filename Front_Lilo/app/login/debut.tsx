// app/(tabs)/welcome.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>

      <Image
        source={require('../(tabs)/assets/Super_Happy.png')} 
        style={styles.image}
      />

      <Text style={styles.title}>Bienvenue sur Lilo</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/login/login')}
      >
        <Text style={styles.buttonText}>Employé</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/login/loginman')}
      >
        <Text style={styles.buttonText}>Manager</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    backgroundColor: '#3dbf86',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginVertical: 10,
    width: width * 0.7,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
