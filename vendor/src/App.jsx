import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getVendorProfile } from './services/api';
import VendorLayout from './components/layout/VendorLayout';
import DriverLayout from './components/layout/DriverLayout';
import LandingPage from './pages/LandingPage';

// Vendor Pages
import VendorRegister from './pages/VendorRegister';
import VendorLogin from './pages/VendorLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import PendingPage from './pages/PendingPage';
import RejectedPage from './pages/RejectedPage';
import SuspendedPage from './pages/SuspendedPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import EarningsPage from './pages/EarningsPage';
import WithdrawalsPage from './pages/WithdrawalsPage';
import StorePage from './pages/StorePage';
import ReviewsPage from './pages/ReviewsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import VendorDriversPage from './pages/VendorDriversPage';
import VendorSupportPage from './pages/VendorSupportPage';

// Driver Pages
import DriverLogin from './pages/DriverLogin';
import DriverRegister from './pages/DriverRegister';
import DriverDashboardPage from './pages/DriverDashboardPage';
import DriverDeliveriesPage from './pages/DriverDeliveriesPage';
import DriverEarningsPage from './pages/DriverEarningsPage';
import DriverProfilePage from './pages/DriverProfilePage';
import DriverHistoryPage from './pages/DriverHistoryPage';
import DriverNotificationsPage from './pages/DriverNotificationsPage';
import DriverSettingsPage from './pages/DriverSettingsPage';
import DriverChatPage from './pages/DriverChatPage';
import DriverSupportPage from './pages/DriverSupportPage';
import DriverMapPage from './pages/DriverMapPage';

import NotFoundPage from './pages/NotFoundPage';
import ThemeToggle from './components/ThemeToggle';
import { THEME_CHANGE_EVENT } from './components/ThemePreference';
import './styles/vendor.css';

const THEME_STORAGE_KEY = 'youshop_theme';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === 'dark' ? 'dark' : 'light';
};

const getVendorSession = () => {
  try {
    const saved = localStorage.getItem('youshop_vendor_session');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getDriverSession = () => {
  try {
    const saved = localStorage.getItem('youshop_driver_session');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const normalizeVendor = (vendorData = null) => {
  if (!vendorData) return null;

  return {
    id: vendorData._id || vendorData.id,
    _id: vendorData._id || vendorData.id,
    name: vendorData.name || 'Vendor',
    email: vendorData.email || '',
    role: vendorData.role || 'vendor',
    status: vendorData.vendorStatus || vendorData.status || 'approved',
    vendorStatus: vendorData.vendorStatus || vendorData.status || 'approved',
    store_name: vendorData.storeName || vendorData.store_name || 'My Store',
    storeName: vendorData.storeName || vendorData.store_name || 'My Store',
    business_category: vendorData.businessCategory || vendorData.business_category || 'General',
    businessCategory: vendorData.businessCategory || vendorData.business_category || 'General',
    phoneNumber: vendorData.phoneNumber || vendorData.phone || '',
    profilePicture: vendorData.profilePicture || '',
    // Preserve JWT token so all API calls include Authorization header
    token: vendorData.token || null,
  };
};

const normalizeDriver = (driverData = null) => {
  if (!driverData) return null;
  return {
    id: driverData._id || driverData.id,
    _id: driverData._id || driverData.id,
    name: driverData.name || driverData.fullName || 'Driver Partner',
    email: driverData.email || '',
    phone: driverData.phoneNumber || driverData.phone || '',
    phoneNumber: driverData.phoneNumber || driverData.phone || '',
    role: 'driver',
    vehicleType: driverData.vehicleType || 'Motorcycle (Express Delivery)',
    plateNumber: driverData.plateNumber || '',
    licenseNumber: driverData.licenseNumber || '',
    city: driverData.driverCity || driverData.city || 'Lagos',
    driverCity: driverData.driverCity || driverData.city || 'Lagos',
    status: driverData.driverStatus || driverData.status || 'approved',
    driverStatus: driverData.driverStatus || driverData.status || 'approved',
    rating: driverData.rating || 5.0,
    completedTrips: driverData.completedTrips || 0,
    profilePicture: driverData.profilePicture || '',
    token: driverData.token || null,
  };
};

const App = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [vendor, setVendor] = useState(() => {
    const session = getVendorSession();
    return session ? normalizeVendor(session) : null;
  });
  const [driver, setDriver] = useState(() => {
    const session = getDriverSession();
    return session ? normalizeDriver(session) : null;
  });

  const isVendorLoggedIn = useMemo(() => Boolean(vendor && (vendor.id || vendor._id)), [vendor]);
  const isDriverLoggedIn = useMemo(() => Boolean(driver && (driver.id || driver._id)), [driver]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const handleThemeChange = (event) => {
      if (event.key === THEME_STORAGE_KEY && (event.newValue === 'light' || event.newValue === 'dark')) {
        setTheme(event.newValue);
      }
    };
    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);

  useEffect(() => {
    const handleThemeChange = (event) => {
      if (event.detail === 'light' || event.detail === 'dark') setTheme(event.detail);
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  // Auto-heal/sync vendor status: if local session is pending, verify against backend
  useEffect(() => {
    if (vendor && (vendor.status === 'pending' || vendor.vendorStatus === 'pending')) {
      getVendorProfile()
        .then((profile) => {
          if (profile && (profile.vendorStatus === 'approved' || profile.status === 'approved')) {
            const updated = {
              ...vendor,
              status: 'approved',
              vendorStatus: 'approved',
              profilePicture: profile.profilePicture || vendor.profilePicture,
            };
            setVendor(updated);
            localStorage.setItem('youshop_vendor_session', JSON.stringify(updated));
          }
        })
        .catch(() => {});
    }
  }, [vendor]);

  // Sync profile picture from localStorage when it changes
  useEffect(() => {
    const handleStorageChange = () => {
      const vendorSession = getVendorSession();
      if (vendorSession) {
        setVendor(normalizeVendor(vendorSession));
      }
      const driverSession = getDriverSession();
      if (driverSession) {
        setDriver(normalizeDriver(driverSession));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleVendorLogin = (vendorData) => {
    const payload = normalizeVendor(vendorData);
    setVendor(payload);
    if (payload) {
      // Preserve existing profile picture if not provided in login response
      const existingSession = JSON.parse(localStorage.getItem('youshop_vendor_session') || '{}');
      const finalPayload = {
        ...payload,
        profilePicture: payload.profilePicture || existingSession.profilePicture || '',
      };
      localStorage.setItem('youshop_vendor_session', JSON.stringify(finalPayload));
      setVendor(finalPayload);
    }
  };

  const handleVendorLogout = () => {
    setVendor(null);
    localStorage.removeItem('youshop_vendor_session');
  };

  const handleDriverLogin = (driverData) => {
    const payload = normalizeDriver(driverData);
    setDriver(payload);
    if (payload) {
      // Preserve existing profile picture if not provided in login response
      const existingSession = JSON.parse(localStorage.getItem('youshop_driver_session') || '{}');
      const finalPayload = {
        ...payload,
        profilePicture: payload.profilePicture || existingSession.profilePicture || '',
      };
      localStorage.setItem('youshop_driver_session', JSON.stringify(finalPayload));
      setDriver(finalPayload);
    }
  };

  const handleDriverLogout = () => {
    setDriver(null);
    localStorage.removeItem('youshop_driver_session');
  };

  // Vendor Route Protections
  const VendorProtectedRoute = ({ children }) => {
    if (!isVendorLoggedIn) return <Navigate to="/vendor/login" replace />;
    const status = vendor.status || vendor.vendorStatus || 'approved';
    if (status === 'pending') return <Navigate to="/vendor/pending" replace />;
    if (status === 'rejected') return <Navigate to="/vendor/rejected" replace />;
    if (status === 'suspended') return <Navigate to="/vendor/suspended" replace />;
    return children;
  };

  const VendorGuestRoute = ({ children }) => {
    if (isVendorLoggedIn) {
      const status = vendor.status || vendor.vendorStatus || 'approved';
      if (status === 'pending') return <Navigate to="/vendor/pending" replace />;
      if (status === 'rejected') return <Navigate to="/vendor/rejected" replace />;
      if (status === 'suspended') return <Navigate to="/vendor/suspended" replace />;
      return <Navigate to="/vendor/dashboard" replace />;
    }
    return children;
  };

  // Driver Route Protections
  const DriverProtectedRoute = ({ children }) => {
    if (!isDriverLoggedIn) return <Navigate to="/driver/login" replace />;
    return children;
  };

  const DriverGuestRoute = ({ children }) => {
    if (isDriverLoggedIn) {
      return <Navigate to="/driver/dashboard" replace />;
    }
    return children;
  };

  return (
    <div className="app-shell">
      <ThemeToggle theme={theme} onToggle={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />
      <Routes>
        <Route path="/" element={<Navigate to="/vendor" replace />} />
        <Route path="/vendor" element={<LandingPage />} />

        {/* Vendor Routes */}
        <Route path="/vendor/register" element={<VendorGuestRoute><VendorRegister /></VendorGuestRoute>} />
        <Route path="/vendor/login" element={<VendorGuestRoute><VendorLogin onLogin={handleVendorLogin} /></VendorGuestRoute>} />
        <Route path="/vendor/forgot-password" element={<VendorGuestRoute><ForgotPassword /></VendorGuestRoute>} />
        <Route path="/vendor/reset-password" element={<VendorGuestRoute><ResetPassword /></VendorGuestRoute>} />
        <Route path="/vendor/terms" element={<TermsPage />} />
        <Route path="/vendor/privacy" element={<PrivacyPage />} />
        <Route path="/vendor/pending" element={<PendingPage />} />
        <Route path="/vendor/rejected" element={<RejectedPage />} />
        <Route path="/vendor/suspended" element={<SuspendedPage />} />

        <Route path="/vendor/dashboard" element={<VendorProtectedRoute><VendorLayout vendor={vendor} onLogout={handleVendorLogout}><DashboardPage vendor={vendor} /></VendorLayout></VendorProtectedRoute>} />
        <Route path="/vendor/products" element={<VendorProtectedRoute><VendorLayout vendor={vendor} onLogout={handleVendorLogout}><ProductsPage /></VendorLayout></VendorProtectedRoute>} />
        <Route path="/vendor/orders" element={<VendorProtectedRoute><VendorLayout vendor={vendor} onLogout={handleVendorLogout}><OrdersPage /></VendorLayout></VendorProtectedRoute>} />
        <Route path="/vendor/drivers" element={<VendorProtectedRoute><VendorLayout vendor={vendor} onLogout={handleVendorLogout}><VendorDriversPage /></VendorLayout></VendorProtectedRoute>} />
        <Route path="/vendor/earnings" element={<VendorProtectedRoute><VendorLayout vendor={vendor} onLogout={handleVendorLogout}><EarningsPage /></VendorLayout></VendorProtectedRoute>} />
        <Route path="/vendor/withdrawals" element={<VendorProtectedRoute><VendorLayout vendor={vendor} onLogout={handleVendorLogout}><WithdrawalsPage /></VendorLayout></VendorProtectedRoute>} />
        <Route path="/vendor/store" element={<VendorProtectedRoute><VendorLayout vendor={vendor} onLogout={handleVendorLogout}><StorePage vendor={vendor} /></VendorLayout></VendorProtectedRoute>} />
        <Route path="/vendor/profile" element={<VendorProtectedRoute><VendorLayout vendor={vendor} onLogout={handleVendorLogout}><StorePage vendor={vendor} /></VendorLayout></VendorProtectedRoute>} />
        <Route path="/vendor/reviews" element={<VendorProtectedRoute><VendorLayout vendor={vendor} onLogout={handleVendorLogout}><ReviewsPage /></VendorLayout></VendorProtectedRoute>} />
        <Route path="/vendor/notifications" element={<VendorProtectedRoute><VendorLayout vendor={vendor} onLogout={handleVendorLogout}><NotificationsPage /></VendorLayout></VendorProtectedRoute>} />
        <Route path="/vendor/settings" element={<VendorProtectedRoute><VendorLayout vendor={vendor} onLogout={handleVendorLogout}><SettingsPage vendor={vendor} /></VendorLayout></VendorProtectedRoute>} />
<Route path="/vendor/support" element={<VendorProtectedRoute><VendorLayout vendor={vendor} onLogout={handleVendorLogout}><VendorSupportPage /></VendorLayout></VendorProtectedRoute>} />

        {/* Driver Routes */}
        <Route path="/driver/login" element={<DriverGuestRoute><DriverLogin onLogin={handleDriverLogin} /></DriverGuestRoute>} />
        <Route path="/driver/register" element={<DriverGuestRoute><DriverRegister /></DriverGuestRoute>} />
        <Route path="/driver/forgot-password" element={<DriverGuestRoute><ForgotPassword role="driver" /></DriverGuestRoute>} />
        <Route path="/driver/reset-password" element={<DriverGuestRoute><ResetPassword role="driver" /></DriverGuestRoute>} />
        <Route path="/driver/dashboard" element={<DriverProtectedRoute><DriverLayout driver={driver} onLogout={handleDriverLogout}><DriverDashboardPage driver={driver} /></DriverLayout></DriverProtectedRoute>} />
        <Route path="/driver/deliveries" element={<DriverProtectedRoute><DriverLayout driver={driver} onLogout={handleDriverLogout}><DriverDeliveriesPage driver={driver} /></DriverLayout></DriverProtectedRoute>} />
        <Route path="/driver/earnings" element={<DriverProtectedRoute><DriverLayout driver={driver} onLogout={handleDriverLogout}><DriverEarningsPage driver={driver} /></DriverLayout></DriverProtectedRoute>} />
        <Route path="/driver/history" element={<DriverProtectedRoute><DriverLayout driver={driver} onLogout={handleDriverLogout}><DriverHistoryPage driver={driver} /></DriverLayout></DriverProtectedRoute>} />
        <Route path="/driver/notifications" element={<DriverProtectedRoute><DriverLayout driver={driver} onLogout={handleDriverLogout}><DriverNotificationsPage driver={driver} /></DriverLayout></DriverProtectedRoute>} />
        <Route path="/driver/profile" element={<DriverProtectedRoute><DriverLayout driver={driver} onLogout={handleDriverLogout}><DriverProfilePage driver={driver} /></DriverLayout></DriverProtectedRoute>} />
        <Route path="/driver/settings" element={<DriverProtectedRoute><DriverLayout driver={driver} onLogout={handleDriverLogout}><DriverSettingsPage driver={driver} onLogout={handleDriverLogout} /></DriverLayout></DriverProtectedRoute>} />
        <Route path="/driver/chat" element={<DriverProtectedRoute><DriverLayout driver={driver} onLogout={handleDriverLogout}><DriverChatPage driver={driver} /></DriverLayout></DriverProtectedRoute>} />
        <Route path="/driver/map" element={<DriverProtectedRoute><DriverLayout driver={driver} onLogout={handleDriverLogout}><DriverMapPage driver={driver} /></DriverLayout></DriverProtectedRoute>} />
        <Route path="/driver/support" element={<DriverProtectedRoute><DriverLayout driver={driver} onLogout={handleDriverLogout}><DriverSupportPage /></DriverLayout></DriverProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
