import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import { CreditCard, AlertCircle, ArrowLeft, Building, Calendar, Clock, Ticket } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!state || !state.show || !state.seats) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }} className="glass-panel">
        <h3>No active transaction found</h3>
        <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>Your session may have expired or was reloaded.</p>
        <Link to="/movies" className="btn-primary">Browse Movies</Link>
      </div>
    );
  }

  const { show, seats, lockedUntil } = state;
  const totalPrice = seats.length * show.price;

  const handleExpiry = () => {
    alert('Transaction cancelled. Your selected seat has been released. Please try again.');
    navigate(`/seat-selection/${show._id}`);
  };

  const handleCancelHold = async () => {
    try {
      await api.post('/bookings/cancel', {
        showId: show._id,
        seats,
      });
    } catch (err) {
      console.error('Error cancelling hold:', err);
    }
    navigate(`/seat-selection/${show._id}`);
  };

  const handlePayAtCounter = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.post('/bookings/pay-counter', {
        showId: show._id,
        seats,
      });

      if (res.data.success) {
        navigate('/booking-success', {
          state: { booking: res.data.booking },
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment processing failed. Your hold may have expired.';
      setErrorMessage(msg);
      setTimeout(() => {
        navigate(`/seat-selection/${show._id}`);
      }, 3500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Top Header & Countdown */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Checkout & Payment</h1>
          <p style={{ color: 'var(--text-muted)' }}>Pay at counter to complete your cinema ticket reservation</p>
        </div>

        <CountdownTimer
          expiryTimestamp={lockedUntil || new Date(Date.now() + 15 * 60 * 1000)}
          onExpire={handleExpiry}
        />
      </div>

      {errorMessage && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5',
          padding: '14px 20px',
          borderRadius: '10px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <AlertCircle size={20} color="#ef4444" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Booking Summary Box */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '24px' }}>
        
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          Booking Summary
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Movie</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{show.movieId?.title}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Theatre & Screen</div>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{show.theatreId?.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{show.screen}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Date & Show Time</div>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{show.date}</div>
            <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>{show.startTime}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Seats Reserved</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>{seats.join(', ')}</div>
          </div>
        </div>

        {/* Amount Breakdown */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '18px 24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tickets ({seats.length} x Rs. {show.price})</span>
            <span>Rs. {totalPrice}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Convenience Fee</span>
            <span style={{ color: '#10b981' }}>Rs. 0 (Free)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '1.25rem', fontWeight: 800 }}>
            <span>Total Payable</span>
            <span style={{ color: '#fbbf24' }}>Rs. {totalPrice}</span>
          </div>
        </div>

      </div>

      {/* Payment Action Section */}
      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Payment Mode: Pay at Cinema Counter</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 24px auto' }}>
          No upfront online payment required. Your seats are locked for 15 minutes. Click below to generate your official booking code and PDF receipt.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={handlePayAtCounter}
            disabled={loading}
            className="btn-gold"
            style={{ padding: '16px 42px', fontSize: '1.1rem', letterSpacing: '0.05em' }}
          >
            <Ticket size={22} />
            {loading ? 'Confirming Booking...' : 'PAY AT COUNTER'}
          </button>

          <button
            onClick={handleCancelHold}
            className="btn-secondary"
            style={{ padding: '16px 24px' }}
          >
            Cancel & Release Seats
          </button>
        </div>
      </div>

    </div>
  );
};

export default Payment;
