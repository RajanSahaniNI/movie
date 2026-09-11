import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { Film, Sparkles, Clock, Shield, Ticket, ArrowRight, Play } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get('/movies');
        if (res.data.success) {
          setMovies(res.data.movies);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const genres = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Animation'];

  const filteredMovies = selectedGenre === 'All'
    ? movies
    : movies.filter((m) => m.genre?.includes(selectedGenre));

  const featuredMovie = movies.find(m => m.title.includes('Avengers')) || movies[0];

  return (
    <div>
      {/* Hero Section */}
      {featuredMovie && (
        <section style={{
          position: 'relative',
          minHeight: '65vh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `linear-gradient(90deg, #0a0b10 20%, rgba(10, 11, 16, 0.85) 60%, rgba(10, 11, 16, 0.4) 100%), url(${featuredMovie.banner || featuredMovie.poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          padding: '60px 24px',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
            <div style={{ maxWidth: '650px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(229, 9, 20, 0.2)', border: '1px solid rgba(229, 9, 20, 0.4)', padding: '6px 14px', borderRadius: '30px', marginBottom: '16px' }}>
                <Sparkles size={14} color="#e50914" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ff4d4f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Featured Spotlight</span>
              </div>
              <h1 style={{ fontSize: '3rem', lineHeight: '1.1', marginBottom: '16px', fontWeight: 800 }}>
                {featuredMovie.title}
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                {featuredMovie.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <Link to={`/movie/${featuredMovie._id}`} className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                  <Ticket size={18} /> Book Tickets Now
                </Link>
                <Link to="/movies" className="btn-secondary" style={{ padding: '14px 24px', fontSize: '1rem' }}>
                  Explore All Movies <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Feature Highlights Banner */}
      <section style={{ maxWidth: '1280px', margin: '-30px auto 40px auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} color="#f59e0b" />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>15-Min Seat Hold</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Seats are secured with live countdown timer</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={24} color="#10b981" />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>Zero Collision Check</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Atomic locking prevents double booking</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ticket size={24} color="#06b6d4" />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>Pay at Counter</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instant booking code & PDF download</p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Movies Grid Section */}
      <section style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '2rem' }}>Now Showing</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Select your favourite movie and grab the best seats</p>
          </div>

          {/* Genre Filters */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedGenre === genre ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: selectedGenre === genre ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedGenre === genre ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            Loading movies...
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Film size={48} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
            <h3>No movies found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try selecting another genre or check back later.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '28px' }}>
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
