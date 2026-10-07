import React, { useState } from 'react';
import { productsApi, ordersApi } from '../services/api';
import { showToast } from '../services/toast';

function Reports() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('sales');

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      let csvContent = "";
      
      if (reportType === 'sales') {
        const res = await ordersApi.getAll();
        const orders = res.data || [];
        
        csvContent = "Order ID,Date,Status,Total Amount\n";
        orders.forEach(o => {
          const id = o.orderNumber || o._id;
          const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A';
          const status = o.status || 'N/A';
          const total = o.totalPrice || 0;
          csvContent += `"${id}","${date}","${status}","${total}"\n`;
        });
      } else if (reportType === 'inventory') {
        const res = await productsApi.getAll();
        const products = res.data || [];
        
        csvContent = "Product Name,Category,Price,Stock Level\n";
        products.forEach(p => {
          csvContent += `"${p.name}","${p.category || 'N/A'}","${p.price}","${p.stock || 0}"\n`;
        });
      }

      if (!csvContent) {
        showToast('No data available for this report.', 'info');
        return;
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating report:', err);
      showToast('Failed to generate report.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="reports-page" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="workspace-heading">
        <p className="page-eyebrow">INSIGHTS / EXPORT STUDIO</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Export Reports</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
          Generate and download CSV reports of your store's data.
        </p>
      </div>

      <div className="glass-card reports-studio" style={{ padding: '32px', maxWidth: '720px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Select Report Type
            </label>
            <div className="report-choice-grid" style={{ display: 'flex', gap: '16px' }}>
              <label className={`report-choice ${reportType === 'sales' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="reportType" 
                  value="sales" 
                  checked={reportType === 'sales'} 
                  onChange={(e) => setReportType(e.target.value)} 
                />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sales & Orders</span>
              </label>
              
              <label className={`report-choice ${reportType === 'inventory' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="reportType" 
                  value="inventory" 
                  checked={reportType === 'inventory'} 
                  onChange={(e) => setReportType(e.target.value)} 
                />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Inventory Levels</span>
              </label>
            </div>
          </div>

          <div className="report-description" style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {reportType === 'sales' 
                ? "This report includes all historical orders, their statuses, dates, and total amounts. Useful for financial auditing." 
                : "This report provides a snapshot of your current product catalog, including pricing and current stock levels."}
            </p>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleDownload} 
            disabled={isGenerating}
            className="report-download-button"
            style={{ alignSelf: 'flex-start', padding: '10px 24px' }}
          >
            {isGenerating ? 'Generating CSV...' : 'Download Report CSV'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;
