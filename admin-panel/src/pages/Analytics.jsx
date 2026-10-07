import React, { useEffect, useState } from 'react';
import { adminApi, productsApi, ordersApi } from '../services/api';

function Analytics() {
  const [stats, setStats] = useState({ totalRevenue: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [statsRes, prodRes, ordRes] = await Promise.all([
          adminApi.getStats(),
          productsApi.getAll(),
          ordersApi.getAll()
        ]);

        const totalRevenue = statsRes.data?.totalRevenue || 0;
        setStats({ totalRevenue });

        const products = prodRes.data || [];
        const orders = ordRes.data || [];

        // Estimate revenue by category based on products available (simple distribution if no order items)
        const catMap = {};
        products.forEach(p => {
          const cat = p.category || 'Other';
          if (!catMap[cat]) catMap[cat] = 0;
          catMap[cat] += p.price || 0;
        });

        const catChartData = Object.keys(catMap).map(cat => ({
          name: cat,
          value: catMap[cat]
        })).sort((a, b) => b.value - a.value).slice(0, 5); // top 5

        setCategoryData(catChartData);

        // Conversion funnel based on orders length
        const completedPurchases = orders.length;
        const addTOCartEstimate = completedPurchases * 3;
        const siteVisitsEstimate = completedPurchases * 10;

        setFunnelData([
          { step: 'Site Visits', count: siteVisitsEstimate, color: '#4F7CFF' },
          { step: 'Add to Cart', count: addTOCartEstimate, color: '#00C2FF' },
          { step: 'Completed Purchases', count: completedPurchases, color: '#22C55E' }
        ]);

      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="analytics-page" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="workspace-heading">
        <p className="page-eyebrow">INSIGHTS / PERFORMANCE</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Analytics & Reports</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
          Deep dive into your store's performance metrics.
        </p>
      </div>

      <div className="workspace-metrics analytics-metrics">
        <div className="workspace-metric"><span className="metric-mark metric-mark-coral" /><div><strong>${stats.totalRevenue.toLocaleString()}</strong><span>Tracked revenue</span></div></div>
        <div className="workspace-metric"><span className="metric-mark metric-mark-green" /><div><strong>{categoryData.length}</strong><span>Top categories</span></div></div>
        <div className="workspace-metric"><span className="metric-mark metric-mark-amber" /><div><strong>{funnelData.length ? `${Math.round((funnelData[funnelData.length - 1].count / Math.max(funnelData[0].count, 1)) * 100)}%` : '0%'}</strong><span>Estimated conversion</span></div></div>
      </div>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading analytics...</div>
      ) : (
        <div className="analytics-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Revenue Breakdown */}
          <div className="glass-card analytics-panel analytics-category-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px' }}>
              Category Value Breakdown
            </h3>
            
            {categoryData.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No category data available</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {categoryData.map((cat, i) => {
                  const max = Math.max(...categoryData.map(c => c.value));
                  const percentage = max > 0 ? (cat.value / max) * 100 : 0;
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{cat.name}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>${cat.value.toLocaleString()}</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${percentage}%`, 
                          height: '100%', 
                          background: i === 0 ? '#4F7CFF' : i === 1 ? '#00C2FF' : '#6C63FF',
                          borderRadius: '4px'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Conversion Funnel */}
          <div className="glass-card analytics-panel analytics-funnel-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px' }}>
              Conversion Funnel (Estimated)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', marginTop: '20px' }}>
              {funnelData.map((step, i) => {
                const width = 100 - (i * 20); // 100%, 80%, 60%
                return (
                  <div key={i} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      width: `${width}%`, 
                      padding: '12px', 
                      background: `${step.color}20`, 
                      border: `1px solid ${step.color}`,
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{step.step}</span>
                      <span style={{ fontWeight: 800, color: step.color }}>{step.count.toLocaleString()}</span>
                    </div>
                    {i < funnelData.length - 1 && (
                      <div style={{ width: '2px', height: '20px', background: 'var(--border-color)', margin: '4px 0' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
