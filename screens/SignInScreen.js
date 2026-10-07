import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import YouShopLogo from '../components/YouShopLogo';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';

const SignInScreen = ({ onSignIn, onSignUp, onForgotPassword, onSkip, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignInPress = () => {
    if (!email.trim() || !password) {
      alert('Please enter your email address and password.');
      return;
    }

    if (onSignIn) {
      onSignIn(email.trim(), password);
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
            <TouchableOpacity onPress={onSkip || (() => onSignIn && onSignIn())} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
              <Feather name="chevron-right" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={['#8B5CF6', '#4F46E5', '#111827']}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBox}
          >
            <Text style={styles.eyebrow}>Welcome back</Text>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue your local shopping journey.</Text>
            <View style={styles.featureRow}>
              <View style={styles.featurePill}><Text style={styles.featureText}>Fast checkout</Text></View>
              <View style={styles.featurePill}><Text style={styles.featureText}>Local deals</Text></View>
            </View>
          </LinearGradient>

          <View style={styles.cardContainer}>
            <View style={styles.formContainer}>
              <InputField icon="mail" placeholder="Email Address" keyboardType="email-address" value={email} onChangeText={setEmail} />
              <InputField icon="lock" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

              <TouchableOpacity style={styles.forgotPassword} onPress={() => onForgotPassword && onForgotPassword(email.trim())}>
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#7C3AED" style={{ marginVertical: 16 }} />
              ) : (
                <GradientButton title="SIGN IN" onPress={handleSignInPress} />
              )}

              <Text style={styles.footerText}>
                Don’t have an account? <Text style={styles.linkText} onPress={onSignUp}>Sign Up</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    color: '#E2E8F0',
    fontWeight: '700',
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
    letterSpacing: 1.7,
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
  featureRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  featurePill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  featureText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
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
  formContainer: {
    marginBottom: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 14,
    marginBottom: 8,
  },
  linkText: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 15,
    color: '#4B5563',
    marginTop: 12,
  },
});

export default SignInScreen;
