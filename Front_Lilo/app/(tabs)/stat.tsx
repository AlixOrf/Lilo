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

const moodImages: Record<string, any> = {
  Super_Happy: require("./assets/Super_Happy.png"),
  Happy: require("./assets/Happy.png"),
  Neutre: require("./assets/Neutre.png"),
  Depressed: require("./assets/Depressed.png"),
  Super_Depressed: require("./assets/Super_Depressed.png"),
};

const drinkImages: Record<string, any> = {
  Thé: require("./assets/The.png"),
  Eau: require("./assets/Eau.png"),
  Café: require("./assets/Cafe.png"),
  Soda: require("./assets/Soda.png"),
  Sirop: require("./assets/Sirop.png"),
  Jus: require("./assets/Jus.png"),
};

interface MoodEntry {
  id: number;
  Mood: keyof typeof moodImages;
  Boisson: keyof typeof drinkImages;
  Date: string;
}

const Stat = () => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [{ data: [] as number[] }],
  });
  const [topDrinks, setTopDrinks] = useState<{ name: string; count: number }[]>(
    []
  );

  const chartHeight = 360;

  useEffect(() => {
    fetch("http://10.109.253.140:1337/api/moods")
      .then((response) => response.json())
      .then((json) => {
        const fetchedMoods = json.data.map((item: any) => ({
          id: item.id,
          Mood: item.Mood,
          Boisson: item.Boisson,
          Date: item.Date,
        }));
        setMoods(fetchedMoods);
        generateChartData(fetchedMoods);
        computeTopDrinks(fetchedMoods);
      })
      .catch((error) => console.error("Erreur lors du fetch:", error));
  }, []);

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

    const values = sorted.map((item) => moodValue(item.Mood));

    setChartData({
      labels,
      datasets: [{ data: values }],
    });
  };

  const computeTopDrinks = (data: MoodEntry[]) => {
    const drinkCount: Record<string, number> = {};

    data.forEach((item) => {
      if (item.Boisson) {
        drinkCount[item.Boisson] = (drinkCount[item.Boisson] || 0) + 1;
      }
    });

    const sorted = Object.entries(drinkCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    setTopDrinks(sorted);
  };

  // 🎯 Affichage du jour avec image OU numéro
  const renderDay = (day: any) => {
    const dateStr = `${day.year}-${String(day.month).padStart(2, "0")}-${String(
      day.day
    ).padStart(2, "0")}`;

    const moodForDay = moods.find(
      (m) => m.Date.split("T")[0] === dateStr
    )?.Mood;

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>🌤️ Tes Statistiques du Mois</Text>

      <View style={styles.sectionCard}>
        <Text style={styles.title}>🗓️ Calendrier des Moods</Text>

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
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.title}>📈 Évolution du Mood</Text>

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
                    r: "7",
                    strokeWidth: "2",
                    stroke: "#ffde52",
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
      </View>

      <View style={styles.drinkContainer}>
        <Text style={styles.title}>🧃 Top 3 des boissons du mois</Text>
        <View style={styles.drinkList}>
          {topDrinks.map((drink, index) => (
            <View
              key={drink.name}
              style={[
                styles.drinkItem,
                { backgroundColor: index === 0 ? "#ffde52" : "#76efa3" },
              ]}
            >
              <Image source={drinkImages[drink.name]} style={styles.drinkImage} />
              <Text style={styles.drinkName}>{drink.name}</Text>
              <Text style={styles.drinkCount}>{drink.count}x</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Stat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3dbf86",
    marginVertical: 20,
  },
  sectionCard: {
    backgroundColor: "#dfdad7",
    marginHorizontal: 15,
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#262524",
    textAlign: "center",
    marginBottom: 10,
  },
  dayContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width / 7 - 5,
    height: 50,
  },
  moodImageFull: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  dayNumber: {
    fontSize: 14,
    color: "#b6b0ae",
    fontWeight: "600",
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
    marginRight: 5,
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
  drinkContainer: {
    backgroundColor: "#ffffff",
    margin: 15,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#3dbf86",
  },
  drinkList: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  drinkItem: {
    alignItems: "center",
    borderRadius: 16,
    padding: 10,
    width: 100,
  },
  drinkImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  drinkName: {
    marginTop: 5,
    fontWeight: "600",
    color: "#262524",
  },
  drinkCount: {
    color: "#ea654e",
    fontWeight: "bold",
  },
});
