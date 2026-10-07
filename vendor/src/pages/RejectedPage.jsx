import React from 'react';
import { Link } from 'react-router-dom';

const RejectedPage = () => (
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
            <span className="auth-brand-tag" style={{ color: '#EF4444' }}>Application Status</span>
          </Link>
        </div>

        <div className="auth-panel-content">
          <h1 className="auth-panel-headline">
            Application Review.<br />Requires Update.<br />
            <em>Re-submit Details.</em>
          </h1>
          <p className="auth-panel-sub">
            Our compliance team requires additional verification documents before your store can go live.
          </p>
        </div>
      </div>
    </div>

    <div className="auth-panel-right">
      <div className="auth-form-container" style={{ textAlign: 'center' }}>
        <div style={{ width: 68, height: 68, borderRadius: 20, background: '#fee2e2', color: '#EF4444', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </div>

        <p className="auth-eyebrow" style={{ color: '#EF4444' }}>APPLICATION UNAPPROVED</p>
        <h2 className="auth-form-title">Store Registration Decision</h2>
        <p className="auth-form-sub" style={{ maxWidth: 440, margin: '0 auto 24px' }}>
          We could not verify your business registration or bank account details. Please update your information and re-submit.
        </p>

        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          <Link to="/vendor/register" className="auth-btn auth-btn--primary" style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #7C3AED 100%)', textAlign: 'center' }}>
            Re-Submit Merchant Application →
          </Link>
          <Link to="/vendor/login" className="btn btn-outline" style={{ display: 'block', padding: 12 }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default RejectedPage;
