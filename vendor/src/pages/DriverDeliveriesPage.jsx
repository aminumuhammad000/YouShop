import React, { useEffect, useState } from 'react';
import { getDriverDeliveriesList, acceptDelivery, updateDriverDeliveryStatus } from '../services/api';
import { TruckIcon, ArrowRightIcon } from '../components/Icons';

const DriverDeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const data = await getDriverDeliveriesList();
      setDeliveries(data);
    } catch (err) {
      console.error('Failed to load deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleAccept = async (id) => {
    setActionLoading(id);
    try {
      await acceptDelivery(id);
      await fetchDeliveries();
    } catch (err) {
      alert(err.message || 'Failed to accept');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatus = async (id, currentStatus) => {
    const nextMap = {
      Accepted: 'Arrived at Pickup',
      'Arrived at Pickup': 'Picked Up',
      'Picked Up': 'On the Way',
    };
    const next = nextMap[currentStatus];
    if (!next) return;
    setActionLoading(id);
    try {
      await updateDriverDeliveryStatus(id, next);
      await fetchDeliveries();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = deliveries.filter((d) => {
    if (filter === 'Available') return d.status === 'Available';
    if (filter === 'Active') return ['Accepted', 'Arrived at Pickup', 'Picked Up', 'On the Way'].includes(d.status);
    if (filter === 'Delivered') return d.status === 'Delivered';
    return true;
  });

  return (
    <div className="vendor-content">
      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>Courier Dispatch Matrix ({deliveries.length})</h3>
            <p>Filter active missions, dispatch requests, and delivered orders</p>
          </div>
        </div>

        <div className="tab-row">
          {['All', 'Available', 'Active', 'Delivered'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`tab-btn ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab === 'All' ? 'All Deliveries' : tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
            <div className="auth-spinner" style={{ margin: '0 auto 12px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
            Loading courier dispatch board...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94A3B8' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: '#14B8A6' }}>
              <TruckIcon size={48} />
            </div>
            <h3 style={{ color: '#CBD5E1', marginBottom: 8 }}>No deliveries in this tab</h3>
            <p style={{ fontSize: '0.88rem' }}>New orders will appear here automatically from the marketplace.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mission Code</th>
                  <th>Customer / Destination</th>
                  <th>Items</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong style={{ fontFamily: 'var(--vendor-font-display)', fontSize: '0.88rem' }}>
                        {item.orderNumber}
                      </strong>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.customerName}</div>
                      <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{item.deliveryAddress}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#94A3B8', maxWidth: 160 }}>{item.itemsSummary}</td>
                    <td>
                      <strong style={{ color: '#14B8A6', fontFamily: 'var(--vendor-font-display)' }}>
                        +&#8358;{Number(item.deliveryFee).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge ${item.status === 'Delivered' ? 'active' : item.status === 'Available' ? 'neutral' : 'pending'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === 'Available' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAccept(item._id)}
                          disabled={actionLoading === item._id}
                        >
                          {actionLoading === item._id ? '...' : 'Accept'}
                        </button>
                      )}
                      {['Accepted', 'Arrived at Pickup', 'Picked Up'].includes(item.status) && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleStatus(item._id, item.status)}
                          disabled={actionLoading === item._id}
                        >
                          <span>{actionLoading === item._id ? '...' : 'Next Step'}</span>
                          <ArrowRightIcon size={14} />
                        </button>
                      )}
                      {item.status === 'On the Way' && (
                        <span style={{ fontSize: '0.8rem', color: '#F59E0B' }}>Awaiting PIN</span>
                      )}
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

export default DriverDeliveriesPage;
