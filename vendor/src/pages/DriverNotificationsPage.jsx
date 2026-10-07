import React, { useEffect, useState } from 'react';
import { getDriverNotificationsList } from '../services/api';
import {
  BellIcon,
  BoltIcon,
  CurrencyNairaIcon,
  StarIcon,
  PackageIcon,
} from '../components/Icons';

const renderTypeIcon = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('surge') || t.includes('bonus')) return <BoltIcon size={20} />;
  if (t.includes('payout') || t.includes('cashout') || t.includes('earning')) return <CurrencyNairaIcon size={20} />;
  if (t.includes('badge') || t.includes('award') || t.includes('rating')) return <StarIcon size={20} />;
  if (t.includes('order') || t.includes('delivery')) return <PackageIcon size={20} />;
  return <BellIcon size={20} />;
};

const DriverNotificationsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDriverNotificationsList()
      .then((data) => setAlerts(Array.isArray(data) ? data : []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="vendor-content">
      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>Courier Dispatch Alerts</h3>
            <p>Real-time notifications, surge alerts, and payout updates</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
            <div className="auth-spinner" style={{ margin: '0 auto 12px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
            Loading alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: '#14B8A6' }}>
              <BellIcon size={48} />
            </div>
            <h3 style={{ color: '#CBD5E1', marginBottom: 8 }}>No notifications yet</h3>
            <p style={{ fontSize: '0.9rem' }}>Surge alerts, payout confirmations and mission updates will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {alerts.map((al, idx) => (
              <div
                key={al._id || al.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  padding: 18,
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(20,184,166,0.12)',
                    color: '#14B8A6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {renderTypeIcon(al.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', fontWeight: 800, color: '#F1F5F9' }}>
                    {al.title || al.message || 'Notification'}
                  </h4>
                  {al.message && al.title && (
                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.4 }}>
                      {al.message}
                    </p>
                  )}
                  <span style={{ display: 'block', marginTop: 8, fontSize: '0.74rem', color: '#64748B' }}>
                    {al.createdAt ? new Date(al.createdAt).toLocaleString() : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverNotificationsPage;
