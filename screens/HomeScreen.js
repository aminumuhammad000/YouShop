import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { fetchProducts } from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, AntDesign } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Card occupies 95% of screen width and a tall portion of height
const CARD_WIDTH = SCREEN_WIDTH * 0.95;
const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.75, 680);

// How far the user needs to drag before a swipe commits
const SWIPE_THRESHOLD = 90;

// At this drag distance the indicator is fully opaque
const INDICATOR_MAX_DRAG = 100;



const HomeScreen = ({ onOpenSearch, onAddToCart, cartCount }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        const formatted = data.map(item => ({
          id: item._id,
          name: item.name,
          price: '₦' + item.price,
          desc: item.description,
          image: { uri: item.imageUrl },
          rating: '★★★★☆',
          reviews: '(124)',
          store: 'Tasty Bites',
          category: 'For You',
          storyImages: [
            { uri: { uri: item.imageUrl }, label: 'Product Image' },
          ],
        }));
        setProducts(formatted);
      } catch (error) {
        console.log('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [likedProducts, setLikedProducts] = useState({});

  // ─── Product Variant Stories state ──────────────────────────────────────────
  const [storyProduct, setStoryProduct] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const storyProgress = useRef(new Animated.Value(0)).current;
  const storyDragY = useRef(new Animated.Value(0)).current;
  const doubleTapTimeout = useRef(null);
  const storyTimer = useRef(null);

  const position = useRef(new Animated.ValueXY()).current;
  const likeAnim = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);

  // ─── Derived Animated Values ───────────────────────────────────────────────

  // Card rotation: tilts as it moves horizontally
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  // Slight fade when far from centre
  const cardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0.85, 1, 0.85],
    extrapolate: 'clamp',
  });

  // Scale-up the card behind the top card as it is dragged away
  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.93, 1],
    extrapolate: 'clamp',
  });

  // ─── Swipe Indicator Opacities ─────────────────────────────────────────────

  // Swipe RIGHT → green "ADD TO CART"
  const rightIndicatorOpacity = position.x.interpolate({
    inputRange: [0, INDICATOR_MAX_DRAG],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Swipe LEFT → red "PASS"
  const leftIndicatorOpacity = position.x.interpolate({
    inputRange: [-INDICATOR_MAX_DRAG, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Swipe UP → blue "VIEW DETAILS"  (dy is negative when swiping up)
  const upIndicatorOpacity = position.y.interpolate({
    inputRange: [-INDICATOR_MAX_DRAG, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // ─── Ref to avoid stale closures in PanResponder ──────────────────────────
  const stateRef = useRef({});
  stateRef.current = { currentIndex, onAddToCart, setSelectedProduct };

  // ─── Story Logic ──────────────────────────────────────────────────────────

  const startStoryProgress = (idx, prod) => {
    storyProgress.setValue(0);
    if (storyTimer.current) {
      storyTimer.current.stop();
    }
    const duration = 3000; // 3 seconds per slide
    storyTimer.current = Animated.timing(storyProgress, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    });

    storyTimer.current.start(({ finished }) => {
      if (finished) {
        handleNextStory(prod, idx);
      }
    });
  };

  const handleNextStory = (prod, currentIdx) => {
    const images = prod.storyImages || [];
    if (currentIdx < images.length - 1) {
      setStoryIndex(currentIdx + 1);
    } else {
      closeStoryViewer();
    }
  };

  const handlePrevStory = () => {
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1);
    }
  };

  const closeStoryViewer = () => {
    if (storyTimer.current) {
      storyTimer.current.stop();
    }
    setStoryProduct(null);
    setStoryIndex(0);
    storyProgress.setValue(0);
    storyDragY.setValue(0);
  };

  useEffect(() => {
    if (storyProduct) {
      startStoryProgress(storyIndex, storyProduct);
    }
    return () => {
      if (storyTimer.current) {
        storyTimer.current.stop();
      }
    };
  }, [storyProduct, storyIndex]);

  // Story Swipe Down to Dismiss PanResponder
  const storyPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          storyDragY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120) {
          Animated.timing(storyDragY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            closeStoryViewer();
          });
        } else {
          Animated.spring(storyDragY, {
            toValue: 0,
            friction: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // ─── Actions ───────────────────────────────────────────────────────────────

  const forceSwipe = (direction) => {
    let x = 0;
    let y = 0;
    if (direction === 'left') x = -(SCREEN_WIDTH + 200);
    else if (direction === 'right') x = SCREEN_WIDTH + 200;
    else if (direction === 'down') y = SCREEN_HEIGHT + 200;

    Animated.timing(position, {
      toValue: { x, y },
      duration: 280,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    const { currentIndex: currIdx, onAddToCart: addToCartFn } = stateRef.current;
    const item = products[currIdx % products.length];

    if (direction === 'right') {
      if (addToCartFn) {
        addToCartFn(item, { x: SCREEN_WIDTH * 0.85, y: SCREEN_HEIGHT * 0.45 });
      }
    } else if (direction === 'down') {
      console.log(`Added ${item.name} to wishlist`);
    }

    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      tension: 40,
      useNativeDriver: false,
    }).start();
  };

  const handleLikeToggle = (productId, isDoubleTap = false) => {
    setLikedProducts((prev) => {
      const isCurrentlyLiked = prev[productId];
      const nextState = !isCurrentlyLiked;
      if (nextState || isDoubleTap) {
        likeAnim.setValue(0);
        Animated.sequence([
          Animated.spring(likeAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
          Animated.timing(likeAnim, {
            toValue: 0,
            duration: 150,
            delay: 400,
            useNativeDriver: true,
          }),
        ]).start();
      }
      return { ...prev, [productId]: isDoubleTap ? true : nextState };
    });
  };

  const handleCardPress = (product) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (doubleTapTimeout.current) {
        clearTimeout(doubleTapTimeout.current);
        doubleTapTimeout.current = null;
      }
      handleLikeToggle(product.id, true);
    } else {
      if (doubleTapTimeout.current) {
        clearTimeout(doubleTapTimeout.current);
      }
      doubleTapTimeout.current = setTimeout(() => {
        setStoryProduct(product);
        setStoryIndex(0);
        doubleTapTimeout.current = null;
      }, 250);
    }
    lastTap.current = now;
  };

  // ─── PanResponder ──────────────────────────────────────────────────────────

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else if (gesture.dy < -SWIPE_THRESHOLD) {
          const { currentIndex: currIdx, setSelectedProduct: setProductFn } = stateRef.current;
          setProductFn(products[currIdx % products.length]);
          resetPosition();
        } else if (gesture.dy > SWIPE_THRESHOLD) {
          forceSwipe('down');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  // ─── Render Helpers ────────────────────────────────────────────────────────

  const renderCards = () => {
    return products.map((_, i) => {
      const displayIndex = (currentIndex + i) % products.length;
      const product = products[displayIndex];
      if (i >= 2) return null;

      if (i === 0) {
        // ── Top draggable card ──
        return (
          <Animated.View
            key={product.id + '-' + currentIndex}
            style={[
              styles.cardContainer,
              {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate },
                ],
                opacity: cardOpacity,
                zIndex: 10,
              },
            ]}
            {...panResponder.panHandlers}
          >
            <TouchableWithoutFeedback onPress={() => handleCardPress(product)}>
              <View style={{ flex: 1 }}>
                {renderCardContent(product, true)}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        );
      }

      // ── Behind card (scale up as top card flies off) ──
      return (
        <Animated.View
          key={product.id + '-' + (currentIndex + 1)}
          style={[
            styles.cardContainer,
            {
              transform: [{ scale: nextCardScale }],
              zIndex: 5,
            },
          ]}
        >
          {renderCardContent(product, false)}
        </Animated.View>
      );
    }).reverse();
  };

  const renderCardContent = (product, isTop) => {
    const isLiked = likedProducts[product.id];

    return (
      <View style={styles.card}>
        {/* ── Image takes up full card ── */}
        <Image source={product.image} style={styles.cardImage} resizeMode="cover" />

        {/* Gradient-like dark overlay at bottom so text is legible */}
        <View style={styles.imageOverlay} />

        {/* ── Swipe Indicators (only on top card) ── */}
        {isTop && (
          <>
            {/* RIGHT  → ADD TO CART (green, top-left) */}
            <Animated.View
              style={[
                styles.indicatorBadge,
                styles.indicatorRight,
                { opacity: rightIndicatorOpacity },
              ]}
              pointerEvents="none"
            >
              <Text style={styles.indicatorText}>✓  ADD TO CART</Text>
            </Animated.View>

            {/* LEFT  → PASS (red, top-right) */}
            <Animated.View
              style={[
                styles.indicatorBadge,
                styles.indicatorLeft,
                { opacity: leftIndicatorOpacity },
              ]}
              pointerEvents="none"
            >
              <Text style={styles.indicatorText}>✕  PASS</Text>
            </Animated.View>

            {/* UP  → VIEW DETAILS (blue, centre-top) */}
            <Animated.View
              style={[
                styles.indicatorBadge,
                styles.indicatorUp,
                { opacity: upIndicatorOpacity },
              ]}
              pointerEvents="none"
            >
              <Text style={styles.indicatorText}>↑  VIEW DETAILS</Text>
            </Animated.View>
          </>
        )}

        {/* ── Top badges row ── */}
        <View style={styles.topBadgesRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Feather name="check-circle" size={12} color="#4FC3F7" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>

        {/* ── Floating heart button ── */}
        <TouchableOpacity
          style={styles.floatingHeartBtn}
          onPress={() => handleLikeToggle(product.id)}
        >
          <AntDesign
            name={isLiked ? 'heart' : 'hearto'}
            size={20}
            color={isLiked ? '#EF4444' : '#8B5CF6'}
          />
        </TouchableOpacity>

        {/* ── TikTok-style double-tap heart overlay ── */}
        <Animated.View
          style={[
            styles.tiktokHeartContainer,
            {
              opacity: likeAnim,
              transform: [
                {
                  scale: likeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1.4],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <AntDesign name="heart" size={100} color="#EF4444" />
        </Animated.View>

        {/* ── Info panel at bottom of card ── */}
        <View style={styles.cardInfo}>
          <View style={styles.storeRow}>
            <Text style={styles.storeName}>{product.store}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.stars}>{product.rating}</Text>
              <Text style={styles.reviewsText}>{product.reviews}</Text>
            </View>
          </View>
          <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.productDesc} numberOfLines={2}>{product.desc}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>{product.price}</Text>
            <View style={styles.tapHint}>
              <Feather name="info" size={12} color="#9CA3AF" />
              <Text style={styles.tapHintText}>Swipe up for details</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }
  if (products.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>No products available</Text>
      </SafeAreaView>
    );
  }

  const currentTopProduct = products[currentIndex % products.length];
  

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>DISCOVER</Text>
          <Text style={styles.headerTitle}>Today's Picks</Text>
        </View>
        <View style={{ width: 46 }} />
      </View>

      {/* ── Cards Area ── */}
      <View style={styles.cardsArea}>
        {renderCards()}
      </View>

      {/* ── Action Buttons ── */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.btnX]}
          onPress={() => forceSwipe('left')}
          activeOpacity={0.8}
        >
          <Feather name="x" size={26} color="#EF4444" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.btnInfo]}
          onPress={() => setSelectedProduct(currentTopProduct)}
          activeOpacity={0.8}
        >
          <Feather name="info" size={22} color="#8B5CF6" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.btnCart]}
          onPress={() => forceSwipe('right')}
          activeOpacity={0.8}
        >
          <Feather name="shopping-cart" size={26} color="#10B981" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.btnHeart]}
          onPress={() => handleLikeToggle(currentTopProduct.id)}
          activeOpacity={0.8}
        >
          <AntDesign
            name={likedProducts[currentTopProduct.id] ? 'heart' : 'hearto'}
            size={24}
            color={likedProducts[currentTopProduct.id] ? '#EF4444' : '#F59E0B'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.helperBanner}>
        <Text style={styles.helperText}>PASS    •    DETAILS    •    CART    •    DOUBLE TAP</Text>
      </View>

      {/* ── Full Details Overlay ── */}
      {selectedProduct && (
        <View style={styles.overlayContainer}>
          <View style={styles.overlayHeader}>
            <TouchableOpacity
              onPress={() => setSelectedProduct(null)}
              style={styles.overlayBack}
            >
              <Feather name="chevron-left" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.overlayHeaderTitle}>Product Details</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.overlayContent} showsVerticalScrollIndicator={false}>
            <Image
              source={selectedProduct.image}
              style={styles.overlayImage}
              resizeMode="cover"
            />
            <View style={styles.overlayBody}>
              <View style={styles.overlayVendorRow}>
                <Text style={styles.overlayVendorName}>{selectedProduct.store} </Text>
                <Feather name="check-circle" size={14} color="#4FC3F7" />
                <View style={{ flex: 1 }} />
                <Text style={styles.overlayStars}>{selectedProduct.rating} </Text>
                <Text style={styles.overlayReviews}>{selectedProduct.reviews}</Text>
              </View>
              <Text style={styles.overlayTitle}>{selectedProduct.name}</Text>
              <Text style={styles.overlaySectionTitle}>Description</Text>
              <Text style={styles.overlayDesc}>
                {selectedProduct.desc} This delicious meal is prepared fresh by our local
                chefs using high quality ingredients and traditional spices.
              </Text>
              <Text style={styles.overlayPrice}>{selectedProduct.price}</Text>
              <TouchableOpacity
                style={styles.overlayAddBtn}
                onPress={() => {
                  if (onAddToCart) {
                    onAddToCart(selectedProduct, { x: SCREEN_WIDTH * 0.5, y: SCREEN_HEIGHT * 0.8 });
                  }
                  setSelectedProduct(null);
                  setCurrentIndex((prev) => prev + 1);
                }}
              >
                <Feather name="shopping-cart" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.overlayAddBtnText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* ── WhatsApp Status style Product Story Viewer ── */}
      {storyProduct && (
        <Animated.View
          style={[
            styles.storyContainer,
            {
              transform: [{ translateY: storyDragY }],
            },
          ]}
          {...storyPanResponder.panHandlers}
        >
          {/* Background variant Image */}
          <Image
            source={storyProduct.storyImages[storyIndex].uri}
            style={styles.storyImage}
            resizeMode="cover"
          />

          {/* Dark Overlay gradient for readability of progress and top controls */}
          <View style={styles.storyTopShadow} />
          <View style={styles.storyBottomShadow} />

          {/* Top Progress Bars & controls */}
          <SafeAreaView style={styles.storyTopControls}>
            <View style={styles.storyProgressBarRow}>
              {storyProduct.storyImages.map((img, idx) => {
                let progressWidth = '0%';
                if (idx < storyIndex) {
                  progressWidth = '100%';
                } else if (idx === storyIndex) {
                  return (
                    <View key={idx} style={styles.storyProgressBg}>
                      <Animated.View
                        style={[
                          styles.storyProgressFill,
                          {
                            width: storyProgress.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                            }),
                          },
                        ]}
                      />
                    </View>
                  );
                }
                return (
                  <View key={idx} style={styles.storyProgressBg}>
                    <View style={[styles.storyProgressFill, { width: progressWidth }]} />
                  </View>
                );
              })}
            </View>

            {/* Header info */}
            <View style={styles.storyHeader}>
              <View style={styles.storyHeaderLeft}>
                <Text style={styles.storyStoreName}>{storyProduct.store}</Text>
                <Text style={styles.storyVariantLabel}>
                  {storyProduct.storyImages[storyIndex].label}
                </Text>
              </View>
              <TouchableOpacity onPress={closeStoryViewer} style={styles.storyCloseBtn}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Tap Zones for navigating */}
          <View style={styles.storyTapZones}>
            {/* Left Tap Zone */}
            <TouchableOpacity
              activeOpacity={1}
              style={styles.storyTapZoneLeft}
              onPress={handlePrevStory}
            />
            {/* Right Tap Zone */}
            <TouchableOpacity
              activeOpacity={1}
              style={styles.storyTapZoneRight}
              onPress={() => handleNextStory(storyProduct, storyIndex)}
            />
          </View>

          {/* Bottom CTA / Add to Cart */}
          <View style={styles.storyBottomBar}>
            <View style={styles.storyBottomInfo}>
              <Text style={styles.storyProductName}>{storyProduct.name}</Text>
              <Text style={styles.storyProductPrice}>{storyProduct.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.storyAddBtn}
              onPress={() => {
                if (onAddToCart) {
                  onAddToCart(storyProduct, { x: SCREEN_WIDTH * 0.5, y: SCREEN_HEIGHT * 0.8 });
                }
                closeStoryViewer();
              }}
            >
              <Feather name="shopping-cart" size={18} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.storyAddBtnText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },

  // ── Header
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 8,
  },
  categoryScroll: {
    alignItems: 'center',
    gap: 8,
    paddingRight: 12,
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginRight: 4,
  },
  categoryTabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  categoryTabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '700',
  },
  categoryTabTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Cards
  cardsArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardContainer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 28,
    overflow: 'hidden',
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  // Dark gradient-like overlay at bottom
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    // Simulated gradient from transparent to dark
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    // Use multiple shadow layers as gradient simulators
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -20 },
        shadowOpacity: 0.0,
        shadowRadius: 0,
      },
    }),
  },

  // ── Swipe Indicators
  indicatorBadge: {
    position: 'absolute',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 3,
    zIndex: 30,
  },
  indicatorText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // "ADD TO CART" – green – top-left
  indicatorRight: {
    top: 28,
    left: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.85)',
    borderColor: '#10B981',
    transform: [{ rotate: '-8deg' }],
  },
  // "PASS" – red – top-right
  indicatorLeft: {
    top: 28,
    right: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    borderColor: '#EF4444',
    transform: [{ rotate: '8deg' }],
  },
  // "VIEW DETAILS" – blue – centred near top
  indicatorUp: {
    top: 28,
    alignSelf: 'center',
    left: CARD_WIDTH / 2 - 80,
    backgroundColor: 'rgba(59, 130, 246, 0.85)',
    borderColor: '#3B82F6',
  },

  // ── Top badges
  topBadgesRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },

  // ── Floating heart
  floatingHeartBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  // ── TikTok heart
  tiktokHeartContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },

  // ── Card info panel (overlaid on image)
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 22,
    backgroundColor: 'rgba(10, 10, 15, 0.78)',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeName: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    color: '#F59E0B',
    fontSize: 13,
  },
  reviewsText: {
    color: '#6B7280',
    fontSize: 11,
    marginLeft: 4,
  },
  productName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productDesc: {
    color: '#D1D5DB',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    color: '#A78BFA',
    fontSize: 26,
    fontWeight: '800',
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.7,
  },
  tapHintText: {
    color: '#9CA3AF',
    fontSize: 11,
    marginLeft: 4,
  },

  // ── Action buttons
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 18,
  },
  actionBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#2D2D4E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  btnX: { borderColor: '#EF4444', shadowColor: '#EF4444' },
  btnCart: { borderColor: '#10B981', shadowColor: '#10B981', width: 72, height: 72, borderRadius: 36 },
  btnInfo: { borderColor: '#8B5CF6', shadowColor: '#8B5CF6' },
  btnHeart: { borderColor: '#F59E0B', shadowColor: '#F59E0B' },

  // ── Hint banner
  helperBanner: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  helperText: {
    color: '#4B5563',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // ── Full details overlay
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0A0A0F',
    zIndex: 99,
  },
  overlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  overlayBack: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayHeaderTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  overlayContent: {
    flex: 1,
  },
  overlayImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.45,
  },
  overlayBody: {
    padding: 24,
    backgroundColor: '#111',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  overlayVendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overlayVendorName: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  overlayStars: {
    color: '#F59E0B',
  },
  overlayReviews: {
    color: '#6B7280',
  },
  overlayTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 20,
  },
  overlaySectionTitle: {
    color: '#8B5CF6',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  overlayDesc: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  overlayPrice: {
    color: '#A78BFA',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 24,
  },
  overlayAddBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  overlayAddBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // ── WhatsApp Status style Product Story Viewer styles
  storyContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    zIndex: 10000,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  storyTopShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  storyBottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  storyTopControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 35,
    left: 0,
    right: 0,
    zIndex: 10002,
    paddingHorizontal: 16,
  },
  storyProgressBarRow: {
    flexDirection: 'row',
    height: 3,
    gap: 6,
    marginBottom: 16,
  },
  storyProgressBg: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  storyProgressFill: {
    height: '100%',
    backgroundColor: '#FFF',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyHeaderLeft: {
    flex: 1,
  },
  storyStoreName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  storyVariantLabel: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  storyCloseBtn: {
    padding: 8,
  },
  storyTapZones: {
    position: 'absolute',
    top: 150,
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 10001,
  },
  storyTapZoneLeft: {
    flex: 3,
    height: '100%',
  },
  storyTapZoneRight: {
    flex: 7,
    height: '100%',
  },
  storyBottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 10002,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(17,17,26,0.85)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  storyBottomInfo: {
    flex: 1,
    marginRight: 16,
  },
  storyProductName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
  storyProductPrice: {
    color: '#34D399',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  storyAddBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyAddBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default HomeScreen;
