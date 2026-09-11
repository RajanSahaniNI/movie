import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MapPin, Film, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';

const Theatre = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const res = await api.get('/theatres');
        if (res.data.success) {
          setTheatres(res.data.theatres);
        }
      } catch (err) {
        console.error('Error fetching theatres:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTheatres();
  }, []);

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Theatres & Multiplexes</h1>
        <p style={{ color: 'var(--text-muted)' }}>Experience cinematic excellence with cutting-edge IMAX, 4DX, and Dolby Atmos screens</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          Loading theatres...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {theatres.map((theatre) => (
            <div key={theatre._id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(229, 9, 20, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Film size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem' }}>{theatre.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} /> {theatre.location}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  {theatre.address}
                </p>

                <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: '10px' }}>
                  Screens ({theatre.screens?.length || 0})
                </h5>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  {(theatre.screens || []).map((screen, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Monitor size={14} color="#38bdf8" />
                      <span>{screen.name}</span>
                      <span style={{ color: 'var(--text-dim)' }}>({screen.totalSeats} seats)</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/movies" className="btn-secondary" style={{ width: '100%', padding: '10px' }}>
                Browse Shows at this Venue
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Theatre;
