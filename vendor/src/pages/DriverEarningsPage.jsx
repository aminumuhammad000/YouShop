import React, { useEffect, useState } from 'react';
import { getDriverDashboardData, requestDriverCashout, getDriverPayoutHistory } from '../services/api';
import { BankIcon, ArrowUpRightIcon, ArrowRightIcon, CheckIcon, XIcon, SparklesIcon } from '../components/Icons';

const DriverEarningsPage = ({ driver }) => {
  const [stats, setStats] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('GTBank');
  const [accNum, setAccNum] = useState('');
  const [accName, setAccName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [res, payout] = await Promise.all([
        getDriverDashboardData(),
        getDriverPayoutHistory(),
      ]);
      setStats(res.stats);
      setPayouts(Array.isArray(payout) ? payout : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num < 1000) return showToast('Minimum payout amount is ₦1,000', false);
    setSubmitting(true);
    try {
      await requestDriverCashout(num, { bankName, accountNumber: accNum, accountName: accName });
      showToast(`Payout of ₦${num.toLocaleString()} submitted to ${bankName}!`);
      setShowWithdrawModal(false);
      setAmount('');
      setAccNum('');
      setAccName('');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to submit payout', false);
    } finally {
      setSubmitting(false);
    }
  };

  const totalEarned = stats?.totalEarned || 0;
  const completedTrips = stats?.completedTrips || 0;
  const tierLabel = completedTrips >= 200 ? 'Platinum Pilot' : completedTrips >= 100 ? 'Gold Pilot' : completedTrips >= 50 ? 'Silver Pilot' : 'Rising Pilot';
  const tierBonus = completedTrips >= 200 ? '+10%' : completedTrips >= 100 ? '+5%' : '+2%';

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

      {/* Metric Cards with Liquid Hover */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-accent" />
          <div className="stat-head">
            <span className="stat-title">Available Wallet Balance</span>
            <div className="stat-icon-bg emerald">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          {loading ? (
            <div style={{ height: 36, background: 'rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 8 }} />
          ) : (
            <div className="stat-value">&#8358;{totalEarned.toLocaleString()}</div>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowWithdrawModal(true)}
            style={{ marginTop: 10, width: '100%' }}
          >
            <span>Instant Bank Payout</span>
            <ArrowUpRightIcon size={16} />
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent" />
          <div className="stat-head">
            <span className="stat-title">Total Deliveries</span>
            <div className="stat-icon-bg purple">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{loading ? '—' : `${completedTrips} Trips`}</div>
          <div className="stat-footer">
            <span className="trend-badge positive">
              {completedTrips > 0
                ? `₦${Math.round(totalEarned / completedTrips).toLocaleString()} avg/trip`
                : 'Complete your first trip'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent" />
          <div className="stat-head">
            <span className="stat-title">Pilot Tier &amp; Bonus</span>
            <div className="stat-icon-bg amber">
              <SparklesIcon size={20} />
            </div>
          </div>
          <div className="stat-value">{tierLabel}</div>
          <div className="stat-footer">
            <span className="trend-badge positive">{tierBonus} High Velocity Bonus</span>
          </div>
        </div>
      </div>

      {/* Payout Disbursements Table */}
      <div className="card-panel" style={{ marginTop: 24 }}>
        <div className="section-header">
          <div className="section-title-group">
            <h3>Recent Payout Disbursements</h3>
            <p>Direct bank transfers and instant settlement ledger</p>
          </div>
        </div>
        {loading ? (
          <div style={{ padding: 30, textAlign: 'center', color: '#64748B' }}>
            <div className="auth-spinner" style={{ margin: '0 auto 12px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
          </div>
        ) : payouts.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#14B8A6' }}>
              <BankIcon size={48} />
            </div>
            <p style={{ fontWeight: 600, color: '#CBD5E1', marginBottom: 6 }}>No payouts yet</p>
            <p style={{ fontSize: '0.85rem' }}>Your payout requests will appear here after submission.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bank</th>
                  <th>Account</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p, i) => (
                  <tr key={p._id || i}>
                    <td style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ color: '#CBD5E1', fontSize: '0.87rem' }}>{p.bankName}</td>
                    <td style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                      {p.accountNumber ? `•••• ${p.accountNumber.slice(-4)}` : '—'}
                    </td>
                    <td>
                      <strong style={{ color: '#14B8A6' }}>
                        &#8358;{Number(p.amount).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'Completed' || p.status === 'Approved' ? 'active' : 'pending'}`}>
                        {p.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cashout Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">INSTANT CASHOUT</span>
                <h3 style={{ margin: '4px 0 0' }}>Transfer to Bank Account</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setShowWithdrawModal(false)}>
                <XIcon size={18} />
              </button>
            </div>
            <form onSubmit={handleWithdraw}>
              <div className="modal-body" style={{ padding: 24 }}>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="label">Withdrawal Amount (&#8358;)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="e.g. 15000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={1000}
                    required
                  />
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 6 }}>
                    Minimum ₦1,000 · Available Balance: ₦{totalEarned.toLocaleString()}
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="label">Destination Bank</label>
                  <select className="select" value={bankName} onChange={(e) => setBankName(e.target.value)}>
                    <option value="GTBank">GTBank</option>
                    <option value="Access Bank">Access Bank</option>
                    <option value="Zenith Bank">Zenith Bank</option>
                    <option value="First Bank">First Bank</option>
                    <option value="UBA">UBA</option>
                    <option value="Opay">Opay</option>
                    <option value="Palmpay">Palmpay</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="label">10-Digit Account Number</label>
                  <input
                    type="text"
                    className="input"
                    maxLength={10}
                    placeholder="0123456789"
                    value={accNum}
                    onChange={(e) => setAccNum(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Account Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Account holder full name"
                    value={accName}
                    onChange={(e) => setAccName(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', padding: '16px 24px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowWithdrawModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <span>{submitting ? 'Processing...' : 'Initiate Transfer'}</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverEarningsPage;
