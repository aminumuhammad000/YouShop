import React, { useEffect, useState, useRef } from 'react';
import { getDriverProfileData, saveDriverProfile, uploadDriverProfilePicture } from '../services/api';
import { ShieldCheckIcon, CheckIcon, XIcon } from '../components/Icons';

const DriverProfilePage = ({ driver }) => {
  const [form, setForm] = useState({
    name: driver?.name || '',
    phoneNumber: driver?.phoneNumber || driver?.phone || '',
    email: driver?.email || '',
    vehicleType: driver?.vehicleType || 'Motorcycle',
    plateNumber: driver?.plateNumber || '',
    licenseNumber: driver?.licenseNumber || '',
    city: driver?.driverCity || driver?.city || 'Lagos',
    profilePicture: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getDriverProfileData()
      .then((data) => {
        setForm({
          name: data.name || driver?.name || '',
          phoneNumber: data.phoneNumber || data.phone || driver?.phoneNumber || '',
          email: data.email || driver?.email || '',
          vehicleType: data.vehicleType || driver?.vehicleType || 'Motorcycle',
          plateNumber: data.plateNumber || driver?.plateNumber || '',
          licenseNumber: data.licenseNumber || driver?.licenseNumber || '',
          city: data.driverCity || data.city || driver?.driverCity || 'Lagos',
          profilePicture: data.profilePicture || driver?.profilePicture || '',
        });
      })
      .catch(() => {})
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
        name: form.name,
        phoneNumber: form.phoneNumber,
        email: form.email,
        vehicleType: form.vehicleType,
        plateNumber: form.plateNumber,
        licenseNumber: form.licenseNumber,
        city: form.city,
        profilePicture: form.profilePicture,
      };
      await saveDriverProfile(profileData);
      showToast('Profile and vehicle credentials updated successfully!');
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
      console.log('Calling uploadDriverProfilePicture...');
      const result = await uploadDriverProfilePicture(file);
      console.log('Upload result:', result);
      
      const pictureUrl = result.profilePicture || result.url;
      console.log('Setting profile picture URL:', pictureUrl);
      
      setForm(prev => ({ ...prev, profilePicture: pictureUrl }));
      
      // Update driver session with new profile picture
      const currentSession = JSON.parse(localStorage.getItem('youshop_driver_session') || '{}');
      const updatedSession = { ...currentSession, profilePicture: pictureUrl };
      localStorage.setItem('youshop_driver_session', JSON.stringify(updatedSession));
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

  return (
    <div className="vendor-content">
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            padding: '14px 22px',
            borderRadius: 14,
            background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${toast.ok ? '#10B981' : '#EF4444'}`,
            color: toast.ok ? '#10B981' : '#EF4444',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {toast.ok ? <CheckIcon size={16} /> : <XIcon size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#64748B' }}>
          <div className="auth-spinner" style={{ margin: '0 auto 16px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
          Loading profile...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.8fr)', gap: 24 }}>
          <div className="card-panel" style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: (previewUrl || form.profilePicture)
                  ? 'transparent'
                  : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 900,
                margin: '0 auto 16px',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                border: '3px solid #8B5CF6',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s ease',
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
                (form.name || 'D')[0].toUpperCase()
              )}
            </div>
            
            {/* Luxury Profile Picture Upload */}
            <div style={{ marginBottom: 20 }}>
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 300,
                  margin: '0 auto',
                }}
              >
                {/* Upload Area */}
                <div
                  className="profile-picture-upload-card driver-upload-card"
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    margin: '0 auto 16px',
                    background: (previewUrl || form.profilePicture)
                      ? 'transparent'
                      : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    border: '3px solid #8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => { 
                    if (!uploading && !(previewUrl || form.profilePicture)) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.3)';
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
                      <div style={{ fontSize: '1.5rem', marginBottom: 2 }}>+</div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 500, opacity: 0.9 }}>Upload</div>
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
                  <strong>{uploading ? 'Uploading your picture...' : 'Choose a driver profile picture'}</strong>
                  <span>PNG, JPG or WEBP · Maximum 5MB</span>
                </div>

              </div>
            </div>
            
            <h3 style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: 800 }}>
              {form.name || 'Driver Partner'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>{form.city}</p>
            <div style={{ marginTop: 14 }}>
              <span className="badge active" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheckIcon size={14} />
                <span>Verified Dispatch Pilot</span>
              </span>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: 18,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#64748B',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                DISPATCH COMPLIANCE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Driver License:</span>
                  <strong style={{ color: form.licenseNumber ? '#10B981' : '#F59E0B' }}>
                    {form.licenseNumber ? 'Active' : 'Pending'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Vehicle Plate:</span>
                  <strong style={{ color: form.plateNumber ? '#10B981' : '#F59E0B' }}>
                    {form.plateNumber || 'Not provided'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Background Check:</span>
                  <strong style={{ color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span>Passed</span>
                    <CheckIcon size={14} />
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="card-panel">
            <div className="section-header">
              <div className="section-title-group">
                <h3>Vehicle &amp; Pilot Credentials</h3>
                <p>Maintain your official registration details with YouShop Logistics</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="form-grid">
              <div className="form-group">
                <label className="label">Full Legal Name</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="label">Phone Number</label>
                <input
                  type="text"
                  className="input"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="label">Vehicle Type</label>
                <input
                  type="text"
                  className="input"
                  value={form.vehicleType}
                  onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                  placeholder="e.g. Motorcycle"
                />
              </div>
              <div className="form-group">
                <label className="label">Vehicle Plate Number</label>
                <input
                  type="text"
                  className="input"
                  value={form.plateNumber}
                  onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
                  placeholder="e.g. LND-882-AG"
                />
              </div>
              <div className="form-group">
                <label className="label">License Number</label>
                <input
                  type="text"
                  className="input"
                  value={form.licenseNumber}
                  onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                  placeholder="e.g. DL-982188401"
                />
              </div>
              <div className="form-group">
                <label className="label">Operating City / Zone</label>
                <input
                  type="text"
                  className="input"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Lagos"
                />
              </div>
              <div className="form-group full" style={{ marginTop: 10 }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                  {saving ? 'Saving Changes...' : 'Save Vehicle & Pilot Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverProfilePage;
