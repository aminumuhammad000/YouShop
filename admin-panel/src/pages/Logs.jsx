import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      const res = await adminApi.getLogs();
      // Assume newest first or sort manually
      const sorted = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLogs(sorted);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the visible logs?')) {
      setLogs([]);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.level === filter; // level could be info, warn, error
  });

  return (
    <div className="logs-page" style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
      <div className="logs-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div className="workspace-heading">
          <p className="page-eyebrow">SYSTEM / AUDIT TRAIL</p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>System Logs</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
            Monitor system activities, errors, and admin actions.
          </p>
        </div>
        
        <div className="logs-actions" style={{ display: 'flex', gap: '12px' }}>
          <select 
            className="input-field" 
            style={{ width: '150px', padding: '8px 12px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warnings</option>
            <option value="error">Errors</option>
          </select>
          <button className="btn btn-danger logs-clear-button" onClick={handleClear}>Clear logs</button>
        </div>
      </div>

      <div className="glass-card logs-console" style={{ 
        flex: 1, 
        padding: '0', 
        background: '#0d1117', 
        border: '1px solid #30363d',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          padding: '12px 20px', 
          background: '#161b22', 
          borderBottom: '1px solid #30363d',
          display: 'flex',
          gap: '8px'
        }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.6' }}>
          {loading ? (
            <div style={{ color: '#8b949e' }}>[SYSTEM] Loading logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ color: '#8b949e' }}>[SYSTEM] No logs found matching criteria.</div>
          ) : (
            filteredLogs.map((log) => {
              const dateStr = new Date(log.createdAt).toISOString().replace('T', ' ').substring(0, 19);
              const color = log.level === 'error' ? '#ff7b72' : log.level === 'warn' ? '#d2a8ff' : '#79c0ff';
              const levelStr = (log.level || 'info').toUpperCase().padEnd(5);
              
              return (
                <div key={log._id || log.id} style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <span style={{ color: '#8b949e', flexShrink: 0 }}>[{dateStr}]</span>
                  <span style={{ color, fontWeight: 'bold', flexShrink: 0 }}>[{levelStr}]</span>
                  <span style={{ color: '#c9d1d9' }}>
                    {log.action} {log.details ? `- ${log.details}` : ''}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Logs;
