import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import Badge from '../components/Badge';
import { showToast } from '../services/toast';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target: 'all' // all, users, admins
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await adminApi.getNotifications();
      // Assume API returns newest first, or we sort here
      const sorted = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sorted);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;
    
    setIsSubmitting(true);
    try {
      const res = await adminApi.createNotification({
        title: formData.title,
        message: formData.message,
        target: formData.target
      });
      // Add to top of list
      setNotifications([res.data, ...notifications]);
      setFormData({ title: '', message: '', target: 'all' });
      showToast('Notification sent successfully!', 'success');
    } catch (err) {
      console.error('Error sending notification:', err);
      showToast('Failed to send notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="notification-page" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="workspace-heading">
        <p className="page-eyebrow">RELATIONSHIPS / BROADCASTS</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Push Notifications</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
          Send announcements and alerts to your users.
        </p>
      </div>

      <div className="workspace-metrics">
        <div className="workspace-metric"><span className="metric-mark metric-mark-coral" /><div><strong>{notifications.length}</strong><span>Broadcasts sent</span></div></div>
        <div className="workspace-metric"><span className="metric-mark metric-mark-green" /><div><strong>{notifications.filter(notification => notification.target === 'all').length}</strong><span>Store-wide sends</span></div></div>
        <div className="workspace-metric"><span className="metric-mark metric-mark-amber" /><div><strong>{notifications.filter(notification => notification.target !== 'all').length}</strong><span>Targeted sends</span></div></div>
      </div>

      <div className="notification-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
        {/* Send Form */}
        <div className="glass-card notification-compose-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Compose Message</h3>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target Audience</label>
              <select
                name="target"
                className="input-field"
                value={formData.target}
                onChange={handleChange}
              >
                <option value="all">All Users</option>
                <option value="customers">Customers Only</option>
                <option value="admins">Admins Only</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Title</label>
              <input
                type="text"
                name="title"
                className="input-field"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Big Summer Sale!"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Message Body</label>
              <textarea
                name="message"
                className="input-field"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter notification content here..."
                rows="4"
                style={{ resize: 'vertical' }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ marginTop: '8px' }}>
              {isSubmitting ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>

        {/* History List */}
        <div className="glass-card notification-history-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Notification History</h3>
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading history...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No notifications sent yet.</div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Target</th>
                    <th>Message</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notif) => {
                    const id = notif._id || notif.id;
                    return (
                      <tr key={id}>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                          {new Date(notif.createdAt).toLocaleString()}
                        </td>
                        <td>
                          <Badge type="info" style={{ textTransform: 'capitalize' }}>
                            {notif.target || 'all'}
                          </Badge>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {notif.title}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            {notif.message}
                          </div>
                        </td>
                        <td>
                          <Badge type="success">Sent</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
