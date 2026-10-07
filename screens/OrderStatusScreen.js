import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const foodImage = require('../assets/spicy_awara_food.jpg');

const OrderStatusScreen = ({ onBack, onGoHome, order }) => {
  const orderNumber = order?.orderNumber || '#YS-98421';
  const items = order?.items || [];
  const total = order?.totalPrice || 0;
  const estimatedDelivery = '2 hours 24 minutes'; // placeholder
  return (
    <View style={styles.container}>
      {/* Header with back/close button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Status</Text>
        <TouchableOpacity onPress={onGoHome} style={styles.homeBtn}>
          <Feather name="home" size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Order Number */}
        <Text style={styles.orderLabel}>ORDER STATUS</Text>
        <Text style={styles.orderNumber}>{orderNumber}</Text>

        {/* Estimated Delivery Badge */}
        <View style={styles.estBadge}>
          <Feather name="clock" size={20} color="#6D28D9" style={styles.clockIcon} />
          <View>
            <Text style={styles.estLabel}>Estimated Delivery</Text>
            <Text style={styles.estTime}>{estimatedDelivery}</Text>
          </View>
        </View>

        {/* Tracking Timeline Card */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardHeader}>TRACKING TIMELINE</Text>
          <View style={styles.timeline}>
            {/* Step 1: Delivered (Incomplete) */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={[styles.circle, styles.circleIncomplete]}>
                  <Feather name="check" size={12} color="#D1D5DB" />
                </View>
                <View style={[styles.line, styles.lineGray]} />
              </View>
              <View style={styles.timelineRight}>
                <Text style={[styles.stepTitle, styles.txtGray]}>Delivered</Text>
                <Text style={[styles.stepDesc, styles.txtGray]}>Estimated {estimatedDelivery}</Text>
              </View>
            </View>

            {/* Step 2: On the way (Active) */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={[styles.circle, styles.circleActive]}>
                  <Feather name="truck" size={12} color="#fff" />
                </View>
                <View style={styles.line} />
              </View>
              <View style={styles.timelineRight}>
                <Text style={[styles.stepTitle, styles.txtActive]}>On the way</Text>
                <Text style={styles.stepDesc}>Package is on its way to the local hub</Text>
                <Text style={styles.stepTimeText}>OCT 22, 10:45 AM</Text>
              </View>
            </View>

            {/* Step 3: Order Processed (Completed) */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={styles.circle}>
                  <Feather name="check" size={12} color="#fff" />
                </View>
                <View style={styles.line} />
              </View>
              <View style={styles.timelineRight}>
                <Text style={styles.stepTitle}>Order Processed</Text>
                <Text style={styles.stepDesc}>Tasty Bites has packed your order</Text>
                <Text style={styles.stepTimeText}>OCT 21, 04:20 PM</Text>
              </View>
            </View>

            {/* Step 4: Order Placed (Completed) */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={styles.circle}>
                  <Feather name="check" size={12} color="#fff" />
                </View>
              </View>
              <View style={styles.timelineRight}>
                <Text style={styles.stepTitle}>Order Placed</Text>
                <Text style={styles.stepDesc}>We have received your order</Text>
                <Text style={styles.stepTimeText}>OCT 21, 09:12 AM</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>ORDER SUMMARY</Text>
          {items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Image source={item.imageUrl ? { uri: item.imageUrl } : require('../assets/spicy_awara_food.jpg')} style={styles.itemImg} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>• Qty: {item.quantity}</Text>
                <Text style={styles.itemPrice}>₦{item.price}</Text>
              </View>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Subtotal</Text>
            <Text style={styles.costVal}>₦{total}</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Shipping</Text>
            <Text style={styles.shippingFree}>FREE</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.costRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalVal}>₦{total}</Text>
          </View>
        </View>

        {/* Verified Purchase Badge */}
        <View style={styles.verifiedContainer}>
          <View style={styles.verifiedBadge}>
            <Feather name="check-circle" size={14} color="#065F46" />
            <Text style={styles.verifiedText}>VERIFIED PURCHASE</Text>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  homeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  orderLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8B5CF6',
    letterSpacing: 0.5,
    marginTop: 10,
  },
  orderNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 16,
  },
  
  // Est Badge
  estBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBE5F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  clockIcon: {
    marginRight: 16,
  },
  estLabel: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  estTime: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 2,
  },
  
  // Timeline Card
  timelineCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 24,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  circleIncomplete: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  circleActive: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  line: {
    width: 2,
    position: 'absolute',
    top: 24,
    bottom: -28,
    backgroundColor: '#8B5CF6',
    zIndex: 1,
  },
  lineGray: {
    backgroundColor: '#E5E7EB',
  },
  timelineRight: {
    flex: 1,
    paddingTop: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4C1D95',
    marginBottom: 4,
  },
  txtActive: {
    color: '#8B5CF6',
  },
  txtGray: {
    color: '#9CA3AF',
  },
  stepDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 4,
  },
  stepTimeText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  
  // Summary Card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  itemQty: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  costLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  costVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  shippingFree: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8B5CF6',
  },
  
  // Verified Purchase
  verifiedContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verifiedText: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: 11,
    marginLeft: 6,
  },
});

export default OrderStatusScreen;
