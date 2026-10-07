import React, { useEffect, useState } from 'react';
import { productsApi } from '../services/api';
import Badge from '../components/Badge';
import { showToast } from '../services/toast';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      const res = await productsApi.getAll();
      const products = res.data || [];
      setInventory(products);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStock = async (id, currentStock, change) => {
    const newStock = Math.max(0, (currentStock || 0) + change);
    
    setUpdatingId(id);
    try {
      await productsApi.update(id, { stock: newStock });
      setInventory(inventory.map(item => 
        (item._id === id || item.id === id) ? { ...item, stock: newStock } : item
      ));
    } catch (err) {
      console.error('Error updating stock:', err);
      showToast('Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="inventory-page" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="workspace-heading">
        <p className="page-eyebrow">OPERATIONS / STOCKROOM</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Inventory</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
          Track and adjust stock levels for your products.
        </p>
      </div>

      <div className="workspace-metrics">
        <div className="workspace-metric"><span className="metric-mark metric-mark-coral" /><div><strong>{inventory.length}</strong><span>Total SKUs</span></div></div>
        <div className="workspace-metric"><span className="metric-mark metric-mark-amber" /><div><strong>{inventory.filter(item => (item.stock || 0) > 0 && (item.stock || 0) <= 10).length}</strong><span>Low stock</span></div></div>
        <div className="workspace-metric"><span className="metric-mark metric-mark-green" /><div><strong>{inventory.filter(item => !(item.stock || 0)).length}</strong><span>Out of stock</span></div></div>
      </div>

      <div className="glass-card inventory-table-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Stock Levels</h3>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading inventory...</div>
        ) : inventory.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No products in inventory.</div>
        ) : (
          <div className="data-table-container table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU / ID</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Stock Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const stock = item.stock || 0;
                  const itemId = item._id || item.id;
                  const isUpdating = updatingId === itemId;
                  
                  return (
                    <tr key={itemId}>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{itemId.substring(0, 8)}...</td>
                      <td>{item.category || 'Uncategorized'}</td>
                      <td>
                        <Badge type={stock > 10 ? 'success' : stock > 0 ? 'warning' : 'danger'}>
                          {stock > 10 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock'}
                        </Badge>
                      </td>
                      <td style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        {stock}
                      </td>
                      <td>
                        <div className="stock-stepper" style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '4px 12px', fontSize: '1.2rem', lineHeight: 1 }}
                            onClick={() => handleUpdateStock(itemId, stock, -1)}
                            disabled={isUpdating || stock <= 0}
                          >
                            -
                          </button>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '4px 12px', fontSize: '1.2rem', lineHeight: 1 }}
                            onClick={() => handleUpdateStock(itemId, stock, 1)}
                            disabled={isUpdating}
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;
