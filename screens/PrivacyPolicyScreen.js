import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const privacyShieldImage = require('../assets/privacy_shield.jpg');

const PrivacyPolicyScreen = ({ onBack }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Status Header */}
        <View style={styles.statusRow}>
          <View style={styles.complianceBadge}>
            <Text style={styles.complianceText}>Legal Compliance</Text>
          </View>
          <Text style={styles.lastUpdatedText}>Last Updated: July 4, 2026</Text>
        </View>

        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={privacyShieldImage} style={styles.heroImage} resizeMode="contain" />
        </View>

        {/* Introduction */}
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.paragraphText}>
          At <Text style={styles.brandText}>YouShop</Text>, your trust is our most valuable asset. We are committed to maintaining the confidentiality and security of your personal information. This Privacy Policy outlines how we collect, use, and protect your data to ensure a transparent and frictionless shopping experience.
        </Text>

        {/* Information We Collect */}
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoTitleRow}>
            <Feather name="user" size={16} color="#6B7280" style={{marginRight: 8}} />
            <Text style={styles.infoTitle}>PERSONAL DATA</Text>
          </View>
          <Text style={styles.infoText}>
            Name, email address, phone number, and shipping/billing addresses used for your account and order processing.
          </Text>
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.infoTitleRow}>
            <Feather name="bar-chart-2" size={16} color="#6B7280" style={{marginRight: 8}} />
            <Text style={styles.infoTitle}>USAGE & ANALYTICS</Text>
          </View>
          <Text style={styles.infoText}>
            IP addresses, browser type, pages visited, and interaction data to help us optimize the YouShop experience.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoTitleRow}>
            <Feather name="database" size={16} color="#B45309" style={{marginRight: 8}} />
            <Text style={[styles.infoTitle, {color: '#B45309'}]}>COOKIES & TRACKING</Text>
          </View>
          <Text style={styles.infoText}>
            Small data files used to remember your preferences, cart items, and provide a personalized shopping journey.
          </Text>
        </View>

        {/* How We Use Your Data */}
        <Text style={styles.sectionTitle}>How We Use Your Data</Text>

        <View style={styles.checkListItem}>
          <Feather name="check-circle" size={18} color="#10B981" style={{marginTop: 2}} />
          <View style={styles.checkListContent}>
            <Text style={styles.checkListTitle}>Order Fulfillment</Text>
            <Text style={styles.checkListText}>We use your info to process payments, ship products, and send order updates.</Text>
          </View>
        </View>

        <View style={styles.checkListItem}>
          <Feather name="check-circle" size={18} color="#10B981" style={{marginTop: 2}} />
          <View style={styles.checkListContent}>
            <Text style={styles.checkListTitle}>Personalization</Text>
            <Text style={styles.checkListText}>Curating product recommendations and deals tailored specifically to your taste.</Text>
          </View>
        </View>

        <View style={styles.checkListItem}>
          <Feather name="check-circle" size={18} color="#10B981" style={{marginTop: 2}} />
          <View style={styles.checkListContent}>
            <Text style={styles.checkListTitle}>Platform Security</Text>
            <Text style={styles.checkListText}>Protecting against fraudulent transactions and maintaining the integrity of our marketplace.</Text>
          </View>
        </View>

        {/* Data Sharing Card */}
        <View style={styles.sharingCard}>
          <View style={styles.sharingHeader}>
            <Feather name="share-2" size={20} color="#8B5CF6" />
            <Text style={styles.sharingTitle}>Data Sharing</Text>
          </View>
          <Text style={styles.sharingText}>
            We do not sell your data. We only share essential information with trusted third-party partners to facilitate your experience:
          </Text>
          <View style={styles.pillsContainer}>
            <View style={styles.pill}><Text style={styles.pillText}>Payment Processors</Text></View>
            <View style={styles.pill}><Text style={styles.pillText}>Logistics Partners</Text></View>
            <View style={styles.pill}><Text style={styles.pillText}>Cloud Storage Providers</Text></View>
          </View>
        </View>

        {/* Footer Actions */}
        <TouchableOpacity style={styles.contactBtn}>
          <Text style={styles.contactBtnText}>Contact Privacy Support</Text>
        </TouchableOpacity>
        
        <Text style={styles.footerNote}>
          Our privacy team is here to help clarify any concerns regarding your personal data.
        </Text>

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
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  complianceBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  complianceText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  lastUpdatedText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 20,
    height: 160,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 16,
  },
  paragraphText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 32,
  },
  brandText: {
    fontWeight: '700',
    color: '#6D28D9',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  
  checkListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkListContent: {
    marginLeft: 12,
    flex: 1,
  },
  checkListTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 4,
  },
  checkListText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  
  sharingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 32,
    marginTop: 10,
  },
  sharingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sharingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  sharingText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  pillText: {
    color: '#4C1D95',
    fontSize: 12,
    fontWeight: '600',
  },
  
  contactBtn: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  contactBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerNote: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});

export default PrivacyPolicyScreen;
