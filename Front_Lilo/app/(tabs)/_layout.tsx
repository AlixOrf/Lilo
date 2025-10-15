import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import CustomNavbar from './../components/navbar';

export default function TabsLayout() {
  return (
    <View style={styles.container}>

      <Stack screenOptions={{ headerShown: false }} />

      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
});
