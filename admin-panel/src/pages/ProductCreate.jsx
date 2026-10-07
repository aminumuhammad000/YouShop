import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsApi } from '../services/api';

function ProductCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({ name: '', price: '', category: 'Food', description: '', images: [] });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      productsApi.getById(id).then(r => {
        const d = r.data;
        const images = Array.isArray(d.images) && d.images.length ? d.images : (d.imageUrl ? [d.imageUrl] : []);
        setForm({ name: d.name || '', price: d.price || '', category: d.category || 'Food', description: d.description || '', images });
      }).catch(() => setError('Failed to load product.'));
    }
  }, [id, isEdit]);

  useEffect(() => () => {
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
  }, [imagePreviews]);

  const applyImageFiles = (files) => {
    const incomingFiles = Array.from(files || []);
    const availableSlots = 3 - form.images.length - imageFiles.length;
    const selectedFiles = incomingFiles
      .filter(file => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024)
      .slice(0, Math.max(availableSlots, 0));
    if (incomingFiles.length > availableSlots) setError('You can add up to 3 images.');
    else if (selectedFiles.length !== incomingFiles.length) setError('Only image files up to 5MB are accepted.');
    else setError('');
    setImageFiles(current => [...current, ...selectedFiles]);
    setImagePreviews(current => [...current, ...selectedFiles.map(file => URL.createObjectURL(file))]);
  };

  const handleImageChange = (event) => {
    applyImageFiles(event.target.files);
    event.target.value = '';
  };

  const handleImageDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    applyImageFiles(event.dataTransfer.files);
  };

  const removeImage = (index) => {
    if (index < form.images.length) {
      setForm(current => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }));
      return;
    }
    const fileIndex = index - form.images.length;
    setImageFiles(files => files.filter((_, currentIndex) => currentIndex !== fileIndex));
    setImagePreviews(previews => previews.filter((_, currentIndex) => currentIndex !== fileIndex));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) { setError('Name and Price are required.'); return; }
    setLoading(true); setError('');
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('price', Number(form.price));
      data.append('category', form.category);
      data.append('description', form.description);
      data.append('existingImages', JSON.stringify(form.images));
      imageFiles.forEach(file => data.append('images', file));
      if (isEdit) await productsApi.update(id, data);
      else await productsApi.create(data);
      setSuccess(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
      setTimeout(() => navigate('/products'), 1200);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1040px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div className="product-form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="page-eyebrow">CATALOG / {isEdit ? 'EDIT ITEM' : 'NEW ITEM'}</p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            {isEdit ? 'Edit product' : 'Add new product'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
            {isEdit ? 'Update the product details below' : 'Fill in the details to add a new catalog item'}
          </p>
        </div>
        <button onClick={() => navigate('/products')} className="form-cancel-button">
          Cancel
        </button>
      </div>

      {/* Alerts */}
      {error && <div className="form-alert form-alert-error">{error}</div>}
      {success && <div className="form-alert form-alert-success">{success}</div>}

      <form className="product-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(280px, 0.9fr)', gap: '24px', alignItems: 'start' }}>
        {/* Left Fields */}
        <div className="glass-card product-form-fields" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-section-heading">
            <span className="form-section-number">01</span>
            <div><h2>Product details</h2><p>Give customers the information they need to buy.</p></div>
          </div>
          <div className="input-group">
            <label>Product Name *</label>
            <input type="text" id="name" className="input-field" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Spicy Chicken Suya" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label>Price (₦/$) *</label>
              <input type="number" id="price" className="input-field" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" min="0" step="0.01" required />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select id="category" className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="Food">Food / Meals</option>
                <option value="Drinks">Drinks</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea id="description" className="input-field" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows="5" placeholder="Describe this product in detail..." style={{ resize: 'vertical' }}></textarea>
          </div>
        </div>

        {/* Right Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card product-preview-panel">
            <div className="image-upload-heading"><div><p>Product gallery</p><span>{form.images.length + imagePreviews.length ? 'Add more product angles' : 'Upload up to 3 images'}</span></div><strong>{form.images.length + imagePreviews.length}/3</strong></div>
            {!form.images.length && !imagePreviews.length && <label
              className={`image-upload-dropzone ${isDragging ? 'is-dragging' : ''}`}
              onDragEnter={event => { event.preventDefault(); setIsDragging(true); }}
              onDragOver={event => event.preventDefault()}
              onDragLeave={event => { if (event.currentTarget === event.target) setIsDragging(false); }}
              onDrop={handleImageDrop}
            >
              <input type="file" accept="image/*" multiple onChange={handleImageChange} />
              <span className="product-preview-icon" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /><path d="M12 12v6M9 15h6" /></svg></span>
              <span className="image-upload-title">{isDragging ? 'Drop images here' : 'Drop images here or browse'}</span>
              <span className="image-upload-help">PNG, JPG or WEBP · up to 3 images · max 5MB each</span>
            </label>}
            {(imagePreviews.length || form.images.length) > 0 && (
              <div className="image-preview-grid">
                {[...form.images, ...imagePreviews].map((preview, index) => (
                  <div className="image-preview-tile" key={`${preview}-${index}`}>
                    <img src={preview} alt={`Product preview ${index + 1}`} />
                    <button type="button" onClick={() => removeImage(index)} aria-label={`Remove image ${index + 1}`}>×</button>
                    {index === 0 && <span>Primary</span>}
                  </div>
                ))}
                {form.images.length + imagePreviews.length < 3 && <label className="image-add-tile" aria-label="Add another image">
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                  <span>+</span>
                  <small>Add image</small>
                </label>}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary product-submit" disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}>
            {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Publish product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductCreate;
