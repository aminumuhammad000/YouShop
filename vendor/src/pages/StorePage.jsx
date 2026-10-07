import React, { useEffect, useState, useRef } from 'react';
import { getVendorProfile, updateVendorProfile, uploadVendorProfilePicture } from '../services/api';

const StorePage = ({ vendor }) => {
  const [form, setForm] = useState({
    storeName: '',
    businessCategory: '',
    phoneNumber: '',
    businessAddress: '',
    businessDescription: '',
    state: '',
    city: '',
    profilePicture: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getVendorProfile()
      .then((data) => {
        setForm({
          storeName: data.storeName || '',
          businessCategory: data.businessCategory || '',
          phoneNumber: data.phoneNumber || '',
          businessAddress: data.businessAddress || '',
          businessDescription: data.businessDescription || '',
          state: data.state || '',
          city: data.city || '',
          profilePicture: data.profilePicture || '',
        });
      })
      .catch(() => {
        setForm({
          storeName: vendor?.storeName || '',
          businessCategory: vendor?.businessCategory || '',
          phoneNumber: vendor?.phoneNumber || '',
          businessAddress: '',
          businessDescription: '',
          state: '',
          city: '',
          profilePicture: vendor?.profilePicture || '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const profileData = {
        storeName: form.storeName,
        businessCategory: form.businessCategory,
        phoneNumber: form.phoneNumber,
        businessAddress: form.businessAddress,
        businessDescription: form.businessDescription,
        state: form.state,
        city: form.city,
        profilePicture: form.profilePicture,
      };
      await updateVendorProfile(profileData);
      showToast('Storefront details updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', false);
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', false);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB', false);
      return;
    }

    // Create local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    console.log('Local preview created:', localPreview);

    setUploading(true);
    try {
      console.log('Calling uploadVendorProfilePicture...');
      const result = await uploadVendorProfilePicture(file);
      console.log('Upload result:', result);
      
      const pictureUrl = result.profilePicture || result.url;
      console.log('Setting profile picture URL:', pictureUrl);
      
      setForm(prev => ({ ...prev, profilePicture: pictureUrl }));
      
      // Update vendor session with new profile picture
      const currentSession = JSON.parse(localStorage.getItem('youshop_vendor_session') || '{}');
      const updatedSession = { ...currentSession, profilePicture: pictureUrl };
      localStorage.setItem('youshop_vendor_session', JSON.stringify(updatedSession));
      console.log('Session updated with profile picture');
      
      // Clean up local preview after successful upload
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
      
      const message = result.isLocal 
        ? 'Profile picture set (local preview - backend not connected)' 
        : 'Profile picture uploaded successfully!';
      showToast(message);
    } catch (err) {
      console.error('Upload error:', err);
      showToast(err.message || 'Failed to upload profile picture', false);
      // Clean up preview on error
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <div className="vendor-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <div className="auth-spinner" style={{ borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
      </div>
    );
  }

  return (
    <div className="vendor-content">
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, padding: '14px 22px', borderRadius: 14, background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.ok ? '#10B981' : '#EF4444'}`, color: toast.ok ? '#10B981' : '#EF4444', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          {toast.ok ? '✓ ' : '✕ '}{toast.msg}
        </div>
      )}

      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>Storefront Profile & Branding</h3>
            <p>Customize your public storefront visible to YouShop customers</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="form-grid">
          {/* Luxury Profile Picture Upload */}
          <div className="form-group full">
            <label className="label">Profile Picture</label>
            <div 
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 400,
                margin: '0 auto',
              }}
            >
              {/* Upload Area */}
              <div
                className="profile-picture-upload-card"
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  margin: '0 auto 20px',
                  background: (previewUrl || form.profilePicture)
                    ? 'transparent'
                    : 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                  border: '3px solid #14B8A6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 8px 32px rgba(20, 184, 166, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => { 
                  if (!uploading && !(previewUrl || form.profilePicture)) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(20, 184, 166, 0.4)';
                  }
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(20, 184, 166, 0.3)';
                }}
              >
                {(previewUrl || form.profilePicture) ? (
                  <img 
                    src={previewUrl || form.profilePicture} 
                    alt="Profile Preview" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>+</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 500, opacity: 0.9 }}>Upload</div>
                  </div>
                )}
                
                <div className="profile-picture-edit-overlay">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14.5 4H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5" />
                    <path d="m16 2 6 6" /><path d="m21 2-9 9" /><path d="M8 15h2l5-5" />
                  </svg>
                  <span>{uploading ? 'Uploading' : 'Change photo'}</span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              <div className="profile-upload-hint">
                <strong>{uploading ? 'Uploading your picture...' : 'Choose a storefront picture'}</strong>
                <span>PNG, JPG or WEBP · Maximum 5MB</span>
              </div>

            </div>
          </div>

          <div className="form-group">
            <label className="label">Store Public Name</label>
            <input type="text" className="input" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} placeholder="e.g. Apex Electronics & Tech" />
          </div>

          <div className="form-group">
            <label className="label">Primary Category</label>
            <input type="text" className="input" value={form.businessCategory} onChange={(e) => setForm({ ...form, businessCategory: e.target.value })} placeholder="e.g. Electronics & Gadgets" />
          </div>

          <div className="form-group">
            <label className="label">Support Phone Number</label>
            <input type="text" className="input" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+234 800 000 0000" />
          </div>

          <div className="form-group">
            <label className="label">Physical Fulfillment Address</label>
            <input type="text" className="input" value={form.businessAddress} onChange={(e) => setForm({ ...form, businessAddress: e.target.value })} placeholder="15 Admiralty Way, Lekki Phase 1" />
          </div>

          <div className="form-group">
            <label className="label">State</label>
            <input type="text" className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Lagos" />
          </div>

          <div className="form-group">
            <label className="label">City</label>
            <input type="text" className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Lekki" />
          </div>

          <div className="form-group full">
            <label className="label">Store Bio & Description</label>
            <textarea className="textarea" rows={4} value={form.businessDescription} onChange={(e) => setForm({ ...form, businessDescription: e.target.value })} placeholder="Describe your store and what makes you unique..." />
          </div>

          <div className="form-group full" style={{ marginTop: 10 }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Storefront Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StorePage;
