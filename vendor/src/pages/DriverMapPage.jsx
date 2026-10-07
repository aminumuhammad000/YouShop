import React, { useEffect, useState } from 'react';
import { getDriverActiveDelivery, updateDriverLocation } from '../services/api';
import { MapPinIcon, PackageIcon, HomeIcon, NavigationIcon, MapIcon, AlertTriangleIcon, RefreshCwIcon } from '../components/Icons';

const DriverMapPage = ({ driver }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    loadActiveDelivery();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setCurrentLocation(locationData);
        setLoading(false);

        // Send location to server
        try {
          await updateDriverLocation(locationData);
        } catch (err) {
          console.error('Failed to update location on server:', err);
        }
      },
      (err) => {
        setError('Unable to retrieve your location. Please enable GPS.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const loadActiveDelivery = async () => {
    try {
      const delivery = await getDriverActiveDelivery();
      if (delivery) {
        setActiveDelivery(delivery);
        
        if (delivery.pickupCoords) {
          setPickupLocation({
            lat: delivery.pickupCoords.lat,
            lng: delivery.pickupCoords.lng,
            address: delivery.pickupAddress || delivery.shippingAddress || 'Pickup location',
          });
        }
        
        if (delivery.customerCoords) {
          setCustomerLocation({
            lat: delivery.customerCoords.lat,
            lng: delivery.customerCoords.lng,
            address: delivery.customerAddress || delivery.deliveryAddress || 'Customer location',
          });
        }
      }
    } catch (err) {
      console.error('Failed to load active delivery:', err);
    }
  };

  const openNavigation = (destination) => {
    if (!currentLocation || !destination) return;
    
    // Open in Google Maps
    const url = `https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}/${destination.lat},${destination.lng}`;
    window.open(url, '_blank');
  };

  const refreshLocation = () => {
    setLocationLoading(true);
    setError(null);
    getCurrentLocation().finally(() => {
      setLocationLoading(false);
    });
  };

  return (
    <div className="vendor-content">
      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>GPS Navigation & Route Planner</h3>
            <p>Real-time location tracking and delivery route optimization</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748B' }}>
            <div className="auth-spinner" style={{ margin: '0 auto 16px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
            <p>Acquiring GPS signal...</p>
          </div>
        ) : error ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#EF4444' }}>
            <div style={{ marginBottom: 16 }}>
              <AlertTriangleIcon size={48} />
            </div>
            <h3 style={{ color: '#FCA5A5', marginBottom: 8 }}>Location Error</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: 24 }}>{error}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={refreshLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
                  Retrying...
                </span>
              ) : 'Retry GPS Connection'}
            </button>
          </div>
        ) : (
          <>
            {!activeDelivery && (
              <div style={{ padding: 60, textAlign: 'center', color: '#64748B' }}>
                <div style={{ marginBottom: 16 }}>
                  <PackageIcon size={48} />
                </div>
                <h3 style={{ color: '#94A3B8', marginBottom: 8 }}>No Active Delivery</h3>
                <p style={{ fontSize: '0.9rem' }}>Accept a delivery from the Deliveries page to see route information.</p>
              </div>
            )}
            
            {activeDelivery && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {/* Current Location Card */}
            <div
              style={{
                padding: 24,
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(20,184,166,0.1) 0%, rgba(20,184,166,0.05) 100%)',
                border: '2px solid rgba(20,184,166,0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'rgba(20,184,166,0.2)',
                    color: '#14B8A6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MapPinIcon size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Current Location</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>GPS Active</p>
                </div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                  Coordinates
                </div>
                <div style={{ fontSize: '0.9rem', fontFamily: 'monospace', color: '#0F172A' }}>
                  {currentLocation?.lat?.toFixed(6)}, {currentLocation?.lng?.toFixed(6)}
                </div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                  Accuracy
                </div>
                <div style={{ fontSize: '0.9rem', color: '#0F172A' }}>
                  ±{currentLocation?.accuracy?.toFixed(0)} meters
                </div>
              </div>
              
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={refreshLocation}
                disabled={locationLoading}
                style={{ width: '100%' }}
              >
                {locationLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
                    Refreshing...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RefreshCwIcon size={16} />
                    Refresh Location
                  </span>
                )}
              </button>
            </div>

            {/* Pickup Location Card */}
            <div
              style={{
                padding: 24,
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(139,92,246,0.05) 100%)',
                border: '2px solid rgba(139,92,246,0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'rgba(139,92,246,0.2)',
                    color: '#8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PackageIcon size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Pickup Location</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Merchant Location</p>
                </div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                  Address
                </div>
                <div style={{ fontSize: '0.9rem', color: '#0F172A' }}>
                  {pickupLocation?.address || 'No active pickup'}
                </div>
              </div>
              
              {pickupLocation && (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                      Coordinates
                    </div>
                    <div style={{ fontSize: '0.9rem', fontFamily: 'monospace', color: '#0F172A' }}>
                      {pickupLocation.lat.toFixed(6)}, {pickupLocation.lng.toFixed(6)}
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openNavigation(pickupLocation)}
                    style={{ width: '100%' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <NavigationIcon size={16} />
                      Navigate to Pickup
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* Customer Location Card */}
            <div
              style={{
                padding: 24,
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.05) 100%)',
                border: '2px solid rgba(245,158,11,0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'rgba(245,158,11,0.2)',
                    color: '#F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HomeIcon size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Customer Location</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Delivery Destination</p>
                </div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                  Customer
                </div>
                <div style={{ fontSize: '0.9rem', color: '#0F172A' }}>
                  {activeDelivery?.customerName || 'No active delivery'}
                </div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                  Address
                </div>
                <div style={{ fontSize: '0.9rem', color: '#0F172A' }}>
                  {customerLocation?.address || 'No active delivery'}
                </div>
              </div>
              
              {customerLocation && (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                      Coordinates
                    </div>
                    <div style={{ fontSize: '0.9rem', fontFamily: 'monospace', color: '#0F172A' }}>
                      {customerLocation.lat.toFixed(6)}, {customerLocation.lng.toFixed(6)}
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openNavigation(customerLocation)}
                    style={{ width: '100%' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <NavigationIcon size={16} />
                      Navigate to Customer
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
            )}
          </>
        )}

        {/* Route Information Section */}
        {!loading && !error && activeDelivery && pickupLocation && customerLocation && (
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                padding: 24,
                borderRadius: 16,
                background: 'rgba(15,23,42,0.03)',
                border: '1px solid rgba(15,23,42,0.08)',
              }}
            >
              <h4 style={{ margin: '0 0 16', fontSize: '1rem', fontWeight: 700 }}>Route Summary</h4>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                    Delivery Code
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#8B5CF6' }}>
                    {activeDelivery.orderNumber || activeDelivery.deliveryCode || activeDelivery._id || 'N/A'}
                  </div>
                </div>
                
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                    Status
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                    {activeDelivery.status || 'Active'}
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(15,23,42,0.08)' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (currentLocation && pickupLocation && customerLocation) {
                      const url = `https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}/${pickupLocation.lat},${pickupLocation.lng}/${customerLocation.lat},${customerLocation.lng}`;
                      window.open(url, '_blank');
                    }
                  }}
                  style={{ width: '100%' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <NavigationIcon size={18} />
                    Start Full Route Navigation
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        {!loading && !error && activeDelivery && (
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                height: 300,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)',
                border: '2px dashed #94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ color: '#64748B' }}>
                <MapIcon size={48} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: 0, color: '#475569', fontSize: '1rem' }}>Interactive Map</h4>
                <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>
                  Map integration requires Leaflet or Google Maps SDK
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverMapPage;