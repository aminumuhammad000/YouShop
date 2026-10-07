import React, { useState, useEffect } from 'react';

function Settings() {
  const [form, setForm] = useState({ storeName: 'Your Shop', currency: 'USD', shippingFee: '5.00', allowGuestCheckout: true });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('store_settings');
    if (s) setForm(JSON.parse(s));
  }, []);

  const save = (e) => {
    e.preventDefault();
    localStorage.setItem('store_settings', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="settings-page" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
      <div className="workspace-heading">
        <p className="page-eyebrow">CONTROL CENTER / PREFERENCES</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Store Settings</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>Configure global behavior and preferences for your store.</p>
      </div>

      {saved && (
          <div className="settings-saved">
          Settings saved successfully.
        </div>
      )}

      <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-card settings-panel settings-general-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>General</h3>

          <div className="input-group" style={{ margin: 0 }}>
            <label>Store Name</label>
            <input type="text" className="input-field" value={form.storeName} onChange={e => setForm({ ...form, storeName: e.target.value })} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label>Currency</label>
              <select className="input-field" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                <option value="USD">USD – US Dollar ($)</option>
                <option value="NGN">NGN – Nigerian Naira (₦)</option>
                <option value="EUR">EUR – Euro (€)</option>
                <option value="GBP">GBP – British Pound (£)</option>
              </select>
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <label>Flat Shipping Fee</label>
              <input type="number" step="0.01" className="input-field" value={form.shippingFee} onChange={e => setForm({ ...form, shippingFee: e.target.value })} required />
            </div>
          </div>
        </div>

        <div className="glass-card settings-panel settings-checkout-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>Checkout</h3>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.925rem', color: 'var(--text-primary)' }}>Guest Checkout</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Allow non-registered users to complete purchases</div>
            </div>
            <div
              onClick={() => setForm({ ...form, allowGuestCheckout: !form.allowGuestCheckout })}
              style={{
                width: '48px', height: '26px', borderRadius: '99px', flexShrink: 0,
                background: form.allowGuestCheckout ? 'var(--secondary)' : 'var(--border-color)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.25s ease',
              }}
            >
              <div style={{
                position: 'absolute', top: '3px',
                left: form.allowGuestCheckout ? '24px' : '3px',
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#fff', transition: 'left 0.25s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              }} />
            </div>
          </label>
        </div>

        <button type="submit" className="btn btn-primary settings-save-button" style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}>
          Save configuration
        </button>
      </form>
    </div>
  );
}

export default Settings;
