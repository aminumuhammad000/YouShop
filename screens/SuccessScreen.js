import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import GradientButton from '../components/GradientButton';

const SuccessScreen = ({ onHome }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Feather name="check" size={40} color="#FFFFFF" style={styles.checkIcon} />
          </View>
        </View>

        <Text style={styles.message}>
          Your Email has been successfully verified!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <GradientButton title="Go to Homepage" onPress={onHome} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FA',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  checkIcon: {
    marginTop: 5,
  },
  message: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginBottom: 40,
  },
});

export default SuccessScreen;
