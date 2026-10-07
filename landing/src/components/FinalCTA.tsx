import * as React from 'react';

const FinalCTA: React.FC = () => {
  return (
    <section style={{
      padding: '160px max(5%, calc((100% - 1280px) / 2))',
      background: '#0D1521', /* Deep, calm, premium dark blue */
      color: 'white',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* Calm, subtle blur shapes (not rainbow) */}
      <div className="floating-slow" style={{ position: 'absolute', top: '20%', left: '15%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(40, 199, 177, 0.08)', filter: 'blur(80px)' }} />
      <div className="floating" style={{ position: 'absolute', bottom: '10%', right: '10%', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(123, 72, 217, 0.08)', filter: 'blur(80px)' }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <h2 style={{
          fontSize: '4.8rem', fontWeight: 800, marginBottom: '24px',
          letterSpacing: '-0.03em', lineHeight: 1.1,
          color: '#F8F9FA',
        }}>
          The neighborhood is <span style={{ color: 'var(--color-teal)' }}>waiting.</span>
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#A0AEC0', marginBottom: '50px', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 50px' }}>
          Stop waiting for shipping. Everything you need is already around the corner. Get the app and start discovering.
        </p>

        {/* App Store Badges */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" style={{
            background: '#000', color: '#fff', padding: '14px 28px', borderRadius: '14px',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '14px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)', transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 28px 50px rgba(0,0,0,0.35)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)'; }}
          >
            {/* Apple icon */}
            <svg width="26" height="28" viewBox="0 0 814 1000" fill="white">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.3-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.4 135.4-316.9 269-316.9 70.6 0 129.5 45.5 173.3 45.5 42.5 0 109.2-48 190.4-48 30.5 0 132.8 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Download on the</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 }}>App Store</div>
            </div>
          </a>

          <a href="#" style={{
            background: '#000', color: '#fff', padding: '14px 28px', borderRadius: '14px',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '14px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)', transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 28px 50px rgba(0,0,0,0.35)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)'; }}
          >
            {/* Google Play icon */}
            <svg width="26" height="28" viewBox="0 0 512 512" fill="white">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l2.7 1.5 246.9-246.9v-5.5L47 0zm403.9 301.2l-58.5 33.7-64.5-64.5v-.7l64.5-64.5 58.5 33.7c16.7 9.5 16.7 25 0 34.5zm-58.5 33.7L152.8 512l280.8-161.2-41-41z" />
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Get it on</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 }}>Google Play</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
