import React, { useState } from 'react';
import { View, StatusBar, Text, TouchableOpacity, Dimensions, Animated, Easing, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar from '../components/BottomTabBar';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import ChatListScreen from './ChatListScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';
import PaymentMethodScreen from './PaymentMethodScreen';
import AddNewCardScreen from './AddNewCardScreen';
import AddPaymentSuccessScreen from './AddPaymentSuccessScreen';
import OrderStatusScreen from './OrderStatusScreen';
import HelpCenterScreen from './HelpCenterScreen';
import ContactUsScreen from './ContactUsScreen';
import LikedPostsScreen from './LikedPostsScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import LogoutScreen from './LogoutScreen';
import CartScreen from './CartScreen';
import CheckoutScreen from './CheckoutScreen';
import PaymentScreen from './PaymentScreen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TARGET_X = SCREEN_WIDTH * 0.625; // 3rd tab in BottomTabBar (5/8 of width)
const TARGET_Y = SCREEN_HEIGHT - 64; // roughly the bottom tab bar's badge position

const MainScreen = ({ onLogout, userName, userEmail }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [openChat, setOpenChat] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isViewingPaymentMethods, setIsViewingPaymentMethods] = useState(false);
  const [isViewingAddNewCard, setIsViewingAddNewCard] = useState(false);
  const [isViewingAddPaymentSuccess, setIsViewingAddPaymentSuccess] = useState(false);
  const [isViewingOrderStatus, setIsViewingOrderStatus] = useState(false);
  const [isViewingHelpCenter, setIsViewingHelpCenter] = useState(false);
  const [isViewingContactUs, setIsViewingContactUs] = useState(false);
  const [isViewingLikedPosts, setIsViewingLikedPosts] = useState(false);
  const [isViewingPrivacyPolicy, setIsViewingPrivacyPolicy] = useState(false);
  const [isViewingCheckout, setIsViewingCheckout] = useState(false);
  const [isViewingPayment, setIsViewingPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null); // { cartItems, totalPrice }
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [floatingItems, setFloatingItems] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const cartCount = cartItems.length;

  const addToCart = (product, coords = null) => {
    if (!product) return;

    if (coords) {
      const animId = Date.now().toString() + Math.random().toString();
      const animX = new Animated.Value(coords.x);
      const animY = new Animated.Value(coords.y);
      const scale = new Animated.Value(0.4);
      const opacity = new Animated.Value(1);

      const newItem = {
        id: animId,
        animX,
        animY,
        scale,
        opacity,
      };

      setFloatingItems((prev) => [...prev, newItem]);

      // Play floating path animation
      Animated.parallel([
        Animated.timing(animX, {
          toValue: TARGET_X,
          duration: 650,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animY, {
          toValue: TARGET_Y,
          duration: 650,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.spring(scale, {
            toValue: 1.5,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.6,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 200,
            delay: 450,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Increment cart state
        setCartItems((prev) => [...prev, product]);
        // Remove animation item from list
        setFloatingItems((prev) => prev.filter((item) => item.id !== animId));
      });
    } else {
      setCartItems((prev) => [...prev, product]);
    }
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const renderContent = () => {
    if (openChat) return <ChatScreen chat={openChat} onBack={() => setOpenChat(null)} />;
    if (showSearch) return <SearchScreen onBack={() => setShowSearch(false)} />;
    if (isEditingProfile) return <EditProfileScreen onBack={() => setIsEditingProfile(false)} onSave={() => setIsEditingProfile(false)} />;
    if (isViewingPaymentMethods) return <PaymentMethodScreen onBack={() => setIsViewingPaymentMethods(false)} onAddPaymentMethod={() => setIsViewingAddNewCard(true)} />;
    if (isViewingAddNewCard) return <AddNewCardScreen onBack={() => setIsViewingAddNewCard(false)} onAddCard={() => { setIsViewingAddNewCard(false); setIsViewingAddPaymentSuccess(true); }} />;
    if (isViewingAddPaymentSuccess) return <AddPaymentSuccessScreen onBack={() => setIsViewingAddPaymentSuccess(false)} onGoToShop={() => { setIsViewingAddPaymentSuccess(false); setIsViewingPaymentMethods(false); setActiveTab('home'); }} />;

    if (isViewingOrderStatus) return <OrderStatusScreen onBack={() => setIsViewingOrderStatus(false)} onGoHome={() => { setIsViewingOrderStatus(false); setActiveTab('home'); }} />;
    if (isViewingHelpCenter) return <HelpCenterScreen onBack={() => setIsViewingHelpCenter(false)} />;
    if (isViewingContactUs) return <ContactUsScreen onBack={() => setIsViewingContactUs(false)} />;
    if (isViewingLikedPosts) return <LikedPostsScreen onBack={() => setIsViewingLikedPosts(false)} />;
    if (isViewingPrivacyPolicy) return <PrivacyPolicyScreen onBack={() => setIsViewingPrivacyPolicy(false)} />;

    // Payment screen — comes after checkout
    if (isViewingPayment && paymentData) return (
      <PaymentScreen
        cartItems={paymentData.cartItems}
        totalPrice={paymentData.totalPrice}
        onBack={() => setIsViewingPayment(false)}
        onSuccess={async () => {
          // Create the order after successful payment
          let createdOrder = null;
          try {
            const { createOrder } = require('../services/api');
            const orderItems = paymentData.cartItems.map(item => ({
              productId: item.id || item._id,
              name: item.name,
              price: parseInt(String(item.price).replace(/[^0-9]/g, ''), 10),
              quantity: 1,
              imageUrl: item.image?.uri || '',
            }));
            createdOrder = await createOrder(orderItems, paymentData.totalPrice);
          } catch (e) {
            console.log('Order creation error:', e);
          }
          setLastOrder(createdOrder);
          setCartItems([]);
          setIsViewingPayment(false);
          setIsViewingCheckout(false);
          setPaymentData(null);
          setIsViewingOrderStatus(true);
        }}
      />
    );

    if (isViewingCheckout) return (
      <CheckoutScreen
        cartItems={cartItems}
        onBack={() => setIsViewingCheckout(false)}
        onPay={(data) => {
          setPaymentData(data);
          setIsViewingPayment(true);
        }}
      />
    );
    if (isLoggingOut) return <LogoutScreen onBack={() => setIsLoggingOut(false)} onConfirmLogout={onLogout} />;

    switch (activeTab) {
      case 'home':
        return <HomeScreen onOpenSearch={() => setShowSearch(true)} onAddToCart={addToCart} cartCount={cartCount} />;
      case 'chat':
        return <ChatListScreen onOpenChat={c => setOpenChat(c)} onOpenSearch={() => setShowSearch(true)} />;
      case 'cart':
        return <CartScreen cartItems={cartItems} onRemoveItem={removeFromCart} onCheckout={() => setIsViewingCheckout(true)} onBack={() => setActiveTab('home')} />;
      case 'profile':
        return <ProfileScreen userName={userName} userEmail={userEmail} onLogout={() => setIsLoggingOut(true)} onBack={() => setActiveTab('home')} onEditProfile={() => setIsEditingProfile(true)} onPaymentMethods={() => setIsViewingPaymentMethods(true)} onHelpCenter={() => setIsViewingHelpCenter(true)} onContactUs={() => setIsViewingContactUs(true)} onLikedPosts={() => setIsViewingLikedPosts(true)} onPrivacyPolicy={() => setIsViewingPrivacyPolicy(true)} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: activeTab === 'home' ? '#000' : '#F5F5FA' }}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1 }}>{renderContent()}</View>
      {!openChat && !showSearch && !isEditingProfile && !isViewingPaymentMethods && !isViewingHelpCenter && !isViewingContactUs && !isViewingLikedPosts && !isViewingPrivacyPolicy && !isLoggingOut && !isViewingCheckout && !isViewingAddPaymentSuccess && !isViewingAddNewCard && !isViewingOrderStatus && (
        <BottomTabBar activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cartCount} />
      )}
      
      {/* Floating Add to Cart Badges Overlay */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {floatingItems.map((item) => (
          <Animated.View
            key={item.id}
            style={[
              styles.floatingBadge,
              {
                transform: [
                  { translateX: item.animX },
                  { translateY: item.animY },
                  { scale: item.scale },
                ],
                opacity: item.opacity,
              },
            ]}
          >
            <Text style={styles.floatingText}>+1</Text>
          </Animated.View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  floatingBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#10B981', // green cart color
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default MainScreen;
