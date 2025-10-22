// @ts-nocheck
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

const COLORS = {
  bg: "#FFFFFF",
  card: "#F8FAFC",
  border: "#E5E7EB",
  text: "#0F172A",
  sub: "#64748B",
  primary: "#3dbf86", 
  pastel: "#76efa3",   
  danger: "#ea654e",   
};
const RADIUS = 20;

function SectionHeader({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function AccountCard({ user }) {
  return (
    <View style={[styles.accountCard, styles.shadow]}>
      <View style={styles.avatarPlaceholder} />
      <View>
        <Text style={styles.username}>{user.Nom} (Manager)</Text>
        <Text style={styles.subtitle}>{user.Mail}</Text>
      </View>
    </View>
  );
}

export default function ProfileManager() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Remplace l'URL par celle de ton backend
    fetch("http://10.109.253.112:1337/api/managers")
      .then(res => res.json())
      .then(data => {
        if (data?.data?.length > 0) {
          setUser(data.data[0]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Oui", onPress: () => router.replace("../login/debut") },
    ]);
  };


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 160 }}>
        <Text style={styles.pageTitle}>Profil Manager</Text>

        <SectionHeader title="Compte" />
        {user ? <AccountCard user={user} /> : <Text>Aucune info disponible</Text>}

        <SectionHeader title="Accès rapide" />
        <Pressable
          style={[styles.quickCard, styles.shadow]}
          onPress={() => router.push("/man/statman")}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📊</Text>
          </View>
          <Text style={styles.cardTitle}>Statistiques globales</Text>
          <Text style={styles.cardSubtitle}>Voir plus de détails sur les performances</Text>
        </Pressable>

        <SectionHeader title="Paramètres" />
        <Pressable style={styles.pill} onPress={() => Alert.alert("Sécurité & mots de passe", "Page à venir")}>
          <Text style={styles.pillLabel}>Sécurité & mots de passe</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
        <Pressable style={styles.pill} onPress={() => Alert.alert("Préférences d’équipe", "Page à venir")}>
          <Text style={styles.pillLabel}>Préférences d’équipe</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
        <Pressable style={styles.pill} onPress={() => Alert.alert("Notifications & alertes", "Page à venir")}>
          <Text style={styles.pillLabel}>Notifications & alertes</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: { fontSize: 30, fontWeight: "800", color: COLORS.text, marginTop: 60, marginBottom: 24, textAlign: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: 10, marginTop: 26 },
  accountCard: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.card, borderRadius: RADIUS, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.pastel, marginRight: 12 },
  username: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.sub, marginTop: 4 },
  quickCard: { backgroundColor: COLORS.pastel, borderRadius: RADIUS, padding: 24, alignItems: "center", marginBottom: 16 },
  iconCircle: { backgroundColor: "#fff", width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  iconText: { fontSize: 28 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#064e3b" },
  cardSubtitle: { fontSize: 14, color: "#155e47", marginTop: 4, textAlign: "center" },
  pill: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.primary, borderRadius: RADIUS, paddingVertical: 16, paddingHorizontal: 18, marginTop: 12 },
  pillLabel: { flex: 1, fontSize: 17, fontWeight: "600", color: "#fff" },
  arrow: { fontSize: 26, color: "#fff", marginLeft: 8 },
  logoutButton: { marginTop: 40, backgroundColor: COLORS.danger, borderRadius: RADIUS, paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  logoutText: { fontSize: 17, fontWeight: "700", color: "#fff" },
  shadow: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 3 },
});
