import React, { useEffect, useState } from 'react';
import { productsApi, ordersApi, adminApi } from '../services/api';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge';

// Animated counter hook
function useCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCard({ title, value, icon, color, change, prefix = '', suffix = '' }) {
  const count = useCounter(typeof value === 'number' ? value : 0);
  return (
    <div className="glass-card stat-card" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px', letterSpacing: '-1px' }}>
            {prefix}{typeof value === 'number' ? count.toLocaleString() : value}{suffix}
          </p>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
      {change && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
          <span style={{ color: change > 0 ? '#22C55E' : '#EF4444' }}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>vs last week</span>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ usersCount: 0, productsCount: 0, ordersCount: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, ordRes, logsRes] = await Promise.all([
          adminApi.getStats(),
          ordersApi.getAll(),
          adminApi.getLogs()
        ]);
        
        setStats(statsRes.data || { usersCount: 0, productsCount: 0, ordersCount: 0, totalRevenue: 0 });
        
        const orders = ordRes.data || [];
        setRecentOrders([...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
        
        const logs = logsRes.data || [];
        const acts = [...logs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6).map(log => ({
          text: log.action || 'System event',
          time: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: log.level === 'error' ? 'error' : log.level === 'warn' ? 'warning' : 'info'
        }));
        
        setActivities(acts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="dashboard-page" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Title */}
      <div className="dashboard-heading">
        <div>
          <p className="dashboard-eyebrow">STORE PULSE / TODAY</p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Good morning, Admin.</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <Link className="dashboard-action" to="/products/create">+ Add product</Link>
      </div>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading dashboard...</div>
      ) : (
        <>
          {/* KPI Stat Cards */}
          <div className="dashboard-grid">
            <StatCard 
              title="Total Revenue" 
              value={stats.totalRevenue} 
              prefix="$" 
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F7CFF" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} 
              color="#4F7CFF" 
            />
            <StatCard 
              title="Total Orders" 
              value={stats.ordersCount} 
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>} 
              color="#6C63FF" 
            />
            <StatCard 
              title="Active Products" 
              value={stats.productsCount} 
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>} 
              color="#00C2FF" 
            />
            <StatCard 
              title="Total Customers" 
              value={stats.usersCount} 
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} 
              color="#22C55E" 
            />
          </div>

          {/* Middle Section: Chart + Activity */}
          <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Revenue Chart */}
            <div className="glass-card dashboard-revenue" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Revenue Overview</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Weekly performance breakdown</p>
                </div>
                <select style={{ padding: '7px 12px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.8rem', fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>

              <svg viewBox="0 0 800 220" style={{ width: '100%', height: '180px' }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F7CFF" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4F7CFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[50, 100, 150].map(y => (
                  <line key={y} x1="40" y1={y} x2="780" y2={y} stroke="var(--border-color)" strokeWidth="1" />
                ))}
                {/* Area fill */}
                <path
                  d="M 40,175 L 155,130 L 270,155 L 385,95 L 500,115 L 615,60 L 730,75 L 730,195 L 40,195 Z"
                  fill="url(#revGrad)"
                />
                {/* Line */}
                <polyline
                  fill="none"
                  stroke="#4F7CFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="40,175 155,130 270,155 385,95 500,115 615,60 730,75"
                />
                {/* Data points */}
                {[40, 155, 270, 385, 500, 615, 730].map((x, i) => {
                  const ys = [175, 130, 155, 95, 115, 60, 75];
                  return <circle key={i} cx={x} cy={ys[i]} r="5" fill="#fff" stroke="#4F7CFF" strokeWidth="2.5" />;
                })}
                {/* Day labels */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                  <text key={d} x={(i * 115) + 40} y="215" fill="var(--text-secondary)" fontSize="12" textAnchor="middle" fontFamily="Inter">{d}</text>
                ))}
              </svg>
            </div>

            {/* Activity Feed */}
            <div className="glass-card dashboard-activity" style={{ display: 'flex', flexDirection: 'column', height: '340px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>Recent Activity</h3>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
                {activities.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px', fontSize: '0.85rem' }}>No recent activity.</div>
                ) : (
                  activities.map((act, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i < activities.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px', flexShrink: 0,
                        background: act.type === 'error' ? '#EF4444' : act.type === 'warning' ? '#F59E0B' : '#4F7CFF'
                      }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{act.text}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{act.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="glass-card dashboard-orders" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Orders</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Latest purchases from your store</p>
              </div>
              <Link to="/orders" style={{
                padding: '8px 16px',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '0.825rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}>
                View All &rarr;
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No recent orders yet.</div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order._id}>
                        <td style={{ fontWeight: 600 }}>{order.orderNumber || order._id}</td>
                        <td>
                          <Badge type={order.status === 'delivered' ? 'success' : order.status === 'processing' || order.status === 'shipped' ? 'warning' : order.status === 'cancelled' ? 'danger' : 'info'}>
                            {order.status || 'pending'}
                          </Badge>
                        </td>
                        <td style={{ fontWeight: 600 }}>${(order.totalPrice || 0).toLocaleString()}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/orders/${order._id}`} style={{ color: '#4F7CFF', textDecoration: 'none', fontSize: '0.825rem', fontWeight: 600 }}>View &rarr;</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
