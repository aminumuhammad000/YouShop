import React, { useState } from 'react';
import { ToggleButton } from '../components/Icons';
import ThemePreference from '../components/ThemePreference';

const SettingsPage = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoInvoice, setAutoInvoice] = useState(true);

  return (
    <div className="vendor-content">
      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>Store Security & Preferences</h3>
            <p>Configure automated invoicing, notification alerts, and security</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ThemePreference />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#F8FAFC', borderRadius: 16, border: '1px solid var(--vendor-border)' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0F172A' }}>Instant Email Order Dispatch Alerts</strong>
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Receive high priority notifications when customers place an order</span>
            </div>
            <ToggleButton checked={emailAlerts} onChange={setEmailAlerts} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#F8FAFC', borderRadius: 16, border: '1px solid var(--vendor-border)' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0F172A' }}>Automated PDF Invoicing</strong>
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Generate digital stamped invoices for each fulfilled shipment</span>
            </div>
            <ToggleButton checked={autoInvoice} onChange={setAutoInvoice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
