import React, { useEffect, useState } from 'react';
import { getVendorOrders, updateOrderStatus } from '../services/api';

const formatMoney = (value) => `₦${Number(value || 0).toLocaleString()}`;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getVendorOrders();
      setOrders(data);
    } catch (error) {
      console.error('Orders fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      (o.orderNumber && o.orderNumber.toLowerCase().includes(search.toLowerCase())) ||
      (o.customerName && o.customerName.toLowerCase().includes(search.toLowerCase()));
    const matchesTab =
      activeTab === 'All' ||
      (o.status || '').toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <div className="vendor-content">
      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>Orders Fulfillment Board ({orders.length})</h3>
            <p>Track order lifecycle from placement through courier dispatch and completion</p>
          </div>
        </div>

        <div className="tab-row">
          {['All', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            className="input"
            placeholder="Search by customer name or order ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 360 }}
          />
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
            <div className="auth-spinner" style={{ margin: '0 auto 12px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
            Loading fulfillment board...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>No orders found for this tab.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Customer Details</th>
                  <th>Items & Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong style={{ color: '#0F172A', fontFamily: 'var(--vendor-font-display)' }}>
                        {order.orderNumber || order._id.slice(-6).toUpperCase()}
                      </strong>
                      <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{order.customerName || 'Customer'}</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748B' }}>{order.shippingAddress || 'Lagos Address'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--vendor-primary-hover)', fontFamily: 'var(--vendor-font-display)', fontSize: '1rem' }}>
                        {formatMoney(order.totalAmount)}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{(order.items || []).length} items</div>
                    </td>
                    <td>
                      <span className="badge active">{order.paymentMethod || 'Card'}</span>
                    </td>
                    <td>
                      <span className={`badge ${(order.status || 'placed').toLowerCase()}`}>
                        {order.status || 'Placed'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Fulfill / Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">ORDER DETAILS</span>
                <h3 style={{ margin: '4px 0 0' }}>Order #{selectedOrder.orderNumber || selectedOrder._id}</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div style={{ padding: 18, background: '#F8FAFC', borderRadius: 16, border: '1px solid var(--vendor-border)', marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 800 }}>CUSTOMER</span>
                    <strong style={{ display: 'block', color: '#0F172A', marginTop: 2 }}>{selectedOrder.customerName}</strong>
                    <span style={{ fontSize: '0.84rem', color: '#64748B' }}>{selectedOrder.customerPhone || '+234 800 000 0000'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 800 }}>SHIPPING ADDRESS</span>
                    <strong style={{ display: 'block', color: '#0F172A', marginTop: 2 }}>{selectedOrder.shippingAddress || 'Lagos, Nigeria'}</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="label" style={{ marginBottom: 8 }}>Transition Status</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`btn btn-sm ${selectedOrder.status === st ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleStatusChange(selectedOrder._id, st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 10px', fontSize: '0.94rem', fontWeight: 800 }}>Purchased Item(s)</h4>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--vendor-border-subtle)' }}>
                    <span>{item.name || 'Product'} x {item.quantity || 1}</span>
                    <strong>{formatMoney(item.price)}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
