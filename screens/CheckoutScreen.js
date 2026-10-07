import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { createOrder } from '../services/api';

const CheckoutScreen = ({ cartItems = [], onBack, onPay }) => {
  // Calculate total from actual cart items
  const totalPrice = cartItems.reduce((sum, item) => {
    const num = parseInt(String(item.price).replace(/[^0-9]/g, ''), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const handleCheckout = () => {
    // Navigate to payment screen with cart + total
    if (onPay) onPay({ cartItems, totalPrice });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Payment Method Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Feather name="credit-card" size={16} color="#8B5CF6" style={{marginRight: 8}} />
              <Text style={styles.cardHeaderTitle}>PAYMENT METHOD</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.paymentBox}>
            <View style={styles.visaBadge}>
              <Text style={styles.visaText}>VISA</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Visa ending in 4242</Text>
              <Text style={styles.paymentExpiry}>Expires 12/26</Text>
            </View>
            <Feather name="check-circle" size={20} color="#10B981" />
          </View>
        </View>

        {/* Order Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Feather name="shopping-bag" size={16} color="#8B5CF6" style={{marginRight: 8}} />
              <Text style={styles.cardHeaderTitle}>ORDER SUMMARY</Text>
            </View>
          </View>

          {/* Items List - from actual cart */}
          {cartItems.map((item, index) => (
            <View key={item.id || item._id || index} style={styles.itemRow}>
              <Image 
                source={typeof item.image === 'object' && item.image.uri ? { uri: item.image.uri } : item.image || require('../assets/spicy_awara_food.jpg')} 
                style={styles.itemImage} 
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemQty}>Qty: 1</Text>
              </View>
              <Text style={styles.itemPrice}>{typeof item.price === 'string' ? item.price : '₦' + item.price}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          {/* Totals */}
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>₦{totalPrice.toLocaleString()}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Delivery</Text>
            <Text style={styles.totalsFree}>Free</Text>
          </View>
          
          <View style={styles.dividerDashed} />
          
          <View style={styles.totalsRow}>
            <Text style={styles.totalFinalLabel}>Total</Text>
            <Text style={styles.totalFinalValue}>₦{totalPrice.toLocaleString()}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.proceedBtn} onPress={handleCheckout}>
          <Feather name="lock" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.proceedBtnText}>Proceed to Payment</Text>
          <Feather name="arrow-right" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  card: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
  },
  changeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  paymentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  visaBadge: {
    backgroundColor: '#1F2937', // Dark color in screenshot
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 16,
  },
  visaText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  paymentExpiry: {
    fontSize: 13,
    color: '#6B7280',
  },
  
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemQty: {
    fontSize: 13,
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  dividerDashed: {
    height: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    marginVertical: 16,
  },
  
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalsLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  totalsValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalsFree: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
  },
  totalFinalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalFinalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  
  footer: {
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  proceedBtn: {
    flexDirection: 'row',
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
});

export default CheckoutScreen;
