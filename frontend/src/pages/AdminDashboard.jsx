import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Film, Calendar, Ticket, Building, Plus, Trash2, ShieldAlert, DollarSign, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Movie Form State
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 150,
    releaseDate: '2026-09-01',
    poster: '',
    banner: '',
    rating: 8.5,
  });

  // New Show Form State
  const [newShow, setNewShow] = useState({
    movieId: '',
    theatreId: '',
    screen: 'Screen 1',
    date: '2026-09-10',
    startTime: '18:00',
    price: 300,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'movie' or 'show'

  const loadData = async () => {
    setLoading(true);
    try {
      const [mRes, tRes, sRes, bRes] = await Promise.all([
        api.get('/movies'),
        api.get('/theatres'),
        api.get('/shows'),
        api.get('/bookings/all'),
      ]);

      if (mRes.data.success) setMovies(mRes.data.movies);
      if (tRes.data.success) setTheatres(tRes.data.theatres);
      if (sRes.data.success) setShows(sRes.data.shows);
      if (bRes.data.success) setBookings(bRes.data.bookings);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }} className="glass-panel">
        <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          You must be logged in as an Administrator to view this portal.
        </p>
      </div>
    );
  }

  // Handle create Movie
  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newMovie,
        genre: newMovie.genre.split(',').map((g) => g.trim()),
      };
      const res = await api.post('/movies', payload);
      if (res.data.success) {
        alert('Movie added successfully!');
        setShowModal(false);
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add movie');
    }
  };

  // Handle create Show
  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/shows', newShow);
      if (res.data.success) {
        alert('Show scheduled successfully!');
        setShowModal(false);
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule show');
    }
  };

  // Handle delete Movie
  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie and its scheduled shows?')) return;
    try {
      await api.delete(`/movies/${id}`);
      loadData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  // Handle delete Show
  const handleDeleteShow = async (id) => {
    if (!window.confirm('Cancel and delete this show?')) return;
    try {
      await api.delete(`/shows/${id}`);
      loadData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-gold">Admin Portal</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>CineReserve Management</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', marginTop: '4px' }}>System Control Dashboard</h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              setModalType('movie');
              setShowModal(true);
            }}
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <Plus size={16} /> Add Movie
          </button>
          <button
            onClick={() => {
              setModalType('show');
              if (movies.length > 0) setNewShow((s) => ({ ...s, movieId: movies[0]._id }));
              if (theatres.length > 0) setNewShow((s) => ({ ...s, theatreId: theatres[0]._id }));
              setShowModal(true);
            }}
            className="btn-gold"
            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <Plus size={16} /> Schedule Show
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '30px', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Overview Metrics', icon: DollarSign },
          { id: 'movies', label: `Movies (${movies.length})`, icon: Film },
          { id: 'shows', label: `Shows (${shows.length})`, icon: Calendar },
          { id: 'bookings', label: `All Bookings (${bookings.length})`, icon: Ticket },
          { id: 'theatres', label: `Theatres (${theatres.length})`, icon: Building },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: active ? '3px solid var(--primary)' : '3px solid transparent',
                color: active ? '#fff' : 'var(--text-muted)',
                fontWeight: active ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} color={active ? 'var(--primary)' : 'var(--text-dim)'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Gross Bookings</span>
                <DollarSign size={20} color="#fbbf24" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24' }}>₹{totalRevenue}</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>From counter reservations</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tickets Reserved</span>
                <Ticket size={20} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8' }}>{bookings.length}</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Active booking codes generated</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Catalog</span>
                <Film size={20} color="#e50914" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{movies.length}</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Movies screening now</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Scheduled Shows</span>
                <Calendar size={20} color="#10b981" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981' }}>{shows.length}</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Across {theatres.length} partner multiplexes</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Movies */}
      {activeTab === 'movies' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Active Movie Titles</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '12px 8px' }}>Poster</th>
                  <th style={{ padding: '12px 8px' }}>Title</th>
                  <th style={{ padding: '12px 8px' }}>Genre</th>
                  <th style={{ padding: '12px 8px' }}>Duration</th>
                  <th style={{ padding: '12px 8px' }}>Rating</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 8px' }}>
                      <img src={m.poster} alt={m.title} style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>{m.title}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{(m.genre || []).join(', ')}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{m.duration} min</td>
                    <td style={{ padding: '12px 8px', color: '#f59e0b', fontWeight: 700 }}>★ {m.rating}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteMovie(m._id)}
                        className="btn-outline-danger"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Shows */}
      {activeTab === 'shows' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Scheduled Screenings</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '12px 8px' }}>Movie</th>
                  <th style={{ padding: '12px 8px' }}>Theatre</th>
                  <th style={{ padding: '12px 8px' }}>Screen</th>
                  <th style={{ padding: '12px 8px' }}>Date & Time</th>
                  <th style={{ padding: '12px 8px' }}>Price</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((s) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>{s.movieId?.title || 'Unknown'}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{s.theatreId?.name || 'Unknown'}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-dim)' }}>{s.screen}</td>
                    <td style={{ padding: '12px 8px' }}>
                      {s.date} <strong style={{ color: '#10b981' }}>{s.startTime}</strong>
                    </td>
                    <td style={{ padding: '12px 8px', color: '#fbbf24', fontWeight: 700 }}>₹{s.price}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteShow(s._id)}
                        className="btn-outline-danger"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Bookings */}
      {activeTab === 'bookings' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>System Bookings Log</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '12px 8px' }}>Booking Code</th>
                  <th style={{ padding: '12px 8px' }}>User</th>
                  <th style={{ padding: '12px 8px' }}>Movie</th>
                  <th style={{ padding: '12px 8px' }}>Seats</th>
                  <th style={{ padding: '12px 8px' }}>Amount</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 700, color: '#ff4d4f', fontFamily: 'monospace' }}>
                      {b.bookingCode}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <div>{b.userId?.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{b.userId?.email}</div>
                    </td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{b.showId?.movieId?.title || 'Movie'}</td>
                    <td style={{ padding: '12px 8px', color: '#38bdf8', fontWeight: 600 }}>{(b.seats || []).join(', ')}</td>
                    <td style={{ padding: '12px 8px', color: '#fbbf24', fontWeight: 700 }}>₹{b.totalAmount}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                        {b.paymentMethod}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Theatres */}
      {activeTab === 'theatres' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {theatres.map((t) => (
            <div key={t._id} className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{t.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '14px' }}>{t.address || t.location}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(t.screens || []).map((s, idx) => (
                  <span key={idx} className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
                    {s.name} ({s.totalSeats} seats)
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Movie / Add Show */}
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel" style={{ maxWidth: '540px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
              {modalType === 'movie' ? 'Add New Movie' : 'Schedule New Show'}
            </h2>

            {modalType === 'movie' ? (
              <form onSubmit={handleCreateMovie} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Title</label>
                  <input
                    type="text"
                    required
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Dune: Part Two"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Description</label>
                  <textarea
                    required
                    rows="3"
                    value={newMovie.description}
                    onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Genres (comma separated)</label>
                    <input
                      type="text"
                      required
                      value={newMovie.genre}
                      onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Duration (mins)</label>
                    <input
                      type="number"
                      required
                      value={newMovie.duration}
                      onChange={(e) => setNewMovie({ ...newMovie, duration: Number(e.target.value) })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Poster Image URL</label>
                  <input
                    type="url"
                    required
                    value={newMovie.poster}
                    onChange={(e) => setNewMovie({ ...newMovie, poster: e.target.value })}
                    className="form-input"
                    placeholder="https://..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Movie</button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateShow} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Select Movie</label>
                  <select
                    value={newShow.movieId}
                    onChange={(e) => setNewShow({ ...newShow, movieId: e.target.value })}
                    className="form-input"
                  >
                    {movies.map((m) => (
                      <option key={m._id} value={m._id}>{m.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Select Theatre</label>
                  <select
                    value={newShow.theatreId}
                    onChange={(e) => setNewShow({ ...newShow, theatreId: e.target.value })}
                    className="form-input"
                  >
                    {theatres.map((t) => (
                      <option key={t._id} value={t._id}>{t.name} ({t.location})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Date (YYYY-MM-DD)</label>
                    <input
                      type="date"
                      required
                      value={newShow.date}
                      onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Start Time (HH:mm)</label>
                    <input
                      type="text"
                      required
                      value={newShow.startTime}
                      onChange={(e) => setNewShow({ ...newShow, startTime: e.target.value })}
                      className="form-input"
                      placeholder="18:30"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Screen Name</label>
                    <input
                      type="text"
                      required
                      value={newShow.screen}
                      onChange={(e) => setNewShow({ ...newShow, screen: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Ticket Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newShow.price}
                      onChange={(e) => setNewShow({ ...newShow, price: Number(e.target.value) })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button type="submit" className="btn-gold" style={{ flex: 1 }}>Schedule Show</button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
