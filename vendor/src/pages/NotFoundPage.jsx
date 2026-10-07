import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{ background: '#111827', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontFamily: 'Plus Jakarta Sans, sans-serif', padding: 24, textAlign: 'center' }}>
    <div style={{ background: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '48px 36px', maxWidth: 480, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
      <div style={{ fontSize: '4rem', fontWeight: 900, background: 'linear-gradient(135deg, #14B8A6, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
        404
      </div>
      <h2 style={{ fontSize: '1.6rem', margin: '10px 0 8px', fontWeight: 800 }}>Page Not Found</h2>
      <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: 28, lineHeight: 1.6 }}>
        The portal route you are looking for does not exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/vendor/dashboard" className="btn" style={{ background: 'linear-gradient(135deg, #14B8A6, #7C3AED)', color: 'white', fontWeight: 800, padding: '12px 24px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          Merchant Dashboard
        </Link>
        <Link to="/driver/dashboard" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 700, padding: '12px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
          Driver Portal
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
