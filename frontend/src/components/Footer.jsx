import React from 'react';
import { Film, ShieldCheck, Clock, Ticket } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-color)', 
      background: 'linear-gradient(180deg, rgba(10, 11, 16, 0.4) 0%, rgba(6, 7, 10, 0.95) 100%)',
      padding: '50px 24px 30px 24px',
      marginTop: '80px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Film size={18} color="#fff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Cine<span style={{ color: 'var(--primary)' }}>Reserve</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Next-generation cinema ticketing ecosystem with 15-minute hold windows, atomic booking protection, and seamless counter payments.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Features</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} color="#f59e0b" /> 15-Minute Seat Hold</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={16} color="#10b981" /> Double-Booking Protection</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Ticket size={16} color="#06b6d4" /> Pay at Counter & PDF Receipt</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Demo Accounts</h4>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <p style={{ color: '#fbbf24', fontWeight: 600, marginBottom: '4px' }}>Admin Access:</p>
              <p style={{ color: 'var(--text-muted)' }}>admin@moviebooking.com / admin123</p>
              <p style={{ color: '#38bdf8', fontWeight: 600, marginTop: '8px', marginBottom: '4px' }}>User Access:</p>
              <p style={{ color: 'var(--text-muted)' }}>user@moviebooking.com / user123</p>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          <p>© 2026 CineReserve MERN Booking System. Designed for educational excellence.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy</span>
            <span>Terms of Service</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
