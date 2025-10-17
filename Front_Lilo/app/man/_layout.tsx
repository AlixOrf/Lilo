import { Tabs } from "expo-router";
import CustomNavbar from "./../components/navbarman";
import { View, StyleSheet } from "react-native";

export default function ManagerLayout() {
  return (
    <View style={styles.container}>

      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="profil-manager" />
        <Tabs.Screen name="statman" />
      </Tabs>

      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
});
