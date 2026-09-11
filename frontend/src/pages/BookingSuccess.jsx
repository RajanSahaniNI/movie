import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Download, Printer, ArrowRight, Ticket, Film, Calendar, Clock, MapPin } from 'lucide-react';

const BookingSuccess = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }} className="glass-panel">
        <h2>Booking Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>Could not retrieve booking details.</p>
        <Link to="/my-bookings" className="btn-primary">View My Bookings</Link>
      </div>
    );
  }

  const show = booking.showId || {};
  const movie = show.movieId || {};
  const theatre = show.theatreId || {};

  const handleDownloadReceipt = () => {
    // Direct endpoint download
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
        console.error('Download error:', err);
        alert('Could not download receipt. Please try again.');
      });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Success Badge */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle2 size={40} color="#10b981" />
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Booking Confirmed!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
          The seat is booked. You can show/provide the below code at the counter to pay and get the ticket.
        </p>
      </div>

      {/* Prominent Booking Code Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)',
        border: '2px solid rgba(229, 9, 20, 0.4)',
        marginBottom: '28px',
        boxShadow: '0 0 25px rgba(229, 9, 20, 0.2)'
      }}>
        <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ff4d4f', fontWeight: 800 }}>
          Your Official Booking Code
        </div>
        <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '0.08em', color: '#fff', margin: '6px 0', fontFamily: 'monospace' }}>
          {booking.bookingCode}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 600 }}>
          Show this code at the ticket counter to pay ₹{booking.totalAmount}
        </div>
      </div>

      {/* Ticket Card Preview */}
      <div className="glass-panel" id="printable-ticket" style={{ padding: '32px', marginBottom: '30px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Film size={24} color="var(--primary)" />
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>CineReserve E-Ticket</span>
          </div>
          <span className="badge badge-gold" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
            Pay at Counter (Pending)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Movie</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>{movie.title}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Theatre & Screen</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '2px' }}>{theatre.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{show.screen}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Date & Show Time</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '2px' }}>{show.date}</div>
            <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 700 }}>{show.startTime}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Seats Allocated</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
              {(booking.seats || []).join(', ')}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total Amount to Pay</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>₹{booking.totalAmount}</div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div>Payment Mode: <strong>PAY AT COUNTER</strong></div>
            <div>Status: <span style={{ color: '#10b981', fontWeight: 700 }}>SEAT CONFIRMED</span></div>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={handleDownloadReceipt}
          className="btn-primary"
          style={{ padding: '14px 28px', fontSize: '1rem' }}
        >
          <Download size={18} /> Download PDF Receipt
        </button>

        <button
          onClick={handlePrint}
          className="btn-secondary"
          style={{ padding: '14px 24px', fontSize: '1rem' }}
        >
          <Printer size={18} /> Print Ticket
        </button>

        <Link
          to="/my-bookings"
          className="btn-secondary"
          style={{ padding: '14px 24px', fontSize: '1rem' }}
        >
          View All My Bookings <ArrowRight size={16} />
        </Link>
      </div>

    </div>
  );
};

export default BookingSuccess;
