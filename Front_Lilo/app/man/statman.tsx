import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import { StackedBarChart } from "react-native-chart-kit";
import { useAuth } from "../context/AuthContext";

const moodImages: Record<string, any> = {
  Super_Happy: require("../(tabs)/assets/Super_Happy.png"),
  Happy: require("../(tabs)/assets/Happy.png"),
  Neutre: require("../(tabs)/assets/Neutre.png"),
  Depressed: require("../(tabs)/assets/Depressed.png"),
  Super_Depressed: require("../(tabs)/assets/Super_Depressed.png"),
};

const moodColors: Record<string, string> = {
  Super_Happy: "#3dbf86",
  Happy: "#76efa3",
  Neutre: "#ffde52",
  Depressed: "#ff9384",
  Super_Depressed: "#ea654e",
};

interface MoodEntry {
  idMood: number | string;
  Mood: keyof typeof moodImages;
  Date: string;
  idUtilisateur: string;
}

const StatMan = () => {
  const { manager, loading: authLoading } = useAuth();
  const [calendarData, setCalendarData] = useState<Record<string, keyof typeof moodImages>>({});
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (authLoading) return;

  const fetchData = async () => {
    if (!manager?.Idman) {
      console.warn("⚠️ Manager non connecté, stop ici");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Récupérer les utilisateurs du manager
      console.log("📌 Fetching utilisateurs pour manager Idman:", manager.Idman);
      const resUsers = await fetch(
        `http://10.109.253.112:1337/api/utilisateurs?filters[manager][Idman][$eq]=${manager.Idman}`
      );
      const usersJson = await resUsers.json();
      const utilisateurs = usersJson.data || [];
      console.log("📌 Utilisateurs récupérés:", utilisateurs);

      // fallback sur id si idUtilisateur n'existe pas
      const idUtilisateurs = utilisateurs.map((u: any) => u.idUtilisateur || u.id);
      console.log("📌 idUtilisateurs:", idUtilisateurs);

      if (!idUtilisateurs.length) {
        console.warn("⚠️ Aucun utilisateur trouvé");
        setLoading(false);
        return;
      }

      // 2️⃣ Récupérer tous les moods
      console.log("📌 Fetching moods");
      const resMoods = await fetch(`http://10.109.253.112:1337/api/moods?populate=utilisateur`);
      const moodsJson = await resMoods.json();
      console.log("📌 moodsJson brut:", moodsJson);

      // 3️⃣ Filtrer moods pour les utilisateurs du manager
      const fetchedMoods: MoodEntry[] = moodsJson.data
        .map((item: any) => ({
          idMood: item.idMood || item.id,
          Mood: item.Mood,
          Date: item.Date,
          idUtilisateur: item.utilisateur?.idUtilisateur || item.utilisateur?.id,
        }))
        .filter((m: MoodEntry) => idUtilisateurs.includes(m.idUtilisateur));

      console.log("📌 fetchedMoods filtrés:", fetchedMoods);

      // 4️⃣ Fusionner tous les moods par date (tous utilisateurs)
      const moodsByDate: Record<string, MoodEntry[]> = {};
      fetchedMoods.forEach(m => {
        const date = m.Date.split("T")[0];
        if (!moodsByDate[date]) moodsByDate[date] = [];
        moodsByDate[date].push(m);
      });
      console.log("📌 moodsByDate fusionnés:", moodsByDate);

      // 5️⃣ Calculer la majorité globale par date pour le calendrier
      const majorityMoodByDate: Record<string, keyof typeof moodImages> = {};
      Object.entries(moodsByDate).forEach(([date, moods]) => {
        const freq: Record<string, number> = {};
        moods.forEach(m => {
          freq[m.Mood] = (freq[m.Mood] || 0) + 1;
        });
        const majority = Object.keys(freq).reduce((a, b) => freq[a] >= freq[b] ? a : b);
        majorityMoodByDate[date] = majority as keyof typeof moodImages;
      });
      console.log("📌 majorityMoodByDate pour calendrier:", majorityMoodByDate);
      setCalendarData(majorityMoodByDate);

      // 6️⃣ Construire les données pour le graphique empilé
      const allDates = Object.keys(moodsByDate).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      const labels = allDates.map(d => {
        const date = new Date(d);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      });

      const dataPerDay = allDates.map(date => {
        const count = { Super_Happy: 0, Happy: 0, Neutre: 0, Depressed: 0, Super_Depressed: 0 };
        moodsByDate[date].forEach(m => {
          count[m.Mood] = (count[m.Mood] || 0) + 1;
        });
        return [count.Super_Happy, count.Happy, count.Neutre, count.Depressed, count.Super_Depressed];
      });

      const stackedData = {
        labels,
        legend: Object.keys(moodColors),
        data: dataPerDay,
        barColors: Object.values(moodColors),
      };
      console.log("📌 stackedData pour graphique:", stackedData);
      setChartData(stackedData);

    } catch (err) {
      console.error("❌ Erreur fetchData StatMan:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [authLoading, manager]);





  const renderDay = (day: any) => {
    const dateStr = `${day.year}-${String(day.month).padStart(2,"0")}-${String(day.day).padStart(2,"0")}`;
    const mood = calendarData[dateStr];
    return (
      <View style={styles.dayContainer}>
        {mood ? <Image source={moodImages[mood]} style={styles.moodImageFull} /> : <Text style={styles.dayNumber}>{day.day}</Text>}
      </View>
    );
  };

  const getChartWidth = (labelsLength: number) => {
    const minWidth = Dimensions.get('window').width * 0.95;
    const barPixel = 14;
    const paddingBetweenBars = 4;
    return Math.max(minWidth, labelsLength * (barPixel + paddingBetweenBars));
  };

  if (loading)
    return <ActivityIndicator style={{ flex:1, marginTop:50 }} size="large" color="#3dbf86" />;

  if (!manager?.Idman)
    return <Text style={{ color:"red", textAlign:"center", marginTop:50 }}>Manager non connecté</Text>;

  return (
    <ScrollView style={{ flex:1, backgroundColor:"#fff", padding:16 }}>
      <View style={styles.transparentBlock} />
      <Text style={styles.title}>Statistiques de votre équipe</Text>

      <View style={styles.grayBox}>
        <Calendar
          // @ts-ignore
          dayComponent={({ date }) => renderDay(date)}
          hideExtraDays
          theme={{ calendarBackground:'#fff', textMonthFontWeight:'bold', textDayFontSize:16 }}
        />
      </View>

      {chartData && (
        <View style={{ marginTop:40 }}>
          <Text style={{ fontWeight:'bold', marginBottom:12, fontSize:16 }}>Répartition des émotions par jour</Text>
          <View style={styles.grayBox}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <StackedBarChart
                data={chartData}
                width={getChartWidth(chartData.labels.length)}
                height={260}
                chartConfig={{
                  backgroundColor:'#fff',
                  backgroundGradientFrom:'#fff',
                  backgroundGradientTo:'#fff',
                  decimalPlaces:0,
                  color: () => '#262524',
                  labelColor: () => '#262524',
                  propsForLabels: { fontSize:12, fontWeight:"bold" },
                  barPercentage: 0.9,
                }}
                hideLegend={true}
                withHorizontalLabels={true}
                showValuesOnTopOfBars={false}
              />
            </ScrollView>
          </View>

          <View style={styles.legendContainer}>
            {Object.entries(moodColors).map(([label, color]) => (
              <View key={label} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: color }]} />
                <Text style={styles.legendText}>{label.replace("_"," ")}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.transparentBlock} />
    </ScrollView>
  );
};

export default StatMan;

const styles = StyleSheet.create({
  transparentBlock: { height:60, marginBottom:10, borderRadius:10 },
  grayBox: { backgroundColor:"#dfdad7", padding:10, borderRadius:10, shadowRadius:5, elevation:2 },
  title: { fontSize:22, fontWeight:"bold", textAlign:"center", marginTop:25, marginBottom:35 },
  dayContainer: { justifyContent:'center', alignItems:'center', width:Dimensions.get("window").width/7-5, height:50 },
  dayNumber: { fontSize:14, fontWeight:'600' },
  moodImageFull: { width:45, height:45, resizeMode:'contain' },
  legendContainer: { flexDirection:"row", flexWrap:"wrap", justifyContent:"center", marginTop:20, gap:10 },
  legendItem: { flexDirection:"row", alignItems:"center", marginHorizontal:6 },
  legendColor: { width:14, height:14, borderRadius:4, marginRight:6 },
  legendText: { fontSize:13, color:"#262524", fontWeight:"500" },
});