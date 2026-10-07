import React, { useEffect, useState } from 'react';
import { getDriverDeliveriesList } from '../services/api';
import { HistoryIcon, CheckIcon } from '../components/Icons';

const DriverHistoryPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDriverDeliveriesList()
      .then((data) => {
        setDeliveries(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const completed = deliveries.filter((d) => d.status === 'Delivered' || d.status === 'Completed');

  return (
    <div className="vendor-content">
      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>Trip Fulfillment History</h3>
            <p>Chronological record of all completed dropoffs — {completed.length} trip{completed.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
            <div className="auth-spinner" style={{ margin: '0 auto 12px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
            Loading trip history...
          </div>
        ) : completed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: '#14B8A6' }}>
              <HistoryIcon size={48} />
            </div>
            <h3 style={{ color: '#CBD5E1', marginBottom: 8 }}>No completed deliveries yet</h3>
            <p style={{ fontSize: '0.9rem' }}>Your confirmed delivery history will appear here once you complete trips.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order Code</th>
                  <th>Customer / Destination</th>
                  <th>Items</th>
                  <th>Payout</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {completed.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <strong style={{ fontFamily: 'var(--vendor-font-display)', fontSize: '0.88rem' }}>
                        {job.orderNumber}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{job.customerName}</div>
                      <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{job.deliveryAddress}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#94A3B8', maxWidth: 160 }}>{job.itemsSummary}</td>
                    <td>
                      <strong style={{ color: '#14B8A6', fontFamily: 'var(--vendor-font-display)' }}>
                        +&#8358;{Number(job.deliveryFee).toLocaleString()}
                      </strong>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="badge active" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <CheckIcon size={14} />
                        <span>Delivered</span>
                      </span>
                    </td>
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

export default DriverHistoryPage;
