import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import ProductCreate from './pages/ProductCreate';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Inventory from './pages/Inventory';
import Coupons from './pages/Coupons';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Logs from './pages/Logs';
import ChatZone from './pages/ChatZone';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ToastViewport from './components/ToastViewport';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('youshop_theme') === 'dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('youshop_theme') || localStorage.getItem('theme_preference');
    setDarkMode(savedTheme === 'dark');

    const handleThemeChange = (event) => {
      if (event.key === 'youshop_theme' && (event.newValue === 'light' || event.newValue === 'dark')) {
        setDarkMode(event.newValue === 'dark');
      }
    };
    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('youshop_theme', theme);
  }, [darkMode]);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('youshop_theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('youshop_theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
  }

  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark' : ''}`}>
        <ToastViewport />
        <Sidebar 
          onLogout={handleLogout} 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
        <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Header 
            onLogout={handleLogout}
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode} 
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
          />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Users />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/create" element={<ProductCreate />} />
              <Route path="/products/edit/:id" element={<ProductCreate />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/chat-zone" element={<ChatZone />} />
              <Route path="/coupons" element={<Coupons />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
