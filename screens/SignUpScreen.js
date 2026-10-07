import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import YouShopLogo from '../components/YouShopLogo';
import Stepper from '../components/Stepper';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';

const SignUpScreen = ({ onComplete, onSignIn, loading }) => {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNext = () => {
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        alert('Please enter your first and last name.');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!email.trim() || !phone.trim()) {
        alert('Please enter your email and phone number.');
        return;
      }
      setStep(3);
      return;
    }

    if (!password || !confirmPassword) {
      alert('Please enter and confirm your password.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (!agreed) {
      alert('Please accept the Terms & Conditions to create an account.');
      return;
    }

    const name = `${firstName} ${lastName}`.trim();
    if (onComplete) onComplete(name, email.trim(), password, phone.trim());
  };

  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <>
            <InputField icon="user" placeholder="First Name" value={firstName} onChangeText={setFirstName} />
            <InputField icon="user" placeholder="Last Name" value={lastName} onChangeText={setLastName} />
          </>
        );
      case 2:
        return (
          <>
            <InputField icon="mail" placeholder="Email Address" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <InputField icon="phone" placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          </>
        );
      case 3:
        return (
          <>
            <InputField icon="lock" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <InputField icon="lock" placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            <View style={styles.checkboxContainer}>
              <TouchableOpacity style={[styles.checkbox, !agreed && styles.checkboxUnchecked]} onPress={() => setAgreed(!agreed)}>
                {agreed && <Feather name="check" size={14} color="#FFFFFF" />}
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                I agree to the <Text style={styles.linkText}>Terms & Conditions</Text>
              </Text>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
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
          <TouchableOpacity style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
            <Feather name="chevron-right" size={16} color="#E2E8F0" />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={['#8B5CF6', '#4F46E5', '#111827']}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBox}
        >
          <Text style={styles.eyebrow}>Create account</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start buying and selling locally in seconds.</Text>
          <View style={styles.featureRow}>
            <View style={styles.featurePill}><Text style={styles.featureText}>Verified sellers</Text></View>
            <View style={styles.featurePill}><Text style={styles.featureText}>Secure checkout</Text></View>
          </View>
        </LinearGradient>

        <View style={styles.cardContainer}>
          <View style={styles.stepperWrapper}>
            <Stepper currentStep={step} totalSteps={3} />
          </View>

          <View style={styles.formContainer}>{renderForm()}</View>

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#7C3AED" style={{ marginVertical: 16 }} />
            ) : (
              <GradientButton title={step === 3 ? 'CREATE ACCOUNT' : 'NEXT'} onPress={handleNext} />
            )}

            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.linkText} onPress={onSignIn}>Sign In</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
    paddingTop: 16,
    paddingBottom: 22,
    marginHorizontal: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  stepperWrapper: {
    marginTop: 0,
  },
  formContainer: {
    marginTop: 20,
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxUnchecked: {
    backgroundColor: '#D1D5DB',
  },
  checkboxText: {
    fontSize: 14,
    color: '#4B5563',
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

export default SignUpScreen;
