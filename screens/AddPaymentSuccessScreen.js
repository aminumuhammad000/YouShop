import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const creditCardThumb = require('../assets/credit_card_thumb.jpg');

const AddPaymentSuccessScreen = ({ onBack, onGoToShop }) => {
  return (
    <View style={styles.container}>
      {/* Centered Success Badge */}
      <View style={styles.successBadgeContainer}>
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Feather name="check" size={40} color="#fff" />
          </View>
        </View>
      </View>

      {/* Success Text */}
      <Text style={styles.title}>Card Added Successfully!</Text>
      <Text style={styles.subtitle}>
        Your Visa ending in 4242 has been added to your payment methods.
      </Text>

      {/* Card Preview Box */}
      <View style={styles.cardPreview}>
        <View style={styles.cardInfoRow}>
          <Image source={creditCardThumb} style={styles.cardThumb} resizeMode="cover" />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Visa Card</Text>
            <Text style={styles.cardNumber}>••••  ••••  ••••  4242</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Feather name="check-circle" size={12} color="#065F46" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.cardFooterRow}>
          <Text style={styles.expiryText}>Expires 12/28</Text>
          <Text style={styles.primaryText}>PRIMARY METHOD</Text>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>Back to Payment Methods</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shopBtn} onPress={onGoToShop}>
          <Text style={styles.shopBtnText}>Go to Shop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  successBadgeContainer: {
    marginBottom: 40,
  },
  outerCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  
  // Card Preview Box
  cardPreview: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 60,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardThumb: {
    width: 50,
    height: 34,
    borderRadius: 6,
    marginRight: 16,
    backgroundColor: '#1E293B',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: 11,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 12,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  primaryText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // Buttons
  buttonContainer: {
    width: '100%',
  },
  backBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  backBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  shopBtn: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  shopBtnText: {
    color: '#8B5CF6',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default AddPaymentSuccessScreen;
