import React, { useEffect, useState } from 'react';
import { getVendorWithdrawals } from '../services/api';

const formatMoney = (v) => `₦${Number(v || 0).toLocaleString()}`;

const statusClass = (s = '') => {
  const st = s.toLowerCase();
  if (st === 'completed' || st === 'approved') return 'active';
  if (st === 'pending' || st === 'processing') return 'pending';
  if (st === 'rejected') return 'cancelled';
  return 'neutral';
};

const WithdrawalsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendorWithdrawals()
      .then(setRecords)
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="vendor-content">
      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>Disbursement & Withdrawal History</h3>
            <p>Official ledger of all your bank transfer requests</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748B' }}>
            <div className="auth-spinner" style={{ margin: '0 auto 16px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
            Loading records...
          </div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🏦</div>
            <h3 style={{ color: '#CBD5E1', marginBottom: 8 }}>No withdrawals yet</h3>
            <p style={{ fontSize: '0.9rem' }}>Your payout requests will appear here after you submit them from the Earnings page.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Bank Account</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r._id || i}>
                    <td><strong style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{r.reference || `#WTH-${i + 100}`}</strong></td>
                    <td style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td style={{ color: '#CBD5E1' }}>{r.bankName || 'Bank'} {r.accountNumber ? `•••• ${r.accountNumber.slice(-4)}` : ''}</td>
                    <td><strong style={{ color: '#FFFFFF' }}>{formatMoney(r.amount)}</strong></td>
                    <td><span className={`badge ${statusClass(r.status)}`}>{r.status || 'Pending'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalsPage;
