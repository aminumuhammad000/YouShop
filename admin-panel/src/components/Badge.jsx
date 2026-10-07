import React from 'react';

function Badge({ type, children }) {
  const badgeClass = `badge-pill badge-${type || 'info'}`;
  return (
    <span className={badgeClass}>
      {children}
    </span>
  );
}

export default Badge;
