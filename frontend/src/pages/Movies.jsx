import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { Search, Filter } from 'lucide-react';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [language, setLanguage] = useState('All');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (genre !== 'All') params.genre = genre;
        if (language !== 'All') params.language = language;

        const res = await api.get('/movies', { params });
        if (res.data.success) {
          setMovies(res.data.movies);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchMovies();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, genre, language]);

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 24px' }}>
      
      {/* Title & Search bar */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Explore Movies</h1>
        <p style={{ color: 'var(--text-muted)' }}>Browse all movies currently screening in our premier theatres</p>

        {/* Filter bar */}
        <div className="glass-panel" style={{ marginTop: '24px', padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search movies by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '42px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '12px 16px', cursor: 'pointer' }}
            >
              <option value="All">All Genres</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Drama">Drama</option>
              <option value="Animation">Animation</option>
              <option value="Thriller">Thriller</option>
            </select>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '12px 16px', cursor: 'pointer' }}
            >
              <option value="All">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          Loading catalog...
        </div>
      ) : movies.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3>No movies found matching criteria</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '28px' }}>
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Movies;
