import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import MapScreen from './src/screens/MapScreen';
import InfoScreen from './src/screens/InfoScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { useAppStore } from './src/store/appStore';
import { useTranslation } from './src/i18n/useTranslation';
import { RootTabParamList } from './src/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  React.useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splash}>
      <Text style={styles.splashEmoji}>🦞</Text>
      <Text style={styles.splashTitle}>HKLive</Text>
      <Text style={styles.splashSubtitle}>「香港，一触即发」</Text>
      <ActivityIndicator size="large" color="#FFF" style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashEmoji: { fontSize: 80, marginBottom: 16 },
  splashTitle: { fontSize: 48, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  splashSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 40 },
  spinner: { marginTop: 20 },
});

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { selectedLanguage } = useAppStore();
  const { t } = useTranslation();

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              height: 85,
              paddingTop: 8,
              paddingBottom: 28,
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#F0F0F0',
            },
            tabBarActiveTintColor: '#FF6B35',
            tabBarInactiveTintColor: '#999',
            tabBarLabelStyle: { fontSize: 12, fontWeight: '500', marginTop: 4 },
          }}
        >
          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{
              tabBarLabel: t('map'),
              tabBarIcon: ({ focused }) => (
                <View style={focused ? styles.tabIconActive : undefined}>
                  <Text style={styles.tabIcon}>🗺️</Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Info"
            component={InfoScreen}
            options={{
              tabBarLabel: t('info'),
              tabBarIcon: ({ focused }) => (
                <View style={focused ? styles.tabIconActive : undefined}>
                  <Text style={styles.tabIcon}>📱</Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: t('profile'),
              tabBarIcon: ({ focused }) => (
                <View style={focused ? styles.tabIconActive : undefined}>
                  <Text style={styles.tabIcon}>👤</Text>
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabIconActive: { backgroundColor: '#FFF5F0', borderRadius: 22 },
  tabIcon: { fontSize: 24 },
});
