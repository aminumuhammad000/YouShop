import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { requestVendorOtp, requestDriverOtp } from '../services/api';
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

const ForgotPassword = ({ role: initialRole }) => {
  const location = useLocation();
  const role = initialRole || (location.pathname.includes('driver') ? 'driver' : 'vendor');
  const isDriver = role === 'driver';

  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');
  const navigate = useNavigate();

  const brandColor = isDriver ? '#A78BFA' : '#14B8A6';
  const loginUrl = isDriver ? '/driver/login' : '/vendor/login';
  const resetUrl = isDriver ? '/driver/reset-password' : '/vendor/reset-password';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const clean = identifier.trim();
    if (!clean) {
      setError('Please enter your registered email address or phone number.');
      return;
    }

    setLoading(true);
    try {
      const response = isDriver
        ? await requestDriverOtp(clean)
        : await requestVendorOtp(clean);

      const storageKey = isDriver ? 'driver_reset_identifier' : 'vendor_reset_identifier';
      localStorage.setItem(storageKey, clean);
      if (response.email) {
        localStorage.setItem(isDriver ? 'driver_reset_email' : 'vendor_reset_email', response.email);
      }

      setSuccessInfo(
        response.otp
          ? `Verification OTP sent! (Demo Code: ${response.otp})`
          : (response.message || 'Verification OTP sent to your account.')
      );

      setTimeout(() => {
        navigate(resetUrl);
      }, 1100);
    } catch (err) {
      setError(err.message || 'Unable to send OTP. Please check your credentials and try again.');
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
            Account Recovery
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
          {/* Card Top Stepper Pill Header */}
          <div className="step-card-stepper-header">
            <div className="step-section-pill">
              <span className="step-section-pulse" />
              <span className="step-section-name">
                {isDriver ? 'Driver Partner Recovery' : 'Merchant Store Recovery'}
              </span>
            </div>

            <div className="step-counter-badge" style={{ padding: '3px 12px', fontSize: '0.78rem' }}>
              <span>Step 1 of 2</span>
            </div>
          </div>

          <div className="step-stage-viewport">
            <div className="step-card">
              <div className="step-question-meta">
                <h2 className="step-question-title">
                  Reset {isDriver ? 'Driver' : 'Vendor'} Password
                </h2>
                <p className="step-question-sub">
                  Enter your registered {isDriver ? 'driver' : 'merchant'} email or 11-digit phone number to receive a secure 6-digit OTP.
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
                <div className="step-input-wrap" style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>
                    Registered Email or Phone Number
                  </label>
                  <input
                    type="text"
                    className={`step-input ${error ? 'error' : ''}`}
                    placeholder={isDriver ? 'e.g. driver@youshop.ng or 08012345678' : 'e.g. vendor@youshop.ng or 08012345678'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoFocus
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
                        Sending OTP...
                      </span>
                    ) : (
                      'Send Verification OTP →'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="step-card-footer">
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#94a3b8' }}>
            Remember your credentials?{' '}
            <Link to={loginUrl} style={{ color: brandColor, fontWeight: 600, textDecoration: 'none' }}>
              Return to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
