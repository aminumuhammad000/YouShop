import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import YouShopLogo from '../components/YouShopLogo';
import GradientButton from '../components/GradientButton';

const VerifyOTPScreen = ({ email = 'bilalu046@gmail.com', onVerify, onReEnter }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(15);
  const inputRefs = useRef([]);

  const otpCode = otp.join('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (text, index) => {
    const sanitized = text.replace(/[^0-9]/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = sanitized;
    setOtp(newOtp);

    if (sanitized && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
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
        <Text style={styles.eyebrow}>Security check</Text>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the code sent to <Text style={styles.boldText}>{email}</Text> to verify your account.
        </Text>
      </LinearGradient>

      <View style={styles.cardContainer}>
        <View style={styles.otpContainer}>
          {[0, 1, 2, 3].map((index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index]}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        <Text style={styles.resendText}>
          Resend Code in <Text style={styles.highlightText}>{countdown} sec.</Text>
        </Text>

        <View style={styles.buttonContainer}>
          <GradientButton title="VERIFY" onPress={() => onVerify && onVerify(otpCode)} />
          <Text style={styles.footerText}>
            Incorrect email? <Text style={styles.linkText} onPress={onReEnter}>re-enter</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
    paddingTop: 40,
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
  boldText: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardContainer: {
    flex: 1,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  otpInput: {
    width: 62,
    height: 62,
    backgroundColor: '#F5F3FF',
    borderRadius: 18,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
    color: '#111827',
  },
  resendText: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 28,
  },
  highlightText: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 15,
    color: '#1F2937',
    marginTop: 12,
  },
  linkText: {
    color: '#7C3AED',
    fontWeight: '700',
  },
});

export default VerifyOTPScreen;
