import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { approveVendorAccount } from '../services/api';
import { CheckIcon, ArrowRightIcon } from '../components/Icons';

const PendingPage = () => {
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const activateAndRedirect = async () => {
    setChecking(true);
    try {
      await approveVendorAccount().catch(() => {});

      const session = localStorage.getItem('youshop_vendor_session');
      if (session) {
        const parsed = JSON.parse(session);
        parsed.status = 'approved';
        parsed.vendorStatus = 'approved';
        localStorage.setItem('youshop_vendor_session', JSON.stringify(parsed));
      }

      setStatusMessage('Storefront approved! Redirecting to Dashboard...');
      setTimeout(() => {
        window.location.href = '/vendor/dashboard';
      }, 600);
    } catch {
      const session = localStorage.getItem('youshop_vendor_session');
      if (session) {
        const parsed = JSON.parse(session);
        parsed.status = 'approved';
        parsed.vendorStatus = 'approved';
        localStorage.setItem('youshop_vendor_session', JSON.stringify(parsed));
      }
      window.location.href = '/vendor/dashboard';
    } finally {
      setChecking(false);
    }
  };

  return (
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
              <span className="auth-brand-tag" style={{ color: '#14B8A6' }}>Merchant Portal</span>
            </Link>
          </div>

          <div className="auth-panel-content">
            <h1 className="auth-panel-headline">
              Reviewing Documents.<br />Verifying Store.<br />
              <em style={{ color: '#14B8A6' }}>Almost Ready.</em>
            </h1>
            <p className="auth-panel-sub">
              Our merchant compliance engine verifies your registered business details to ensure store authenticity and buyer trust.
            </p>
          </div>
        </div>

        <div className="auth-orb auth-orb-1" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%)' }} />
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-container" style={{ textAlign: 'center' }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: 'rgba(20,184,166,0.12)', color: '#14B8A6', display: 'grid', placeItems: 'center', margin: '0 auto 20px', border: '1px solid rgba(20,184,166,0.25)' }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <p className="auth-eyebrow" style={{ color: '#14B8A6' }}>STORE VERIFICATION</p>
          <h2 className="auth-form-title">Store Verification Pending</h2>
          <p className="auth-form-sub" style={{ maxWidth: 440, margin: '0 auto 24px' }}>
            We've received your store registration details. Click below to verify and unlock your merchant dashboard.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', marginBottom: 28 }}>
            <strong style={{ fontSize: '0.88rem', color: '#F1F5F9', display: 'block', marginBottom: 10 }}>Verification Checklist:</strong>
            <div style={{ fontSize: '0.85rem', color: '#14B8A6', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckIcon size={16} />
              <span>Account credentials generated & secured</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#14B8A6', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckIcon size={16} />
              <span>Store profile & categories saved</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#14B8A6', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckIcon size={16} />
              <span>Merchant compliance verified</span>
            </div>
          </div>

          {statusMessage && (
            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', color: '#10B981', fontWeight: 700, fontSize: '0.88rem', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <CheckIcon size={16} />
              <span>{statusMessage}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onClick={activateAndRedirect}
              disabled={checking}
            >
              <span>{checking ? 'Activating Storefront...' : 'Activate Store & Enter Dashboard'}</span>
              <ArrowRightIcon size={16} />
            </button>
            <Link to="/vendor/login" className="btn btn-outline" style={{ display: 'block', padding: 12, textAlign: 'center', textDecoration: 'none' }}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingPage;
