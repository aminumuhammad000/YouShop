import React, { useEffect, useState } from 'react';
import { getOnlineDrivers, getVendorOrders, updateOrderStatus } from '../services/api';
import {
  TruckIcon,
  StarIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
  PackageIcon,
  CheckCircleIcon,
  XIcon,
  ArrowRightIcon,
} from '../components/Icons';

const VendorDriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('online'); // 'all' | 'online' | 'available' | 'delivering'
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [assigningOrder, setAssigningOrder] = useState(false);
  const [dispatchOrderSuccess, setDispatchOrderSuccess] = useState(null);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [driverList, orderList] = await Promise.all([
        getOnlineDrivers(),
        getVendorOrders().catch(() => []),
      ]);
      setDrivers(driverList);
      setOrders(Array.isArray(orderList) ? orderList : []);
    } catch (err) {
      console.error('Failed to load online drivers:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and search logic
  const filteredDrivers = drivers.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      d.name?.toLowerCase().includes(q) ||
      d.phoneNumber?.toLowerCase().includes(q) ||
      d.plateNumber?.toLowerCase().includes(q) ||
      d.driverCity?.toLowerCase().includes(q) ||
      d.vehicleType?.toLowerCase().includes(q);

    if (!matchesQuery) return false;

    if (filterTab === 'online') return d.isOnline;
    if (filterTab === 'available') return d.isOnline && d.activeJobs === 0;
    if (filterTab === 'delivering') return d.isOnline && d.activeJobs > 0;
    return true; // 'all'
  });

  const totalOnline = drivers.filter((d) => d.isOnline).length;
  const totalAvailable = drivers.filter((d) => d.isOnline && d.activeJobs === 0).length;
  const totalOnDelivery = drivers.filter((d) => d.isOnline && d.activeJobs > 0).length;
  const avgRating = drivers.length
    ? (drivers.reduce((acc, d) => acc + (d.rating || 5), 0) / drivers.length).toFixed(1)
    : '5.0';

  const pendingDispatchOrders = orders.filter((o) => ['placed', 'processing'].includes(o.status));

  const handleDispatchOrder = async (orderId) => {
    if (!selectedDriver) return;
    setAssigningOrder(true);
    try {
      await updateOrderStatus(orderId, 'processing');
      setDispatchOrderSuccess(`Order successfully assigned to ${selectedDriver.name}!`);
      setTimeout(() => {
        setDispatchOrderSuccess(null);
        setSelectedDriver(null);
        loadData(true);
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to assign order');
    } finally {
      setAssigningOrder(false);
    }
  };

  return (
    <div className="vendor-content">
      {/* Top Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-accent" />
          <div className="stat-head">
            <span className="stat-title">Couriers Online</span>
            <div className="stat-icon-bg emerald">
              <TruckIcon size={22} />
            </div>
          </div>
          <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {loading ? '—' : `${totalOnline}`}
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 12px #10B981',
                display: 'inline-block',
                animation: 'pulse 1.8s infinite',
              }}
            />
          </div>
          <div className="stat-footer">
            <span className="trend-badge positive">Live GPS Radar Active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent" />
          <div className="stat-head">
            <span className="stat-title">Ready for Dispatch</span>
            <div className="stat-icon-bg blue">
              <PackageIcon size={22} />
            </div>
          </div>
          <div className="stat-value">{loading ? '—' : totalAvailable}</div>
          <div className="stat-footer">
            <span className="trend-badge neutral">Available nearby your store</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent" />
          <div className="stat-head">
            <span className="stat-title">En Route / Delivering</span>
            <div className="stat-icon-bg amber">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{loading ? '—' : totalOnDelivery}</div>
          <div className="stat-footer">
            <span className="trend-badge neutral">Active fulfillment drops</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent" />
          <div className="stat-head">
            <span className="stat-title">Fleet Average Rating</span>
            <div className="stat-icon-bg purple">
              <StarIcon size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {loading ? '—' : avgRating}
            <StarIcon size={18} style={{ color: '#F59E0B' }} />
          </div>
          <div className="stat-footer">
            <span className="trend-badge positive">Verified YouShop Pilots</span>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="card-panel" style={{ marginTop: 24 }}>
        <div className="section-header" style={{ flexWrap: 'wrap', gap: 14 }}>
          <div className="section-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3>Live Courier Fleet Network</h3>
              <span className="badge active" style={{ fontSize: '0.72rem', padding: '3px 10px' }}>
                {totalOnline} Online
              </span>
            </div>
            <p>Direct live radar of registered logistics couriers ready to fulfill customer orders</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => loadData(true)}
              disabled={refreshing}
              title="Refresh radar"
            >
              <RefreshCwIcon size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Live Sync'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="tab-row" style={{ margin: 0 }}>
            {[
              { id: 'online', label: `Online (${totalOnline})` },
              { id: 'available', label: `Available (${totalAvailable})` },
              { id: 'delivering', label: `On Mission (${totalOnDelivery})` },
              { id: 'all', label: `All Fleet (${drivers.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab-btn ${filterTab === tab.id ? 'active' : ''}`}
                onClick={() => setFilterTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: 'min(300px, 100%)' }}>
            <input
              type="text"
              className="input"
              placeholder="Search by courier, plate, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 14px', fontSize: '0.86rem' }}
            />
          </div>
        </div>

        {/* Drivers Grid */}
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748B' }}>
            <div className="auth-spinner" style={{ margin: '0 auto 16px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
            Locating nearby delivery pilots...
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94A3B8' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14, color: '#14B8A6' }}>
              <TruckIcon size={52} />
            </div>
            <h3 style={{ color: '#CBD5E1', marginBottom: 6 }}>No couriers found</h3>
            <p style={{ fontSize: '0.88rem', maxWidth: 420, margin: '0 auto' }}>
              {filterTab === 'online'
                ? 'No drivers are currently active online. Drivers will appear here as soon as they toggle their status.'
                : 'Try adjusting your search criteria or switching filter tabs.'}
            </p>
          </div>
        ) : (
          <div className="fleet-table-wrap table-wrap">
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Vehicle</th>
                  <th>Zone</th>
                  <th>Rating</th>
                  <th>Trips</th>
                  <th>Contact</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => {
                  const isDriverOnline = driver.isOnline;
                  const hasActiveDrop = driver.activeJobs > 0;
                  const statusLabel = isDriverOnline
                    ? hasActiveDrop
                      ? 'On Delivery'
                      : 'Online & Ready'
                    : 'Offline';

                  return (
                    <tr key={driver._id}>
                      <td>
                        <div className="driver-cell">
                          <div className={`driver-avatar ${isDriverOnline ? 'online' : ''}`}>
                            {(driver.name || 'D')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="driver-name">{driver.name}</div>
                            <div className="driver-meta">{driver.plateNumber || 'No plate yet'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${isDriverOnline ? (hasActiveDrop ? 'pending' : 'active') : 'neutral'}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td>
                        <div className="driver-metric">{driver.vehicleType || 'N/A'}</div>
                      </td>
                      <td>
                        <div className="driver-metric">{driver.driverCity || 'Not set'}</div>
                      </td>
                      <td>
                        <div className="driver-rating">
                          <StarIcon size={14} style={{ color: '#F59E0B' }} />
                          <span>{driver.rating || 5.0}</span>
                        </div>
                      </td>
                      <td>
                        <div className="driver-metric">{driver.completedTrips || 0}</div>
                      </td>
                      <td>
                        <a href={`tel:${driver.phoneNumber}`} className="driver-call-link">
                          <PhoneIcon size={14} />
                          <span>{driver.phoneNumber || 'Call'}</span>
                        </a>
                      </td>
                      <td>
                        <div className="driver-actions">
                          {isDriverOnline ? (
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => setSelectedDriver(driver)}>
                              <PackageIcon size={14} />
                              <span>Dispatch</span>
                            </button>
                          ) : (
                            <span className="driver-metric muted">Unavailable</span>
                          )}
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

      {/* Dispatch Order Modal */}
      {selectedDriver && (
        <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">DISPATCH LOGISTICS</span>
                <h3 style={{ margin: '4px 0 0' }}>Assign Courier: {selectedDriver.name}</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setSelectedDriver(null)}>
                <XIcon size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: 24 }}>
              {dispatchOrderSuccess ? (
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#10B981' }}>
                    <CheckCircleIcon size={56} />
                  </div>
                  <h4 style={{ color: '#10B981', margin: '0 0 6px' }}>{dispatchOrderSuccess}</h4>
                  <p style={{ color: '#94A3B8', fontSize: '0.86rem' }}>
                    Courier has been notified and the order is marked for fulfillment.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      background: 'rgba(20,184,166,0.08)',
                      borderRadius: 14,
                      border: '1px solid rgba(20,184,166,0.2)',
                      padding: 16,
                      marginBottom: 20,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <ShieldCheckIcon size={20} className="text-teal-400" />
                      <div>
                        <strong style={{ color: '#F1F5F9', fontSize: '0.92rem' }}>
                          Verified Pilot: {selectedDriver.name}
                        </strong>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                          {selectedDriver.vehicleType} • {selectedDriver.plateNumber} • {selectedDriver.driverCity}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 style={{ color: '#F1F5F9', fontSize: '0.94rem', margin: '0 0 12px' }}>
                    Select an order to assign to this courier:
                  </h4>

                  {pendingDispatchOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94A3B8' }}>
                      <PackageIcon size={36} style={{ margin: '0 auto 10px', opacity: 0.6 }} />
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>No pending orders awaiting dispatch.</p>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        All current customer orders have already been dispatched or delivered.
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260, overflowY: 'auto' }}>
                      {pendingDispatchOrders.map((ord) => (
                        <div
                          key={ord._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 12,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 12,
                          }}
                        >
                          <div>
                            <strong style={{ color: '#E2E8F0', fontSize: '0.88rem' }}>
                              {ord.orderNumber || ord._id}
                            </strong>
                            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                              {ord.customerName} • {ord.shippingAddress || 'Lagos'}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            disabled={assigningOrder}
                            onClick={() => handleDispatchOrder(ord._id)}
                          >
                            <span>Assign</span>
                            <ArrowRightIcon size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDriversPage;
