import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Seat from '../components/Seat';
import { ArrowLeft, Clock, Film, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [holding, setHolding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchShow = async () => {
    try {
      const res = await api.get(`/shows/${showId}`);
      if (res.data.success) {
        setShow(res.data.show);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error loading show details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShow();
    // Poll every 10 seconds to keep seat states synced in real time
    const interval = setInterval(fetchShow, 10000);
    return () => clearInterval(interval);
  }, [showId]);

  const handleSeatToggle = (seatNumber) => {
    setErrorMessage('');
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        if (prev.length >= 8) {
          setErrorMessage('Maximum 8 seats can be selected per transaction.');
          return prev;
        }
        return [...prev, seatNumber];
      }
    });
  };

  const handleProceedToPay = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/seat-selection/${showId}` } });
      return;
    }

    if (selectedSeats.length === 0) {
      setErrorMessage('Please select at least one seat to proceed.');
      return;
    }

    setHolding(true);
    setErrorMessage('');

    try {
      const res = await api.post('/bookings/hold', {
        showId: show._id,
        seats: selectedSeats,
      });

      if (res.data.success) {
        navigate('/payment', {
          state: {
            show,
            seats: selectedSeats,
            lockedUntil: res.data.lockedUntil,
            expiresInSeconds: res.data.expiresInSeconds,
          },
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to hold seats. Please choose another seat.';
      setErrorMessage(msg);
      // Refresh seat state to reflect recent locks
      fetchShow();
    } finally {
      setHolding(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
        Loading theatre seat layout...
      </div>
    );
  }

  if (!show) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center' }} className="glass-panel">
        <h2>Show not found</h2>
        <Link to="/movies" className="btn-primary" style={{ marginTop: '20px' }}>
          Back to Movies
        </Link>
      </div>
    );
  }

  // Group seats by row
  const rowsMap = {};
  show.seats.forEach((seat) => {
    const r = seat.row || seat.seatNumber.charAt(0);
    if (!rowsMap[r]) rowsMap[r] = [];
    rowsMap[r].push(seat);
  });

  const sortedRows = Object.keys(rowsMap).sort();
  const totalPrice = selectedSeats.length * show.price;

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
      
      {/* Top Breadcrumb & Movie Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <Link to={`/movie/${show.movieId?._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Change Show / Movie
        </Link>

        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '1.4rem' }}>{show.movieId?.title}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            {show.theatreId?.name} • {show.screen} • {show.date} • <span style={{ color: '#10b981', fontWeight: 700 }}>{show.startTime}</span>
          </p>
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5',
          padding: '14px 20px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.95rem'
        }}>
          <AlertCircle size={20} color="#ef4444" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Seat Layout Panel */}
      <div className="glass-panel" style={{ padding: '30px 20px' }}>
        
        {/* Screen Graphic */}
        <div className="cinema-screen-container">
          <div className="cinema-screen-curve" />
          <div className="cinema-screen-light" />
          <div className="cinema-screen-text">All eyes this way • Screen</div>
        </div>

        {/* Seat Grid */}
        <div className="seats-grid-wrapper">
          {sortedRows.map((rowKey) => (
            <div key={rowKey} className="seat-row">
              <span className="seat-row-label">{rowKey}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {rowsMap[rowKey]
                  .sort((a, b) => a.number - b.number)
                  .map((seat) => (
                    <Seat
                      key={seat.seatNumber}
                      seat={seat}
                      isSelected={selectedSeats.includes(seat.seatNumber)}
                      onToggle={handleSeatToggle}
                      currentUserId={user?._id}
                    />
                  ))}
              </div>
              <span className="seat-row-label">{rowKey}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#192231', border: '1px solid rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#06b6d4', border: '1px solid #38bdf8' }} />
            <span style={{ color: 'var(--text-muted)' }}>Selected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#b45309', border: '1px solid #f59e0b' }} />
            <span style={{ color: 'var(--text-muted)' }}>Held (Locked)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#3f1215', border: '1px solid rgba(239, 68, 68, 0.3)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Booked</span>
          </div>
        </div>

      </div>

      {/* Floating Bottom Selection Bar */}
      <div className="glass-panel" style={{
        marginTop: '24px',
        padding: '20px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Selected Seats ({selectedSeats.length})
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            Price: Rs. {show.price} / ticket
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>
            Rs. {totalPrice}
          </div>
        </div>

        <button
          onClick={handleProceedToPay}
          disabled={selectedSeats.length === 0 || holding}
          className="btn-primary"
          style={{ padding: '14px 32px', fontSize: '1rem' }}
        >
          {holding ? 'Securing Seats...' : 'Proceed to Pay'}
        </button>

      </div>

    </div>
  );
};

export default SeatSelection;
