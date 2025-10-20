import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type TabItem = {
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: string;
};

const tabs: TabItem[] = [
    { name: 'Stats', icon: 'stats-chart-outline', route: '/(tabs)/stat' },
    { name: 'Accueil', icon: 'home-outline', route: '/(tabs)' },
    { name: 'Profil', icon: 'person-outline', route: '/(tabs)/profil-utilisateur' },
];

const NAVBAR_HEIGHT = 60; // <- tu peux contrôler la hauteur exacte ici

const CustomNavbar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    return (
    <View
        style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: NAVBAR_HEIGHT + insets.bottom, // hauteur totale = navbar + zone système
            backgroundColor: '#2F494F',
            zIndex: 10,
        }}
    >
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
            <View style={[styles.navbar, { height: NAVBAR_HEIGHT, width }]}>
                {tabs.map((tab) => {
                    const isActive = pathname === tab.route;
                    return (
                        <TouchableOpacity
                        key={tab.name}
                        style={styles.tab}
                        onPress={() => router.push(tab.route)}
                        >
                    <Ionicons
                        name={tab.icon}
                        size={24}
                        color={isActive ? '#6FC18A' : '#F5F5DC'}
                    />
                    <Text
                    style={[
                        styles.label,
                        { color: isActive ? '#6FC18A' : '#F5F5DC' },
                    ]}
                    >
                    {tab.name}
                </Text>
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
        backgroundColor: '#2F494F',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 12,
        marginTop: 1,
    },
});

export default CustomNavbar;
