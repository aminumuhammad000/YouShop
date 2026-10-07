import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FloatingIcons from '../components/FloatingIcons';
import PaginationDots from '../components/PaginationDots';
import GradientButton from '../components/GradientButton';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../assets/onboarding1.jpg'),
    titlePart1: 'Talk to sellers ',
    titleHighlight: 'directly',
    description:
      'No middlemen. Negotiate, ask questions, and build real relationships with local businesses before you buy.',
  },
  {
    id: '2',
    image: require('../assets/onboarding2.jpg'),
    titlePart1: 'Scroll your city like a\n',
    titleHighlight: 'timeline',
    description:
      "We've reimagined local shopping. Swap the boring search bars for a gorgeous, personalized feed of products actively available just blocks away from you.",
  },
  {
    id: '3',
    image: require('../assets/onboarding3.jpg'),
    titlePart1: 'The market is now in\nyour ',
    titleHighlight: 'pocket',
    description:
      'Discover products near you, chat directly with local sellers, and get it delivered. All in one app.',
  },
];

const OnboardingSlide = ({ item }) => {
  return (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {item.titlePart1}
          <Text style={styles.titleHighlight}>{item.titleHighlight}</Text>
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const OnboardingScreen = ({ onGetStarted }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleNext = useCallback(() => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      // Last slide — Get Started
      if (onGetStarted) onGetStarted();
    }
  }, [activeIndex, onGetStarted]);

  const isLastSlide = activeIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Floating background icons */}
      <FloatingIcons />

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OnboardingSlide item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        style={styles.flatList}
      />

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        <PaginationDots total={slides.length} activeIndex={activeIndex} />
        <GradientButton
          title={isLastSlide ? 'GET STARTED' : 'NEXT'}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    maxHeight: height * 0.45,
  },
  image: {
    width: width * 0.85,
    height: height * 0.42,
  },
  textContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 16,
  },
  titleHighlight: {
    color: '#7C3AED',
    fontWeight: '800',
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  bottomSection: {
    paddingBottom: 10,
    alignItems: 'center',
  },
});

export default OnboardingScreen;
