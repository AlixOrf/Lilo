// app/(tabs)/profile-utilisateur.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  bg: "#FFFFFF",
  card: "#F8FAFC",
  border: "#E5E7EB",
  text: "#262524",
  sub: "#64748B",
  primary: "#3dbf86",
  pastel: "#76efa3",
  danger: "#ea654e",
};
const RADIUS = 20;

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function AccountCard({ user }: { user: any }) {
  return (
    <View style={[styles.accountCard, styles.shadow]}>
      <View style={styles.avatarPlaceholder} />
      <View>
        <Text style={styles.username}>{user?.Nom || 'Utilisateur'}</Text>
        <Text style={styles.subtitle}>{user?.Mail || ''}</Text>
      </View>
    </View>
  );
}

function TwoCards({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <View style={styles.row}>
      <Pressable style={[styles.smallCard, styles.shadow]} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.iconText}>😊</Text>
        <Text style={styles.cardTitle}>Mood du jour</Text>
        <Text style={styles.cardSubtitle}>Exprime ton ressenti</Text>
      </Pressable>

      <Pressable style={[styles.smallCard, styles.shadow]} onPress={() => router.push('/(tabs)/stat')}>
        <Text style={styles.iconText}>📊</Text>
        <Text style={styles.cardTitle}>Statistiques</Text>
        <Text style={styles.cardSubtitle}>Tes progrès récents</Text>
      </Pressable>
    </View>
  );
}

function Pill({ label, icon }: { label: string; icon: string }) {
  return (
    <Pressable style={({ pressed }) => [styles.pill, pressed && { opacity: 0.9 }]}>
      <Text style={styles.pillIcon}>{icon}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

export default function ProfileUtilisateur() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Oui', onPress: async () => { await logout(); router.replace('/login/debut'); } },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 160, backgroundColor: COLORS.bg }}>
      <Text style={styles.pageTitle}>Profil</Text>

      <SectionHeader title="Compte" />
      {user ? <AccountCard user={user} /> : <Text>Aucune info utilisateur</Text>}

      <SectionHeader title="Accès rapides" />
      <TwoCards router={router} />

      <SectionHeader title="Paramètres" />
      <Pill label="Sécurité & mot de passe" icon="🔒" />
      <Pill label="Confidentialité" icon="🛡️" />
      <Pill label="Aide & support" icon="💬" />

      <Pressable style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.85 }]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageTitle: { fontSize: 30, fontWeight: "800", color: COLORS.text, marginTop: 60, marginBottom: 24, textAlign: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: 10, marginTop: 26 },
  accountCard: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.card, borderRadius: RADIUS, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.pastel, marginRight: 12 },
  username: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.sub, marginTop: 4 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  smallCard: { flex: 1, backgroundColor: COLORS.pastel, borderRadius: RADIUS, padding: 16, alignItems: "center", marginHorizontal: 4 },
  iconText: { fontSize: 24, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#064e3b" },
  cardSubtitle: { fontSize: 13, color: "#155e47" },
  pill: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.primary, borderRadius: RADIUS, paddingVertical: 16, paddingHorizontal: 18, marginTop: 12 },
  pillIcon: { fontSize: 20, marginRight: 8 },
  pillLabel: { flex: 1, fontSize: 17, fontWeight: "600", color: "#fff" },
  arrow: { fontSize: 26, color: "#fff", marginLeft: 8 },
  logoutButton: { marginTop: 40, backgroundColor: COLORS.danger, borderRadius: RADIUS, paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  logoutText: { fontSize: 17, fontWeight: "700", color: "#fff" },
  shadow: { shadowColor: "#262524", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 3 },
});