import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

const mapImage = require('../assets/map_placeholder.jpg');

const ContactUsScreen = ({ onBack }) => {
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
        <Text style={styles.headerTitle}>Contact us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Contact Method Buttons */}
        <View style={styles.contactMethodsRow}>
          <TouchableOpacity style={styles.contactMethodBox}>
            <View style={styles.iconCircle}>
              <Feather name="phone" size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.methodTitle}>Call Us</Text>
            <Text style={styles.methodText}>+2348012345678</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactMethodBox}>
            <View style={styles.iconCircle}>
              <Feather name="mail" size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.methodTitle}>Email Us</Text>
            <Text style={[styles.methodText, {fontSize: 8}]} numberOfLines={1}>uuhashim0918@gmail.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactMethodBox}>
            <View style={styles.iconCircle}>
              <Feather name="message-circle" size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.methodTitle}>What's app Us</Text>
            <Text style={styles.methodText}>09044922410</Text>
          </TouchableOpacity>
        </View>

        {/* Send a Message Form */}
        <View style={styles.formCard}>
          <Text style={styles.formCardTitle}>Send a Message</Text>
          
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="Jane Doe" placeholderTextColor="#9CA3AF" />
          
          <Text style={styles.label}>Email Address</Text>
          <TextInput style={styles.input} placeholder="jane@example.com" placeholderTextColor="#9CA3AF" keyboardType="email-address" />
          
          <Text style={styles.label}>Title</Text>
          <View style={styles.selectInput}>
            <Text style={{color: '#9CA3AF'}}>jane@example.com</Text>
            <Feather name="chevron-down" size={20} color="#1F2937" />
          </View>
          
          <Text style={styles.label}>Message</Text>
          <TextInput 
            style={styles.textArea} 
            placeholder="How can we help you today?" 
            placeholderTextColor="#9CA3AF" 
            multiline 
            numberOfLines={4} 
            textAlignVertical="top" 
          />
          
          <TouchableOpacity style={styles.sendBtn}>
            <Text style={styles.sendBtnText}>Send Message</Text>
          </TouchableOpacity>
        </View>

        {/* Our Headquarters Section */}
        <Text style={styles.hqTitle}>Our Headquarters</Text>
        <View style={styles.hqCard}>
          <Image source={mapImage} style={styles.mapImg} resizeMode="cover" />
          <View style={styles.hqBody}>
            <View style={styles.hqIconCircle}>
              <Feather name="map-pin" size={16} color="#8B5CF6" />
            </View>
            <View style={styles.hqInfo}>
              <Text style={styles.hqName}>YouShop HQ</Text>
              <Text style={styles.hqAddress}>Zoo road, Kano. Gidan Saude, beside Fiest Bank Kano</Text>
              <TouchableOpacity>
                <Text style={styles.getDirectionsText}>GET DIRECTIONS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Our support team usually responds within 2-4 business hours.
        </Text>

      </ScrollView>
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  // Contact Methods
  contactMethodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  contactMethodBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  methodTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  methodText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
  },
  
  // Form Card
  formCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  formCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 16,
  },
  selectInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1F2937',
    height: 100,
    marginBottom: 20,
  },
  sendBtn: {
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  
  // Headquarters
  hqTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  hqCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 24,
  },
  mapImg: {
    width: '100%',
    height: 150,
    backgroundColor: '#EBE5F7',
  },
  hqBody: {
    flexDirection: 'row',
    padding: 16,
  },
  hqIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  hqInfo: {
    flex: 1,
  },
  hqName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  hqAddress: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 12,
  },
  getDirectionsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});

export default ContactUsScreen;
