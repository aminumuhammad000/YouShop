import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientButton = ({ title = 'NEXT', onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.buttonWrapper}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#4F46E5', '#14B8A6']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 24,
  },
  gradient: {
    paddingVertical: 19,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
});

export default GradientButton;
