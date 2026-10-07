import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedStepForm from '../components/AnimatedStepForm';
import WelcomeScreen from '../components/WelcomeScreen';
import { loginVendor } from '../services/api';

const VendorLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });

  const handleLoginSubmit = async (data) => {
    const response = await loginVendor(data.emailOrPhone, data.password);
    const payload = {
      id: response._id || response.id,
      _id: response._id || response.id,
      name: response.name || 'Merchant Partner',
      email: response.email || data.emailOrPhone,
      status: response.vendorStatus || response.status || 'approved',
      vendorStatus: response.vendorStatus || response.status || 'approved',
      store_name: response.storeName || response.store_name || 'My Store',
      storeName: response.storeName || response.store_name || 'My Store',
      role: response.role || 'vendor',
      token: response.token || 'jwt-token-vendor-' + Date.now(),
    };

    localStorage.setItem('youshop_vendor_session', JSON.stringify(payload));
    sessionStorage.setItem('youshop_auth_notification', JSON.stringify({
      type: 'login',
      title: 'Account Login Successful! 👋',
      message: `Your account login was successful. Welcome back, ${payload.name}!`,
    }));

    setSuccessMsg(`Your account login was successful! Welcome back, ${payload.name}.`);

    setTimeout(() => {
      if (onLogin) onLogin(payload);
      if (payload.status === 'pending') navigate('/vendor/pending');
      else if (payload.status === 'rejected') navigate('/vendor/rejected');
      else if (payload.status === 'suspended') navigate('/vendor/suspended');
      else navigate('/vendor/dashboard');
    }, 1100);
  };

  const steps = [
    {
      id: 'credentials',
      section: 'Vendor Sign-In',
      question: 'Welcome Back, Merchant',
      subtext: 'Sign in with your registered email or phone number and password.',
      type: 'login-combo',
      emailPlaceholder: 'e.g. vendor@youshop.ng or 08012345678',
      passwordPlaceholder: 'Enter your account password',
      required: true,
    },
  ];

  return (
    <AnimatedStepForm
      role="vendor"
      mode="login"
      steps={steps}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleLoginSubmit}
      submitButtonText="Sign In to Vendor Hub"
      successMsg={successMsg}
      footerLink={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--auth-muted)' }}>
            Don't have a vendor store yet?{' '}
            <Link to="/vendor/register" style={{ color: 'var(--auth-link)', fontWeight: 600, textDecoration: 'none' }}>
              Register Your Store
            </Link>
          </p>
        </div>
      }
    />
  );
};

export default VendorLogin;
