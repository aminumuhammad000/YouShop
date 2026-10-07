import React, { useEffect, useState } from 'react';
import { adminApi, productsApi } from '../services/api';
import { showToast } from '../services/toast';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        adminApi.getCategories(),
        productsApi.getAll()
      ]);
      setCategories(catRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      console.error('Error fetching categories or products:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await adminApi.createCategory({ name: newCategoryName });
      setCategories([...categories, res.data]);
      setNewCategoryName('');
    } catch (err) {
      console.error('Error creating category:', err);
      showToast('Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await adminApi.deleteCategory(id);
      setCategories(categories.filter(c => c._id !== id && c.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      showToast('Failed to delete category');
    }
  };

  // Helper to count products in a category
  const getProductCount = (categoryName) => {
    return products.filter(p => p.category?.toLowerCase() === categoryName?.toLowerCase()).length;
  };

  return (
    <div className="category-page" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="workspace-heading">
        <p className="page-eyebrow">CATALOG / STRUCTURE</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Categories</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
          Organize your products by managing categories.
        </p>
      </div>

      <div className="workspace-metrics">
        <div className="workspace-metric"><span className="metric-mark metric-mark-coral" /><div><strong>{categories.length}</strong><span>Active categories</span></div></div>
        <div className="workspace-metric"><span className="metric-mark metric-mark-green" /><div><strong>{products.filter(product => product.category).length}</strong><span>Products organized</span></div></div>
        <div className="workspace-metric"><span className="metric-mark metric-mark-amber" /><div><strong>{products.filter(product => !product.category).length}</strong><span>Uncategorized products</span></div></div>
      </div>

      <div className="category-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 0.8fr) minmax(0, 2fr)', gap: '24px', alignItems: 'start' }}>
        {/* Create Form */}
        <div className="glass-card category-create-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Add New Category</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category Name</label>
              <input
                type="text"
                className="input-field"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Electronics"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="glass-card category-list-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Category List</h3>
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading categories...</div>
          ) : categories.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No categories created yet.</div>
          ) : (
            <div className="data-table-container">
              <div className="table-scroll"><table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Products</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id || cat.id}>
                      <td style={{ fontWeight: 600 }}>{cat.name}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          background: 'var(--bg-app)', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem', 
                          color: 'var(--text-secondary)' 
                        }}>
                          {getProductCount(cat.name)} products
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDelete(cat._id || cat.id)}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories;
