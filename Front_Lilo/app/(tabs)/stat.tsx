// app/(tabs)/stat.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { LineChart } from "react-native-chart-kit";
import { useAuth } from "../context/AuthContext";

const moodImages: Record<string, any> = {
  Super_Happy: require('../(tabs)/assets/Super_Happy.png'),
  Happy: require('../(tabs)/assets/Happy.png'),
  Neutre: require('../(tabs)/assets/Neutre.png'),
  Depressed: require('../(tabs)/assets/Depressed.png'),
  Super_Depressed: require('../(tabs)/assets/Super_Depressed.png'),
};

interface MoodEntry {
  id: number;
  Mood: keyof typeof moodImages;
  Date: string;
}

const Stat = () => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [{ data: [] as number[] }],
  });

  const chartHeight = 360;
  const { user } = useAuth();

  useEffect(() => {
    // si tu veux filtrer par utilisateur, tu peux append ?filters[utilisateur][$eq]=user.id
    const url = 'http://10.109.253.140:1337/api/moods';
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const fetchedMoods = json.data.map((item: any) => {
          // gérer si les données sont en attributes ou en flat object
          const built = {
            id: item.id,
            Mood: item.Mood || item.attributes?.Mood || item.attributes?.mood,
            Date: item.Date || item.attributes?.Date || item.attributes?.createdAt,
          };
          return built;
        });
        setMoods(fetchedMoods);
        generateChartData(fetchedMoods);
      })
      .catch((error) => console.error("Erreur lors du fetch:", error));
  }, [user]);

  const moodValue = (mood: string) => {
    switch (mood) {
      case "Super_Happy":
        return 5;
      case "Happy":
        return 4;
      case "Neutre":
        return 3;
      case "Depressed":
        return 2;
      case "Super_Depressed":
        return 1;
      default:
        return 0;
    }
  };

  const generateChartData = (data: MoodEntry[]) => {
    const sorted = [...data].sort(
      (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
    );

    const labels = sorted.map((item) => {
      const date = new Date(item.Date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const values = sorted.map((item) => moodValue(item.Mood as string));

    setChartData({
      labels,
      datasets: [{ data: values }],
    });
  };

  const renderDay = (day: any) => {
    const dateStr = `${day.year}-${String(day.month).padStart(2, "0")}-${String(
      day.day
    ).padStart(2, "0")}`;

    const moodForDay = moods.find(
      (m) => m.Date && m.Date.split && m.Date.split("T")[0] === dateStr
    )?.Mood;

    return (
      <View style={styles.dayContainer}>
        {moodForDay ? (
          <Image source={moodImages[moodForDay]} style={styles.moodImage} />
        ) : (
          <View style={styles.emptyDay} />
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Calendrier des Moods</Text>

      <Calendar
        // @ts-ignore
        dayComponent={({ date }) => renderDay(date)}
        hideExtraDays
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#3dbf86",
          monthTextColor: "#262524",
          todayTextColor: "#3dbf86",
          textMonthFontWeight: "bold",
          textDayFontSize: 16,
        }}
      />

      <Text style={styles.title}>Évolution du Mood</Text>

      {chartData.labels.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        >
          <View style={styles.chartWrapper}>
            <View style={styles.iconColumn}>
              {(["Super_Happy", "Happy", "Neutre", "Depressed", "Super_Depressed"] as const).map(
                (mood) => (
                  <View key={mood} style={styles.iconWrapper}>
                    <Image source={moodImages[mood]} style={styles.axisIcon} />
                  </View>
                )
              )}
            </View>

            <LineChart
              data={chartData}
              width={Dimensions.get("window").width * 1.5}
              height={chartHeight}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(61, 191, 134, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(38, 37, 36, ${opacity})`,
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#3dbf86",
                },
              }}
              bezier
              style={styles.chart}
              fromZero
              withInnerLines={false}
              withVerticalLines={false}
              withHorizontalLines={false}
              yLabelsOffset={-9999}
            />
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.loadingText}>Chargement du graphique...</Text>
      )}
    </ScrollView>
  );
};

export default Stat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#262524",
    textAlign: "center",
    marginVertical: 10,
  },
  dayContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width / 7 - 5,
    height: 50,
  },
  moodImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  emptyDay: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "transparent",
  },
  chartWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  iconColumn: {
    width: 50,
    justifyContent: "space-between",
    marginRight: 2,
  },
  iconWrapper: {
    alignItems: "center",
  },
  axisIcon: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },
  loadingText: {
    textAlign: "center",
    color: "#949190",
    marginTop: 10,
  },
});
