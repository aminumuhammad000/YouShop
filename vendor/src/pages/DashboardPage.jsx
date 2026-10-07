import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVendorDashboardData, updateOrderStatus } from '../services/api';
import { PackageIcon, XIcon } from '../components/Icons';

const formatMoney = (value) => `₦${Number(value || 0).toLocaleString()}`;

const DashboardPage = ({ vendor }) => {
  const [data, setData] = useState({
    products: [],
    orders: [],
    stats: { totalProducts: 0, totalOrders: 0, pendingOrders: 0, totalSales: 0, activeProducts: 0, trustScore: 4.95 },
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const payload = await getVendorDashboardData();
      setData(payload);
    } catch (error) {
      console.error('Dashboard fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    await fetchDashboard();
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const stats = [
    {
      label: 'Gross Revenue',
      value: formatMoney(data.stats.totalSales),
      trend: data.stats.totalSales > 0 ? 'Live from real orders' : 'No orders yet',
      trendClass: data.stats.totalSales > 0 ? 'positive' : 'neutral',
      iconClass: 'purple',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m-3-3l3 3 3-3m2.5-8H6.5a2.5 2.5 0 000 5h11a2.5 2.5 0 010 5H5" />
        </svg>
      ),
    },
    {
      label: 'Fulfilled Orders',
      value: String(data.stats.totalOrders),
      trend: `${data.stats.pendingOrders} pending dispatch`,
      trendClass: 'neutral',
      iconClass: 'emerald',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: 'Active Inventory',
      value: String(data.stats.activeProducts || data.stats.totalProducts),
      trend: data.stats.totalProducts > 0 ? `${data.stats.totalProducts} total SKUs` : 'No products yet',
      trendClass: data.stats.totalProducts > 0 ? 'positive' : 'neutral',
      iconClass: 'blue',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
    {
      label: 'Merchant Trust Score',
      value: `${data.stats.trustScore || '—'} / 5.0`,
      trend: 'Platform verified merchant',
      trendClass: 'positive',
      iconClass: 'amber',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.486-.412.87-.837.614L12 17.653l-4.704 2.89c-.425.256-.953-.128-.837-.614l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="vendor-content">
      <div className="luxury-hero-banner">
        <div className="hero-text-content">
          <div className="hero-pill-badge">
            <span>✦</span> Verified Merchant Storefront • Live
          </div>
          <h2 className="hero-title">
            Welcome back, {vendor?.storeName || vendor?.name || 'Merchant'}!
          </h2>
          <p className="hero-subtitle">
            {loading
              ? 'Loading your store data…'
              : data.stats.pendingOrders > 0
                ? <>Your store has <strong>{data.stats.pendingOrders} order(s)</strong> awaiting courier pickup.</>
                : 'Your storefront is live and accepting orders.'}
          </p>
        </div>

        <div className="hero-actions-row">
          <Link to="/vendor/products" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.12)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
            + Add New SKU
          </Link>
          <Link to="/vendor/orders" className="btn btn-primary">
            Dispatch Hub →
          </Link>
        </div>
      </div>

      <section className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-card-accent" />
            <div className="stat-head">
              <span className="stat-title">{stat.label}</span>
              <div className={`stat-icon-bg ${stat.iconClass}`}>{stat.icon}</div>
            </div>
            {loading ? (
              <div style={{ height: 40, background: 'rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 10, animation: 'pulse 1.5s infinite' }} />
            ) : (
              <p className="stat-value">{stat.value}</p>
            )}
            <div className="stat-footer">
              <span className={`trend-badge ${stat.trendClass}`}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: 24 }}>
        <div className="card-panel">
          <div className="section-header">
            <div className="section-title-group">
              <h3>Live Orders Stream</h3>
              <p>Real-time customer transactions</p>
            </div>
            <Link to="/vendor/orders" className="btn btn-secondary btn-sm">View All</Link>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
              <div className="auth-spinner" style={{ margin: '0 auto 12px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
              Loading orders...
            </div>
          ) : data.orders.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#14B8A6' }}>
                <PackageIcon size={44} />
              </div>
              <p style={{ fontWeight: 600, color: '#CBD5E1', marginBottom: 6 }}>No orders yet</p>
              <p style={{ fontSize: '0.85rem' }}>Orders placed by customers will appear here in real time.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.slice(0, 6).map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong style={{ fontFamily: 'var(--vendor-font-display)', color: '#E2E8F0' }}>
                          {order.orderNumber || order._id.slice(-6).toUpperCase()}
                        </strong>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(124,58,237,0.15)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                            {(order.customerName || 'C')[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#E2E8F0' }}>{order.customerName || 'Customer'}</div>
                            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{order.shippingAddress?.city || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td><strong style={{ color: '#E2E8F0' }}>{formatMoney(order.totalPrice)}</strong></td>
                      <td>
                        <span className={`badge ${(order.status || 'placed').toLowerCase()}`}>
                          {order.status || 'Placed'}
                        </span>
                      </td>
                      <td>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelectedOrder(order)}>
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-panel recent-order-card">
          <div className="section-header">
            <div className="section-title-group">
              <span className="eyebrow">LATEST ACTIVITY</span>
              <h3>ORDER DETAILS</h3>
              <p>Your most recently placed customer order</p>
            </div>
            <Link to="/vendor/orders" className="btn btn-secondary btn-sm">View Orders</Link>
          </div>

          {loading ? (
            <div className="recent-order-loading">Loading latest order...</div>
          ) : data.orders.length === 0 ? (
            <div className="recent-order-empty">
              <PackageIcon size={32} />
              <span>New orders will appear here when customers place them.</span>
            </div>
          ) : (
            <div className="recent-order-details">
              <div className="recent-order-customer">
                <div className="recent-order-avatar">{(data.orders[0].customerName || 'C')[0].toUpperCase()}</div>
                <div>
                  <strong>{data.orders[0].customerName || 'Customer'}</strong>
                  <span>{data.orders[0].orderNumber || data.orders[0]._id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
              <div className="recent-order-meta">
                <span>Total</span>
                <strong>{formatMoney(data.orders[0].totalPrice)}</strong>
              </div>
              <span className="badge placed">
                Placed
              </span>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelectedOrder(data.orders[0])}>
                Inspect
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">ORDER INSPECTION</span>
                <h3 style={{ margin: '4px 0 0' }}>Order {selectedOrder.orderNumber || selectedOrder._id}</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setSelectedOrder(null)}>
                <XIcon size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '14px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>CUSTOMER</div>
                  <strong style={{ fontSize: '1rem', color: '#F1F5F9' }}>{selectedOrder.customerName || 'Customer'}</strong>
                  <div style={{ fontSize: '0.84rem', color: '#94A3B8' }}>{selectedOrder.customerPhone || ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>ORDER AMOUNT</div>
                  <strong style={{ fontSize: '1.25rem', color: '#14B8A6', fontFamily: 'var(--vendor-font-display)' }}>
                    {formatMoney(selectedOrder.totalPrice)}
                  </strong>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div style={{ marginBottom: 16, fontSize: '0.87rem', color: '#94A3B8' }}>
                  <strong style={{ color: '#CBD5E1' }}>Delivery Address:</strong> {selectedOrder.shippingAddress}
                </div>
              )}

              <div style={{ marginBottom: 18 }}>
                <label className="label" style={{ marginBottom: 8 }}>Update Fulfillment Status</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {['placed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`btn btn-sm ${st === 'placed' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleStatusChange(selectedOrder._id, st)}
                    >
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedOrder.items || []).length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 10px', fontSize: '0.92rem', fontWeight: 800, color: '#E2E8F0' }}>Items in Order</h4>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#CBD5E1' }}>
                      <span>{item.name || 'Product'} × {item.qty || item.quantity || 1}</span>
                      <strong>{formatMoney(item.price)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
