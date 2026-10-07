import React, { useEffect, useState, useRef } from 'react';
import { getVendorProducts, saveVendorProduct, deleteVendorProduct } from '../services/api';

const formatMoney = (value) => `₦${Number(value || 0).toLocaleString()}`;

const initialForm = {
  _id: null,
  name: '',
  category: 'Electronics',
  price: '',
  discountPrice: '',
  stock: '',
  sku: '',
  description: '',
  imageUrl: '',
  images: [],
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [urlInput, setUrlInput] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getVendorProducts();
      setProducts(data);
    } catch (error) {
      console.error('Products fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setForm({
      ...initialForm,
      sku: `YS-PRD-${Math.floor(100 + Math.random() * 900)}`,
      imageUrl: '',
      images: [],
    });
    setUrlInput('');
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    const existingImages = product.images && product.images.length > 0
      ? product.images
      : (product.imageUrl ? [product.imageUrl] : []);
    setForm({ ...product, images: existingImages });
    setUrlInput('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteVendorProduct(productToDelete);
      await fetchProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const processFiles = (files) => {
    if (!files || !files.length) return;
    const currentCount = (form.images || []).length;
    const availableSlots = 5 - currentCount;
    if (availableSlots <= 0) {
      alert('Maximum 5 images allowed per product.');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    filesToProcess.forEach((file) => {
      if (!file.type || !file.type.startsWith('image/')) return;
      
      // Validate file size (max 2MB per image to prevent request entity too large)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        alert(`Image "${file.name}" is too large. Maximum size is 2MB per image.`);
        return;
      }

      // Compress image by resizing if needed
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 800px width/height)
          const maxDimension = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with quality 0.7
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          setForm((prev) => {
            const updated = [...(prev.images || []), compressedDataUrl].slice(0, 5);
            return { ...prev, images: updated, imageUrl: updated[0] || '' };
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleAddUrl = () => {
    const trimmed = (urlInput || '').trim();
    if (!trimmed) return;
    if ((form.images || []).length >= 5) {
      alert('Maximum 5 images allowed per product.');
      return;
    }
    setForm((prev) => {
      const updated = [...(prev.images || []), trimmed].slice(0, 5);
      return { ...prev, images: updated, imageUrl: updated[0] || '' };
    });
    setUrlInput('');
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => {
      const updated = (prev.images || []).filter((_, i) => i !== index);
      return { ...prev, images: updated, imageUrl: updated[0] || '' };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        imageUrl: form.images && form.images.length > 0 ? form.images[0] : (form.imageUrl || ''),
      };
      await saveVendorProduct(payload);
      await fetchProducts();
      setShowModal(false);
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStock =
      stockFilter === 'All' ||
      (stockFilter === 'In Stock' && Number(p.stock) > 10) ||
      (stockFilter === 'Low Stock' && Number(p.stock) > 0 && Number(p.stock) <= 10) ||
      (stockFilter === 'Out of Stock' && Number(p.stock) === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="vendor-content">
      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>Product Inventory Catalog ({products.length})</h3>
            <p>Manage, inspect, and update live marketplace SKUs</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 12, border: '1px solid var(--vendor-border)' }}>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'table' ? '#0F172A' : '#64748B',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Table View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'grid' ? '#0F172A' : '#64748B',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Grid Cards
              </button>
            </div>
            <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
              + Add New SKU
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            className="input"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />
          <select className="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ width: 170 }}>
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Food">Food & Groceries</option>
            <option value="Home">Home & Living</option>
            <option value="Beauty">Beauty & Health</option>
          </select>
          <select className="select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} style={{ width: 160 }}>
            <option value="All">All Stock Levels</option>
            <option value="In Stock">In Stock (&gt;10)</option>
            <option value="Low Stock">Low Stock (1-10)</option>
            <option value="Out of Stock">Out of Stock (0)</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
            <div className="auth-spinner" style={{ margin: '0 auto 12px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
            Loading inventory...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>No products found matching filters.</div>
        ) : viewMode === 'table' ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category & SKU</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F8FAFC', border: '1px solid var(--vendor-border)', overflow: 'hidden', flexShrink: 0 }}>
                          <img
                            src={item.imageUrl || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80'}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{item.description ? item.description.slice(0, 45) + '...' : 'Premium YouShop item'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{item.category}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{item.sku || 'YS-PRD'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--vendor-primary-hover)', fontFamily: 'var(--vendor-font-display)', fontSize: '1.02rem' }}>
                        {formatMoney(item.price)}
                      </div>
                      {item.discountPrice && (
                        <div style={{ fontSize: '0.74rem', color: '#94A3B8', textDecoration: 'line-through' }}>{formatMoney(item.discountPrice)}</div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${Number(item.stock) === 0 ? 'cancelled' : Number(item.stock) <= 10 ? 'draft' : 'delivered'}`}>
                        {item.stock} in stock
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(item)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="product-grid-layout">
            {filtered.map((item) => (
              <div key={item._id} className="luxury-product-card">
                <div className="product-img-container">
                  <img
                    src={item.imageUrl || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80'}
                    alt={item.name}
                  />
                  <span className="badge active product-badge-float">{item.category}</span>
                </div>
                <div className="product-content-body">
                  <h4 className="product-title-text">{item.name}</h4>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: 12 }}>SKU: {item.sku || 'YS-PRD'} · Stock: {item.stock}</div>
                  <div className="product-meta-row">
                    <div className="product-price-val">{formatMoney(item.price)}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(item)}>Edit</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>✕</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">CATALOG INVENTORY</span>
                <h3 style={{ margin: '4px 0 0' }}>{form._id ? 'Edit Product SKU' : 'Create New Product SKU'}</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full">
                    <label className="label">Product Title</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Luxury Velvet Armchair / Wireless Earbuds"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Category</label>
                    <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Food">Food & Groceries</option>
                      <option value="Home">Home & Living</option>
                      <option value="Beauty">Beauty & Health</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="label">SKU Identifier</label>
                    <input
                      type="text"
                      className="input"
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Listing Price (₦)</label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g. 45000"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Units in Stock</label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g. 25"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group full">
                    <label className="label">Product Description</label>
                    <textarea
                      className="textarea"
                      placeholder="Highlight key features, material, warranty, and specifications..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group full">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label className="label" style={{ margin: 0, fontWeight: 650 }}>Product Photos & Gallery</label>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                        {(form.images || []).length} / 5 photos uploaded
                      </span>
                    </div>

                    {/* Hidden input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />

                    {/* Modern Drag & Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: isDragging ? '2px dashed #14B8A6' : '1.5px dashed #CBD5E1',
                        borderRadius: 16,
                        background: isDragging ? 'rgba(20,184,166,0.06)' : '#F8FAFC',
                        padding: '24px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom: 14,
                      }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(20,184,166,0.12)', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 650, color: '#0F172A', marginBottom: 3 }}>
                        Click to upload or drag & drop images
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                        PNG, JPG, or WEBP up to 2MB (Up to 5 images, auto-compressed)
                      </div>
                    </div>

                    {/* Image Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: 12, marginBottom: 12 }}>
                      {(form.images || []).map((img, i) => (
                        <div
                          key={i}
                          style={{
                            position: 'relative',
                            aspectRatio: '1/1',
                            borderRadius: 14,
                            overflow: 'hidden',
                            border: i === 0 ? '2px solid #14B8A6' : '1px solid #E2E8F0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                            background: '#0F172A',
                          }}
                        >
                          <img src={img} alt={`Product photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          {i === 0 && (
                            <span style={{ position: 'absolute', bottom: 6, left: 6, right: 6, background: 'rgba(20,184,166,0.92)', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 700, padding: '2px 4px', borderRadius: 6, textAlign: 'center', backdropFilter: 'blur(4px)' }}>
                              Cover Photo
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(i); }}
                            title="Remove image"
                            style={{
                              position: 'absolute',
                              top: 6,
                              right: 6,
                              background: 'rgba(15,23,42,0.75)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '50%',
                              width: 22,
                              height: 22,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#EF4444'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(15,23,42,0.75)'}
                          >
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}

                      {(form.images || []).length < 5 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            aspectRatio: '1/1',
                            borderRadius: 14,
                            border: '1.5px dashed #CBD5E1',
                            background: '#FFFFFF',
                            color: '#64748B',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#14B8A6'; e.currentTarget.style.color = '#14B8A6'; e.currentTarget.style.background = 'rgba(20,184,166,0.04)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = '#FFFFFF'; }}
                        >
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          <span style={{ fontSize: '0.72rem', fontWeight: 650 }}>+ Add Photo</span>
                        </button>
                      )}
                    </div>

                    {/* URL Option */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="url"
                        className="input"
                        style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                        placeholder="Or paste external image URL (https://...)"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={handleAddUrl}
                        disabled={!urlInput.trim()}
                        style={{ whiteSpace: 'nowrap', padding: '8px 14px', fontSize: '0.82rem' }}
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {form._id ? 'Update Product' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">CONFIRM DELETION</span>
                <h3 style={{ margin: '4px 0 0' }}>Delete Product?</h3>
              </div>
              <button type="button" className="modal-close" onClick={cancelDelete}>✕</button>
            </div>

            <div className="modal-body">
              <div style={{ 
                padding: 20, 
                borderRadius: 16, 
                background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', 
                border: '2px solid #FECACA',
                marginBottom: 20 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 12, 
                    background: 'rgba(239, 68, 68, 0.2)', 
                    color: '#DC2626', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#991B1B', fontSize: '1rem', marginBottom: 2 }}>
                      This action cannot be undone
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#B91C1C' }}>
                      The product will be permanently removed from your inventory
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={cancelDelete}
                  style={{ 
                    padding: '12px 24px',
                    borderRadius: 12,
                    fontSize: '0.9rem',
                    fontWeight: 700
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={confirmDelete}
                  style={{ 
                    padding: '12px 24px',
                    borderRadius: 12,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                    border: 'none',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  Yes, Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
