import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MailIcon,
  LockIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  BuildingStoreIcon,
  TruckIcon,
  AlertTriangleIcon,
  ToggleButton,
} from './Icons';
import '../styles/luxury-auth.css';

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

const LuxuryAuthCard = ({
  role = 'vendor', // 'vendor' | 'driver'
  onSubmit = async () => {},
  registerLink = '/vendor/register',
  forgotPasswordLink = '/vendor/forgot-password',
}) => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isVendor = role === 'vendor';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your email or registered phone number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please provide your account password.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      await onSubmit({ emailOrPhone: emailOrPhone.trim(), password });
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = (targetRole) => {
    if (targetRole === 'vendor') {
      navigate('/vendor/login');
    } else {
      navigate('/driver/login');
    }
  };

  return (
    <div className="luxury-auth-viewport">
      {/* Dynamic Background Ambient Aurora */}
      <div className="luxury-aurora-glow glow-1" />
      <div className="luxury-aurora-glow glow-2" />
      <div className="luxury-aurora-glow glow-3" />

      {/* Top Floating Brand Navigation */}
      <header className="luxury-auth-nav">
        <Link to="/" className="luxury-brand-group" style={{ textDecoration: 'none' }}>
          <img
            src="/youshop-logo.png"
            alt="YouShop"
            style={{ height: 38, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 10px rgba(20, 184, 166, 0.4))' }}
          />
          <span className="brand-tier-tag" style={{ marginLeft: 8 }}>ENTERPRISE</span>
        </Link>

        <div className="luxury-nav-badges">
          <span className="luxury-pill-badge">
            <ShieldCheckIcon size={14} />
            <span>256-Bit Encrypted</span>
          </span>
        </div>
      </header>

      {/* Main Luxury Glass Card */}
      <main className="luxury-card-container">
        <div className="luxury-glass-card">
          {/* Card Top Glass Accent */}
          <div className="luxury-card-specular-bar" />

          {/* Role Switcher Tabs */}
          <div className="luxury-role-selector">
            <button
              type="button"
              className={`luxury-role-tab ${isVendor ? 'active' : ''}`}
              onClick={() => handleRoleSwitch('vendor')}
            >
              <BuildingStoreIcon size={16} />
              <span>Merchant Hub</span>
            </button>
            <button
              type="button"
              className={`luxury-role-tab ${!isVendor ? 'active' : ''}`}
              onClick={() => handleRoleSwitch('driver')}
            >
              <TruckIcon size={16} />
              <span>Courier Dispatch</span>
            </button>
          </div>

          {/* Card Header */}
          <div className="luxury-card-header">
            <h2 className="luxury-headline">
              {isVendor ? 'Merchant Management' : 'Courier Pilot Terminal'}
            </h2>
            <p className="luxury-subtext">
              {isVendor
                ? 'Sign in to access real-time orders, analytics & store revenue.'
                : 'Sign in to accept delivery dispatches, track routes & view payouts.'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="luxury-alert-error">
              <AlertTriangleIcon size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="luxury-auth-form" noValidate>
            {/* Field: Email or Phone */}
            <div className="luxury-form-field">
              <label className="luxury-field-label">
                <span>Account Identifier</span>
                <span className="luxury-field-hint">Email or Phone</span>
              </label>
              <div className="luxury-input-wrapper">
                <div className="luxury-input-icon">
                  <MailIcon size={18} />
                </div>
                <input
                  type="text"
                  className="luxury-input"
                  placeholder={isVendor ? 'merchant@youshop.com' : 'driver@youshop.com or 080...'}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Field: Password */}
            <div className="luxury-form-field">
              <div className="luxury-label-split">
                <label className="luxury-field-label">Password</label>
                {isVendor && forgotPasswordLink && (
                  <Link to={forgotPasswordLink} className="luxury-forgot-link">
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="luxury-input-wrapper">
                <div className="luxury-input-icon">
                  <LockIcon size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="luxury-input"
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="luxury-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="luxury-remember-row">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Keep terminal authenticated</span>
                <ToggleButton checked={rememberMe} onChange={setRememberMe} size={20} />
              </div>
            </div>

            {/* Liquid Submit Button */}
            <button
              type="submit"
              className="luxury-liquid-submit-btn"
              disabled={loading}
            >
              <span className="liquid-btn-content">
                {loading ? (
                  <>
                    <span className="luxury-spinner" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>{isVendor ? 'Sign In to Merchant Hub' : 'Unlock Courier Dispatch'}</span>
                    <ArrowRightIcon size={18} />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Registration Redirect Footer */}
          <div className="luxury-card-footer">
            <p className="luxury-footer-text">
              {isVendor ? (
                <>
                  Looking to sell on YouShop?{' '}
                  <Link to={registerLink} className="luxury-accent-link">
                    Register as Merchant <ArrowRightIcon size={14} />
                  </Link>
                </>
              ) : (
                <>
                  Want to drive & earn with YouShop?{' '}
                  <Link to={registerLink} className="luxury-accent-link">
                    Register as Driver Partner <ArrowRightIcon size={14} />
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Commercial Trust Stamp */}
        <div className="luxury-trust-stamp">
          <ShieldCheckIcon size={15} />
          <span>YouShop Commercial Secure Architecture · PCI-DSS Compliant</span>
        </div>
      </main>
    </div>
  );
};

export default LuxuryAuthCard;
