import React from 'react';
import { Link } from 'react-router-dom';

const SuspendedPage = () => (
  <div className="auth-page auth-page--mounted">
    <div className="auth-panel-left" style={{ background: 'linear-gradient(160deg, #111827 0%, #1F2937 50%, #111827 100%)' }}>
      <div className="auth-panel-inner">
        <div className="auth-brand">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img 
              src="/youshop-logo.png" 
              alt="YouShop" 
              style={{ height: 38, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(20,184,166,0.35))' }} 
            />
            <span className="auth-brand-tag" style={{ color: '#F59E0B' }}>Account Notice</span>
          </Link>
        </div>

        <div className="auth-panel-content">
          <h1 className="auth-panel-headline">
            Account Restricted.<br />Contact Support.<br />
            <em>Fast Appeal.</em>
          </h1>
          <p className="auth-panel-sub">
            Your store account is temporarily restricted. Please reach out to our merchant safety team to resolve policy alerts.
          </p>
        </div>
      </div>
    </div>

    <div className="auth-panel-right">
      <div className="auth-form-container" style={{ textAlign: 'center' }}>
        <div style={{ width: 68, height: 68, borderRadius: 20, background: '#fef3c7', color: '#F59E0B', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>

        <p className="auth-eyebrow" style={{ color: '#F59E0B' }}>ACCOUNT RESTRICTED</p>
        <h2 className="auth-form-title">Store Temporarily Suspended</h2>
        <p className="auth-form-sub" style={{ maxWidth: 440, margin: '0 auto 24px' }}>
          Your store account has been restricted by merchant safety compliance. Please submit an inquiry to unlock your account.
        </p>

        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          <a href="mailto:support@youshop.com" className="auth-btn auth-btn--primary" style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #7C3AED 100%)', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Contact Merchant Support Team →
          </a>
          <Link to="/vendor/login" className="btn btn-outline" style={{ display: 'block', padding: 12 }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default SuspendedPage;
