import * as React from 'react';

const Footer: React.FC = () => {
  const cols = [
    {
      heading: 'Product',
      links: ['How it Works', 'Features', 'Location Discovery', 'For Sellers', 'Download App'],
    },
    {
      heading: 'Company',
      links: ['About Us', 'Blog', 'Careers', 'Press', 'Partners'],
    },
    {
      heading: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'],
    },
  ];

  const socials = [
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, href: '#', label: 'X' },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, href: '#', label: 'Instagram' },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, href: '#', label: 'Facebook' },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer style={{ backgroundColor: '#1E2B3A', color: 'white', padding: '100px max(5%, calc((100% - 1280px) / 2)) 40px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top: logo + columns */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '60px', marginBottom: '80px', width: '100%' }}>
          {/* Brand */}
          <div style={{ flex: '1.5', minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <img src="/src/assets/logo.png" alt="YouShop logo"
                style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover' }} />
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}><span style={{ color: 'var(--color-teal)' }}>You</span><span style={{ color: 'var(--color-purple)' }}>Shop</span></span>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, maxWidth: '280px', color: '#718096' }}>
              The local social commerce app. Discover nearby products, chat directly with sellers, and shop instantly.
            </p>
            {/* Socials */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label} style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#A0AEC0', textDecoration: 'none',
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(123,72,217,0.25)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#A0AEC0'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.heading} style={{ flex: '1', minWidth: '140px' }}>
              <h4 style={{ color: '#F8F9FA', fontWeight: 700, fontSize: '0.9rem', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {col.heading}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '13px' }}>
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" style={{
                      color: '#718096', textDecoration: 'none', fontSize: '0.92rem',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#718096')}
                    >{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom-bar" style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <p style={{ fontSize: '0.88rem', color: '#4A5568' }}>
            © {new Date().getFullYear()} Youshop Technologies Ltd. All rights reserved. Made with ❤️ in Nigeria.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a key={l} href="#" style={{ color: '#4A5568', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#A0AEC0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4A5568')}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
