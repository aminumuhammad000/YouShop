import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Stepper = ({ currentStep, totalSteps = 3 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isActive = stepNum <= currentStep;
        
        return (
          <React.Fragment key={stepNum}>
            <View style={styles.stepContainer}>
              {isActive ? (
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899', '#F97316']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.circle}
                >
                  <Text style={styles.activeText}>{stepNum}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.circle, styles.inactiveCircle]}>
                  <Text style={styles.inactiveText}>{stepNum}</Text>
                </View>
              )}
            </View>
            
            {/* Connecting Line */}
            {stepNum < totalSteps && (
              <View style={styles.lineContainer}>
                {isActive && currentStep > stepNum ? (
                   <LinearGradient
                    colors={['#EC4899', '#F97316']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.line}
                  />
                ) : (
                  <View style={[styles.line, styles.inactiveLine]} />
                )}
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 40,
  },
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  inactiveCircle: {
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.1,
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inactiveText: {
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lineContainer: {
    flex: 1,
    height: 3,
    backgroundColor: 'transparent',
    marginHorizontal: -5,
    zIndex: 1,
  },
  line: {
    flex: 1,
    height: '100%',
  },
  inactiveLine: {
    backgroundColor: '#FFFFFF',
  },
});

export default Stepper;
