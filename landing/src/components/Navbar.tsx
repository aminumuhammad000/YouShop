import * as React from 'react';
import { Menu, X, Download } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features',      href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'For Sellers',  href: '#sellers' },
    { label: 'Stories',      href: '#stories' },
  ];

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000,
        background: scrolled ? 'rgba(255,255,255,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        boxShadow: scrolled ? '0 1px 30px rgba(0,0,0,0.07)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : 'none',
        transition: 'all 0.35s ease',
      }}>
        {/* Scroll progress line */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          height: '3px', width: `${progress}%`,
          background: 'linear-gradient(90deg, #28C7B1, #7B48D9, #FF6874, #FFC864)',
          transition: 'width 0.1s linear',
          zIndex: 10,
        }} />

        <div style={{
          width: '100%', padding: '0 max(5%, calc((100% - 1280px) / 2))',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px',
        }}>
          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/src/assets/logo.png" alt="YouShop logo"
              style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em' }}><span style={{ color: 'var(--color-teal)' }}>You</span><span style={{ color: 'var(--color-purple)' }}>Shop</span></span>
          </a>

          {/* Desktop nav links */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '36px' }}>
            {navLinks.map(link => (
              <a key={link.label} href={link.href}
                style={{ color: '#1E2B3A', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-teal)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#1E2B3A'; }}
              >{link.label}</a>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="desktop-nav"
              style={{
                background: 'var(--gradient-primary)', color: 'white', fontFamily: 'var(--font-heading)',
                padding: '10px 22px', borderRadius: '14px', fontWeight: 800, fontSize: '0.95rem',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s ease', boxShadow: '0 4px 15px rgba(123,72,217,0.3)'
              }}
              onMouseEnter={e => { 
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(123,72,217,0.45)';
              }}
              onMouseLeave={e => { 
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(123,72,217,0.3)';
              }}
            >
              <Download size={15} strokeWidth={2.5} /> Get App
            </button>

            {/* Hamburger */}
            <button className="mobile-menu-btn"
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--color-dark-blue)', display: 'none', alignItems: 'center' }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile overlay menu */}
        <div style={{
          maxHeight: menuOpen ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: menuOpen ? '1px solid #E2E8F0' : 'none',
        }}>
          <div style={{ padding: '20px 5%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map(link => (
              <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
                style={{ color: 'var(--color-dark-blue)', fontWeight: 600, fontSize: '1.05rem', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}
              >{link.label}</a>
            ))}
            <button style={{
              marginTop: '12px', background: 'var(--gradient-primary)', color: 'white',
              padding: '14px', borderRadius: '14px', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer',
            }}>Get App</button>
          </div>
        </div>
      </header>
      {/* Spacer to push content below fixed nav */}
      <div style={{ height: '72px' }} />
    </>
  );
};

export default Navbar;
