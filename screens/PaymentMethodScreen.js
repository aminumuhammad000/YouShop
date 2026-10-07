import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const PaymentMethodScreen = ({ onBack, onAddPaymentMethod }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Saved Cards Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Cards</Text>
          <Text style={styles.sectionSubtitle}>2 Methods</Text>
        </View>

        {/* Card 1: VISA */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.visaBadge}>
              <Text style={styles.visaText}>VISA</Text>
            </View>
            <View style={styles.defaultBadge}>
              <Feather name="check-circle" size={14} color="#10B981" />
              <Text style={styles.defaultText}>Default</Text>
            </View>
          </View>
          
          <Text style={styles.cardLabel}>Card Number</Text>
          <Text style={styles.cardNumber}>••••  ••••  ••••  4242</Text>
          
          <Text style={styles.cardLabel}>Expires</Text>
          <Text style={styles.cardValue}>12/26</Text>
        </View>

        {/* Card 2: MasterCard (MC) */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.mcBadge}>
              <Text style={styles.mcText}>MC</Text>
            </View>
          </View>
          
          <Text style={styles.cardLabel}>Card Number</Text>
          <Text style={styles.cardNumber}>••••  ••••  ••••  8891</Text>
          
          <Text style={styles.cardLabel}>Expires</Text>
          <Text style={styles.cardValue}>08/25</Text>
        </View>

        {/* Add New Payment Method Button */}
        <TouchableOpacity style={styles.addBtn} onPress={onAddPaymentMethod}>
          <Feather name="plus-circle" size={20} color="#8B5CF6" />
          <Text style={styles.addBtnText}>Add New Payment Method</Text>
        </TouchableOpacity>

        {/* Security Info Card */}
        <View style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <Feather name="shield" size={20} color="#1F2937" />
            <Text style={styles.securityTitle}>Your payment data is secure</Text>
          </View>
          <Text style={styles.securityText}>
            YouShop uses industry-standard 256-bit encryption to protect your financial details. We never store your full CVV/CVC codes.
          </Text>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  
  // Card Styles
  cardContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  visaBadge: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  visaText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  mcBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  mcText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  defaultText: {
    color: '#065F46',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 2,
    marginBottom: 20,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  
  // Add Button
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 24,
    marginTop: 8,
  },
  addBtnText: {
    color: '#8B5CF6',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
  
  // Security Card
  securityCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 20,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 10,
  },
  securityText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
});

export default PaymentMethodScreen;
