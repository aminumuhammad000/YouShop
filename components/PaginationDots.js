import React from 'react';
import { View, StyleSheet } from 'react-native';

const PaginationDots = ({ total = 3, activeIndex = 0 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    borderRadius: 6,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    height: 8,
    backgroundColor: '#4338CA',
    borderRadius: 4,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
  },
});

export default PaginationDots;
