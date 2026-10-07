import React, { useState } from 'react';
import { ToggleButton } from '../components/Icons';
import ThemePreference from '../components/ThemePreference';

const DriverSettingsPage = () => {
  const [autoAccept, setAutoAccept] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [highValueFilter, setHighValueFilter] = useState(true);

  return (
    <div className="vendor-content">
      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>Dispatch & App Preferences</h3>
            <p>Customize automated job routing and telemetry alerts</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ThemePreference />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#F8FAFC', borderRadius: 16, border: '1px solid var(--vendor-border)' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0F172A' }}>Auto-Accept High Payout Jobs</strong>
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Instantly lock in delivery missions exceeding ₦3,000</span>
            </div>
            <ToggleButton checked={autoAccept} onChange={setAutoAccept} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#F8FAFC', borderRadius: 16, border: '1px solid var(--vendor-border)' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0F172A' }}>High Priority Audio Chimes</strong>
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Play loud alert sounds when new dispatch missions enter radar</span>
            </div>
            <ToggleButton checked={soundAlerts} onChange={setSoundAlerts} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#F8FAFC', borderRadius: 16, border: '1px solid var(--vendor-border)' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0F172A' }}>Prefer Express & Short Route Jobs</strong>
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Prioritize deliveries under 8km for maximum hourly earnings</span>
            </div>
            <ToggleButton checked={highValueFilter} onChange={setHighValueFilter} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverSettingsPage;
