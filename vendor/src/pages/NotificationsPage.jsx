import React, { useEffect, useState } from 'react';
import { getVendorNotifications, markNotificationsRead } from '../services/api';
import { AlertTriangleIcon, BellIcon, CurrencyNairaIcon, PackageIcon, StarIcon } from '../components/Icons';

const typeIcon = (type) => {
  if (!type) return <BellIcon size={20} />;
  const t = type.toLowerCase();
  if (t.includes('order')) return <PackageIcon size={20} />;
  if (t.includes('payout') || t.includes('withdrawal')) return <CurrencyNairaIcon size={20} />;
  if (t.includes('award') || t.includes('milestone')) return <StarIcon size={20} />;
  if (t.includes('warning') || t.includes('alert')) return <AlertTriangleIcon size={20} />;
  return <BellIcon size={20} />;
};

const NotificationsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendorNotifications()
      .then(setAlerts)
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAll = async () => {
    await markNotificationsRead();
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  return (
    <div className="vendor-content">
      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>Storefront Activity & Alerts</h3>
            <p>Real-time notifications, order events and system alerts</p>
          </div>
          {alerts.length > 0 && (
            <button className="btn btn-outline btn-sm" onClick={handleMarkAll}>Mark All Read</button>
          )}
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748B' }}>
            <div className="auth-spinner" style={{ margin: '0 auto 16px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
            Loading notifications...
          </div>
        ) : alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: '#14B8A6' }}><BellIcon size={48} /></div>
            <h3 style={{ color: 'var(--vendor-text-main)', marginBottom: 8 }}>No notifications yet</h3>
            <p style={{ fontSize: '0.9rem' }}>System alerts, order updates and store events will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {alerts.map((al, idx) => (
              <div key={al._id || al.id || idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: 18, borderRadius: 16, background: al.read ? 'rgba(255,255,255,0.02)' : 'rgba(20,184,166,0.06)', border: al.read ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(20,184,166,0.2)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(20,184,166,0.12)', color: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  {typeIcon(al.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', fontWeight: 800, color: '#F1F5F9' }}>{al.title || al.message || 'Notification'}</h4>
                  {al.message && al.title && <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.4 }}>{al.message}</p>}
                  <span style={{ display: 'block', marginTop: 8, fontSize: '0.74rem', color: '#64748B' }}>
                    {al.createdAt ? new Date(al.createdAt).toLocaleString() : ''}
                  </span>
                </div>
                {!al.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#14B8A6', flexShrink: 0, marginTop: 6 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
