import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";

interface MoodEntry {
  id: number;
  Mood: string;
  Date: string;
}

export default function StatScreen() {
  const [moodData, setMoodData] = useState<Record<string, string>>({});

  // 🖼️ Images locales pour chaque humeur
  const moodImages: Record<string, any> = {
    Super_Happy: require("./assets/Super_Happy.png"),
    Happy: require("./assets/Happy.png"),
    Neutre: require("./assets/Neutre.png"),
    Depressed: require("./assets/Depressed.png"),
    Super_Depressed: require("./assets/Super_Depressed.png"),
  };

  // 🔄 Récupération des moods depuis Strapi
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await fetch("http://10.109.253.140:1337/api/moods");
        const json = await response.json();

        const moods: MoodEntry[] = json.data;

        const mapped: Record<string, string> = {};
        moods.forEach((m) => {
          const date = new Date(m.Date).toISOString().split("T")[0];
          mapped[date] = m.Mood;
        });

        setMoodData(mapped);
      } catch (error) {
        console.error("❌ Erreur de récupération des moods :", error);
      }
    };

    fetchMoods();
  }, []);

  // 📅 Rendu personnalisé de chaque jour
  const renderDay = (day: any) => {
    const date = day.dateString;
    const mood = moodData[date];
    const moodImage = mood ? moodImages[mood] : null;

    return (
      <View style={styles.dayContainer}>
        {moodImage ? (
          <Image source={moodImage} style={styles.moodImage} />
        ) : (
          <View style={styles.emptyDay} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        // @ts-ignore - le calendrier accepte les composants personnalisés
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
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 40,
  },
  dayContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth / 7 - 5,
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
});
