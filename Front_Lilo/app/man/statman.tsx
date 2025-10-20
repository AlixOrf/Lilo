import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";

const API_URL = "http://10.109.253.232:1337/api/moods"; // ← adapte selon ton IP locale

const StatMoodsStacked = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

        const json = await res.json();
        if (!json.data || !Array.isArray(json.data))
          throw new Error("Format de données inattendu");

        // Extraction Strapi (compatibilité v4 / v5)
        const moods = json.data.map((item: any) => ({
          Mood: item.attributes?.Mood ?? item.Mood,
          Date: item.attributes?.Date ?? item.Date,
        }));

        // Regrouper les moods par jour
        const grouped: Record<string, Record<string, number>> = {};

        moods.forEach(({ Mood, Date: dateStr }) => {
          if (!dateStr) return;
          const dateKey = new Date(dateStr).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
          });
          if (!grouped[dateKey]) grouped[dateKey] = {};
          grouped[dateKey][Mood] = (grouped[dateKey][Mood] || 0) + 1;
        });

        // Créer les labels (jours) et datasets
        const labels = Object.keys(grouped);
        const moodTypes = ["Super_Happy", "Happy", "Neutre", "Depressed", "Super_Depressed"];

        const data = labels.map((label) =>
          moodTypes.map((m) => grouped[label][m] || 0)
        );

        setChartData({
          labels,
          legend: moodTypes,
          data,
          barColors: ["#6EDC82", "#A2E3A5", "#E5E35B", "#F2A65A", "#E57373"], // vert → rouge
        });
      } catch (err: any) {
        console.error(err);
        setError("Impossible de charger les statistiques 😢");
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3dbf86" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.loadingText, { color: "#ea654e" }]}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        <Text style={styles.title}>📊 Répartition des moods par jour</Text>
        {chartData && (
          <StackedBarChart
            data={chartData}
            width={Dimensions.get("window").width * 1.4}
            height={300}
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={styles.chart}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default StatMoodsStacked;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dfdad7",
    margin: 15,
    borderRadius: 20,
    padding: 15,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#262524",
  },
  chart: {
    borderRadius: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    textAlign: "center",
    color: "#949190",
    marginTop: 10,
  },
});
