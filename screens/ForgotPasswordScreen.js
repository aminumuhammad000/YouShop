import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import YouShopLogo from '../components/YouShopLogo';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';

const ForgotPasswordScreen = ({ onSendOTP, onBack, email = '' }) => {
  const [inputEmail, setInputEmail] = useState(email);

  const handleSendOTP = () => {
    const cleanedEmail = inputEmail.trim();
    if (!cleanedEmail) {
      Alert.alert('Email required', 'Please enter your email address to receive the OTP.');
      return;
    }

    if (onSendOTP) {
      onSendOTP(cleanedEmail);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <YouShopLogo size={32} />
              <View style={styles.textContainer}>
                <Text style={styles.youText}>You</Text>
                <Text style={styles.shopText}>Shop</Text>
              </View>
            </View>
          </View>

          <LinearGradient
            colors={['#8B5CF6', '#4F46E5', '#111827']}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBox}
          >
            <Text style={styles.eyebrow}>Password reset</Text>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your email and we’ll send you a secure reset code.</Text>
          </LinearGradient>

          <View style={styles.cardContainer}>
            <InputField icon="mail" placeholder="Email Address" keyboardType="email-address" value={inputEmail} onChangeText={setInputEmail} />

            <View style={styles.buttonContainer}>
              <GradientButton title="SEND OTP" onPress={handleSendOTP} />
              <Text style={styles.footerText}>
                Remembered your password? <Text style={styles.linkText} onPress={onBack}>Back to Sign In</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 18,
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
    fontWeight: '900',
    color: '#34D399',
  },
  shopText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#C4B5FD',
  },
  heroBox: {
    marginHorizontal: 20,
    paddingHorizontal: 24,
    paddingVertical: 30,
    borderRadius: 32,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    elevation: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: '#DDD6FE',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    lineHeight: 24,
  },
  cardContainer: {
    marginTop: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 22,
    marginHorizontal: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 15,
    color: '#4B5563',
    marginTop: 12,
  },
  linkText: {
    color: '#7C3AED',
    fontWeight: '700',
  },
});

export default ForgotPasswordScreen;
