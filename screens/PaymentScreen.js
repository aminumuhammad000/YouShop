import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// ─── Payment method options ────────────────────────────────────────────────
const METHODS = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: 'credit-card',
    color: '#1E3A8A',
  },
  {
    id: 'transfer',
    label: 'Bank Transfer',
    icon: 'repeat',
    color: '#065F46',
  },
  {
    id: 'ussd',
    label: 'USSD',
    icon: 'smartphone',
    color: '#7C3AED',
  },
  {
    id: 'wallet',
    label: 'YouShop Wallet',
    icon: 'pocket',
    color: '#B45309',
  },
];

// ─── Formatters ────────────────────────────────────────────────────────────
const fmtCard = (val) => {
  const digits = val.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};
const fmtExpiry = (val) => {
  const d = val.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

// ─── Card visual ────────────────────────────────────────────────────────────
const CardPreview = ({ number, holder, expiry, active }) => (
  <View style={[styles.cardPreview, { opacity: active ? 1 : 0.35 }]}>
    <View style={styles.cardChip} />
    <Text style={styles.cardPreviewNumber}>
      {number
        ? number.padEnd(19, ' ').replace(/(.{4})/g, '$1 ').trim()
        : '#### #### #### ####'}
    </Text>
    <View style={styles.cardPreviewBottom}>
      <View>
        <Text style={styles.cardPreviewLabel}>CARD HOLDER</Text>
        <Text style={styles.cardPreviewValue}>{holder || 'FULL NAME'}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.cardPreviewLabel}>EXPIRES</Text>
        <Text style={styles.cardPreviewValue}>{expiry || 'MM/YY'}</Text>
      </View>
      <Text style={styles.cardNetworkLabel}>VISA</Text>
    </View>
  </View>
);

// ─── Main component ────────────────────────────────────────────────────────
const PaymentScreen = ({ cartItems = [], totalPrice = 0, onBack, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [paying, setPaying] = useState(false);

  // Simulate payment processing
  const handlePay = async () => {
    if (selectedMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Invalid Card', 'Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardHolder.trim()) {
        Alert.alert('Missing Info', 'Please enter the card holder name.');
        return;
      }
      if (expiry.length < 5) {
        Alert.alert('Invalid Expiry', 'Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (cvv.length < 3) {
        Alert.alert('Invalid CVV', 'Please enter a valid 3-digit CVV.');
        return;
      }
    }

    setPaying(true);
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 2200));
    setPaying(false);
    if (onSuccess) onSuccess();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Feather name="chevron-left" size={26} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={styles.securedBadge}>
            <Feather name="lock" size={12} color="#10B981" />
            <Text style={styles.securedText}>Secured</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Order Summary strip ── */}
          <View style={styles.summaryStrip}>
            <View>
              <Text style={styles.summaryLabel}>Order Total</Text>
              <Text style={styles.summaryAmount}>₦{totalPrice.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryItems}>
              <Text style={styles.summaryItemCount}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</Text>
              <View style={styles.deliveryBadge}>
                <Feather name="truck" size={11} color="#065F46" />
                <Text style={styles.deliveryText}>Free delivery</Text>
              </View>
            </View>
          </View>

          {/* ── Payment method selector ── */}
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          <View style={styles.methodGrid}>
            {METHODS.map((m) => {
              const active = selectedMethod === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.methodCard, active && { borderColor: '#8B5CF6', backgroundColor: '#F5F3FF' }]}
                  onPress={() => setSelectedMethod(m.id)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.methodIcon, { backgroundColor: active ? '#8B5CF6' : '#F3F4F6' }]}>
                    <Feather name={m.icon} size={18} color={active ? '#fff' : '#6B7280'} />
                  </View>
                  <Text style={[styles.methodLabel, active && { color: '#7C3AED', fontWeight: '700' }]}>
                    {m.label}
                  </Text>
                  {active && (
                    <View style={styles.methodCheck}>
                      <Feather name="check-circle" size={14} color="#8B5CF6" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Card Form ── */}
          {selectedMethod === 'card' && (
            <View>
              {/* Live card preview */}
              <CardPreview
                number={cardNumber.replace(/\s/g, '')}
                holder={cardHolder.toUpperCase()}
                expiry={expiry}
                active={true}
              />

              <Text style={styles.sectionTitle}>Card Details</Text>

              {/* Card Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <View style={styles.inputBox}>
                  <Feather name="credit-card" size={16} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#D1D5DB"
                    keyboardType="numeric"
                    value={cardNumber}
                    onChangeText={(t) => setCardNumber(fmtCard(t))}
                    maxLength={19}
                  />
                </View>
              </View>

              {/* Card Holder */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Holder Name</Text>
                <View style={styles.inputBox}>
                  <Feather name="user" size={16} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="JOHN DOE"
                    placeholderTextColor="#D1D5DB"
                    autoCapitalize="characters"
                    value={cardHolder}
                    onChangeText={setCardHolder}
                  />
                </View>
              </View>

              {/* Expiry + CVV row */}
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <View style={styles.inputBox}>
                    <Feather name="calendar" size={16} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      placeholderTextColor="#D1D5DB"
                      keyboardType="numeric"
                      value={expiry}
                      onChangeText={(t) => setExpiry(fmtExpiry(t))}
                      maxLength={5}
                    />
                  </View>
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <View style={styles.inputBox}>
                    <Feather name="lock" size={16} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="• • •"
                      placeholderTextColor="#D1D5DB"
                      keyboardType="numeric"
                      secureTextEntry
                      value={cvv}
                      onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                    />
                  </View>
                </View>
              </View>

              {/* Save card toggle */}
              <TouchableOpacity style={styles.saveRow} onPress={() => setSaveCard(!saveCard)} activeOpacity={0.7}>
                <View style={[styles.checkbox, saveCard && styles.checkboxActive]}>
                  {saveCard && <Feather name="check" size={12} color="#fff" />}
                </View>
                <Text style={styles.saveLabel}>Save card for future payments</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Bank Transfer info ── */}
          {selectedMethod === 'transfer' && (
            <View style={styles.infoCard}>
              <Feather name="info" size={20} color="#065F46" />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.infoTitle}>Transfer to Official Store Account</Text>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Bank Name:</Text><Text style={styles.infoValue}>Smartcash Payment Bank</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Account No:</Text><Text style={[styles.infoValue, { color: '#7C3AED', fontSize: 16, fontWeight: '800' }]}>9044922410</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Account Name:</Text><Text style={styles.infoValue}>Usman Hashim</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Amount Due:</Text><Text style={[styles.infoValue, { color: '#8B5CF6', fontWeight: '800' }]}>₦{totalPrice.toLocaleString()}</Text></View>
                <Text style={styles.infoNote}>
                  ⚠️ Make payment to the account above before proceeding. The Admin will verify payment received before granting full order access and delivery.
                </Text>
              </View>
            </View>
          )}

          {/* ── USSD ── */}
          {selectedMethod === 'ussd' && (
            <View style={styles.infoCard}>
              <Feather name="smartphone" size={20} color="#7C3AED" />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.infoTitle}>Dial the USSD code</Text>
                <Text style={styles.ussdCode}>*966*000*{totalPrice}#</Text>
                <Text style={styles.infoNote}>Dial the code above on your registered bank phone number, then tap "Pay Now" to confirm your order.</Text>
              </View>
            </View>
          )}

          {/* ── Wallet ── */}
          {selectedMethod === 'wallet' && (
            <View style={styles.infoCard}>
              <Feather name="pocket" size={20} color="#B45309" />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.infoTitle}>YouShop Wallet</Text>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Wallet Balance:</Text><Text style={[styles.infoValue, { color: '#10B981' }]}>₦25,000.00</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Order Total:</Text><Text style={[styles.infoValue, { color: '#8B5CF6', fontWeight: '800' }]}>₦{totalPrice.toLocaleString()}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>After Payment:</Text><Text style={styles.infoValue}>₦{Math.max(0, 25000 - totalPrice).toLocaleString()}</Text></View>
                <Text style={styles.infoNote}>Funds will be deducted instantly from your YouShop Wallet balance.</Text>
              </View>
            </View>
          )}

          {/* ── Security footer ── */}
          <View style={styles.securityRow}>
            <Feather name="shield" size={14} color="#10B981" />
            <Text style={styles.securityFooter}>
              256-bit SSL encrypted · PCI-DSS compliant · We never store your CVV
            </Text>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* ── Pay button ── */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.payBtn, paying && { opacity: 0.75 }]}
            onPress={handlePay}
            disabled={paying}
            activeOpacity={0.85}
          >
            {paying ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.payBtnText}>Processing Payment…</Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Feather name="lock" size={18} color="#fff" />
                <Text style={styles.payBtnText}>Pay ₦{totalPrice.toLocaleString()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
  securedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  securedText: { fontSize: 11, fontWeight: '700', color: '#065F46' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 4 },

  // Summary strip
  summaryStrip: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#1F2937', borderRadius: 16, padding: 18, marginBottom: 24,
  },
  summaryLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginBottom: 4 },
  summaryAmount: { fontSize: 24, fontWeight: '800', color: '#fff' },
  summaryItems: { alignItems: 'flex-end', gap: 6 },
  summaryItemCount: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
  deliveryBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20,
  },
  deliveryText: { fontSize: 10, fontWeight: '700', color: '#065F46' },

  // Section titles
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 14 },

  // Method grid
  methodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  methodCard: {
    flexBasis: '47%', flexGrow: 1,
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14,
    padding: 14, alignItems: 'center', backgroundColor: '#fff',
    position: 'relative',
  },
  methodIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  methodLabel: { fontSize: 12, fontWeight: '600', color: '#4B5563', textAlign: 'center' },
  methodCheck: { position: 'absolute', top: 8, right: 8 },

  // Card preview
  cardPreview: {
    height: 180, borderRadius: 20, marginBottom: 20,
    padding: 22,
    background: 'linear-gradient(135deg, #1E3A8A, #7C3AED)',
    backgroundColor: '#1E3A8A',
    shadowColor: '#1E3A8A', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12,
  },
  cardChip: { width: 36, height: 28, borderRadius: 6, backgroundColor: '#FFD700', marginBottom: 20 },
  cardPreviewNumber: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: 3, marginBottom: 20 },
  cardPreviewBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardPreviewLabel: { fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 2 },
  cardPreviewValue: { fontSize: 13, color: '#fff', fontWeight: '700' },
  cardNetworkLabel: { fontSize: 18, fontWeight: '900', color: '#fff', fontStyle: 'italic', opacity: 0.9 },

  // Inputs
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#4B5563', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 12, paddingHorizontal: 14, height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1F2937', fontWeight: '600' },
  row: { flexDirection: 'row' },

  // Save card
  saveRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 4 },
  checkbox: {
    width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB',
    marginRight: 10, alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  saveLabel: { fontSize: 14, color: '#4B5563', fontWeight: '500' },

  // Info card (transfer, ussd, wallet)
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB', borderRadius: 16,
    borderWidth: 1, borderColor: '#E5E7EB',
    padding: 18, marginBottom: 24,
  },
  infoTitle: { fontSize: 15, fontWeight: '800', color: '#1F2937', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  infoLabel: { fontSize: 13, color: '#6B7280' },
  infoValue: { fontSize: 13, fontWeight: '700', color: '#1F2937' },
  infoNote: { fontSize: 12, color: '#9CA3AF', lineHeight: 18, marginTop: 12 },
  ussdCode: { fontSize: 22, fontWeight: '800', color: '#7C3AED', letterSpacing: 1, marginBottom: 8 },

  // Security footer
  securityRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: -8 },
  securityFooter: { fontSize: 11, color: '#9CA3AF', flex: 1, lineHeight: 16 },

  // Footer pay button
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 34,
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  payBtn: {
    backgroundColor: '#8B5CF6',
    height: 58, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  payBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
});

export default PaymentScreen;
