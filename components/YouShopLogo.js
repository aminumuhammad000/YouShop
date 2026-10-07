import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Rect, Circle } from 'react-native-svg';

const YouShopLogo = ({ size = 48 }) => {
  const bagWidth = size;
  const bagHeight = size * 1.1;

  return (
    <View style={{ width: bagWidth, height: bagHeight }}>
      <Svg width={bagWidth} height={bagHeight} viewBox="0 0 60 66">
        <Defs>
          <LinearGradient id="bagGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#7C3AED" />
            <Stop offset="40%" stopColor="#A855F7" />
            <Stop offset="70%" stopColor="#06B6D4" />
            <Stop offset="100%" stopColor="#2DD4BF" />
          </LinearGradient>
          <LinearGradient id="bagGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#F59E0B" />
            <Stop offset="50%" stopColor="#EF4444" />
            <Stop offset="100%" stopColor="#EC4899" />
          </LinearGradient>
          <LinearGradient id="bagGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2DD4BF" />
            <Stop offset="100%" stopColor="#06B6D4" />
          </LinearGradient>
          <LinearGradient id="handleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>
        </Defs>

        {/* Main bag body */}
        <Path
          d="M8 22 L52 22 L48 60 Q47 64 43 64 L17 64 Q13 64 12 60 Z"
          fill="url(#bagGrad1)"
        />

        {/* Diagonal stripe 1 - yellow/orange */}
        <Path
          d="M8 22 L28 22 L12 60 Q11.5 62 12 60 L8 22 Z"
          fill="url(#bagGrad2)"
          opacity="0.6"
        />

        {/* Diagonal stripe 2 - teal */}
        <Path
          d="M8 22 L18 22 L10 52 Q9 56 12 60 L8 22 Z"
          fill="url(#bagGrad3)"
          opacity="0.7"
        />

        {/* Handle */}
        <Path
          d="M22 22 Q22 8 30 8 Q38 8 38 22"
          fill="none"
          stroke="url(#handleGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

export default YouShopLogo;
