import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Animated } from 'react-native';

import MapScreen from './src/screens/MapScreenSimple';
import InfoScreen from './src/screens/InfoScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { useAppStore } from './src/store/appStore';
import { useTranslation } from './src/i18n/useTranslation';
import { RootTabParamList } from './src/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={splashStyles.container}>
      <Animated.View 
        style={[
          splashStyles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ],
          }
        ]}
      >
        <Text style={splashStyles.emoji}>🦞</Text>
        <Text style={splashStyles.title}>HKLive</Text>
        <Text style={splashStyles.subtitle}>「香港，一触即发」</Text>
      </Animated.View>
      
      <Animated.View style={[splashStyles.loadingContainer, { opacity: fadeAnim }]}>
        <View style={splashStyles.dots}>
          <AnimatedDot delay={0} />
          <AnimatedDot delay={200} />
          <AnimatedDot delay={400} />
        </View>
        <Text style={splashStyles.loadingText}>Loading...</Text>
      </Animated.View>
    </View>
  );
};

const AnimatedDot = ({ delay }: { delay: number }) => {
  const [opacity] = useState(new Animated.Value(0.3));

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return <Animated.View style={[splashStyles.dot, { opacity }]} />;
};

const splashStyles = {
  container: {
    flex: 1,
    backgroundColor: '#FF6B35',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  logoContainer: {
    alignItems: 'center' as const,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold' as const,
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  loadingContainer: {
    position: 'absolute' as const,
    bottom: 100,
    alignItems: 'center' as const,
  },
  dots: {
    flexDirection: 'row' as const,
    marginBottom: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginHorizontal: 5,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
};

const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <View style={[tabStyles.iconContainer, focused && tabStyles.iconContainerFocused]}>
    <Text style={tabStyles.icon}>{icon}</Text>
  </View>
);

const tabStyles = {
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent',
  },
  iconContainerFocused: {
    backgroundColor: '#FFF5F0',
  },
  icon: {
    fontSize: 24,
  },
};

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
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarActiveTintColor: '#FF6B35',
            tabBarInactiveTintColor: '#999',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
              marginTop: 4,
            },
          }}
        >
          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{
              tabBarLabel: t('map'),
              tabBarIcon: ({ focused }) => <TabIcon icon="🗺️" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Info"
            component={InfoScreen}
            options={{
              tabBarLabel: t('info'),
              tabBarIcon: ({ focused }) => <TabIcon icon="📱" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: t('profile'),
              tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
