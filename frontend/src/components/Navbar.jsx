import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Ticket, ShieldAlert, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #e50914 0%, #990000 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(229, 9, 20, 0.5)'
          }}>
            <Film size={22} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #ffffff, #e2e8f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Cine<span style={{ color: '#e50914', WebkitTextFillColor: '#e50914' }}>Reserve</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', mdDisplay: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          <Link 
            to="/" 
            style={{ 
              fontWeight: 600, 
              fontSize: '0.95rem',
              color: isActive('/') ? '#e50914' : 'var(--text-muted)',
              transition: 'color 0.2s'
            }}
          >
            Home
          </Link>
          <Link 
            to="/movies" 
            style={{ 
              fontWeight: 600, 
              fontSize: '0.95rem',
              color: isActive('/movies') ? '#e50914' : 'var(--text-muted)',
              transition: 'color 0.2s'
            }}
          >
            Movies
          </Link>
          <Link 
            to="/theatres" 
            style={{ 
              fontWeight: 600, 
              fontSize: '0.95rem',
              color: isActive('/theatres') ? '#e50914' : 'var(--text-muted)',
              transition: 'color 0.2s'
            }}
          >
            Theatres
          </Link>
          {isAuthenticated && (
            <Link 
              to="/my-bookings" 
              style={{ 
                fontWeight: 600, 
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: isActive('/my-bookings') ? '#e50914' : 'var(--text-muted)',
                transition: 'color 0.2s'
              }}
            >
              <Ticket size={16} />
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link 
              to="/admin" 
              style={{ 
                fontWeight: 700, 
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.12)',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}
            >
              <ShieldAlert size={15} />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Auth action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                  <User size={16} color="#94a3b8" />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {user.name}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Sign Out"
              >
                <LogOut size={15} />
                <span className="hide-mobile">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
