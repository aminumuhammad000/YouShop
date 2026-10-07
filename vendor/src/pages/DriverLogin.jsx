import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedStepForm from '../components/AnimatedStepForm';
import WelcomeScreen from '../components/WelcomeScreen';
import { loginDriver } from '../services/api';

const DriverLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });

  const handleDriverLoginSubmit = async (data) => {
    const payload = await loginDriver(data.emailOrPhone, data.password);
    localStorage.setItem('youshop_driver_session', JSON.stringify(payload));
    sessionStorage.setItem('youshop_auth_notification', JSON.stringify({
      type: 'login',
      title: 'Account Login Successful! 🚗',
      message: `Your account login was successful. Welcome back, ${payload.name || 'Driver Partner'}!`,
    }));

    setSuccessMsg(`Your account login was successful! Welcome back, ${payload.name || 'Driver Partner'}.`);

    setTimeout(() => {
      if (onLogin) onLogin(payload);
      navigate('/driver/dashboard');
    }, 1100);
  };

  const steps = [
    {
      id: 'credentials',
      section: 'Driver Fleet Sign-In',
      question: 'Welcome Back, Driver Partner',
      subtext: 'Sign in with your registered email or phone number and password.',
      type: 'login-combo',
      emailPlaceholder: 'e.g. driver@youshop.ng or 08012345678',
      passwordPlaceholder: 'Enter your driver password',
      required: true,
    },
  ];

  return (
    <AnimatedStepForm
      role="driver"
      mode="login"
      steps={steps}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleDriverLoginSubmit}
      submitButtonText="Sign In to Driver Fleet"
      successMsg={successMsg}
      footerLink={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--auth-muted)' }}>
            Not registered as a driver?{' '}
            <Link to="/driver/register" style={{ color: 'var(--auth-link)', fontWeight: 600, textDecoration: 'none' }}>
              Register to Drive
            </Link>
          </p>
        </div>
      }
    />
  );
};

export default DriverLogin;
