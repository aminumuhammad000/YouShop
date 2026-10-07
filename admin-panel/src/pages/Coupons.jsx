import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import Badge from '../components/Badge';
import { showToast } from '../services/toast';

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: '',
    expiryDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    try {
      const res = await adminApi.getCoupons();
      setCoupons(res.data || []);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountPercent) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        code: formData.code.toUpperCase(),
        discountPercent: Number(formData.discountPercent),
        active: true,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined
      };
      const res = await adminApi.createCoupon(payload);
      setCoupons([...coupons, res.data]);
      setFormData({ code: '', discountPercent: '', expiryDate: '' });
    } catch (err) {
      console.error('Error creating coupon:', err);
      showToast('Failed to create coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminApi.updateCoupon(id, { active: !currentStatus });
      setCoupons(coupons.map(c => 
        (c._id === id || c.id === id) ? { ...c, active: !currentStatus } : c
      ));
    } catch (err) {
      console.error('Error toggling coupon status:', err);
      showToast('Failed to update coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await adminApi.deleteCoupon(id);
      setCoupons(coupons.filter(c => c._id !== id && c.id !== id));
    } catch (err) {
      console.error('Error deleting coupon:', err);
      showToast('Failed to delete coupon');
    }
  };

  return (
    <div className="coupon-page" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="workspace-heading">
        <p className="page-eyebrow">GROWTH / CAMPAIGNS</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Coupons & Promotions</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
          Create and manage discount codes for your store.
        </p>
      </div>

      <div className="workspace-metrics">
        <div className="workspace-metric"><span className="metric-mark metric-mark-coral" /><div><strong>{coupons.length}</strong><span>Total campaigns</span></div></div>
        <div className="workspace-metric"><span className="metric-mark metric-mark-green" /><div><strong>{coupons.filter(coupon => coupon.active && !(coupon.expiryDate && new Date(coupon.expiryDate) < new Date())).length}</strong><span>Live promotions</span></div></div>
        <div className="workspace-metric"><span className="metric-mark metric-mark-amber" /><div><strong>{coupons.filter(coupon => coupon.expiryDate && new Date(coupon.expiryDate) < new Date()).length}</strong><span>Expired campaigns</span></div></div>
      </div>

      <div className="coupon-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
        {/* Create Form */}
        <div className="glass-card coupon-create-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Create New Coupon</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Coupon Code</label>
              <input
                type="text"
                name="code"
                className="input-field"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. SUMMER20"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Discount Percentage (%)</label>
              <input
                type="number"
                name="discountPercent"
                className="input-field"
                value={formData.discountPercent}
                onChange={handleChange}
                placeholder="e.g. 20"
                min="1"
                max="100"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Expiry Date (Optional)</label>
              <input
                type="date"
                name="expiryDate"
                className="input-field"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ marginTop: '8px' }}>
              {isSubmitting ? 'Creating...' : 'Create Coupon'}
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="glass-card coupon-list-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Active & Expired Coupons</h3>
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading coupons...</div>
          ) : coupons.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No coupons created yet.</div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Status</th>
                    <th>Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => {
                    const id = coupon._id || coupon.id;
                    const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                    const activeState = coupon.active && !isExpired;
                    
                    return (
                      <tr key={id}>
                        <td>
                          <span style={{ 
                            fontFamily: 'monospace', 
                            fontSize: '1rem', 
                            fontWeight: 700, 
                            color: 'var(--text-primary)',
                            background: 'var(--bg-app)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)'
                          }}>
                            {coupon.code}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{coupon.discountPercent}% OFF</td>
                        <td>
                          <Badge type={activeState ? 'success' : isExpired ? 'danger' : 'warning'}>
                            {activeState ? 'Active' : isExpired ? 'Expired' : 'Inactive'}
                          </Badge>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn btn-primary" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--bg-app)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                              onClick={() => handleToggleStatus(id, coupon.active)}
                            >
                              {coupon.active ? 'Disable' : 'Enable'}
                            </button>
                            <button 
                              className="btn btn-danger" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => handleDelete(id)}
                            >
                              Delete
                            </button>
                          </div>
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

export default Coupons;
