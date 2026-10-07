import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [monthlySales, setMonthlySales] = useState(500000);
  const estimatedProfit = Math.round(monthlySales * 0.925);

  const faqs = [
    {
      q: 'How fast do I receive payouts for my sales?',
      a: 'Payouts are cleared within 24 hours of successful customer order delivery confirmation directly to your registered bank account.',
    },
    {
      q: 'What are the vendor commission fees?',
      a: 'We charge a transparent, flat 7.5% platform fee per completed sale. There are zero listing fees or monthly subscription charges.',
    },
    {
      q: 'How does verification work for new store accounts?',
      a: 'Once you submit your business registration details and logo, our seller verification team reviews and approves your account within 2-4 business hours.',
    },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: '#111827', color: '#f8fafc', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Header Bar */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '20px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img
              src="/youshop-logo.png"
              alt="YouShop"
              style={{ height: 42, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 10px rgba(20, 184, 166, 0.4))' }}
            />
            <span style={{ fontSize: '0.74rem', color: '#2DD4BF', fontWeight: 800, letterSpacing: '0.06em', paddingLeft: 14, borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
              MERCHANT & DRIVER
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/driver/login" className="btn" style={{ background: 'rgba(20, 184, 166, 0.15)', color: '#2DD4BF', border: '1px solid rgba(20, 184, 166, 0.3)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
              Driver Partner Sign In
            </Link>
            <Link to="/vendor/login" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              Vendor Login
            </Link>
            <Link to="/vendor/register" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #14B8A6, #7C3AED)', color: 'white' }}>
              Open Store Account →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(20, 184, 166, 0.15)', border: '1px solid rgba(20, 184, 166, 0.3)', padding: '6px 16px', borderRadius: 999, fontSize: '0.82rem', color: '#2DD4BF', fontWeight: 700, marginBottom: 24 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span>POWERING VERIFIED MERCHANTS & DISPATCH DRIVERS NATIONWIDE</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 20px', letterSpacing: '-0.03em' }}>
          Scale your business with <span style={{ background: 'linear-gradient(135deg, #14B8A6, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>YouShop Merchant & Driver Network</span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: 740, margin: '0 auto 36px', lineHeight: 1.6 }}>
          Manage your inventory, fulfill orders with 1-click logistics, view real-time revenue analytics, or register as an express delivery courier.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/vendor/register" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #14B8A6, #7C3AED)', padding: '14px 32px', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            Become a Merchant Vendor
          </Link>
          <Link to="/driver/register" className="btn" style={{ background: '#7C3AED', color: 'white', border: 'none', padding: '14px 28px', fontSize: '1rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
            Become a Delivery Driver
          </Link>
          <Link to="/vendor/login" className="btn" style={{ background: '#1f2937', color: 'white', border: '1px solid #374151', padding: '14px 28px', fontSize: '1rem' }}>
            Vendor Sign In
          </Link>
        </div>
      </section>

      {/* Revenue Estimator Interactive Widget */}
      <section style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 36, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.5rem', fontWeight: 800 }}>Calculate Your Monthly Earnings</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.92rem' }}>Slide to estimate net profit after our flat 7.5% platform fee</p>
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontWeight: 700 }}>
              <span style={{ color: '#94a3b8' }}>Monthly Sales Volume:</span>
              <span style={{ fontSize: '1.2rem', color: '#14B8A6' }}>₦{monthlySales.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="10000000"
              step="50000"
              value={monthlySales}
              onChange={(e) => setMonthlySales(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#14B8A6', height: 8, cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 18, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 4 }}>Platform Fee (7.5%)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f87171' }}>₦{Math.round(monthlySales * 0.075).toLocaleString()}</div>
            </div>
            <div style={{ background: 'rgba(20,184,166,0.15)', padding: 18, borderRadius: 16, border: '1px solid rgba(20,184,166,0.4)' }}>
              <div style={{ fontSize: '0.85rem', color: '#2DD4BF', marginBottom: 4 }}>Estimated Net Take-Home</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#2DD4BF' }}>₦{estimatedProfit.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ maxWidth: 800, margin: '0 auto 80px', padding: '0 24px' }}>
        <h3 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, margin: '0 0 32px' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'grid', gap: 14 }}>
          {faqs.map((f, idx) => (
            <div
              key={f.q}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              style={{ background: '#1f2937', padding: '18px 24px', borderRadius: 16, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700 }}>
                <span>{f.q}</span>
                <span style={{ color: '#14B8A6' }}>{openFaq === idx ? '−' : '+'}</span>
              </div>
              {openFaq === idx && (
                <p style={{ margin: '12px 0 0', color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6 }}>{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '30px 24px', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
        <p>© 2026 YouShop Logistics & Merchant Network. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
