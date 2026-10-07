import React, { useEffect, useState } from 'react';

const WelcomeScreen = ({ role = 'vendor', mode = 'login', name = '', onDone }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const isVendor = role === 'vendor';
  const isRegister = mode === 'register';
  const accent = isVendor ? '#14B8A6' : '#8B5CF6';
  const accentSoft = isVendor ? 'rgba(20,184,166,0.12)' : 'rgba(139,92,246,0.12)';
  const gradientBg = isVendor
    ? 'linear-gradient(135deg, #0F172A 0%, #134E4A 50%, #0F172A 100%)'
    : 'linear-gradient(135deg, #0F172A 0%, #2E1065 50%, #0F172A 100%)';

  const firstName = name ? ', ' + name.split(' ')[0] : '';
  const headline = isRegister ? ('Welcome to YouShop' + firstName + '! \ud83c\udf89') : ('Welcome Back' + firstName + '! \ud83d\udc4b');

  const subline = isRegister
    ? (isVendor
        ? 'Your merchant store is live. Start adding products and growing your business.'
        : 'Your driver account is active. Start accepting deliveries and earning today.')
    : (isVendor
        ? "You are signed in to your Merchant Hub. Ready to manage your store."
        : "You are signed in to your Driver Fleet. Ready to start your shift.");

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => handleLeave(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleLeave = () => {
    setLeaving(true);
    setTimeout(() => { if (onDone) onDone(); }, 450);
  };

  const confetti = [
    { x: 12, y: 18, s: 10, r: 30, c: '#14B8A6' },
    { x: 85, y: 12, s: 8,  r: -20, c: '#F59E0B' },
    { x: 55, y: 8,  s: 12, r: 45, c: '#7C3AED' },
    { x: 28, y: 72, s: 7,  r: -35, c: '#EC4899' },
    { x: 75, y: 75, s: 9,  r: 15, c: '#14B8A6' },
    { x: 92, y: 50, s: 6,  r: 60, c: '#F59E0B' },
    { x: 6,  y: 50, s: 11, r: -55, c: '#10B981' },
    { x: 45, y: 90, s: 8,  r: 25, c: '#A78BFA' },
  ];

  const outerStyle = {
    position: 'fixed', inset: 0, zIndex: 9999999,
    background: gradientBg,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', overflow: 'hidden',
    opacity: leaving ? 0 : visible ? 1 : 0,
    transform: leaving ? 'scale(1.04)' : visible ? 'scale(1)' : 'scale(0.96)',
    transition: leaving
      ? 'opacity 0.4s ease, transform 0.4s ease'
      : 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
  };

  const cardStyle = {
    textAlign: 'center', padding: '48px 52px', maxWidth: 460, width: '90%',
    opacity: visible && !leaving ? 1 : 0,
    transform: visible && !leaving ? 'translateY(0)' : 'translateY(28px)',
    transition: 'opacity 0.55s ease 0.1s, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.1s',
  };

  const iconRingStyle = {
    width: 88, height: 88, borderRadius: 26,
    background: accentSoft, border: '2px solid ' + accent,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 28px',
    boxShadow: '0 0 0 8px ' + accentSoft + ', 0 20px 40px rgba(0,0,0,0.3)',
  };

  return (
    <div onClick={handleLeave} style={outerStyle}>
      <div style={{
        position: 'absolute', top: '-120px', left: '-100px',
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, ' + accentSoft + ' 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', right: '-80px',
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      {confetti.map((c, i) => (
        <div key={i} style={{
          position: 'absolute', left: c.x + '%', top: c.y + '%',
          width: c.s, height: c.s, background: c.c, borderRadius: 3,
          opacity: visible && !leaving ? 0.8 : 0,
          transform: 'rotate(' + c.r + 'deg) translateY(' + (visible && !leaving ? '0' : '-20px') + ')',
          transition: 'opacity 0.6s ease ' + (i * 0.07) + 's, transform 0.6s ease ' + (i * 0.07) + 's',
        }} />
      ))}
      <div style={cardStyle}>
        <div style={iconRingStyle}>
          {isVendor ? (
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke={accent} strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
          ) : (
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke={accent} strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          )}
        </div>
        <h1 style={{ margin: '0 0 14px', fontSize: '1.9rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          {headline}
        </h1>
        <p style={{ margin: '0 0 32px', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
          {subline}
        </p>
        <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, ' + accent + ', #F59E0B)',
            borderRadius: 4,
            width: visible && !leaving ? '100%' : '0%',
            transition: 'width 2.6s linear 0.15s',
          }} />
        </div>
        <p style={{ marginTop: 16, fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
          Tap anywhere to continue
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
