import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const avatarImage = require('../assets/profile_avatar.jpg');

const ProfileScreen = ({ userName, userEmail, onBack, onLogout, onEditProfile, onPaymentMethods, onHelpCenter, onContactUs, onLikedPosts, onPrivacyPolicy }) => {
  const accountSettings = [
    { id: 1, title: 'Payment Methods', icon: 'credit-card' },
    { id: 2, title: 'Notifications', icon: 'bell' },
    { id: 3, title: 'Liked posts', icon: 'heart' },
  ];

  const supportLegal = [
    { id: 1, title: 'Help Center', icon: 'help-circle' },
    { id: 2, title: 'Contact Us', icon: 'mail' },
    { id: 3, title: 'Privacy Policy', icon: 'shield' },
  ];

  const renderRow = (item, isLast) => {
    const handlePress = () => {
      if (item.title === 'Payment Methods' && onPaymentMethods) {
        onPaymentMethods();
      } else if (item.title === 'Help Center' && onHelpCenter) {
        onHelpCenter();
      } else if (item.title === 'Contact Us' && onContactUs) {
        onContactUs();
      } else if (item.title === 'Liked posts' && onLikedPosts) {
        onLikedPosts();
      } else if (item.title === 'Privacy Policy' && onPrivacyPolicy) {
        onPrivacyPolicy();
      }
    };

    return (
      <TouchableOpacity key={item.id} style={[styles.row, !isLast && styles.rowBorder]} onPress={handlePress}>
        <Feather name={item.icon} size={20} color="#1F2937" style={styles.rowIcon} />
        <Text style={styles.rowText}>{item.title}</Text>
        <Feather name="chevron-right" size={20} color="#1F2937" style={styles.chevron} />
      </TouchableOpacity>
    );
  };

  const displayName = userName || 'Guest User';
  const displayEmail = userEmail || 'Not signed in';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image source={avatarImage} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Feather name="edit-2" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{displayEmail}</Text>

          <TouchableOpacity style={styles.editProfileBtn} onPress={onEditProfile}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.manageAccountBtn}>
            <Text style={styles.manageAccountText}>Manage Account</Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          {accountSettings.map((item, index) => renderRow(item, index === accountSettings.length - 1))}
        </View>

        {/* Support & Legal Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          {supportLegal.map((item, index) => renderRow(item, index === supportLegal.length - 1))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Feather name="log-out" size={18} color="#B91C1C" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout from Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5FA',
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B5CF6',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F8F9FA',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  editProfileBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  manageAccountBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  manageAccountText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowBorder: {
    // optional border between items
  },
  rowIcon: {
    marginRight: 16,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  chevron: {
    color: '#1F2937',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#B91C1C',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ProfileScreen;
