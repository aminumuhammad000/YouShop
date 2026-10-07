import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YouShopLogo from '../components/YouShopLogo';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';

const defaultProfile = {
  storeName: 'Apex Electronics & Tech',
  businessName: 'Apex Enterprise Ltd',
  category: 'Electronics & Gadgets',
  phone: '+234 803 999 8877',
  address: '15 Admiralty Way, Lekki Phase 1, Lagos',
  description: 'Premier merchant providing nationwide delivery for authentic consumer gadgets.',
};

const mockOrders = [
  { id: '#ORD-88421', customer: 'Sarah Jenkins', amount: '₦98,900', status: 'Placed', items: '2 items' },
  { id: '#ORD-88420', customer: 'Michael Adebayo', amount: '₦110,000', status: 'Processing', items: '1 item' },
  { id: '#ORD-88419', customer: 'Fatima Al-Hassan', amount: '₦21,000', status: 'Shipped', items: '3 items' },
];

const VendorDashboardScreen = ({ userName, onLogout }) => {
  const [profile, setProfile] = useState(defaultProfile);
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const missing = Object.entries(profile).filter(([key, value]) => !String(value).trim() && key !== 'description');
    if (missing.length > 0) {
      Alert.alert('Complete your profile', 'Please fill in all required vendor details before entering your dashboard.');
      return;
    }
    setIsDashboardOpen(true);
  };

  const renderProfileForm = () => (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>Vendor Store Setup</Text>
      <Text style={styles.sectionHint}>Enter your merchant credentials to configure your luxury storefront.</Text>

      <InputField icon="shopping-bag" placeholder="Store Name" value={profile.storeName} onChangeText={(value) => handleChange('storeName', value)} />
      <InputField icon="briefcase" placeholder="Business Registered Name" value={profile.businessName} onChangeText={(value) => handleChange('businessName', value)} />
      <InputField icon="tag" placeholder="Business Category" value={profile.category} onChangeText={(value) => handleChange('category', value)} />
      <InputField icon="phone" placeholder="Store Phone Number" keyboardType="phone-pad" value={profile.phone} onChangeText={(value) => handleChange('phone', value)} />
      <InputField icon="map-pin" placeholder="Physical Store Address" value={profile.address} onChangeText={(value) => handleChange('address', value)} />
      <InputField icon="file-text" placeholder="Store Description" value={profile.description} onChangeText={(value) => handleChange('description', value)} />

      <View style={styles.buttonRow}>
        <GradientButton title="SAVE & OPEN DASHBOARD" onPress={handleSave} />
      </View>
    </View>
  );

  const renderDashboard = () => (
    <View style={styles.cardContainer}>
      <View style={styles.welcomeRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.statusLivePill}>
            <View style={styles.statusLiveDot} />
            <Text style={styles.statusLiveText}>LIVE MERCHANT SESSION</Text>
          </View>
          <Text style={styles.storeTitle}>{profile.storeName}</Text>
        </View>
        <View style={styles.verifiedPill}>
          <Text style={styles.verifiedText}>✦ Platinum Tier</Text>
        </View>
      </View>

      {/* Metrics Grid */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Revenue</Text>
          <Text style={[styles.summaryValue, { color: '#34D399' }]}>₦282,900</Text>
          <Text style={styles.trendText}>+18.4% this month</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Orders</Text>
          <Text style={styles.summaryValue}>5</Text>
          <Text style={styles.trendText}>2 Pending dispatch</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Active Products</Text>
          <Text style={styles.summaryValue}>12 Items</Text>
          <Text style={styles.trendText}>100% In Stock</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Merchant Rating</Text>
          <Text style={[styles.summaryValue, { color: '#FBBF24' }]}>4.9 ★</Text>
          <Text style={styles.trendText}>Top Rated Seller</Text>
        </View>
      </View>

      {/* Recent Orders Preview */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.infoTitle}>Recent Orders Stream</Text>
          <Text style={styles.viewAllText}>View All</Text>
        </View>
        {mockOrders.map((ord) => (
          <View key={ord.id} style={styles.orderRow}>
            <View>
              <Text style={styles.orderRef}>{ord.id}</Text>
              <Text style={styles.orderCustomer}>{ord.customer} • {ord.items}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.orderAmount}>{ord.amount}</Text>
              <View style={[styles.orderBadgeWrap, ord.status === 'Placed' ? styles.badgePlaced : ord.status === 'Processing' ? styles.badgeProcessing : styles.badgeShipped]}>
                <Text style={styles.orderBadge}>{ord.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Store Information */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Store Telemetry & Contact</Text>
        <View style={styles.telemetryRow}>
          <Text style={styles.telemetryLabel}>Category</Text>
          <Text style={styles.telemetryVal}>{profile.category}</Text>
        </View>
        <View style={styles.telemetryRow}>
          <Text style={styles.telemetryLabel}>Direct Line</Text>
          <Text style={styles.telemetryVal}>{profile.phone}</Text>
        </View>
        <View style={styles.telemetryRow}>
          <Text style={styles.telemetryLabel}>Hub Location</Text>
          <Text style={styles.telemetryVal}>{profile.address}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsDashboardOpen(false)}>
          <Text style={styles.secondaryButtonText}>Configure Store Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <YouShopLogo size={34} />
              <View style={styles.textContainer}>
                <Text style={styles.youText}>You</Text>
                <Text style={styles.shopText}>Shop</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.titleContainer}>
            <View style={styles.badgeRow}>
              <View style={styles.consoleBadge}>
                <Text style={styles.consoleBadgeText}>COMMAND CENTER</Text>
              </View>
            </View>
            <Text style={styles.title}>Merchant Console</Text>
            <Text style={styles.subtitle}>Supercharge your multi-channel sales and logistics pipeline.</Text>
          </View>

          {isDashboardOpen ? renderDashboard() : renderProfileForm()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  youText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: -0.5,
  },
  shopText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#818CF8',
    letterSpacing: -0.5,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F87171',
  },
  titleContainer: {
    paddingHorizontal: 22,
    marginBottom: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  consoleBadge: {
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    borderColor: 'rgba(14, 165, 233, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  consoleBadgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  cardContainer: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    flex: 1,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  statusLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusLiveText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  storeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  verifiedPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  verifiedText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  sectionHint: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 18,
    lineHeight: 18,
  },
  buttonRow: {
    marginTop: 18,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  trendText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  telemetryLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  telemetryVal: {
    fontSize: 13,
    color: '#F1F5F9',
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  orderRef: {
    fontSize: 13,
    fontWeight: '800',
    color: '#818CF8',
    marginBottom: 2,
  },
  orderCustomer: {
    fontSize: 12,
    color: '#94A3B8',
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  orderBadgeWrap: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgePlaced: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  badgeProcessing: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  badgeShipped: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  orderBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: 14,
  },
});

export default VendorDashboardScreen;
