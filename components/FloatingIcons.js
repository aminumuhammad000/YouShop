import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const iconConfigs = [
  { name: 'cart-outline', family: 'MaterialCommunityIcons', size: 20, color: '#A855F7', top: '5%', left: '8%', delay: 0 },
  { name: 'map-marker-outline', family: 'MaterialCommunityIcons', size: 18, color: '#EC4899', top: '3%', right: '12%', delay: 200 },
  { name: 'storefront-outline', family: 'MaterialCommunityIcons', size: 22, color: '#06B6D4', top: '15%', right: '5%', delay: 400 },
  { name: 'search', family: 'Feather', size: 16, color: '#F59E0B', top: '25%', left: '3%', delay: 600 },
  { name: 'send-outline', family: 'Ionicons', size: 18, color: '#7C3AED', top: '8%', right: '35%', delay: 100 },
  { name: 'play-circle-outline', family: 'MaterialCommunityIcons', size: 18, color: '#EF4444', bottom: '28%', left: '5%', delay: 300 },
  { name: 'megaphone-outline', family: 'Ionicons', size: 16, color: '#10B981', top: '12%', left: '25%', delay: 500 },
  { name: 'pricetag-outline', family: 'Ionicons', size: 17, color: '#F97316', bottom: '32%', right: '8%', delay: 700 },
  { name: 'chatbubble-outline', family: 'Ionicons', size: 16, color: '#8B5CF6', bottom: '25%', right: '25%', delay: 150 },
  { name: 'gift-outline', family: 'MaterialCommunityIcons', size: 18, color: '#14B8A6', top: '20%', left: '40%', delay: 450 },
];

const FloatingIcon = ({ config }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 0.18,
      duration: 800,
      delay: config.delay,
      useNativeDriver: true,
    }).start();

    Animated.timing(scale, {
      toValue: 1,
      duration: 600,
      delay: config.delay,
      useNativeDriver: true,
    }).start();

    // Floating animation
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -8,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 8,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    setTimeout(() => float.start(), config.delay);

    return () => float.stop();
  }, []);

  const getIcon = () => {
    const { name, family, size, color } = config;
    switch (family) {
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={name} size={size} color={color} />;
      case 'Ionicons':
        return <Ionicons name={name} size={size} color={color} />;
      case 'Feather':
        return <Feather name={name} size={size} color={color} />;
      default:
        return <MaterialCommunityIcons name={name} size={size} color={color} />;
    }
  };

  const positionStyle = {};
  if (config.top) positionStyle.top = config.top;
  if (config.bottom) positionStyle.bottom = config.bottom;
  if (config.left) positionStyle.left = config.left;
  if (config.right) positionStyle.right = config.right;

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        positionStyle,
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <View style={[styles.iconCircle, { borderColor: config.color + '20' }]}>
        {getIcon()}
      </View>
    </Animated.View>
  );
};

const FloatingIcons = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      {iconConfigs.map((config, index) => (
        <FloatingIcon key={index} config={config} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  iconContainer: {
    position: 'absolute',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
});

export default FloatingIcons;
