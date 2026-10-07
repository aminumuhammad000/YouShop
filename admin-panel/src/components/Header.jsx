import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const breadcrumbMap = {
  '/': 'Dashboard', '/orders': 'Orders', '/products': 'Products',
  '/products/create': 'Add Product', '/categories': 'Categories',
  '/inventory': 'Inventory', '/customers': 'Customers',
  '/chat-zone': 'Chat Zone',
  '/coupons': 'Coupons', '/notifications': 'Notifications',
  '/analytics': 'Analytics', '/reports': 'Reports',
  '/settings': 'Settings', '/logs': 'System Logs',
};

// SVG Icons
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-4v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.8-2.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.8-2.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.8 2.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
);

const iconBtn = {
  width: '38px', height: '38px', borderRadius: '9px',
  border: '1px solid var(--border-color)', background: 'var(--bg-app)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--text-secondary)', transition: 'all 0.2s ease', flexShrink: 0,
};

function Header({ darkMode, toggleDarkMode, isSidebarCollapsed, setIsSidebarCollapsed, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const pageName = breadcrumbMap[location.pathname] || 'Page';

  return (
    <div className="header">
      {/* Left */}
      <div className="header-left">
        {/* Menu / Collapse Toggle */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={iconBtn}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-color)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-app)'; }}
        >
          <MenuIcon />
        </button>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Admin</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{pageName}</span>
        </nav>
      </div>

      {/* Right */}
      <div className="header-right">
        {/* Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)', pointerEvents: 'none', display: 'flex' }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search anything..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              paddingLeft: '38px', paddingRight: '14px',
              height: '38px', width: '220px',
              background: 'var(--bg-app)', border: '1px solid var(--border-color)',
              borderRadius: '9px', color: 'var(--text-primary)',
              fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
            onFocus={e => { e.target.style.borderColor = '#4F7CFF'; e.target.style.boxShadow = '0 0 0 3px rgba(79,124,255,0.1)'; e.target.style.width = '260px'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; e.target.style.width = '220px'; }}
          />
        </div>

        {/* Dark Mode */}
        <button
          onClick={toggleDarkMode}
          style={iconBtn}
          title={darkMode ? 'Light mode' : 'Dark mode'}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-color)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-app)'; }}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            style={iconBtn}
            title="Notifications"
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-color)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-app)'; }}
          >
            <BellIcon />
          </button>
          <span style={{
            position: 'absolute', top: '7px', right: '7px',
            width: '7px', height: '7px',
            background: '#EF4444', borderRadius: '50%',
            border: '1.5px solid var(--bg-card)',
          }} />
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: 'var(--border-color)' }} />

        {/* User Profile */}
        <div className={`admin-profile-wrap ${profileOpen ? 'is-open' : ''}`} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '5px 12px 5px 6px',
          background: 'var(--bg-app)', border: '1px solid var(--border-color)',
          borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s ease',
        }}
          role="button"
          tabIndex={0}
          aria-expanded={profileOpen}
          onClick={() => setProfileOpen(open => !open)}
          onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') setProfileOpen(open => !open); }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F7CFF'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
        >
          <div className="admin-profile-avatar" style={{
            width: '28px', height: '28px', borderRadius: '7px',
            background: 'linear-gradient(135deg, #4F7CFF, #6C63FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
          }}>A</div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>Admin</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1 }}>Super Admin</div>
          </div>
          <span className="admin-profile-chevron" style={{ color: 'var(--text-secondary)', display: 'flex' }}>
            <ChevronDownIcon />
          </span>
          {profileOpen && (
            <>
              <div className="admin-profile-backdrop" onClick={event => { event.stopPropagation(); setProfileOpen(false); }} />
              <div className="admin-profile-menu" onClick={event => event.stopPropagation()}>
                <div className="admin-profile-menu-head">
                  <div className="admin-profile-menu-avatar">A</div>
                  <div><strong>Admin account</strong><span>Super Admin access</span></div>
                </div>
                <button type="button" className="admin-profile-menu-item" onClick={() => { setProfileOpen(false); navigate('/settings'); }}>
                  <span className="admin-profile-menu-icon settings"><SettingsIcon /></span>
                  <span><strong>Settings</strong><small>Manage store preferences</small></span>
                  <ChevronDownIcon />
                </button>
                <button type="button" className="admin-profile-menu-item danger" onClick={onLogout}>
                  <span className="admin-profile-menu-icon logout"><LogoutIcon /></span>
                  <span><strong>Sign out</strong><small>End this admin session</small></span>
                  <ChevronDownIcon />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
