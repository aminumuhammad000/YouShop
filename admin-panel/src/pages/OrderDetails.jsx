import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../services/api';
import Badge from '../components/Badge';

const STATUS_FLOW = ['placed', 'processing', 'shipped', 'delivered'];

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    ordersApi.getById(id).then(r => setOrder(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleStatus = async (newStatus) => {
    setUpdating(true);
    const res = await ordersApi.updateStatus(id, { status: newStatus }).catch(console.error);
    if (res) setOrder(res.data);
    setUpdating(false);
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>⏳ Loading order details...</div>;
  if (!order) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>Order not found.</div>;

  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];
  const currentStep = STATUS_FLOW.indexOf(order.status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <button onClick={() => navigate('/orders')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', marginBottom: '10px', fontFamily: 'inherit' }}>
            ← Back to Orders
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            {order.orderNumber || `#${order._id.substring(0, 8)}`}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Badge type={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : order.status === 'processing' || order.status === 'shipped' ? 'warning' : 'info'}>
            {order.status?.toUpperCase()}
          </Badge>
          {nextStatus && (
            <button onClick={() => handleStatus(nextStatus)} disabled={updating} className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
              {updating ? 'Updating...' : `Mark as ${nextStatus}`}
            </button>
          )}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <button onClick={() => handleStatus('cancelled')} disabled={updating} className="btn btn-danger" style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="glass-card" style={{ padding: '24px 32px' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Progress</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          {STATUS_FLOW.map((status, i) => {
            const done = i <= currentStep;
            const active = i === currentStep;
            return (
              <React.Fragment key={status}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: done ? '#4F7CFF' : 'var(--bg-app)',
                    border: `2px solid ${done ? '#4F7CFF' : 'var(--border-color)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700,
                    color: done ? '#fff' : 'var(--text-secondary)',
                    boxShadow: active ? '0 0 0 4px rgba(79,124,255,0.15)' : 'none',
                    transition: 'all 0.3s ease',
                  }}>
                    {done && i < currentStep ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: done ? '#4F7CFF' : 'var(--text-secondary)', textTransform: 'capitalize' }}>
                    {status}
                  </span>
                </div>
                {i < STATUS_FLOW.length - 1 && (
                  <div style={{ flex: 1, height: '2px', background: i < currentStep ? '#4F7CFF' : 'var(--border-color)', margin: '0 8px', marginBottom: '24px', transition: 'background 0.3s ease' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Items Table */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Ordered Items</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Price</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={item.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=80'} alt={item.name}
                        style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity || 1}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>${item.price?.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Order Total:</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>${order.totalPrice?.toLocaleString()}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {order.timeline?.map((event, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', paddingBottom: '20px', position: 'relative' }}>
                {i < order.timeline.length - 1 && (
                  <div style={{ position: 'absolute', left: '15px', top: '30px', bottom: 0, width: '2px', background: 'var(--border-color)' }} />
                )}
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#4F7CFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fff', fontWeight: 700, flexShrink: 0, zIndex: 1 }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{event.label}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{event.description}</div>
                  <div style={{ fontSize: '0.725rem', color: '#4F7CFF', marginTop: '4px', fontWeight: 600 }}>{new Date(event.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
