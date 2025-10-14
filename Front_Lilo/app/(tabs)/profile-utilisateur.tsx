// @ts-nocheck
import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";

const COLORS = {
  bg: "#FFFFFF",
  card: "#F8FAFC",
  border: "#E5E7EB",
  text: "#0F172A",
  sub: "#64748B",
  primary: "#3dbf86",  // ✅ Vert boutons
  pastel: "#76efa3",   // ✅ Vert pastel
  danger: "#e63946",   // ✅ Rouge bouton déconnexion
};
const RADIUS = 20;

// ————————————— COMPONENTS ————————————— //

function SectionHeader({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function AccountCard() {
  return (
    <Pressable style={[styles.accountCard, styles.shadow]}>
      <View style={styles.avatarPlaceholder} />
      <View>
        <Text style={styles.username}>Lilo</Text>
        <Text style={styles.subtitle}>Informations concernant l'utilisateur</Text>
      </View>
    </Pressable>
  );
}

function TwoCards({ router }) {
  return (
    <View style={styles.row}>
      {/* Mood du jour → Home */}
      <Pressable
        style={[styles.smallCard, styles.shadow]}
        onPress={() => router.push("/(tabs)")}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>😊</Text>
        </View>
        <Text style={styles.cardTitle}>Mood du jour</Text>
        <Text style={styles.cardSubtitle}>Exprime ton ressenti</Text>
      </Pressable>

      {/* Statistiques → Stats */}
      <Pressable
        style={[styles.smallCard, styles.shadow]}
        onPress={() => router.push("/(tabs)/stat")}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>📊</Text>
        </View>
        <Text style={styles.cardTitle}>Statistiques</Text>
        <Text style={styles.cardSubtitle}>Tes progrès récents</Text>
      </Pressable>
    </View>
  );
}

function Pill({ label, icon }) {
  return (
    <Pressable style={({ pressed }) => [styles.pill, pressed && { opacity: 0.9 }]}>
      <Text style={styles.pillIcon}>{icon}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

// ————————————— MAIN PAGE ————————————— //

export default function ProfileUtilisateur() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Oui", onPress: () => console.log("Déconnecté ✅") },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 160 }}>
        {/* Titre principal */}
        <Text style={styles.pageTitle}>Profil</Text>

        {/* Section Compte */}
        <SectionHeader title="Compte" />
        <AccountCard />

        {/* Accès rapides */}
        <SectionHeader title="Accès rapides" />
        <TwoCards router={router} />

        {/* Paramètres */}
        <SectionHeader title="Paramètres" />
        <Pill label="Sécurité & mot de passe" icon="🔒" />
        <Pill label="Confidentialité" icon="🛡️" />
        <Pill label="Aide & support" icon="💬" />

        {/* Bouton Déconnexion */}
        <Pressable
          style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.85 }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Déconnexion</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text, 
    marginTop: 60,
    marginBottom: 24,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 10,
    marginTop: 26,
  },

  
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.pastel,
    marginRight: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.sub,
    marginTop: 4,
  },

  // — Cartes Mood / Stats —
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallCard: {
    flex: 1,
    backgroundColor: COLORS.pastel,
    borderRadius: RADIUS,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  iconCircle: {
    backgroundColor: "#ffffff",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconText: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#064e3b",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#155e47",
  },

  
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  pillIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  pillLabel: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
  arrow: {
    fontSize: 26,
    color: "#fff",
    marginLeft: 8,
  },


  logoutButton: {
    marginTop: 40,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },

  
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});
