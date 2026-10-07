import React, { useEffect, useState } from 'react';

function ToastViewport() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const id = Date.now() + Math.random();
      const toast = { id, ...event.detail };
      setToasts(current => [...current, toast]);
      window.setTimeout(() => {
        setToasts(current => current.filter(item => item.id !== id));
      }, 4200);
    };

    window.addEventListener('youshop:toast', handleToast);
    return () => window.removeEventListener('youshop:toast', handleToast);
  }, []);

  const dismiss = (id) => setToasts(current => current.filter(item => item.id !== id));

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map(toast => (
        <div className={`admin-toast admin-toast-${toast.type || 'error'}`} key={toast.id} role="status">
          <span className="admin-toast-icon" aria-hidden="true">
            {toast.type === 'success' ? '✓' : toast.type === 'info' ? 'i' : '!'}
          </span>
          <span className="admin-toast-message">{toast.message}</span>
          <button type="button" className="admin-toast-dismiss" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">×</button>
        </div>
      ))}
    </div>
  );
}

export default ToastViewport;
