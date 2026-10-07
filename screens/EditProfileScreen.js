import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

const avatarImage = require('../assets/profile_avatar.jpg');

const EditProfileScreen = ({ onBack, onSave }) => {
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image source={avatarImage} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Feather name="edit-2" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>First name</Text>
          <TextInput 
            style={styles.input} 
            defaultValue="Bilal" 
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last name</Text>
          <TextInput 
            style={styles.input} 
            defaultValue="Usman" 
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>E-mail address</Text>
          <TextInput 
            style={styles.input} 
            defaultValue="Bilalu046@gmail.com" 
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.passwordInput} 
              defaultValue="****************" 
              placeholderTextColor="#9CA3AF"
              secureTextEntry={true}
            />
            <TouchableOpacity>
              <Feather name="eye-off" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone number</Text>
          <TextInput 
            style={styles.input} 
            defaultValue="09120727749" 
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
        </View>

      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={onBack}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B5CF6',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FAFAFA',
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
    color: '#6B7280',
    fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomButtons: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 10,
    backgroundColor: '#FAFAFA',
  },
  saveBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6D28D9',
  },
  cancelBtnText: {
    color: '#6D28D9',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default EditProfileScreen;
