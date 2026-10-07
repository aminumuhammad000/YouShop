import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const LogoutScreen = ({ onBack, onConfirmLogout }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Logout</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        
        {/* Lock Icon Graphic */}
        <View style={styles.iconContainer}>
          <View style={styles.largeCircle}>
            <Feather name="unlock" size={48} color="#C4B5FD" />
          </View>
          <View style={styles.badge}>
            <Feather name="shield" size={14} color="#fff" />
          </View>
        </View>

        {/* Text Area */}
        <Text style={styles.title}>Are you sure you want to log out?</Text>
        <Text style={styles.subtitle}>
          You'll need to sign back in to access your orders, saved items, and profile settings.
        </Text>

        {/* Buttons */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onConfirmLogout}>
          <Feather name="log-out" size={20} color="#fff" style={{marginRight: 10}} />
          <Text style={styles.logoutBtnText}>LOG OUT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.stayBtn} onPress={onBack}>
          <Text style={styles.stayBtnText}>Stay Logged In</Text>
        </TouchableOpacity>

      </View>

      {/* Info Card at bottom */}
      <View style={styles.infoCard}>
        <Feather name="info" size={20} color="#6D28D9" style={{marginTop: 2, marginRight: 12}} />
        <Text style={styles.infoText}>
          Logging out will clear your current local session. Your cart items are saved to your account and will be available when you return.
        </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 40,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  largeCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#8B5CF6',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoutBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  stayBtn: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4C1D95',
  },
  stayBtnText: {
    color: '#4C1D95',
    fontSize: 15,
    fontWeight: '700',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    marginHorizontal: 24,
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20,
  },
});

export default LogoutScreen;
