import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { resetVendorPassword, resetDriverPassword } from '../services/api';
import '../styles/animated-form.css';

const BuildingStoreIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const TruckDeliveryIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
  </svg>
);

const ResetPassword = ({ role: initialRole }) => {
  const location = useLocation();
  const role = initialRole || (location.pathname.includes('driver') ? 'driver' : 'vendor');
  const isDriver = role === 'driver';

  const navigate = useNavigate();
  const [values, setValues] = useState({ otp: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  const brandColor = isDriver ? '#A78BFA' : '#14B8A6';
  const loginUrl = isDriver ? '/driver/login' : '/vendor/login';
  const forgotUrl = isDriver ? '/driver/forgot-password' : '/vendor/forgot-password';

  const identifier = localStorage.getItem(
    isDriver ? 'driver_reset_identifier' : 'vendor_reset_identifier'
  ) || localStorage.getItem(
    isDriver ? 'driver_reset_email' : 'vendor_reset_email'
  ) || '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier) {
      setError('No pending password reset request found. Please request a new code.');
      setTimeout(() => navigate(forgotUrl), 1500);
      return;
    }

    if (!values.otp.trim() || !values.password || !values.confirmPassword) {
      setError('Please complete the verification code and new password fields.');
      return;
    }

    if (values.password.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (values.password !== values.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      if (isDriver) {
        await resetDriverPassword(identifier, values.otp.trim(), values.password);
      } else {
        await resetVendorPassword(identifier, values.otp.trim(), values.password);
      }

      setSuccessInfo('Password reset successful! Redirecting you to sign in...');
      localStorage.removeItem(isDriver ? 'driver_reset_identifier' : 'vendor_reset_identifier');
      localStorage.removeItem(isDriver ? 'driver_reset_email' : 'vendor_reset_email');

      setTimeout(() => {
        navigate(loginUrl);
      }, 1500);
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please check the code or request a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step-form-wrapper">
      {/* Background Ambient Glows & Grid */}
      <div className="step-ambient-canvas" aria-hidden="true">
        <div className={`step-ambient-orb ${isDriver ? 'step-ambient-orb-purple' : 'step-ambient-orb-teal'}`} />
        <div className={`step-ambient-orb ${isDriver ? 'step-ambient-orb-teal' : 'step-ambient-orb-purple'}`} />
        <div className="step-ambient-grid" />
      </div>

      {/* Fixed Top Bar */}
      <div className="step-top-bar">
        <Link to="/" className="step-top-bar-left">
          <img src="/youshop-logo.png" alt="YouShop" className="step-brand-logo-img" />
        </Link>

        <div className="step-top-bar-center">
          <span style={{ fontWeight: 600, letterSpacing: '0.02em', color: '#e2e8f0' }}>
            Security Verification
          </span>
        </div>

        <div className="step-role-tabs">
          <Link
            to="/vendor/forgot-password"
            className={`step-role-tab ${!isDriver ? 'active' : ''}`}
          >
            <BuildingStoreIcon />
            <span>Vendor</span>
          </Link>
          <Link
            to="/driver/forgot-password"
            className={`step-role-tab ${isDriver ? 'active' : ''}`}
          >
            <TruckDeliveryIcon />
            <span>Driver</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="step-form-content">
        <div className="step-modern-card">
          {/* Stepper Header */}
          <div className="step-card-stepper-header">
            <div className="step-section-pill">
              <span className="step-section-pulse" />
              <span className="step-section-name">
                {isDriver ? 'Driver Security Check' : 'Storefront Security Check'}
              </span>
            </div>

            <div className="step-counter-badge" style={{ padding: '3px 12px', fontSize: '0.78rem' }}>
              <span>Step 2 of 2</span>
            </div>
          </div>

          <div className="step-stage-viewport">
            <div className="step-card">
              <div className="step-question-meta">
                <h2 className="step-question-title">Set New Password</h2>
                <p className="step-question-sub">
                  Enter the 6-digit OTP code sent for{' '}
                  <strong style={{ color: '#ffffff' }}>{identifier || 'your account'}</strong> and choose your new password.
                </p>
              </div>

              {error && (
                <div className="step-validation-msg" style={{ marginBottom: 16 }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {successInfo && (
                <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#4ade80', fontSize: '0.88rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>✓ {successInfo}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="step-input-wrap" style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    name="otp"
                    className="step-input"
                    placeholder="e.g. 123456"
                    value={values.otp}
                    onChange={handleChange}
                    maxLength={6}
                    autoFocus
                    required
                  />
                </div>

                <div className="step-input-wrap" style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="step-input"
                      placeholder="Minimum 6 characters"
                      value={values.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="step-input-icon-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>
                </div>

                <div className="step-input-wrap" style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="step-input"
                    placeholder="Re-type new password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="step-actions-bar" style={{ marginTop: 24 }}>
                  <Link
                    to={loginUrl}
                    className="step-btn-back"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="step-btn-next"
                    disabled={loading}
                    style={{
                      background: isDriver
                        ? 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)'
                        : 'linear-gradient(135deg, #14B8A6 0%, #7C3AED 100%)',
                    }}
                  >
                    {loading ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 15, height: 15, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                        Updating Password...
                      </span>
                    ) : (
                      'Reset & Save Password →'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="step-card-footer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#94a3b8' }}>
              Didn't receive code?{' '}
              <Link to={forgotUrl} style={{ color: brandColor, fontWeight: 600, textDecoration: 'none' }}>
                Request New Code
              </Link>
            </p>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#94a3b8' }}>
              <Link to={loginUrl} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                ← Return to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
