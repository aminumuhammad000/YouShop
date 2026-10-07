import React, { useState, useEffect, useRef } from 'react';
import { getChats, getChatById, sendMessage } from '../services/api';

// Professional SVG Icons
const Icons = {
  Chat: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Mic: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  EmptyState: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
};

function ChatZone() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatDetail, setChatDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [listLoading, setListLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // ---------- Load chat list ----------
  const loadChats = async () => {
    try {
      setListLoading(true);
      const data = await getChats();
      const list = Array.isArray(data) ? data : [];
      setChats(list);
      if (list.length > 0 && !selectedChatId) {
        setSelectedChatId(list[0]._id || list[0].id || null);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
      setChats([]);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  // ---------- Load chat detail ----------
  useEffect(() => {
    if (!selectedChatId) {
      setChatDetail(null);
      return;
    }
    const loadDetail = async () => {
      try {
        setDetailLoading(true);
        setChatDetail(null);
        const detail = await getChatById(selectedChatId);
        setChatDetail(detail || null);
      } catch (err) {
        console.error('Error fetching chat detail:', err);
        setChatDetail(null);
      } finally {
        setDetailLoading(false);
      }
    };
    loadDetail();
  }, [selectedChatId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatDetail]);

  // ---------- Send reply ----------
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChatId || sending) return;
    setSending(true);
    try {
      await sendMessage(selectedChatId, replyText.trim(), false);
      setReplyText('');
      const updated = await getChatById(selectedChatId);
      setChatDetail(updated || null);
      await loadChats();
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSending(false);
    }
  };

  // ---------- Filter ----------
  const filteredChats = chats.filter((c) => {
    if (!c) return false;
    const name = c.name || '';
    const msg = c.lastMessage || c.msg || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'Unread') return matchesSearch && (c.unread || 0) > 0;
    return matchesSearch;
  });

  const getInitial = (name) => (name && name.length > 0 ? name.charAt(0).toUpperCase() : 'U');

  return (
    <div className="chat-zone-page" style={{
      height: 'calc(100vh - 72px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 20px',
      boxSizing: 'border-box',
      background: 'var(--bg-app)'
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px',
        flexShrink: 0
      }}>
        <div className="chat-zone-heading" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #00D5C3, #8B2BE2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff'
          }}>
            <Icons.Chat />
          </div>
          <div>
            <p className="page-eyebrow">RELATIONSHIPS / CONCIERGE</p>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>
              Chat Zone
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', margin: 0 }}>
              Live customer support hub and application messaging network
            </p>
          </div>
        </div>

        <button
          onClick={loadChats}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700 }}
        >
          <Icons.Refresh />
          <span>Refresh</span>
        </button>
      </div>

      {/* Full-Screen Split Pane Container */}
      <div className="chat-zone-shell" style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '340px 1fr',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
        minHeight: 0
      }}>
        {/* LEFT: Conversation List */}
        <div className="chat-zone-sidebar" style={{
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-color)',
          background: 'var(--bg-app)',
          minHeight: 0
        }}>
          {/* Search & Filter */}
          <div style={{ padding: '14px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>
                <Icons.Search />
              </span>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['All', 'Unread'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: filter === f ? '#00D5C3' : 'var(--bg-card)',
                    color: filter === f ? '#0F172A' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List Items */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {listLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Loading conversations...
              </div>
            ) : filteredChats.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                No conversations found
              </div>
            ) : (
              filteredChats.map((c) => {
                const chatId = c._id || c.id;
                const isSelected = chatId === selectedChatId;
                return (
                  <div className={`chat-list-item ${isSelected ? 'is-selected' : ''}`}
                    key={chatId}
                    onClick={() => setSelectedChatId(chatId)}
                    style={{
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(0, 213, 195, 0.08)' : 'transparent',
                      borderLeft: isSelected ? '4px solid #00D5C3' : '4px solid transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                      background: c.avatarColor || '#8B2BE2',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1rem'
                    }}>
                      {getInitial(c.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.name || 'User'}
                        </span>
                        {(c.unread || 0) > 0 && (
                          <span style={{ background: '#8B2BE2', color: '#fff', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '10px', fontWeight: 800 }}>
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.lastMessage || c.msg || 'No messages'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Active Chat View */}
        {detailLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
            Loading conversation...
          </div>
        ) : selectedChatId && chatDetail ? (
          <div className="chat-zone-conversation" style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', minHeight: 0 }}>
            {/* Active User Header */}
            <div className="chat-zone-messages" style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: chatDetail.avatarColor || '#8B2BE2',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1.05rem'
                }}>
                  {getInitial(chatDetail.name)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {chatDetail.name || 'Customer'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                    <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                      Active Support Session
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'var(--bg-app)'
            }}>
              {Array.isArray(chatDetail.messages) && chatDetail.messages.length > 0 ? (
                chatDetail.messages.map((m, idx) => {
                  if (!m) return null;
                  const isCustomer = !!m.fromMe;
                  const msgKey = `${selectedChatId}_${m.id || m._id || idx}_${idx}`;
                  return (
                    <div
                      key={msgKey}
                      style={{
                        alignSelf: isCustomer ? 'flex-start' : 'flex-end',
                        maxWidth: '65%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isCustomer ? 'flex-start' : 'flex-end'
                      }}
                    >
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px', paddingLeft: '4px', paddingRight: '4px' }}>
                        {isCustomer ? (chatDetail.name || 'Customer') : 'Admin (You)'}{m.time ? ` • ${m.time}` : ''}
                      </span>
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: isCustomer ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                        background: isCustomer ? 'var(--bg-card)' : 'linear-gradient(135deg, #00D5C3, #00B3A4)',
                        color: isCustomer ? 'var(--text-primary)' : '#0F172A',
                        border: isCustomer ? '1px solid var(--border-color)' : 'none',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        fontWeight: isCustomer ? 500 : 700,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {m.isVoice ? (
                          <>
                            <Icons.Mic />
                            <span>Voice Note</span>
                          </>
                        ) : (
                          m.text || ''
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '80px', fontSize: '0.9rem' }}>
                  No messages yet in this conversation.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input Bar */}
            <form className="chat-zone-reply"
              onSubmit={handleSendReply}
              style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                gap: '12px',
                background: 'var(--bg-card)',
                flexShrink: 0
              }}
            >
              <input
                type="text"
                placeholder={`Type a reply to ${chatDetail.name || 'customer'}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={sending || !replyText.trim()}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #8B2BE2, #6C63FF)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: (sending || !replyText.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (sending || !replyText.trim()) ? 0.55 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{sending ? 'Sending...' : 'Send Reply'}</span>
                <Icons.Send />
              </button>
            </form>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            gap: '14px'
          }}>
            <Icons.EmptyState />
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              Select a conversation
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Choose a customer from the left list to view their messages and reply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatZone;
