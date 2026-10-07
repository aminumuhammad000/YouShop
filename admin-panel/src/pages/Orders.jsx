import React, { useEffect, useState } from 'react';
import { ordersApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    ordersApi.getAll().then(r => setOrders(r.data || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o =>
    (o.orderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.status || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="orders-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="catalog-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p className="page-eyebrow">OPERATIONS / FULFILLMENT</p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Order queue</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>{orders.length} total orders</p>
        </div>
        <div className="page-search" style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', display: 'flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </span>
          <input type="text" placeholder="Search by order # or status..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', paddingRight: '14px', paddingTop: '10px', paddingBottom: '10px', width: '280px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      <div className="catalog-metrics order-metrics">
        <div className="catalog-metric"><span className="metric-mark metric-mark-coral" /><div><strong>{orders.length}</strong><span>All orders</span></div></div>
        <div className="catalog-metric"><span className="metric-mark metric-mark-amber" /><div><strong>{orders.filter(order => ['processing', 'shipped', 'pending'].includes(order.status)).length}</strong><span>Needs attention</span></div></div>
        <div className="catalog-metric"><span className="metric-mark metric-mark-green" /><div><strong>{orders.filter(order => order.status === 'delivered').length}</strong><span>Delivered</span></div></div>
      </div>

      <div className="glass-card catalog-table-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>⏳ Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🧾</div>
            No orders found.
          </div>
        ) : (
          <div className="table-scroll"><table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const itemsCount = order.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;
                return (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 700, fontSize: '0.875rem' }}>{order.orderNumber || `#${order._id.substring(0, 8)}`}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{order.userId || 'Guest'}</td>
                    <td style={{ fontSize: '0.875rem' }}>{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</td>
                    <td style={{ fontWeight: 700 }}>${order.totalPrice?.toLocaleString()}</td>
                    <td>
                      <Badge type={order.status === 'delivered' ? 'success' : order.status === 'processing' || order.status === 'shipped' ? 'warning' : order.status === 'cancelled' ? 'danger' : 'info'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="row-action row-action-edit"
                      >
                        View order
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}

export default Orders;
