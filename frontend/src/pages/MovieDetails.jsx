import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star, Clock, Calendar, MapPin, Film, ArrowLeft } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Available dates (Today, Tomorrow, Day + 2)
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dates.push({ iso, label });
    }
    return dates;
  };

  const dates = getDates();
  const [selectedDate, setSelectedDate] = useState(dates[0].iso);

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      setLoading(true);
      try {
        const [movieRes, showsRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/shows`, { params: { movieId: id, date: selectedDate } }),
        ]);

        if (movieRes.data.success) {
          setMovie(movieRes.data.movie);
        }
        if (showsRes.data.success) {
          setShows(showsRes.data.shows);
        }
      } catch (err) {
        console.error('Error fetching movie details/shows:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShows();
  }, [id, selectedDate]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
        Loading movie experience...
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center' }} className="glass-panel">
        <h2>Movie not found</h2>
        <Link to="/movies" className="btn-primary" style={{ marginTop: '20px' }}>
          Back to Movies
        </Link>
      </div>
    );
  }

  // Group shows by Theatre
  const groupedShows = shows.reduce((acc, show) => {
    const theatreId = show.theatreId?._id;
    if (!theatreId) return acc;
    if (!acc[theatreId]) {
      acc[theatreId] = {
        theatre: show.theatreId,
        shows: [],
      };
    }
    acc[theatreId].shows.push(show);
    return acc;
  }, {});

  return (
    <div style={{ paddingBottom: '60px' }}>
      
      {/* Backdrop Header */}
      <div style={{
        position: 'relative',
        minHeight: '420px',
        backgroundImage: `linear-gradient(180deg, rgba(10, 11, 16, 0.4) 0%, #0a0b10 100%), url(${movie.banner || movie.poster})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '40px 24px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          
          <img
            src={movie.poster}
            alt={movie.title}
            style={{
              width: '200px',
              height: '300px',
              borderRadius: '12px',
              objectFit: 'cover',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              border: '2px solid rgba(255,255,255,0.1)'
            }}
          />

          <div style={{ flex: '1 1 320px' }}>
            <Link to="/movies" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
              <ArrowLeft size={16} /> Back to Movies
            </Link>

            <h1 style={{ fontSize: '2.8rem', lineHeight: '1.1', marginBottom: '12px' }}>
              {movie.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 10px', borderRadius: '6px' }}>
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>{movie.rating ? movie.rating.toFixed(1) : '8.5'}/10</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Clock size={16} /> {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {movie.language}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {(movie.genre || []).map((g, i) => (
                <span key={i} className="badge badge-red">{g}</span>
              ))}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '750px', lineHeight: '1.6' }}>
              {movie.description}
            </p>
          </div>

        </div>
      </div>

      {/* Date Bar & Shows */}
      <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 24px' }}>
        
        {/* Date Selector */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="var(--primary)" /> Select Date
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            {dates.map((d) => (
              <button
                key={d.iso}
                onClick={() => setSelectedDate(d.iso)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: selectedDate === d.iso ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: selectedDate === d.iso ? 'linear-gradient(135deg, #e50914 0%, #b8050e 100%)' : 'rgba(255,255,255,0.04)',
                  color: selectedDate === d.iso ? '#fff' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '110px',
                  boxShadow: selectedDate === d.iso ? '0 4px 15px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{d.label}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.8 }}>{d.iso}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theatres and Shows List */}
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Film size={20} color="var(--primary)" /> Available Theatres & Timings
          </h3>

          {Object.keys(groupedShows).length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No shows scheduled for this date. Please select another date.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Object.values(groupedShows).map(({ theatre, shows }) => (
                <div key={theatre._id} className="glass-panel" style={{ padding: '24px' }}>
                  
                  {/* Theatre info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{theatre.name}</h4>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                        <MapPin size={14} /> {theatre.address || theatre.location}
                      </p>
                    </div>
                  </div>

                  {/* Showtimes Grid */}
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    {shows.map((show) => (
                      <Link
                        key={show._id}
                        to={`/seat-selection/${show._id}`}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '10px',
                          padding: '10px 18px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--primary)';
                          e.currentTarget.style.background = 'rgba(229, 9, 20, 0.1)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>
                          {show.startTime}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {show.screen}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
                          Rs. {show.price}
                        </span>
                      </Link>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default MovieDetails;
