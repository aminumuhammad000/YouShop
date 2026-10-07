import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { showToast } from '../services/toast';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit modal state
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phoneNumber: '', isBanned: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await adminApi.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteUser(id);
      setUsers(users.filter((u) => (u._id || u.id) !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      showToast('Failed to delete user');
    }
  };

  const [statusFilter, setStatusFilter] = useState('All');

  const handleToggleVerify = async (user) => {
    const userId = user._id || user.id;
    const newVerifyState = user.isVerified === false ? true : false;
    const actionText = newVerifyState ? 'approve & verify' : 'revoke verification for';
    try {
      const res = await adminApi.updateUser(userId, { isVerified: newVerifyState });
      const updatedUser = res.data;
      setUsers(users.map((u) => ((u._id || u.id) === userId ? { ...u, ...updatedUser } : u)));
    } catch (err) {
      console.error(`Error updating verification status:`, err);
      showToast('Failed to update verification status');
    }
  };

  const handleToggleBan = async (user) => {
    const userId = user._id || user.id;
    const newBanState = !user.isBanned;
    const actionText = newBanState ? 'ban' : 'unban';
    try {
      const res = await adminApi.updateUser(userId, { isBanned: newBanState });
      const updatedUser = res.data;
      setUsers(users.map((u) => ((u._id || u.id) === userId ? { ...u, ...updatedUser } : u)));
    } catch (err) {
      console.error(`Error updating ban status for user:`, err);
      showToast(`Failed to ${actionText} user`);
    }
  };

  const requestConfirmation = (config) => setConfirmation(config);

  const confirmDelete = (id) => requestConfirmation({
    eyebrow: 'CUSTOMER ACCESS',
    title: 'Delete this customer?',
    message: 'This account and its directory record will be removed permanently.',
    action: 'Delete customer',
    tone: 'danger',
    onConfirm: () => handleDelete(id),
  });

  const confirmVerification = (user) => {
    const nextState = user.isVerified === false;
    requestConfirmation({
      eyebrow: nextState ? 'ACCOUNT REVIEW' : 'VERIFICATION CONTROL',
      title: nextState ? `Approve ${user.name || user.email}?` : `Revoke verification for ${user.name || user.email}?`,
      message: nextState ? 'This customer will become a verified account.' : 'This customer will return to the pending approval queue.',
      action: nextState ? 'Approve & verify' : 'Revoke verification',
      tone: nextState ? 'success' : 'warning',
      onConfirm: () => handleToggleVerify(user),
    });
  };

  const confirmBan = (user) => {
    const nextState = !user.isBanned;
    requestConfirmation({
      eyebrow: 'CUSTOMER ACCESS',
      title: `${nextState ? 'Ban' : 'Unban'} ${user.name || user.email}?`,
      message: nextState ? 'This customer will lose access to their account.' : 'This customer will be able to access their account again.',
      action: nextState ? 'Ban customer' : 'Unban customer',
      tone: nextState ? 'danger' : 'success',
      onConfirm: () => handleToggleBan(user),
    });
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || user.phone || '',
      isBanned: Boolean(user.isBanned),
      isVerified: user.isVerified !== false,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const userId = editingUser._id || editingUser.id;
    setIsSubmitting(true);

    try {
      const res = await adminApi.updateUser(userId, editFormData);
      const updatedUser = res.data;
      setUsers(
        users.map((u) => ((u._id || u.id) === userId ? { ...u, ...updatedUser } : u))
      );
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      showToast('Failed to update user details');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter users by search term and status filter
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase().trim();
    const name = (user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const phone = (user.phoneNumber || user.phone || '').toLowerCase();
    const matchesSearch = !term || name.includes(term) || email.includes(term) || phone.includes(term);

    if (statusFilter === 'Pending') return matchesSearch && user.isVerified === false && !user.isBanned;
    if (statusFilter === 'Verified') return matchesSearch && user.isVerified !== false && !user.isBanned;
    if (statusFilter === 'Banned') return matchesSearch && Boolean(user.isBanned);
    return matchesSearch;
  });

  return (
    <div className="customers-page" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="workspace-heading">
        <p className="page-eyebrow">RELATIONSHIPS / DIRECTORY</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Customers
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
          Manage your registered customers, ban/unban accounts, and search directory.
        </p>
      </div>

      <div className="workspace-metrics">
        <div className="workspace-metric"><span className="metric-mark metric-mark-coral" /><div><strong>{users.length}</strong><span>Total customers</span></div></div>
        <div className="workspace-metric"><span className="metric-mark metric-mark-green" /><div><strong>{users.filter(user => user.isVerified !== false && !user.isBanned).length}</strong><span>Verified accounts</span></div></div>
        <div className="workspace-metric"><span className="metric-mark metric-mark-amber" /><div><strong>{users.filter(user => user.isVerified === false && !user.isBanned).length}</strong><span>Awaiting approval</span></div></div>
      </div>

      <div className="glass-card customer-table-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h3 className="directory-title" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Customer Directory</h3>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Showing {filteredUsers.length} of {users.length} total users
            </span>
          </div>

            <div className="customer-toolbar" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Status Filter Tabs */}
            <div className="customer-filter-tabs" style={{ display: 'flex', gap: '6px', background: 'var(--bg-app)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              {[
                { id: 'All', label: 'All Users' },
                { id: 'Pending', label: 'Pending Approval' },
                { id: 'Verified', label: 'Verified' },
                { id: 'Banned', label: 'Banned' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={statusFilter === f.id ? 'customer-filter active' : 'customer-filter'}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', width: '260px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 14px',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                }}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {searchTerm ? `No users matching "${searchTerm}"` : 'No users found.'}
          </div>
        ) : (
          <div className="data-table-container table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Verification & Status</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const userId = user._id || user.id;
                  const isVerified = user.isVerified !== false;
                  return (
                    <tr key={userId}>
                      <td>
                        <div className="customer-identity">
                          <span className="customer-avatar">{(user.name || user.email || '?').slice(0, 1).toUpperCase()}</span>
                          <div><strong>{user.name || 'Unknown User'}</strong><small>{user.email}</small></div>
                        </div>
                      </td>
                      <td className="customer-email">{user.email}</td>
                      <td>{user.phoneNumber || user.phone || 'N/A'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {user.isBanned ? (
                            <span className="customer-status customer-status-banned">
                              <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#991b1b"/></svg>
                              <span>Banned</span>
                            </span>
                          ) : isVerified ? (
                            <span className="customer-status customer-status-verified">
                              <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#166534"/></svg>
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="customer-status customer-status-pending">
                              <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#92400e"/></svg>
                              <span>Pending Admin Approval</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {!user.isBanned && !isVerified && (
                            <button
                              onClick={() => confirmVerification(user)}
                              className="customer-action customer-action-approve"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              <span>Approve & Verify</span>
                            </button>
                          )}
                          {!user.isBanned && isVerified && (
                            <button
                              onClick={() => confirmVerification(user)}
                              className="customer-action customer-action-revoke"
                            >
                              Revoke
                            </button>
                          )}
                          <button
                            onClick={() => confirmBan(user)}
                            className={`customer-action ${user.isBanned ? 'customer-action-unban' : 'customer-action-ban'}`}
                          >
                            {user.isBanned ? 'Unban' : 'Ban'}
                          </button>
                          <button
                            onClick={() => handleEditClick(user)}
                            className="customer-action customer-action-edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(userId)}
                            className="customer-action customer-action-delete"
                          >
                            Delete
                          </button>
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

      {confirmation && (
        <div className="command-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setConfirmation(null); }}>
          <div className={`command-modal command-modal-${confirmation.tone}`} role="dialog" aria-modal="true" aria-labelledby="command-modal-title">
            <div className="command-modal-icon" aria-hidden="true">
              {confirmation.tone === 'danger' ? '!' : confirmation.tone === 'warning' ? '?' : '✓'}
            </div>
            <p className="command-modal-eyebrow">{confirmation.eyebrow}</p>
            <h2 id="command-modal-title">{confirmation.title}</h2>
            <p className="command-modal-message">{confirmation.message}</p>
            <div className="command-modal-actions">
              <button type="button" className="command-modal-cancel" onClick={() => setConfirmation(null)}>Cancel</button>
              <button type="button" className="command-modal-confirm" onClick={() => { const action = confirmation.onConfirm; setConfirmation(null); action(); }}>{confirmation.action}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '28px',
              backgroundColor: 'var(--bg-card, #ffffff)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Edit Customer</h3>
              <button
                onClick={() => setEditingUser(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                  placeholder="e.g. +123456789"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="isBannedCheckbox"
                  checked={editFormData.isBanned}
                  onChange={(e) => setEditFormData({ ...editFormData, isBanned: e.target.checked })}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="isBannedCheckbox" style={{ fontSize: '0.875rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Ban this user account
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingUser(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
