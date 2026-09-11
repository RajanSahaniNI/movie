import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const CountdownTimer = ({ expiryTimestamp, onExpire }) => {
  const calculateTimeLeft = () => {
    const diff = new Date(expiryTimestamp).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTimestamp, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isLowTime = timeLeft <= 120; // less than 2 minutes

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 18px',
        borderRadius: '12px',
        background: isLowTime ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.12)',
        border: `1px solid ${isLowTime ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.3)'}`,
        boxShadow: isLowTime ? '0 0 15px rgba(239, 68, 68, 0.3)' : '0 0 15px rgba(245, 158, 11, 0.2)',
      }}
    >
      {isLowTime ? (
        <AlertTriangle size={20} color="#ef4444" className="animate-pulse" />
      ) : (
        <Clock size={20} color="#f59e0b" />
      )}
      <div>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', fontWeight: 700 }}>
          Transaction Window
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'monospace', color: isLowTime ? '#ef4444' : '#fbbf24' }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
