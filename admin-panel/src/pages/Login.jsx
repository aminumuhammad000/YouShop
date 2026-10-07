import React, { useState, useEffect } from 'react';
import YouShopLogo from '../components/YouShopLogo';

function Login({ onLogin, darkMode, toggleDarkMode }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_authenticated');
    if (adminSession === 'true') {
      onLogin(true);
    }
  }, [onLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('admin_authenticated', 'true');
      onLogin(true);
    } else {
      setError('Invalid password. Hint: admin123');
    }
  };

  return (
    <div className="admin-login">
      <button className="admin-login-theme-toggle" type="button" onClick={toggleDarkMode}>
        {darkMode ? 'Light mode' : 'Dark mode'}
      </button>
      <section className="login-vision-panel">
        <div className="login-grid-art" aria-hidden="true"><span /><span /><span /></div>
        <div className="login-vision-content">
          <div className="login-brand"><YouShopLogo iconSize={46} fontSize="1.5rem" /></div>
          <p className="login-kicker">THE COMMERCE OPERATING SYSTEM</p>
          <h1>Run the store<br /><em>ahead of tomorrow.</em></h1>
          <p className="login-vision-copy">One intelligent command center for every order, customer, product, and decision.</p>
          <div className="login-signal-card">
            <div className="login-signal-top"><span><i /> SYSTEMS NOMINAL</span><b>LIVE</b></div>
            <div className="login-signal-bars"><span /><span /><span /><span /><span /><span /><span /><span /></div>
            <div className="login-signal-bottom"><span>Store intelligence</span><strong>24 / 7</strong></div>
          </div>
        </div>
        <div className="login-vision-footer"><span>YOUSHOP ADMIN / 2040</span><span>SECURE BY DESIGN</span></div>
      </section>

      <section className="login-access-panel">
        <div className="login-access-card">
          <div className="login-access-mark"><span>Y</span></div>
          <p className="login-kicker">PRIVATE ACCESS</p>
          <h2>Welcome back.</h2>
          <p className="login-access-copy">Your store is ready when you are.</p>
          <div className="login-secure-badge"><span className="login-lock-icon">&#9670;</span><span>Encrypted admin session</span></div>
          <form onSubmit={handleSubmit}>
            <div className="login-field-group">
              <label htmlFor="admin-password">Admin password</label>
              <div className={`login-password-field ${error ? 'has-error' : ''}`}>
                <input id="admin-password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }} placeholder="Enter your access key" autoFocus />
                <button type="button" onClick={() => setShowPassword(visible => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {error && <div className="login-error">{error}</div>}
            </div>
            <button type="submit" className="login-submit">Enter command center <span>-></span></button>
          </form>
          <p className="login-footnote">Authorized administrators only<br />Access is monitored and protected.</p>
        </div>
      </section>
    </div>
  );
}

export default Login;
