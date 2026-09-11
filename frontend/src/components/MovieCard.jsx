import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Globe } from 'lucide-react';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      {/* Poster */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={movie.poster || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'}
          alt={movie.title}
          className="movie-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
          }}
        />
        
        {/* Rating Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '4px 8px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
        }}>
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>
            {movie.rating ? movie.rating.toFixed(1) : '8.5'}
          </span>
        </div>

        {/* Language Tag */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#e2e8f0',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          {movie.language || 'English'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {movie.title}
          </h3>

          {/* Genre Badges */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {(movie.genre || []).slice(0, 2).map((g, idx) => (
              <span key={idx} className="badge badge-red" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                {g}
              </span>
            ))}
            {movie.duration && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>
                <Clock size={13} />
                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </span>
            )}
          </div>
        </div>

        <Link
          to={`/movie/${movie._id}`}
          className="btn-primary"
          style={{ width: '100%', padding: '10px', fontSize: '0.9rem', marginTop: '8px' }}
        >
          Book Tickets
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
