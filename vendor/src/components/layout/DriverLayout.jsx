import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/vendor.css';

const driverNavSections = [
  {
    section: 'DISPATCH & ORDERS',
    items: [
      {
        label: 'Overview',
        path: '/driver/dashboard',
        badge: 'Live Radar',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        ),
      },
      {
        label: 'Delivery',
        path: '/driver/deliveries',
        badge: '2 Nearby',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        ),
      },
      {
        label: 'Map / GPS',
        path: '/driver/map',
        badge: 'Live',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        ),
      },
      {
        label: 'Live Chat',
        path: '/driver/chat',
        badge: 'Active',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
      },
      {
        label: 'Trip History',
        path: '/driver/history',
        badge: null,
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    section: 'EARNINGS & REVENUE',
    items: [
      {
        label: 'Earnings',
        path: '/driver/earnings',
        badge: 'Instant',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5z" />
          </svg>
        ),
      },
    ],
  },
  {
    section: 'PILOT ACCOUNT',
    items: [
      {
        label: 'Courier Alerts',
        path: '/driver/notifications',
        badge: '1',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        ),
      },
      {
        label: 'Vehicle & ID',
        path: '/driver/profile',
        badge: 'Verified',
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        ),
      },
      {
        label: 'Driver Settings',
        path: '/driver/settings',
        badge: null,
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        label: 'Support',
        path: '/driver/support',
        badge: null,
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
    ],
  },
];

const pageTitles = {
  '/driver/dashboard': 'Dispatch & Mission Command Center',
  '/driver/deliveries': 'Courier Deliveries Board',
  '/driver/map': 'GPS Navigation & Route Planner',
  '/driver/chat': 'Customer & Merchant Live Chat',
  '/driver/history': 'Completed Trip History',
  '/driver/earnings': 'Driver Earnings & Instant Payouts',
  '/driver/notifications': 'Courier Alerts & Push Feed',
  '/driver/profile': 'Courier ID & Vehicle Profile',
  '/driver/settings': 'Navigation & Dispatch Preferences',
  '/driver/support': 'Driver Help & Support',
};

const DriverLayout = ({ children, driver, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(driver?.isOnline !== false);

  const currentTitle = pageTitles[location.pathname] || 'Courier Dispatch Portal';
  const [profileOpen, setProfileOpen] = useState(false);

  // Close modal on escape key or route change
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profileOpen]);

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  const [authNotification, setAuthNotification] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('youshop_auth_notification');
      if (stored) {
        setAuthNotification(JSON.parse(stored));
        sessionStorage.removeItem('youshop_auth_notification');
        const timer = setTimeout(() => {
          setAuthNotification(null);
        }, 5500);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleToggleOnline = () => setIsOnline((prev) => !prev);

  const handleLogout = () => {
    setProfileOpen(false);
    if (onLogout) onLogout();
    navigate('/driver/login');
  };

  return (
    <div className="vendor-layout">
      {/* Floating Auth Success Notification Toast */}
      {authNotification && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 99999999,
            background: '#0F172A',
            color: '#FFFFFF',
            border: '2px solid #8B5CF6',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 24px rgba(139, 92, 246, 0.35)',
            borderRadius: 18,
            padding: '16px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            maxWidth: 440,
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(139, 92, 246, 0.2)',
              color: '#A78BFA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontWeight: 800,
              fontSize: '1.2rem',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.3)',
            }}
          >
            ✓
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#C4B5FD', letterSpacing: '-0.01em' }}>
              {authNotification.title}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#E2E8F0', marginTop: 3, lineHeight: 1.4 }}>
              {authNotification.message}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAuthNotification(null)}
            title="Dismiss"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: 8,
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 700,
              padding: '6px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
          >
            ✕
          </button>
        </div>,
        document.body
      )}
      {/* Luxury Obsidian Dispatch Sidebar */}
      <aside className="vendor-sidebar">
        <div className="sidebar-brand">
          <img
            src="/youshop-bag-icon.png"
            alt="YouShop"
            className="sidebar-brand-logo-img"
          />
          <div>
            <h3>
              <span style={{ color: '#14B8A6' }}>You</span>
              <span style={{ color: '#8B5CF6' }}>Shop</span>
            </h3>
            <small>Dispatch Pro Pilot</small>
          </div>
        </div>

        {/* Nav Sections */}
        <nav className="sidebar-nav" aria-label="Driver navigation">
          {driverNavSections.map((section) => (
            <div key={section.section} style={{ marginBottom: 6 }}>
              <p className="sidebar-nav-section-title">
                {section.section}
              </p>
              {section.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) => 'nav-item ' + (isActive ? 'active' : '')}
                >
                  {item.icon}
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                  {item.badge && <span className="nav-badge-pill">{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}

          {/* No sign-out in sidebar – use profile avatar menu in topbar */}
          <div style={{ marginTop: 'auto', paddingTop: 10 }} />
        </nav>

        {/* Driver Profile Bottom Card */}
        <div className="sidebar-profile-card">
          <div 
            className="sidebar-avatar" 
            style={{ 
              background: 'var(--vendor-gradient-violet)', 
              position: 'relative', 
              overflow: 'hidden',
              border: driver?.profilePicture ? '3px solid #8B5CF6' : '2px solid var(--vendor-border)',
              boxShadow: driver?.profilePicture ? '0 4px 20px rgba(139, 92, 246, 0.3)' : 'none',
            }}
          >
            {driver?.profilePicture ? (
              <img 
                src={driver.profilePicture} 
                alt="Profile" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.textContent = driver?.name?.charAt(0)?.toUpperCase() || 'D';
                  e.currentTarget.parentElement.style.border = '2px solid var(--vendor-border)';
                  e.currentTarget.parentElement.style.boxShadow = 'none';
                }}
              />
            ) : (
              (driver?.name || 'D')[0].toUpperCase()
            )}
            <span className="sidebar-avatar-online" style={{ background: isOnline ? '#10B981' : '#64748B' }} />
          </div>
          <div className="sidebar-user-meta" style={{ minWidth: 0 }}>
            <h4 className="sidebar-user-name">{driver?.name || 'Courier Pilot'}</h4>
            <div className="sidebar-user-tier" style={{ color: '#F59E0B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span>★</span> 4.95 • {driver?.vehicleType || 'Motorcycle'}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="vendor-main">
        <header className="vendor-topbar">
          <div className="topbar-title-group">
            <p className="eyebrow">
              {driver?.city || 'Lagos Metropolitan Zone'}
            </p>
            <h2>{currentTitle}</h2>
          </div>

          <div className="topbar-right-tools">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: isOnline ? 'rgba(16,185,129,0.12)' : '#F1F5F9',
                color: isOnline ? '#059669' : '#64748B',
                padding: '8px 16px',
                borderRadius: 999,
                fontSize: '0.82rem',
                fontWeight: 800,
                border: isOnline ? '1px solid rgba(16,185,129,0.3)' : '1px solid #CBD5E1',
              }}
            >
              <span className="status-dot" style={{ background: isOnline ? '#10B981' : '#94A3B8', boxShadow: isOnline ? '0 0 10px #10B981' : 'none' }} />
              {isOnline ? 'GPS Active' : 'GPS Standby'}
            </span>

            <button
              type="button"
              className="topbar-icon-btn"
              onClick={() => navigate('/driver/notifications')}
              title="Notifications"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="topbar-unread-badge" />
            </button>

            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="topbar-avatar-btn"
                onClick={() => setProfileOpen(prev => !prev)}
                title="Account Menu"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  border: profileOpen ? '2px solid #8B5CF6' : '1.5px solid var(--vendor-border)',
                  background: 'transparent',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: profileOpen ? '0 0 0 3px rgba(139,92,246,0.2)' : 'none',
                }}
              >
                <div 
                  className="avatar" 
                  style={{ 
                    margin: 0, 
                    width: 38, 
                    height: 38, 
                    borderRadius: 12,
                    background: 'var(--vendor-gradient-violet)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: driver?.profilePicture ? '2px solid #8B5CF6' : '1.5px solid var(--vendor-border)',
                  }}
                >
                  {driver?.profilePicture ? (
                    <img 
                      src={driver.profilePicture} 
                      alt="Profile" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.textContent = driver?.name?.charAt(0)?.toUpperCase() || 'D';
                        e.currentTarget.parentElement.style.border = '1.5px solid var(--vendor-border)';
                      }}
                    />
                  ) : (
                    (driver?.name || 'D')[0].toUpperCase()
                  )}
                </div>
              </button>

              {/* High-visibility Profile Modal Rendered in Front via Portal */}
              {profileOpen && typeof document !== 'undefined' && createPortal(
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 999999,
                    background: 'rgba(15, 23, 42, 0.55)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    paddingTop: 85,
                    paddingRight: 40,
                  }}
                  onClick={() => setProfileOpen(false)}
                >
                  <div
                    style={{
                      width: 290,
                      background: '#FFFFFF',
                      borderRadius: 22,
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                      padding: '16px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #F1F5F9', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <div 
                          className="avatar" 
                          style={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: 10, 
                            fontSize: '0.9rem', 
                            flexShrink: 0,
                            background: 'var(--vendor-gradient-violet)',
                            position: 'relative',
                            overflow: 'hidden',
                            border: driver?.profilePicture ? '2px solid #8B5CF6' : '1px solid var(--vendor-border)',
                          }}
                        >
                          {driver?.profilePicture ? (
                            <img 
                              src={driver.profilePicture} 
                              alt="Profile" 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement.textContent = driver?.name?.charAt(0)?.toUpperCase() || 'D';
                                e.currentTarget.parentElement.style.border = '1px solid var(--vendor-border)';
                              }}
                            />
                          ) : (
                            (driver?.name || 'D')[0].toUpperCase()
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {driver?.name || 'Courier Pilot'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {driver?.vehicleType || 'Motorcycle'} · {driver?.city || 'Dispatch'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProfileOpen(false)}
                        title="Close"
                        style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontWeight: 700 }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Two options: Profile and Sign Out */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => { setProfileOpen(false); navigate('/driver/profile'); }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: 14,
                          border: '1px solid #E2E8F0',
                          background: '#F8FAFC',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F3FF'; e.currentTarget.style.borderColor = '#8B5CF6'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,92,246,0.12)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.92rem', fontWeight: 650, color: '#0F172A' }}>Profile</div>
                            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>View driver ID & details</div>
                          </div>
                        </div>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#94A3B8' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: 14,
                          border: '1px solid #FEE2E2',
                          background: '#FFF5F5',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.borderColor = '#EF4444'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#FFF5F5'; e.currentTarget.style.borderColor = '#FEE2E2'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.12)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.92rem', fontWeight: 650, color: '#DC2626' }}>Sign Out</div>
                            <div style={{ fontSize: '0.74rem', color: '#EF4444' }}>Log out of account</div>
                          </div>
                        </div>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#FCA5A5' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )}
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default DriverLayout;
