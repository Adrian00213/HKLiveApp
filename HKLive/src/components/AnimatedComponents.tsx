import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, TouchableOpacity, ViewStyle } from 'react-native';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
  onPress?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  style, 
  delay = 0,
  onPress 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  };

  if (onPress) {
    return (
      <Animated.View style={[style, animatedStyle]}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// Animated button with press effect
interface AnimatedButtonProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  style,
  onPress 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={style}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Pulse animation for live indicators
export const PulseDot: React.FC = ({ color = '#FF6B35' }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={styles.pulseContainer}>
      <Animated.View 
        style={[
          styles.pulseDot,
          { backgroundColor: color, transform: [{ scale: pulseAnim }] }
        ]} 
      />
      <View style={[styles.pulseInner, { backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  pulseContainer: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pulseInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
