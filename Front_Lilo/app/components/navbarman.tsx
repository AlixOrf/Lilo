import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type TabItem = {
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const tabs: TabItem[] = [
  { icon: "stats-chart-outline", route: "/man/statman" },
  { icon: "person-outline", route: "/man/profil-manager" },
];

const NAVBAR_HEIGHT = 70;

const CustomNavbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const activeIndex = tabs.findIndex((t) => t.route === pathname);
  const translateX = useRef(
    new Animated.Value(activeIndex * (width / tabs.length))
  ).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeIndex * (width / tabs.length),
      useNativeDriver: true,
      speed: 12,
      bounciness: 6,
    }).start();
  }, [activeIndex]);

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: NAVBAR_HEIGHT + insets.bottom,
        alignItems: "center",
      }}
    >
      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <View
          style={[styles.navbar, { height: NAVBAR_HEIGHT, width: width * 0.9 }]}
        >

          {tabs.map((tab, index) => {
            const isActive = pathname === tab.route;
            return (
              <TouchableOpacity
                key={index}
                style={styles.tab}
                onPress={() => router.push(tab.route)}
              >
                <Ionicons
                  name={tab.icon}
                  size={28}
                  color={"#262524"}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: "center",
  },
  navbar: {
    backgroundColor: "#b6b0ae",
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#262524",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
    overflow: "visible",
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  activeCircle: {
    position: "absolute",
    top: -25,
    left: (width / tabs.length - 55) / 2,
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#6FC18A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  innerCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#b6b0ae",
  },
});

export default CustomNavbar;
