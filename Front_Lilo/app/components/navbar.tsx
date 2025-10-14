import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    Platform,
    } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ Récupère la largeur d'écran pour ajuster la navbar
const { width } = Dimensions.get('window');

type TabItem = {
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: string;
};

const tabs: TabItem[] = [
    { name: 'Stats', icon: 'stats-chart-outline', route: '/(tabs)/stat' },
    { name: 'Accueil', icon: 'home-outline', route: '/(tabs)' },
    { name: 'Profil', icon: 'person-outline', route: '/(tabs)/profile-utilisateur' },
    { name: 'Connexion', icon: 'person-outline', route: '/(tabs)/login' },
];

const CustomNavbar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={[styles.navbar, { width }]}>
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
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#2F494F',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#2F494F',
        borderTopWidth: 1,
        borderTopColor: '#ADB6BC',
        height: Platform.OS === 'ios' ? 80 : 65, // un peu plus grand sur iPhone à cause du notch
        paddingBottom: Platform.OS === 'android' ? 1 : 0,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 12,
        marginTop: 4,
    },
});

export default CustomNavbar;
