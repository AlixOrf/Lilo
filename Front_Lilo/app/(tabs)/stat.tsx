import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { LineChart } from "react-native-chart-kit";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://10.109.253.232:1337/api/moods";

const moodImages: Record<string, any> = {
  Super_Happy: require("./assets/Super_Happy.png"),
  Happy: require("./assets/Happy.png"),
  Neutre: require("./assets/Neutre.png"),
  Depressed: require("./assets/Depressed.png"),
  Super_Depressed: require("./assets/Super_Depressed.png"),
};

const drinkImages: Record<string, any> = {
  The: require("./assets/The.png"),
  Eau: require("./assets/Eau.png"),
  Cafe: require("./assets/Cafe.png"),
  Soda: require("./assets/Soda.png"),
  Sirop: require("./assets/Sirop.png"),
  Jus: require("./assets/Jus.png"),
};

interface MoodEntry {
  idMood: number | string;
  Mood: keyof typeof moodImages;
  Boisson?: keyof typeof drinkImages;
  Date: string;
  idUtilisateur: string;
}

const Stat = () => {
  const { user, loading: authLoading } = useAuth();
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [{ data: [] as number[] }],
  });
  const [topDrinks, setTopDrinks] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chartHeight = 360;

  useEffect(() => {
    if (authLoading) return;

    if (!user?.idUtilisateur) {
      console.warn("⚠️ Utilisateur non connecté");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const resMoods = await fetch(
          `${API_URL}?filters[utilisateur][idUtilisateur][$eq]=${user.idUtilisateur}&populate=utilisateur`
        );
        if (!resMoods.ok) throw new Error(`Erreur HTTP ${resMoods.status}`);

        const moodsJson = await resMoods.json();

        const fetchedMoods = moodsJson.data.map((item: any) => ({
          idMood: item.idMood ?? item.id,
          Mood: item.Mood,
          Boisson: item.Boisson,
          Date: item.Date,
          idUtilisateur: item.utilisateur?.idUtilisateur,
        }));

        setMoods(fetchedMoods);
        generateChartData(fetchedMoods);
        computeTopDrinks(fetchedMoods);
        setError(null);
      } catch (err: any) {
        console.error("❌ Erreur fetchData Stat:", err);
        setError("Impossible de charger les statistiques 😢");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, user]);

  const moodValue = (mood: string) => {
    switch (mood) {
      case "Super_Happy": return 5;
      case "Happy": return 4;
      case "Neutre": return 3;
      case "Depressed": return 2;
      case "Super_Depressed": return 1;
      default: return 0;
    }
  };

  // 🌟 Génération moyenne par date
  const generateChartData = (data: MoodEntry[]) => {
    const moodsByDate: Record<string, MoodEntry[]> = {};
    data.forEach((item) => {
      const dateStr = item.Date.split("T")[0];
      if (!moodsByDate[dateStr]) moodsByDate[dateStr] = [];
      moodsByDate[dateStr].push(item);
    });

    const sortedDates = Object.keys(moodsByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const labels = sortedDates.map((d) => {
      const date = new Date(d);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const values = sortedDates.map((d) => {
      const moodsForDay = moodsByDate[d];
      const avg = moodsForDay.reduce((acc, m) => acc + moodValue(m.Mood), 0) / moodsForDay.length;
      return avg;
    });

    setChartData({ labels, datasets: [{ data: values }] });
  };

  const computeTopDrinks = (data: MoodEntry[]) => {
    const drinkCount: Record<string, number> = {};
    data.forEach((item) => {
      if (item.Boisson) drinkCount[item.Boisson] = (drinkCount[item.Boisson] || 0) + 1;
    });
    const sorted = Object.entries(drinkCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
    setTopDrinks(sorted);
  };

  const renderDay = (day: any) => {
    const dateStr = `${day.year}-${String(day.month).padStart(2, "0")}-${String(day.day).padStart(2, "0")}`;
    const moodForDay = moods.find((m) => m.Date.split("T")[0] === dateStr)?.Mood;
    return (
      <View style={styles.dayContainer}>
        {moodForDay ? (
          <Image source={moodImages[moodForDay]} style={styles.moodImageFull} />
        ) : (
          <Text style={styles.dayNumber}>{day.day}</Text>
        )}
      </View>
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} size="large" color="#3dbf86" />;
  if (!user?.idUtilisateur) return <Text style={{ color: "red", textAlign: "center", marginTop: 50 }}>Utilisateur non connecté</Text>;
  if (error) return <Text style={{ color: "red", textAlign: "center", marginTop: 50 }}>{error}</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 200 }}>
      {/* Rectangle invisible avant le titre */}
      <View style={{ height: 50, width: "100%" }} />

      <Text style={styles.header}>Vos Statistiques du Mois</Text>

      <View style={styles.sectionCard}>
        <Text style={styles.title}>Calendrier des Moods</Text>
        <Calendar
          // @ts-ignore
          dayComponent={({ date }) => renderDay(date)}
          hideExtraDays
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.title}>Évolution du Mood</Text>
        {chartData.labels.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chartWrapper}>
              <View style={styles.iconColumn}>
                {(["Super_Happy", "Happy", "Neutre", "Depressed", "Super_Depressed"] as const).map((mood) => (
                  <View key={mood} style={styles.iconWrapper}>
                    <Image source={moodImages[mood]} style={styles.axisIcon} />
                  </View>
                ))}
              </View>
              <LineChart
                data={chartData}
                width={Math.max(Dimensions.get("window").width, chartData.labels.length * 60)}
                height={360}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(61, 191, 134, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(38, 37, 36, ${opacity})`,
                  propsForDots: { r: "7", strokeWidth: "2", stroke: "#ffde52" },
                }}
                bezier
                fromZero
                withInnerLines={false}
                withVerticalLines={false}
                withHorizontalLines={false}
                yLabelsOffset={-9999}
                style={styles.chart}
              />
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.loadingText}>Aucune donnée à afficher</Text>
        )}
      </View>

      <View style={styles.drinkContainer}>
        <Text style={styles.title}>Top 3 de vos boissons du mois</Text>
        <View style={styles.drinkList}>
          {topDrinks.length > 0 ? topDrinks.map((drink, index) => (
            <View key={drink.name} style={[styles.drinkItem, { backgroundColor: index === 0 ? "#ffde52" : "#76efa3" }]}>
              <Image source={drinkImages[drink.name]} style={styles.drinkImage} />
              <Text style={styles.drinkName}>{drink.name}</Text>
              <Text style={styles.drinkCount}>{drink.count}x</Text>
            </View>
          )) : <Text style={styles.loadingText}>Aucune boisson enregistrée</Text>}
        </View>
      </View>
    </ScrollView>
  );
};

export default Stat;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#3dbf86", marginVertical: 20 },
  sectionCard: { backgroundColor: "#dfdad7", marginHorizontal: 15, borderRadius: 20, padding: 15, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  title: { fontSize: 18, fontWeight: "bold", color: "#262524", textAlign: "center", marginBottom: 10 },
  dayContainer: { justifyContent: "center", alignItems: "center", width: Dimensions.get("window").width / 7 - 5, height: 50 },
  moodImageFull: { width: 45, height: 45, resizeMode: "contain" },
  dayNumber: { fontSize: 14, color: "#b6b0ae", fontWeight: "600" },
  chartWrapper: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 10 },
  chart: { marginVertical: 10, borderRadius: 16 },
  iconColumn: { width: 50, justifyContent: "space-between", marginRight: 5 },
  iconWrapper: { alignItems: "center" },
  axisIcon: { width: 55, height: 55, resizeMode: "contain" },
  loadingText: { textAlign: "center", color: "#949190", marginTop: 10 },
  drinkContainer: { backgroundColor: "#ffffff", margin: 15, borderRadius: 20, padding: 20, borderWidth: 2, borderColor: "#3dbf86" },
  drinkList: { flexDirection: "row", justifyContent: "space-around", marginTop: 15 },
  drinkItem: { alignItems: "center", borderRadius: 16, padding: 10, width: 100 },
  drinkImage: { width: 50, height: 50, resizeMode: "contain" },
  drinkName: { marginTop: 5, fontWeight: "600", color: "#262524" },
  drinkCount: { color: "#ea654e", fontWeight: "bold" },
});
