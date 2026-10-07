import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getVendorEarnings, requestVendorWithdrawal } from '../services/api';
import { nigerianBanks } from '../data/nigerianBanks';

const formatMoney = (v) => `₦${Number(v || 0).toLocaleString()}`;

const BankLogo = ({ bank, size = 34 }) => {
  const [sourceIndex, setSourceIndex] = useState(0);
  const logoSources = [bank.logo, bank.logoFallback].filter(Boolean);
  const handleLogoError = () => {
    setSourceIndex((current) => current + 1);
  };
  return (
    <span className="bank-logo" style={{ width: size, height: size }}>
      {sourceIndex < logoSources.length && (
        <img
          src={logoSources[sourceIndex]}
          alt={`${bank.name} logo`}
          onError={handleLogoError}
        />
      )}
      {sourceIndex >= logoSources.length && <span>{bank.initials}</span>}
    </span>
  );
};

const EarningsPage = () => {
  const [earnings, setEarnings] = useState({ availableBalance: 0, pendingPayouts: 0, totalEarned: 0 });
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState(nigerianBanks[7].name);
  const [bankSearch, setBankSearch] = useState('');
  const [bankPickerOpen, setBankPickerOpen] = useState(false);
  const bankPickerRef = useRef(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchEarnings = () => {
    setLoading(true);
    getVendorEarnings()
      .then(setEarnings)
      .catch(() => setEarnings({ availableBalance: 0, pendingPayouts: 0, totalEarned: 0 }))
      .finally(() => setLoading(false));
  };

  useEffect(fetchEarnings, []);

  useEffect(() => {
    const closePicker = (event) => {
      if (bankPickerRef.current && !bankPickerRef.current.contains(event.target)) {
        setBankPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', closePicker);
    return () => document.removeEventListener('mousedown', closePicker);
  }, []);

  const selectedBank = nigerianBanks.find((item) => item.name === bank) || nigerianBanks[7];
  const filteredBanks = useMemo(() => {
    const query = bankSearch.trim().toLowerCase();
    if (!query) return nigerianBanks;
    return nigerianBanks.filter((item) => item.name.toLowerCase().includes(query));
  }, [bankSearch]);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num < 5000) return showToast('Minimum withdrawal amount is ₦5,000', false);
    if (num > earnings.availableBalance) return showToast('Amount exceeds your available balance.', false);
    setSubmitting(true);
    try {
      await requestVendorWithdrawal(num, { bank, accountNumber, accountName });
      showToast(`Withdrawal request of ${formatMoney(num)} submitted!`);
      setAmount(''); setAccountNumber(''); setAccountName('');
      fetchEarnings();
    } catch (err) {
      showToast(err.message || 'Failed to submit withdrawal.', false);
    } finally {
      setSubmitting(false);
    }
  };

  const stats = [
    { label: 'Available Vault Balance', value: formatMoney(earnings.availableBalance), trend: 'Ready for instant payout', trendClass: 'positive', iconClass: 'emerald', icon: '₦' },
    { label: 'Pending Settlement', value: formatMoney(earnings.pendingPayouts), trend: 'Releases upon delivery SLA', trendClass: 'neutral', iconClass: 'amber', icon: '⏳' },
    { label: 'Lifetime Revenue', value: formatMoney(earnings.totalEarned), trend: 'All-time gross earnings', trendClass: 'positive', iconClass: 'purple', icon: '✦' },
  ];

  return (
    <div className="vendor-content">
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, padding: '14px 22px', borderRadius: 14, background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.ok ? '#10B981' : '#EF4444'}`, color: toast.ok ? '#10B981' : '#EF4444', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          {toast.ok ? '✓ ' : '✕ '}{toast.msg}
        </div>
      )}

      <section className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-card-accent" />
            <div className="stat-head">
              <span className="stat-title">{stat.label}</span>
              <div className={`stat-icon-bg ${stat.iconClass}`}>{stat.icon}</div>
            </div>
            {loading ? (
              <div style={{ height: 36, background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 8 }} />
            ) : (
              <p className="stat-value">{stat.value}</p>
            )}
            <div className="stat-footer">
              <span className={`trend-badge ${stat.trendClass}`}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>Merchant Payout Settlement</h3>
            <p>Disburse store earnings directly into your registered bank account</p>
          </div>
        </div>

        <form onSubmit={handleWithdraw} className="form-grid">
          <div className="form-group">
            <label className="label">Amount to Withdraw (₦)</label>
            <input type="number" className="input" placeholder="e.g. 50000" value={amount} onChange={(e) => setAmount(e.target.value)} required min={5000} />
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 6 }}>Minimum ₦5,000 · Available: {formatMoney(earnings.availableBalance)}</div>
          </div>

          <div className="form-group">
            <label className="label">Settlement Bank</label>
            <div className="bank-picker" ref={bankPickerRef}>
              <button
                type="button"
                className="bank-picker-trigger"
                onClick={() => setBankPickerOpen((open) => !open)}
                aria-expanded={bankPickerOpen}
                aria-haspopup="listbox"
              >
                <BankLogo bank={selectedBank} />
                <span>{selectedBank.name}</span>
                <span className="bank-picker-chevron">⌄</span>
              </button>
              {bankPickerOpen && (
                <div className="bank-picker-menu" role="listbox" aria-label="Settlement banks">
                  <input
                    className="bank-picker-search"
                    value={bankSearch}
                    onChange={(event) => setBankSearch(event.target.value)}
                    placeholder="Search 100+ banks..."
                    autoFocus
                  />
                  <div className="bank-picker-results">
                    {filteredBanks.length ? filteredBanks.map((item) => (
                      <button
                        type="button"
                        role="option"
                        aria-selected={item.name === bank}
                        className={`bank-picker-option ${item.name === bank ? 'selected' : ''}`}
                        key={`${item.name}-${item.domain}`}
                        onClick={() => {
                          setBank(item.name);
                          setBankSearch('');
                          setBankPickerOpen(false);
                        }}
                      >
                        <BankLogo bank={item} />
                        <span>{item.name}</span>
                        {item.name === bank && <span className="bank-picker-check">✓</span>}
                      </button>
                    )) : (
                      <div className="bank-picker-empty">No bank matches that search.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="label">10-Digit Account Number</label>
            <input type="text" maxLength={10} className="input" placeholder="0123456789" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="label">Account Name</label>
            <input type="text" className="input" placeholder="Account holder name" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
          </div>

          <div className="form-group full" style={{ marginTop: 10 }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting || loading}>
              {submitting ? 'Submitting...' : 'Initiate Instant Bank Transfer →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EarningsPage;
