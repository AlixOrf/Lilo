import { Tabs } from "expo-router";

export default function UserLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="profilman" />
      <Tabs.Screen name="statman" />
    </Tabs>
  );
}
