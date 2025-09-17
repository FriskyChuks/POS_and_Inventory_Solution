import { useEffect, useState } from 'react';

const Message = ({ text, type = 'info', duration = 6000 }) => {
  const [visible, setVisible] = useState(!!text);

  useEffect(() => {
    if (text) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [text, duration]);

  if (!visible) return null;

  const styles = {
    success: {
      bg: '#d4edda',
      border: '#c3e6cb',
      color: '#155724',
      icon: '✅',
    },
    error: {
      bg: '#f8d7da',
      border: '#f5c6cb',
      color: '#721c24',
      icon: '❌',
    },
    info: {
      bg: '#d1ecf1',
      border: '#bee5eb',
      color: '#0c5460',
      icon: 'ℹ️',
    },
    warning: {
      bg: '#fff3cd',
      border: '#ffeeba',
      color: '#856404',
      icon: '⚠️',
    },
  };

  const { bg, border, color, icon } = styles[type] || styles.info;

  return (
    <div
      style={{
        padding: '10px 14px',
        margin: '10px 0',
        borderRadius: '6px',
        border: `1px solid ${border}`,
        backgroundColor: bg,
        color: color,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
};

export default Message;
