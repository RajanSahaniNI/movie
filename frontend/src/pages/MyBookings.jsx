import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Ticket, Download, Calendar, Clock, MapPin, Film, AlertCircle } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my');
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDownloadReceipt = (booking) => {
    const token = JSON.parse(localStorage.getItem('cinema_user') || '{}').token;
    fetch(`/api/bookings/${booking._id}/receipt`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt-${booking.bookingCode}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => {
        console.error('Error downloading receipt:', err);
        alert('Could not download PDF receipt.');
      });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>My Bookings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review your reserved tickets and download counter-payment receipts</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          Loading your booking history...
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Ticket size={56} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
          <h3>No bookings yet</h3>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 24px 0' }}>You haven't reserved any movie tickets so far.</p>
          <Link to="/movies" className="btn-primary">
            Explore Movies & Book
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {bookings.map((b) => {
            const show = b.showId || {};
            const movie = show.movieId || {};
            const theatre = show.theatreId || {};

            return (
              <div key={b._id} className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                
                <img
                  src={movie.poster || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'}
                  alt={movie.title}
                  style={{ width: '90px', height: '125px', objectFit: 'cover', borderRadius: '8px' }}
                />

                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{movie.title || 'Movie'}</h3>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      {b.paymentMethod === 'PAY_AT_COUNTER' ? 'Pay at Counter' : b.paymentMethod}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                    {theatre.name} • {show.screen}
                  </p>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {show.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 700 }}>
                      <Clock size={14} /> {show.startTime}
                    </span>
                    <span>
                      Seats: <strong style={{ color: '#38bdf8' }}>{(b.seats || []).join(', ')}</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                      Booking Code: <strong style={{ color: '#fff', letterSpacing: '0.05em' }}>{b.bookingCode}</strong>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24' }}>
                      Rs. {b.totalAmount}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleDownloadReceipt(b)}
                    className="btn-primary"
                    style={{ padding: '10px 18px', fontSize: '0.85rem' }}
                  >
                    <Download size={15} /> Receipt (PDF)
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default MyBookings;
