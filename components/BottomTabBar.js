import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BottomTabBar = ({ activeTab, setActiveTab, cartCount }) => {
  const badgeScale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (cartCount > 0) {
      badgeScale.setValue(1);
      Animated.sequence([
        Animated.timing(badgeScale, {
          toValue: 1.4,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartCount]);

  const tabs = [
    { name: 'home', icon: 'home' },
    { name: 'chat', icon: 'message-square' },
    { name: 'cart', icon: 'cart-outline' },
    { name: 'profile', icon: 'user' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tabButton}
          onPress={() => setActiveTab(tab.name)}
        >
          {activeTab === tab.name ? (
            <View style={styles.activeCircle}>
              {tab.name === 'cart' ? (
                <MaterialCommunityIcons name={tab.icon} size={20} color="#FFFFFF" />
              ) : (
                <Feather name={tab.icon} size={20} color="#FFFFFF" />
              )}
              {tab.name === 'cart' && cartCount > 0 && (
                <Animated.View style={[styles.badge, { transform: [{ scale: badgeScale }] }]} pointerEvents="none">
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </Animated.View>
              )}
            </View>
          ) : (
            <View style={{ position: 'relative' }}>
              {tab.name === 'cart' ? (
                <MaterialCommunityIcons name={tab.icon} size={20} color="#6B7280" />
              ) : (
                <Feather name={tab.icon} size={20} color="#6B7280" />
              )}
              {tab.name === 'cart' && cartCount > 0 && (
                <Animated.View style={[styles.badgeInactive, { transform: [{ scale: badgeScale }] }]} pointerEvents="none">
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </Animated.View>
              )}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#E5E7EB', // Light gray pill color
    borderRadius: 32,
    marginHorizontal: 16,
    marginBottom: 20, // Floating above bottom
    paddingHorizontal: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInactive: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
});

export default BottomTabBar;
