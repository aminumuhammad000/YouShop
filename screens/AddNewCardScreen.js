import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const AddNewCardScreen = ({ onBack, onAddCard }) => {
  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Card</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Form fields matching app style */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Cardholder Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Bilal Usman" 
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Card Number</Text>
          <View style={styles.inputWithIcon}>
            <TextInput 
              style={styles.inputFlex} 
              placeholder="0000 0000 0000 0000" 
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={19}
            />
            <Feather name="credit-card" size={20} color="#6B7280" />
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput 
              style={styles.input} 
              placeholder="MM/YY" 
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput 
              style={styles.input} 
              placeholder="•••" 
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              secureTextEntry
              maxLength={3}
            />
          </View>
        </View>

        {/* Security badge */}
        <View style={styles.securityInfo}>
          <Feather name="lock" size={16} color="#065F46" />
          <Text style={styles.securityText}>Your card information is encrypted and securely stored.</Text>
        </View>

      </ScrollView>

      {/* Action Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addBtn} onPress={onAddCard}>
          <Text style={styles.addBtnText}>Add Card</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  securityText: {
    color: '#065F46',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 10,
    backgroundColor: '#FAFAFA',
  },
  addBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddNewCardScreen;
