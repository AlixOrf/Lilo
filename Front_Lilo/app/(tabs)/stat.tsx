import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

// ✅ Types
type MoodType = "Super_Happy" | "Happy" | "Neutre" | "Depressed" | "Super_Depressed";

interface Mood {
  id: number;
  Mood: MoodType;
  Emotion?: string[];
  Boisson?: string;
  Journal?: string;
  Date: string; // Date au format ISO string
}

// ✅ Composant principal
export default function StatScreen() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [topDrinks, setTopDrinks] = useState<string[]>([]);
  const screenWidth = Dimensions.get("window").width;

  // ✅ Dictionnaire des icônes
  const moodImages: Record<MoodType, any> = {
    Super_Happy: require("../assets/moods/super_happy.png"),
    Happy: require("../assets/moods/happy.png"),
    Neutre: require("../assets/moods/neutral.png"),
    Depressed: require("../assets/moods/depressed.png"),
    Super_Depressed: require("../assets/moods/super_depressed.png"),
  };

  // ✅ Chargement des données Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("'http://10.109.253.140:1337/api/moods");
        const json = await res.json();

        // Directement dans json.data sans attributes
        const data: Mood[] = json.data.map((item: any) => ({
          id: item.id,
          Mood: item.Mood as MoodType,
          Emotion: item.Emotion,
          Boisson: item.Boisson,
          Journal: item.Journal,
          Date: item.Date,
        }));

        setMoods(data);

        // ✅ Calcul des boissons les plus bues
        const drinkCount: Record<string, number> = {};
        data.forEach((d) => {
          if (d.Boisson) {
            drinkCount[d.Boisson] = (drinkCount[d.Boisson] || 0) + 1;
          }
        });

        const sorted = Object.entries(drinkCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([boisson]) => boisson);

        setTopDrinks(sorted);
      } catch (err) {
        console.error("Erreur :", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Conversion pour le graphe
  const moodScale: Record<MoodType, number> = {
    Super_Happy: 5,
    Happy: 4,
    Neutre: 3,
    Depressed: 2,
    Super_Depressed: 1,
  };

  const chartData = moods
    .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())
    .map((m) => moodScale[m.Mood]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.month}>Octobre 2025</Text>
      <Text style={styles.sectionTitle}>Calendrier</Text>

      {/* ✅ Calendrier des humeurs */}
      <View style={styles.calendar}>
        {moods.map((m) => (
          <Image key={m.id} source={moodImages[m.Mood]} style={styles.moodIcon} />
        ))}
      </View>

      {/* ✅ Graphique */}
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: moods.map((m) => new Date(m.Date).getDate().toString()),
            datasets: [{ data: chartData }],
          }}
          width={screenWidth * 0.9}
          height={220}
          yLabelsOffset={15}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(61, 191, 134, ${opacity})`,
            labelColor: () => "#262524",
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* ✅ Boissons les plus bues */}
      <View style={styles.drinkContainer}>
        <Text style={styles.sectionSubtitle}>Vos boissons les plus bues</Text>
        <View style={styles.drinkRow}>
          {topDrinks.map((drink, index) => (
            <View key={index} style={styles.drinkBubble}>
              <Text style={styles.drinkText}>{drink}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  month: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    color: "#262524",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#262524",
    marginTop: 20,
    marginBottom: 10,
  },
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  moodIcon: {
    width: 60,
    height: 60,
    margin: 5,
  },
  chartContainer: {
    marginTop: 30,
    alignItems: "center",
    backgroundColor: "#dfdad7",
    borderRadius: 16,
    padding: 10,
  },
  chart: {
    borderRadius: 16,
  },
  drinkContainer: {
    backgroundColor: "#dfdad7",
    marginTop: 25,
    borderRadius: 16,
    padding: 15,
  },
  sectionSubtitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#262524",
    marginBottom: 10,
  },
  drinkRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  drinkBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3dbf86",
    justifyContent: "center",
    alignItems: "center",
  },
  drinkText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
