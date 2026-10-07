import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getChats, sendChatMessage } from '../services/api';

/* ─── REAL SVG ICONS ─── */
const Icons = {
  Phone: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  PhoneOff: () => (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Video: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  VideoOff: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 4l16 16M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  DevicePhone: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  Mic: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  MicOff: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  ),
  Speaker: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  ),
  Paperclip: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Image: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  File: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Audio: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Refresh: ({ spinning }) => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ animation: spinning ? 'spin 1s linear infinite' : 'none' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  CheckSingle: () => (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  ),
  CheckDouble: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 13l4 4L17 7M9 17l2 2L21 9" />
    </svg>
  ),
  ChatEmpty: () => (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
};

const QUICK_RESPONSES = [
  'On my way with your order now',
  'I have arrived at the pickup point',
  'I am outside the delivery address',
  'Please provide gate security code',
  'Encountered traffic, arriving in 8 minutes',
];

const getTimeStr = () => {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const a = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + m + ' ' + a;
};

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

/* ─── ATTACHMENT BUBBLE (LIGHT MODE STYLED) ─── */
const AttachmentBubble = ({ attachment, fromMe }) => {
  if (!attachment) return null;
  const isImg = attachment.type?.startsWith('image/') || attachment.name?.match(/\.(jpg|jpeg|png|webp|gif)$/i);
  const isVid = attachment.type?.startsWith('video/') || attachment.name?.match(/\.(mp4|webm|mov)$/i);
  const isAud = attachment.type?.startsWith('audio/') || attachment.name?.match(/\.(mp3|wav|ogg|webm)$/i);

  if (isImg && attachment.url) {
    return (
      <div style={{ marginTop: 8, borderRadius: 10, overflow: 'hidden', maxWidth: 260 }}>
        <img src={attachment.url} alt="attachment" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 200, objectFit: 'cover' }} />
      </div>
    );
  }
  if (isVid && attachment.url) {
    return (
      <div style={{ marginTop: 8 }}>
        <video src={attachment.url} controls style={{ maxWidth: 260, borderRadius: 10, display: 'block' }} />
      </div>
    );
  }
  if (isAud && attachment.url) {
    return (
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, background: fromMe ? 'rgba(0,0,0,0.15)' : '#F1F5F9', padding: '6px 10px', borderRadius: 8 }}>
        <Icons.Audio />
        <audio src={attachment.url} controls style={{ width: 220, height: 32 }} />
      </div>
    );
  }
  return (
    <a href={attachment.url || '#'} download={attachment.name || 'file'} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 8, padding: '10px 14px', borderRadius: 10, background: fromMe ? 'rgba(255,255,255,0.15)' : '#F1F5F9', border: fromMe ? '1px solid rgba(255,255,255,0.25)' : '1px solid #E2E8F0', textDecoration: 'none', color: fromMe ? '#FFFFFF' : '#0F172A' }}>
      <Icons.File />
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{attachment.name || 'Document'}</div>
        <div style={{ fontSize: '0.72rem', color: fromMe ? 'rgba(255,255,255,0.8)' : '#64748B' }}>{formatBytes(attachment.size)}</div>
      </div>
    </a>
  );
};

/* ─── CALL MODAL ─── */
const CallModal = ({ mode, contact, onEnd }) => {
  const [duration, setDuration] = useState(0);
  const [callState, setCallState] = useState('calling');
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [camOff, setCamOff] = useState(false);
  const timerRef = useRef(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    const answerTimer = setTimeout(() => {
      setCallState('connected');
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
      if (mode === 'video' && localVideoRef.current) {
        navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
          .then(stream => { if (localVideoRef.current) localVideoRef.current.srcObject = stream; })
          .catch(() => {});
      }
    }, 2500);

    return () => {
      clearTimeout(answerTimer);
      clearInterval(timerRef.current);
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(tr => tr.stop());
      }
    };
  }, [mode]);

  const fmtTime = (s) => Math.floor(s / 60).toString().padStart(2, '0') + ':' + (s % 60).toString().padStart(2, '0');

  const handleEnd = () => {
    clearInterval(timerRef.current);
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(tr => tr.stop());
    }
    onEnd();
  };

  const isVideo = mode === 'video';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,23,42,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }}>
      {isVideo ? (
        <div style={{ position: 'relative', width: '92%', maxWidth: 700, height: 500, borderRadius: 24, overflow: 'hidden', background: '#0F172A', boxShadow: '0 25px 50px rgba(0,0,0,0.35)' }}>
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#1E293B 0%,#0F172A 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: contact?.avatarColor || '#8B5CF6', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: 14 }}>
              {(contact?.name || 'C')[0].toUpperCase()}
            </div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '1.3rem', fontWeight: 650 }}>{contact?.name || 'Contact'}</h2>
            <p style={{ color: '#94A3B8', margin: '6px 0 0', fontSize: '0.85rem' }}>{callState === 'calling' ? 'Calling...' : fmtTime(duration)}</p>
          </div>

          <div style={{ position: 'absolute', top: 16, right: 16, width: 120, height: 160, borderRadius: 14, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', background: '#1E293B' }}>
            {camOff ? (
              <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#94A3B8' }}>
                <Icons.VideoOff />
              </div>
            ) : (
              <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>

          <div style={{ position: 'absolute', bottom: 30, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button type="button" onClick={() => setMuted(m => !m)} style={{ width: 50, height: 50, borderRadius: '50%', border: 'none', background: muted ? '#EF4444' : '#334155', color: '#FFF', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
              {muted ? <Icons.MicOff /> : <Icons.Mic />}
            </button>
            <button type="button" onClick={() => setCamOff(c => !c)} style={{ width: 50, height: 50, borderRadius: '50%', border: 'none', background: camOff ? '#EF4444' : '#334155', color: '#FFF', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
              {camOff ? <Icons.VideoOff /> : <Icons.Video />}
            </button>
            <button type="button" onClick={() => setSpeakerOn(s => !s)} style={{ width: 50, height: 50, borderRadius: '50%', border: 'none', background: '#334155', color: '#FFF', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
              <Icons.Speaker />
            </button>
            <button type="button" onClick={handleEnd} style={{ width: 50, height: 50, borderRadius: '50%', border: 'none', background: '#DC2626', color: '#FFF', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
              <Icons.PhoneOff />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: 360, background: '#FFFFFF', borderRadius: 28, border: '1px solid #E2E8F0', padding: '44px 32px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.18)', position: 'relative' }}>
          {callState === 'calling' && (
            <div style={{ position: 'absolute', width: 130, height: 130, borderRadius: '50%', border: '2px solid rgba(139,92,246,0.3)', animation: 'spin 3s linear infinite' }} />
          )}
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: contact?.avatarColor || '#8B5CF6', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: 16, zIndex: 1 }}>
            {(contact?.name || 'C')[0].toUpperCase()}
          </div>
          <h2 style={{ color: '#0F172A', margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>{contact?.name || 'Dispatch Contact'}</h2>
          <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: '0.84rem' }}>{contact?.phone || 'Dispatch Channel'}</p>
          <div style={{ padding: '4px 14px', borderRadius: 999, background: callState === 'calling' ? '#FEF3C7' : '#ECFDF5', color: callState === 'calling' ? '#D97706' : '#059669', fontSize: '0.78rem', fontWeight: 650, marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: callState === 'calling' ? '#D97706' : '#10B981' }} />
            {callState === 'calling' ? 'Ringing...' : 'Connected: ' + fmtTime(duration)}
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 36 }}>
            <button type="button" onClick={() => setMuted(m => !m)} style={{ width: 50, height: 50, borderRadius: '50%', border: '1px solid #E2E8F0', background: muted ? '#FEE2E2' : '#F1F5F9', color: muted ? '#DC2626' : '#334155', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
              {muted ? <Icons.MicOff /> : <Icons.Mic />}
            </button>
            <button type="button" onClick={handleEnd} style={{ width: 54, height: 54, borderRadius: '50%', border: 'none', background: '#DC2626', color: '#FFF', display: 'grid', placeItems: 'center', cursor: 'pointer', boxShadow: '0 4px 14px rgba(220,38,38,0.35)' }}>
              <Icons.PhoneOff />
            </button>
            <button type="button" onClick={() => setSpeakerOn(s => !s)} style={{ width: 50, height: 50, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#F1F5F9', color: '#334155', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
              <Icons.Speaker />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── MAIN DRIVER CHAT PAGE (CRISP LIGHT THEME) ─── */
const DriverChatPage = ({ driver }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [callMode, setCallMode] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [attachPreview, setAttachPreview] = useState(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const recordTimerRef = useRef(null);
  const mediaRecRef = useRef(null);
  const audioChunks = useRef([]);

  /* Fetch live chats from server */
  const fetchChatsFromServer = useCallback(async (isSilent = false) => {
    if (!isSilent) setSyncing(true);
    try {
      const data = await getChats();
      if (Array.isArray(data)) {
        setChats(data);
        if (data.length > 0 && !selectedChatId) {
          setSelectedChatId(data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load live chats:', err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [selectedChatId]);

  useEffect(() => {
    fetchChatsFromServer();
    const interval = setInterval(() => {
      fetchChatsFromServer(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchChatsFromServer]);

  const activeChat = chats.find(c => c._id === selectedChatId) || (chats.length > 0 ? chats[0] : null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  useEffect(() => {
    const closeMenus = () => setShowAttachMenu(false);
    document.addEventListener('click', closeMenus);
    return () => document.removeEventListener('click', closeMenus);
  }, []);

  const handleSendMessage = async (overrideText) => {
    const text = (overrideText !== undefined ? overrideText : inputText).trim();
    if (!text && !attachPreview) return;
    if (!activeChat) return;

    const timeStr = getTimeStr();
    const tempId = 'm_' + Date.now();

    const localMessage = {
      id: tempId,
      fromMe: true,
      type: attachPreview ? 'attachment' : 'text',
      text: text || '',
      attachment: attachPreview || null,
      time: timeStr,
      status: 'sent',
    };

    setChats(prev => prev.map(c => {
      if (c._id === activeChat._id) {
        return {
          ...c,
          messages: [...(c.messages || []), localMessage],
          lastMessage: text || (attachPreview ? attachPreview.name : 'Message'),
          lastMessageTime: new Date().toISOString(),
          unread: 0,
        };
      }
      return c;
    }));

    setInputText('');
    setAttachPreview(null);
    setShowAttachMenu(false);
    setSending(true);

    try {
      await sendChatMessage(activeChat._id, {
        text: text || '',
        attachment: attachPreview || null,
        type: attachPreview ? 'attachment' : 'text',
        time: timeStr,
      }, true);
      fetchChatsFromServer(true);
    } catch (err) {
      console.error('Failed to send message to server:', err);
    } finally {
      setSending(false);
    }
  };

  const handleFileChosen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAttachPreview({ name: file.name, size: file.size, type: file.type, url });
    setShowAttachMenu(false);
    e.target.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      audioChunks.current = [];
      mr.ondataavailable = e => audioChunks.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAttachPreview({ name: 'Voice message.webm', size: blob.size, type: 'audio/webm', url: URL.createObjectURL(blob) });
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecRef.current = mr;
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    } catch {
      alert('Microphone access denied. Please allow microphone permission in your browser.');
    }
  };

  const stopRecording = () => {
    mediaRecRef.current?.stop();
    clearInterval(recordTimerRef.current);
    setIsRecording(false);
  };

  const filteredChats = chats.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = (c.name || '').toLowerCase().includes(q) || (c.orderNumber || '').toLowerCase().includes(q);
    if (filterRole === 'ALL') return matchesQuery;
    if (filterRole === 'CUSTOMERS') return matchesQuery && (c.role === 'Customer' || !c.role);
    if (filterRole === 'VENDORS') return matchesQuery && (c.role || '').includes('Vendor');
    return matchesQuery;
  });

  const selectChat = (id) => {
    setSelectedChatId(id);
    setChats(prev => prev.map(c => c._id === id ? { ...c, unread: 0 } : c));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <style>{`
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 99px; }
        .qchip-light:hover { border-color: #7C3AED !important; color: #7C3AED !important; background: #F3E8FF !important; }
        .chatli-light:hover { background: #F1F5F9 !important; }
        .aopt-light:hover { background: #F1F5F9 !important; }
        .icobtn-light:hover { background: #E2E8F0 !important; color: #0F172A !important; }
      `}</style>

      {callMode && <CallModal mode={callMode} contact={activeChat} onEnd={() => setCallMode(null)} />}

      {/* Light Banner */}
      <div style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #F0FDFA 100%)', border: '1px solid #E2E8F0', borderRadius: 20, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 999, background: 'rgba(124,58,237,0.08)', color: '#7C3AED', fontSize: '0.78rem', fontWeight: 650, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
            LIVE DISPATCH MESSENGER
          </div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0F172A' }}>Customer & Store Live Chat</h1>
          <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.88rem' }}>Connected directly to live server · Real-time delivery communications</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={() => fetchChatsFromServer()} title="Sync with server" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#334155', padding: '8px 14px', borderRadius: 12, fontSize: '0.82rem', fontWeight: 650, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Icons.Refresh spinning={syncing} />
            <span>Sync</span>
          </button>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>ACTIVE PILOT</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>{driver?.name || 'Courier Pilot'}</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#7C3AED,#A78BFA)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(124,58,237,0.25)' }}>
            {(driver?.name || 'D')[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* Main Light Workstation Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,320px) 1fr', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, overflow: 'hidden', minHeight: 640, boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>

        {/* LEFT SIDEBAR (LIGHT) */}
        <div style={{ borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Search names or orders..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 12, padding: '10px 14px 10px 38px', color: '#0F172A', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = '#7C3AED'}
                onBlur={e => e.target.style.borderColor = '#CBD5E1'}
              />
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                <Icons.Search />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {[['ALL','All'],['CUSTOMERS','Customers'],['VENDORS','Merchants']].map(([id, label]) => (
                <button key={id} type="button" onClick={() => setFilterRole(id)} style={{ background: filterRole===id ? 'rgba(124,58,237,0.12)' : '#FFFFFF', color: filterRole===id ? '#7C3AED' : '#64748B', border: filterRole===id ? '1px solid rgba(124,58,237,0.3)' : '1px solid #E2E8F0', padding: '4px 11px', borderRadius: 999, fontSize: '0.73rem', fontWeight: 650, cursor: 'pointer' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 30, color: '#94A3B8', fontSize: '0.85rem' }}>
                Loading conversations...
              </div>
            ) : filteredChats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: '#94A3B8' }}>
                <div style={{ marginBottom: 12, opacity: 0.4, display: 'flex', justifyContent: 'center', color: '#64748B' }}>
                  <Icons.ChatEmpty />
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 650, color: '#475569' }}>No Active Chats</div>
                <p style={{ margin: '6px 0 0', fontSize: '0.78rem' }}>Conversations with customers or stores will appear here.</p>
              </div>
            ) : (
              filteredChats.map(c => {
                const isSel = c._id === activeChat?._id;
                const msgs = c.messages || [];
                const lastM = msgs[msgs.length - 1];
                return (
                  <div key={c._id} className="chatli-light" onClick={() => selectChat(c._id)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 12px', borderRadius: 14, marginBottom: 3, background: isSel ? '#F3E8FF' : 'transparent', border: isSel ? '1px solid rgba(124,58,237,0.25)' : '1px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: c.avatarColor || '#8B5CF6', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                        {(c.name || 'C')[0].toUpperCase()}
                      </div>
                      {c.online !== false && (
                        <span style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#10B981', border: '2px solid #FFFFFF' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.87rem', fontWeight: 650, color: isSel ? '#7C3AED' : '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.name || 'Customer'}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', whiteSpace: 'nowrap', marginLeft: 6 }}>
                          {lastM?.time || ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 }}>
                        <p style={{ margin: 0, fontSize: '0.77rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                          {lastM?.type === 'attachment'
                            ? (lastM.attachment?.name || 'Attachment')
                            : (lastM?.text || c.lastMessage || 'Open conversation')}
                        </p>
                        {c.unread > 0 && (
                          <span style={{ background: '#7C3AED', color: '#fff', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, padding: '1px 7px' }}>
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL (LIGHT) */}
        {activeChat ? (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, background: '#FFFFFF' }}>
            {/* Chat Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: activeChat.avatarColor || '#8B5CF6', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  {(activeChat.name || 'C')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0F172A' }}>{activeChat.name || 'Delivery Contact'}</h3>
                    <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 650, background: activeChat.online !== false ? 'rgba(16,185,129,0.12)' : '#F1F5F9', color: activeChat.online !== false ? '#059669' : '#64748B' }}>
                      {activeChat.online !== false ? 'Online' : 'Standby'}
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#64748B' }}>
                    {activeChat.orderNumber ? activeChat.orderNumber + ' · ' : ''}{activeChat.deliveryAddress || 'Delivery Coordination'}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setCallMode('voice')} title="Voice Call" style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(16,185,129,0.25)', cursor: 'pointer', background: 'rgba(16,185,129,0.08)', color: '#059669', display: 'grid', placeItems: 'center', transition: 'all 0.15s' }}>
                  <Icons.Phone />
                </button>
                <button type="button" onClick={() => setCallMode('video')} title="Video Call" style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(124,58,237,0.25)', cursor: 'pointer', background: 'rgba(124,58,237,0.08)', color: '#7C3AED', display: 'grid', placeItems: 'center', transition: 'all 0.15s' }}>
                  <Icons.Video />
                </button>
                {activeChat.phone && (
                  <a href={'tel:' + activeChat.phone} title={'Direct Call: ' + activeChat.phone} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#64748B', display: 'grid', placeItems: 'center', textDecoration: 'none', transition: 'all 0.15s' }}>
                    <Icons.DevicePhone />
                  </a>
                )}
              </div>
            </div>

            {/* Messages body (Light theme) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, background: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 8px' }}>
                <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>Dispatch Thread</span>
                <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
              </div>

              {(!activeChat.messages || activeChat.messages.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>No messages exchanged yet.</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>Send a message or delivery update below.</p>
                </div>
              ) : (
                activeChat.messages.map((msg, mIdx) => (
                  <div key={msg.id || msg._id || mIdx} style={{ display: 'flex', justifyContent: msg.fromMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
                    {!msg.fromMe && (
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: activeChat.avatarColor || '#8B5CF6', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                        {(activeChat.name || 'C')[0].toUpperCase()}
                      </div>
                    )}
                    <div style={{ maxWidth: '72%', padding: '10px 14px', borderRadius: 18, borderBottomRightRadius: msg.fromMe ? 4 : 18, borderBottomLeftRadius: msg.fromMe ? 18 : 4, background: msg.fromMe ? 'linear-gradient(135deg,#7C3AED 0%,#6D28D9 100%)' : '#FFFFFF', border: msg.fromMe ? 'none' : '1px solid #E2E8F0', color: msg.fromMe ? '#FFFFFF' : '#0F172A', fontSize: '0.88rem', lineHeight: 1.45, boxShadow: msg.fromMe ? '0 4px 14px rgba(124,58,237,0.22)' : '0 2px 8px rgba(0,0,0,0.04)' }}>
                      {msg.text && <p style={{ margin: 0 }}>{msg.text}</p>}
                      {msg.attachment && <AttachmentBubble attachment={msg.attachment} fromMe={msg.fromMe} />}
                      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: msg.fromMe ? 'flex-end' : 'flex-start', gap: 4 }}>
                        <span style={{ fontSize: '0.68rem', color: msg.fromMe ? 'rgba(255,255,255,0.7)' : '#94A3B8' }}>
                          {msg.time || 'Now'}
                        </span>
                        {msg.fromMe && (
                          <span style={{ color: msg.status === 'read' ? '#93C5FD' : 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center' }}>
                            {msg.status === 'read' ? <Icons.CheckDouble /> : <Icons.CheckSingle />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies (Light) */}
            <div style={{ padding: '8px 18px', borderTop: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
              {QUICK_RESPONSES.map((chip, i) => (
                <button key={i} type="button" className="qchip-light" onClick={() => handleSendMessage(chip)}
                  style={{ flexShrink: 0, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#334155', padding: '5px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                  {chip}
                </button>
              ))}
            </div>

            {/* Attachment preview strip */}
            {attachPreview && (
              <div style={{ padding: '8px 18px', background: '#F1F5F9', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#FFFFFF', borderRadius: 10, padding: '8px 12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ color: '#7C3AED' }}>
                    {attachPreview.type.startsWith('image') ? <Icons.Image /> : attachPreview.type.startsWith('audio') ? <Icons.Audio /> : <Icons.File />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 650, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {attachPreview.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{formatBytes(attachPreview.size)}</div>
                  </div>
                  {attachPreview.type.startsWith('image') && (
                    <img src={attachPreview.url} alt="preview" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                  )}
                </div>
                <button type="button" onClick={() => setAttachPreview(null)} style={{ background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: 8, padding: '6px 10px', fontSize: '0.78rem', fontWeight: 650, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icons.Close /> Remove
                </button>
              </div>
            )}

            {/* Input bar (Light theme) */}
            <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }} style={{ padding: '12px 16px', borderTop: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              <input ref={imageInputRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileChosen} />
              <input ref={fileInputRef}  type="file" accept="*/*"            style={{ display: 'none' }} onChange={handleFileChosen} />

              {/* Attachment button */}
              <div style={{ position: 'relative' }}>
                <button type="button" className="icobtn-light" onClick={e => { e.stopPropagation(); setShowAttachMenu(s => !s); }}
                  style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #E2E8F0', background: showAttachMenu ? '#F3E8FF' : '#F8FAFC', color: showAttachMenu ? '#7C3AED' : '#64748B', display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}>
                  <Icons.Paperclip />
                </button>
                {showAttachMenu && (
                  <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', bottom: 52, left: 0, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 6, zIndex: 50, boxShadow: '0 16px 36px rgba(0,0,0,0.12)', minWidth: 170 }}>
                    <button type="button" className="aopt-light" onClick={() => { imageInputRef.current?.click(); setShowAttachMenu(false); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: '#334155', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                      <Icons.Image /> Photo / Video
                    </button>
                    <button type="button" className="aopt-light" onClick={() => { fileInputRef.current?.click(); setShowAttachMenu(false); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: '#334155', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                      <Icons.File /> Document / File
                    </button>
                  </div>
                )}
              </div>

              {/* Textarea */}
              <textarea rows={1} placeholder={isRecording ? 'Recording voice note...' : 'Type message to ' + (activeChat.name || 'contact') + '...'} value={inputText}
                onChange={e => { setInputText(e.target.value); e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,120)+'px'; }}
                onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleSendMessage();} }}
                disabled={isRecording}
                style={{ flex: 1, background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 14, padding: '10px 16px', color: '#0F172A', fontSize: '0.9rem', outline: 'none', resize: 'none', lineHeight: 1.4, maxHeight: 120, overflowY: 'auto', scrollbarWidth: 'none', opacity: isRecording ? 0.4 : 1, transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor='#7C3AED'}
                onBlur={e => e.target.style.borderColor='#CBD5E1'}
              />

              {/* Voice record button */}
              {!inputText.trim() && !attachPreview && (
                <button type="button" onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording} title="Hold to record voice message"
                  style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #E2E8F0', flexShrink: 0, background: isRecording ? '#FEE2E2' : '#F8FAFC', color: isRecording ? '#DC2626' : '#64748B', display: 'grid', placeItems: 'center', cursor: 'pointer', animation: isRecording ? 'pulse-dot 1s ease-in-out infinite' : 'none', transition: 'all 0.15s' }}>
                  <Icons.Mic />
                </button>
              )}

              {/* Recording timer badge */}
              {isRecording && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#DC2626', fontSize: '0.82rem', fontWeight: 650, padding: '6px 10px', borderRadius: 10, background: '#FEE2E2', border: '1px solid #FECACA', whiteSpace: 'nowrap' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'pulse-dot 1s ease-in-out infinite' }} />
                  {Math.floor(recordSeconds/60).toString().padStart(2,'0')}:{(recordSeconds%60).toString().padStart(2,'0')}
                </div>
              )}

              {/* Send button */}
              {(inputText.trim() || attachPreview) && (
                <button type="submit" disabled={sending}
                  style={{ height: 40, borderRadius: 12, border: 'none', padding: '0 18px', background: 'linear-gradient(135deg,#7C3AED 0%,#6D28D9 100%)', color: '#FFF', fontWeight: 650, fontSize: '0.88rem', cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1, display: 'inline-flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(124,58,237,0.3)', flexShrink: 0 }}>
                  {sending ? '...' : (<><span>Send</span><Icons.Send /></>)}
                </button>
              )}
            </form>
          </div>
        ) : (
          <div style={{ display: 'grid', placeItems: 'center', color: '#94A3B8', fontSize: '0.9rem', padding: 40, textAlign: 'center', background: '#FFFFFF' }}>
            <div>
              <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center', opacity: 0.4, color: '#64748B' }}>
                <Icons.ChatEmpty />
              </div>
              <div style={{ fontWeight: 650, color: '#334155' }}>No Conversation Selected</div>
              <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#94A3B8' }}>Select a contact from the directory on the left to start live messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverChatPage;
