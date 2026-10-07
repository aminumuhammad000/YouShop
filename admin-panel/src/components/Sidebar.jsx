import React from 'react';
import { NavLink } from 'react-router-dom';
import YouShopLogo, { YouShopLogoIcon } from './YouShopLogo';

// Professional SVG Icons
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Orders: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="2"/>
      <path d="M9 12h6M9 16h4"/>
    </svg>
  ),
  Products: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
    </svg>
  ),
  Categories: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Inventory: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h.01M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/>
      <path d="M22 4v16"/><rect x="5" y="14" width="4" height="6" rx="1"/>
      <rect x="10" y="10" width="4" height="10" rx="1"/>
    </svg>
  ),
  Customers: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Chat: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
  Coupons: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  Notifications: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Analytics: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Reports: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Logs: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Store: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
};

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', Icon: Icons.Dashboard, end: true },
    ]
  },
  {
    label: 'Store',
    items: [
      { to: '/orders', label: 'Orders', Icon: Icons.Orders },
      { to: '/products', label: 'Products', Icon: Icons.Products },
      { to: '/categories', label: 'Categories', Icon: Icons.Categories },
      { to: '/inventory', label: 'Inventory', Icon: Icons.Inventory },
      { to: '/customers', label: 'Customers', Icon: Icons.Customers },
    ]
  },
  {
    label: 'Engagement',
    items: [
      { to: '/chat-zone', label: 'Chat Zone', Icon: Icons.Chat },
      { to: '/coupons', label: 'Coupons', Icon: Icons.Coupons },
      { to: '/notifications', label: 'Notifications', Icon: Icons.Notifications },
    ]
  },
  {
    label: 'Insights',
    items: [
      { to: '/analytics', label: 'Analytics', Icon: Icons.Analytics },
      { to: '/reports', label: 'Reports', Icon: Icons.Reports },
    ]
  },
  {
    label: 'System',
    items: [
      { to: '/logs', label: 'System Logs', Icon: Icons.Logs },
    ]
  }
];

function Sidebar({ onLogout, isCollapsed, setIsCollapsed }) {
  return (
    <div
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        background: 'var(--bg-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        height: '72px',
        minHeight: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        padding: isCollapsed ? '0' : '0 18px 0 22px',
        borderBottom: '1px solid var(--sidebar-border)',
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <YouShopLogo iconSize={34} fontSize="1.2rem" />
            <span className="sidebar-kicker">CONTROL CENTER</span>
          </div>
        )}

        {isCollapsed && (
          <YouShopLogoIcon width={32} height={32} />
        )}

        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            title="Collapse sidebar"
            style={{
              width: '28px', height: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: '#64748B',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#CBD5E1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
          >
            <Icons.ChevronLeft />
          </button>
        )}
      </div>

      {/* Navigation — no scroll */}
      <nav style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 10px',
        gap: '2px',
        overflow: 'hidden', // No scroll
      }}>
        {navSections.map((section, si) => (
          <div key={si} style={{ marginBottom: '4px' }}>
            {/* Section label */}
            {!isCollapsed && section.label && (
              <p style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'var(--sidebar-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                padding: '10px 12px 4px',
              }}>
                {section.label}
              </p>
            )}
            {isCollapsed && si > 0 && (
              <div style={{ height: '1px', background: 'var(--sidebar-border)', margin: '6px 8px' }} />
            )}

            {/* Nav Items */}
            {section.items.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                title={isCollapsed ? label : undefined}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: isCollapsed ? '10px' : '9px 12px',
                  borderRadius: '8px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  color: isActive ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                  background: isActive
                    ? 'var(--sidebar-active-bg)'
                    : 'transparent',
                  borderLeft: isActive && !isCollapsed ? '2px solid var(--primary)' : '2px solid transparent',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                })}
              >
                <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <Icon />
                </span>
                {!isCollapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer — Expand button when collapsed */}
      <div style={{
        padding: '12px 10px',
        borderTop: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        {/* Expand button when collapsed */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            title="Expand sidebar"
            style={{
              width: '100%',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: '1px solid var(--sidebar-border)',
              background: 'transparent', color: '#64748B', cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#CBD5E1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
          >
            <Icons.ChevronRight />
          </button>
        )}

      </div>
    </div>
  );
}

export default Sidebar;
