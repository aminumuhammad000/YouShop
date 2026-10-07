import React, { useEffect, useState } from 'react';
import {
  getDriverDashboardData,
  acceptDelivery,
  updateDriverDeliveryStatus,
  verifyDriverOtp,
  submitDriverEmergencyReport,
} from '../services/api';
import {
  MapPinIcon,
  PackageIcon,
  RocketIcon,
  CheckCircleIcon,
  CheckIcon,
  AlertTriangleIcon,
  RadarIcon,
  StarIcon,
  XIcon,
} from '../components/Icons';

const DriverDashboardPage = ({ driver }) => {
  const [data, setData] = useState({ stats: null, deliveries: [] });
  const [loading, setLoading] = useState(true);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyOtpInput, setVerifyOtpInput] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [issueType, setIssueType] = useState('Customer Unreachable');
  const [issueDesc, setIssueDesc] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getDriverDashboardData();
      setData(res);
    } catch (err) {
      console.error('Failed to load driver dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (id) => {
    setActionLoading(id);
    try {
      await acceptDelivery(id);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to accept delivery');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setActionLoading(id);
    try {
      await updateDriverDeliveryStatus(id, newStatus);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setVerifyError('');
    const deliveries = data.deliveries || [];
    const active = deliveries.find(
      (d) => d.status === 'On the Way' || d.status === 'Picked Up' || d.status === 'Accepted'
    );
    if (!active) return;
    try {
      await verifyDriverOtp(active._id, verifyOtpInput.trim());
      setVerifySuccess({ timestamp: new Date().toISOString() });
      setTimeout(() => {
        setShowVerifyModal(false);
        setVerifySuccess(null);
        setVerifyOtpInput('');
        loadData();
      }, 1600);
    } catch (err) {
      setVerifyError(err.message || 'Invalid delivery PIN. Ask the customer for their code.');
    }
  };

  const handleReportSupport = async (e) => {
    e.preventDefault();
    if (!issueDesc.trim()) return;
    await submitDriverEmergencyReport({ type: issueType, description: issueDesc });
    alert('Emergency ticket submitted to YouShop Support! Dispatch control will contact you.');
    setShowSupportModal(false);
    setIssueDesc('');
  };

  const deliveries = data.deliveries || [];
  const stats = data.stats || {};
  const activeDelivery = deliveries.find(
    (d) =>
      d.status === 'Accepted' ||
      d.status === 'Arrived at Pickup' ||
      d.status === 'Picked Up' ||
      d.status === 'On the Way'
  );
  const availableDeliveries = deliveries.filter((d) => d.status === 'Available');
  const recentDelivery = deliveries
    .filter((d) => d.status !== 'Available')
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))[0];

  return (
    <div className="vendor-content">
      {/* Top Metric Cards with Liquid Hover */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-accent" />
          <div className="stat-head">
            <span className="stat-title">Today's Earnings</span>
            <div className="stat-icon-bg emerald">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          {loading ? (
            <div style={{ height: 36, background: 'rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 8 }} />
          ) : (
            <div className="stat-value">&#8358;{Number(stats.todayEarned || 0).toLocaleString()}</div>
          )}
          <div className="stat-footer">
            <span className="trend-badge positive">Shift earnings recorded</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent" />
          <div className="stat-head">
            <span className="stat-title">Nearby Dispatch</span>
            <div className="stat-icon-bg amber">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{loading ? '—' : `${availableDeliveries.length} Available`}</div>
          <div className="stat-footer">
            <span className="trend-badge positive">Live Radar Active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent" />
          <div className="stat-head">
            <span className="stat-title">Completed Drops</span>
            <div className="stat-icon-bg purple">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{loading ? '—' : stats.completedTrips || 0}</div>
          <div className="stat-footer">
            <span className="trend-badge neutral">All-time verified dropoffs</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent" />
          <div className="stat-head">
            <span className="stat-title">Pilot Rating</span>
            <div className="stat-icon-bg blue">
              <StarIcon size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {loading ? '—' : `${stats.driverRating || driver?.rating || 5.0}`}
            <StarIcon size={18} style={{ color: '#F59E0B' }} />
          </div>
          <div className="stat-footer">
            <span className="trend-badge positive">YouShop Verified Courier</span>
          </div>
        </div>
      </div>

      {/* Active Mission Banner with Liquid Action Buttons */}
      {!loading && activeDelivery && (
        <div className="driver-mission-card">
          <div className="driver-mission-header">
            <div>
              <span className="mission-code-badge">
                ACTIVE MISSION · {(activeDelivery.status || '').toUpperCase()}
              </span>
              <h3 style={{ margin: '8px 0 0', fontSize: '1.45rem', fontWeight: 800 }}>
                Order {activeDelivery.orderNumber}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2DD4BF', fontFamily: 'var(--vendor-font-display)' }}>
                +&#8358;{Number(activeDelivery.deliveryFee).toLocaleString()}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block' }}>
                Guaranteed Payout on PIN Confirmation
              </span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
                  Customer
                </span>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#FFFFFF', marginTop: 2 }}>
                  {activeDelivery.customerName}
                </strong>
                {activeDelivery.customerPhone && (
                  <span style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>{activeDelivery.customerPhone}</span>
                )}
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
                  Delivery Destination
                </span>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: '#E2E8F0', marginTop: 2 }}>
                  {activeDelivery.deliveryAddress}
                </strong>
              </div>
            </div>
          </div>

          {/* Liquid Control Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {activeDelivery.status === 'Accepted' && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleStatusUpdate(activeDelivery._id, 'Arrived at Pickup')}
                disabled={actionLoading === activeDelivery._id}
              >
                <MapPinIcon size={16} />
                <span>{actionLoading === activeDelivery._id ? 'Updating...' : 'Mark Arrived at Store'}</span>
              </button>
            )}
            {activeDelivery.status === 'Arrived at Pickup' && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleStatusUpdate(activeDelivery._id, 'Picked Up')}
                disabled={actionLoading === activeDelivery._id}
              >
                <PackageIcon size={16} />
                <span>{actionLoading === activeDelivery._id ? 'Updating...' : 'Package Picked Up'}</span>
              </button>
            )}
            {activeDelivery.status === 'Picked Up' && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleStatusUpdate(activeDelivery._id, 'On the Way')}
                disabled={actionLoading === activeDelivery._id}
              >
                <RocketIcon size={16} />
                <span>{actionLoading === activeDelivery._id ? 'Updating...' : 'En Route to Customer'}</span>
              </button>
            )}
            {activeDelivery.status === 'On the Way' && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowVerifyModal(true)}
              >
                <CheckCircleIcon size={16} />
                <span>Verify Delivery PIN</span>
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowSupportModal(true)}
            >
              <AlertTriangleIcon size={16} />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      )}

      {/* Available Missions Table */}
      {!loading && availableDeliveries.length > 0 && (
        <div className="card-panel">
          <div className="section-header">
            <div className="section-title-group">
              <h3>Available Dispatch Missions ({availableDeliveries.length})</h3>
              <p>Live marketplace orders ready for courier pickup</p>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mission Code</th>
                  <th>Customer Destination</th>
                  <th>Items Summary</th>
                  <th>Delivery Fee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {availableDeliveries.slice(0, 8).map((d) => (
                  <tr key={d._id}>
                    <td>
                      <strong style={{ fontFamily: 'var(--vendor-font-display)', fontSize: '0.88rem' }}>
                        {d.orderNumber}
                      </strong>
                    </td>
                    <td style={{ color: '#CBD5E1', fontSize: '0.88rem' }}>{d.deliveryAddress}</td>
                    <td style={{ color: '#94A3B8', fontSize: '0.8rem', maxWidth: 160 }}>{d.itemsSummary}</td>
                    <td>
                      <strong style={{ color: '#14B8A6', fontFamily: 'var(--vendor-font-display)' }}>
                        +&#8358;{Number(d.deliveryFee).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAccept(d._id)}
                        disabled={actionLoading === d._id}
                      >
                        {actionLoading === d._id ? '...' : 'Accept Job'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && (
        <div className="card-panel recent-delivery-card">
          <div className="section-header">
            <div className="section-title-group">
              <span className="eyebrow">DELIVERY HISTORY</span>
              <h3>Recent Delivery</h3>
              <p>Your latest assigned delivery</p>
            </div>
            <div className="recent-delivery-icon"><PackageIcon size={20} /></div>
          </div>

          {recentDelivery ? (
            <div className="recent-delivery-details">
              <div>
                <span className="recent-delivery-label">Order</span>
                <strong>{recentDelivery.orderNumber || recentDelivery._id}</strong>
              </div>
              <div>
                <span className="recent-delivery-label">Customer</span>
                <strong>{recentDelivery.customerName || 'Customer'}</strong>
              </div>
              <div>
                <span className="recent-delivery-label">Destination</span>
                <strong>{recentDelivery.deliveryAddress || 'Address pending'}</strong>
              </div>
              <div>
                <span className="recent-delivery-label">Fee</span>
                <strong className="recent-delivery-fee">+&#8358;{Number(recentDelivery.deliveryFee || 0).toLocaleString()}</strong>
              </div>
              <span className="badge active">{recentDelivery.status || 'Assigned'}</span>
            </div>
          ) : (
            <div className="recent-delivery-empty driver-empty-copy">
              <h3>No deliveries available right now</h3>
              <p>Radar listening for customer dispatches. New orders will appear here automatically.</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State with Real SVG Icon */}
      {!loading && availableDeliveries.length === 0 && !activeDelivery && (
        <div className="card-panel driver-empty-state">
          <div className="driver-empty-icon">
            <RadarIcon size={52} />
          </div>
          <div className="driver-empty-copy">
            <h3>No deliveries available right now</h3>
            <p>Radar listening for customer dispatches. New orders will appear here automatically.</p>
          </div>
        </div>
      )}

      {/* PIN Verification Modal */}
      {showVerifyModal && (
        <div className="modal-overlay" onClick={() => setShowVerifyModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">DELIVERY VERIFICATION</span>
                <h3 style={{ margin: '4px 0 0' }}>Enter Customer PIN</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setShowVerifyModal(false)}>
                <XIcon size={18} />
              </button>
            </div>
            <form onSubmit={handleVerifyOTP}>
              <div className="modal-body" style={{ padding: 24 }}>
                {verifySuccess ? (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#10B981' }}>
                      <CheckCircleIcon size={56} />
                    </div>
                    <h4 style={{ color: '#10B981', marginTop: 12 }}>Delivery Confirmed!</h4>
                    <p style={{ color: '#94A3B8', fontSize: '0.87rem' }}>
                      Completed: {new Date(verifySuccess.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                      <label className="label">Customer 4-Digit Delivery Code</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. 4829"
                        maxLength={6}
                        value={verifyOtpInput}
                        onChange={(e) => setVerifyOtpInput(e.target.value)}
                        style={{ fontSize: '1.3rem', textAlign: 'center', letterSpacing: '0.3em', fontWeight: 800 }}
                      />
                    </div>
                    {verifyError && (
                      <p style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: 12 }}>{verifyError}</p>
                    )}
                  </>
                )}
              </div>
              {!verifySuccess && (
                <div className="modal-footer" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', padding: '16px 24px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowVerifyModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <span>Confirm Delivery</span>
                    <CheckIcon size={16} />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Emergency Report Modal */}
      {showSupportModal && (
        <div className="modal-overlay" onClick={() => setShowSupportModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">EMERGENCY ESCALATION</span>
                <h3 style={{ margin: '4px 0 0' }}>Report Delivery Issue</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setShowSupportModal(false)}>
                <XIcon size={18} />
              </button>
            </div>
            <form onSubmit={handleReportSupport}>
              <div className="modal-body" style={{ padding: 24 }}>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="label">Issue Classification</label>
                  <select className="select" value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                    <option>Customer Unreachable</option>
                    <option>Wrong Delivery Address</option>
                    <option>Package Damaged</option>
                    <option>Vehicle Breakdown</option>
                    <option>Safety Concern</option>
                    <option>Other Emergency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Description of Incident</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Provide exact details for the dispatch team..."
                    value={issueDesc}
                    onChange={(e) => setIssueDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', padding: '16px 24px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowSupportModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  <AlertTriangleIcon size={16} />
                  <span>Submit Urgent Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboardPage;
