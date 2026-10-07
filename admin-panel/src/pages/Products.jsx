import React, { useEffect, useState } from 'react';
import { productsApi } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    productsApi.getAll().then(r => setProducts(r.data || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await productsApi.delete(id).catch(console.error);
    setProducts(p => p.filter(x => x._id !== id));
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="catalog-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="catalog-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p className="page-eyebrow">CATALOG / INVENTORY</p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Product catalog</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>{products.length} items in your catalog</p>
        </div>
        <div className="catalog-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="page-search" style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', display: 'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '36px', paddingRight: '14px', paddingTop: '10px', paddingBottom: '10px', width: '220px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
          <Link to="/products/create" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <span aria-hidden="true">+</span> Add product
          </Link>
        </div>
      </div>

      <div className="catalog-metrics">
        <div className="catalog-metric"><span className="metric-mark metric-mark-coral" /><div><strong>{products.length}</strong><span>Total products</span></div></div>
        <div className="catalog-metric"><span className="metric-mark metric-mark-green" /><div><strong>{new Set(products.map(product => product.category).filter(Boolean)).size}</strong><span>Categories represented</span></div></div>
        <div className="catalog-metric catalog-metric-note"><span>Catalog health</span><strong>All systems normal</strong></div>
      </div>

      {/* Product Table Card */}
      <div className="glass-card catalog-table-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
            Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📦</div>
            No products found.
          </div>
        ) : (
          <div className="table-scroll"><table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100'}
                        alt={product.name}
                        style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border-color)', flexShrink: 0 }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{product.name}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '2px', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.description || 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(79,124,255,0.08)', color: '#4F7CFF', fontSize: '0.775rem', fontWeight: 600 }}>
                      {product.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>${product.price?.toLocaleString()}</td>
                  <td><Badge type="success">Active</Badge></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => navigate(`/products/edit/${product._id}`)}
                        className="row-action row-action-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="btn btn-danger"
                        style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}

export default Products;
