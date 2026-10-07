import React, { useEffect, useState } from 'react';
import VendorLayout from '../components/layout/VendorLayout';
import { getVendorDashboardData } from '../services/api';

const formatMoney = (value) => `₦${Number(value || 0).toLocaleString()}`;

const VendorDashboard = ({ vendor, onLogout }) => {
  const [data, setData] = useState({
    products: [],
    orders: [],
    stats: { totalProducts: 0, totalOrders: 0, pendingOrders: 0, totalSales: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendorDashboardData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Sales', value: formatMoney(data.stats.totalSales), trend: 'Real-time sales' },
    { label: 'Orders', value: String(data.stats.totalOrders), trend: `${data.stats.pendingOrders} pending` },
    { label: 'Products', value: String(data.stats.totalProducts), trend: 'Active products' },
  ];

  return (
    <VendorLayout vendor={vendor} onLogout={onLogout} title="Dashboard Overview">
      <div className="vendor-content">
        <section className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-head">
                <span>{stat.label}</span>
              </div>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-trend">{stat.trend}</p>
            </div>
          ))}
        </section>

        <section className="card-panel">
          <div className="section-header">
            <h3>Recent Orders</h3>
          </div>
          <div className="table-wrap">
            {data.orders.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#64748b' }}>No orders found on the server.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.slice(0, 5).map((order) => (
                    <tr key={order._id || order.orderNumber}>
                      <td>{order.orderNumber || order._id}</td>
                      <td>{order.customerName || 'Customer'}</td>
                      <td>{formatMoney(order.totalPrice || 0)}</td>
                      <td><span className={`badge ${(order.status || 'placed').toLowerCase()}`}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;
