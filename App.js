import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import VerifyOTPScreen from './screens/VerifyOTPScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import SuccessScreen from './screens/SuccessScreen';
import MainScreen from './screens/MainScreen';
import { loginUser, registerUser } from './services/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');

  // Check for stored token on startup - auto-login
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const name = await AsyncStorage.getItem('userName');
        const email = await AsyncStorage.getItem('userEmail');
        if (token) {
          setUserName(name || '');
          setUserEmail(email || '');
          // Skip to main if token exists
        }
      } catch (e) {
        console.log('Token check failed', e);
      }
    };
    checkToken();
  }, []);

  const handleSignIn = async (email, password) => {
    if (!email || !password) {
      setCurrentScreen('main');
      return;
    }
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userId', data._id);
      await AsyncStorage.setItem('userName', data.name);
      await AsyncStorage.setItem('userEmail', data.email);
      setUserName(data.name);
      setUserEmail(data.email);
      setCurrentScreen('main');
    } catch (error) {
      Alert.alert('Sign In Failed', error.message || 'Could not connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpComplete = async (name, email, password, phoneNumber) => {
    if (!name || !email || !password || !phoneNumber) {
      Alert.alert('Incomplete details', 'Please complete all required information to create your account.');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(name, email, password, phoneNumber);
      Alert.alert(
        'Registration Submitted ⏳',
        data.message || 'Your account was created successfully! It is currently pending Admin Approval. The admin will verify your account before you can log in.',
        [
          {
            text: 'Go to Sign In',
            onPress: () => setCurrentScreen('signin')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message || 'Could not connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setCurrentScreen('main');
  };

  const handleForgotPassword = (email) => {
    const cleanedEmail = (email || '').trim();
    if (!cleanedEmail) {
      Alert.alert('Email required', 'Please enter your email address to receive the OTP.');
      return;
    }

    setOtpEmail(cleanedEmail);
    setCurrentScreen('forgot-password-otp');
    Alert.alert('OTP Sent', `A 4-digit code has been sent to ${cleanedEmail}.`);
  };

  const handleVerifyOTP = (otpCode) => {
    const cleanedCode = String(otpCode || '').replace(/\s+/g, '');
    if (cleanedCode.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter the full 4-digit code.');
      return;
    }

    Alert.alert('OTP Verified', 'Your password reset code is valid.');
    setCurrentScreen('signin');
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userId', 'userName', 'userEmail']);
    setUserName('');
    setCurrentScreen('signin');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={() => setCurrentScreen('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onGetStarted={() => setCurrentScreen('signup')} />;
      case 'signup':
        return (
          <SignUpScreen
            onComplete={handleSignUpComplete}
            onSignIn={() => setCurrentScreen('signin')}
            loading={loading}
          />
        );
      case 'signin':
        return (
          <SignInScreen
            onSignIn={handleSignIn}
            onSignUp={() => setCurrentScreen('signup')}
            onForgotPassword={() => setCurrentScreen('forgot-password')}
            onSkip={handleSkip}
            loading={loading}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordScreen
            email={otpEmail}
            onSendOTP={handleForgotPassword}
            onBack={() => setCurrentScreen('signin')}
          />
        );
      case 'forgot-password-otp':
        return (
          <VerifyOTPScreen
            email={otpEmail}
            onVerify={handleVerifyOTP}
            onReEnter={() => setCurrentScreen('forgot-password')}
          />
        );
      case 'verify':
        return (
          <VerifyOTPScreen
            email={userEmail}
            onVerify={() => setCurrentScreen('success')}
            onReEnter={() => setCurrentScreen('signup')}
          />
        );
      case 'success':
        return (
          <SuccessScreen
            onHome={() => setCurrentScreen('main')}
          />
        );
      case 'main':
        return (
          <MainScreen onLogout={handleLogout} userName={userName} userEmail={userEmail} />
        );
      default:
        return <SplashScreen onFinish={() => setCurrentScreen('onboarding')} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
