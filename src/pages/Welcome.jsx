import React from 'react';
import { Compass } from 'lucide-react';
import Button from '../components/Button';

const Welcome = ({ onNavigate }) => {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '40px 24px',
    background: 'radial-gradient(circle at top right, #0F1D36 0%, #060810 100%)',
    position: 'relative',
    overflow: 'hidden'
  };

  const contentStyle = {
    maxWidth: '540px',
    margin: 'auto 0',
    zIndex: 10,
    animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
  };

  return (
    <div style={containerStyle} className="animate-fade">
      {/* Aurora glow blobs background */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '40%',
        height: '40%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      {/* Header logo */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10 }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Compass size={18} color="#fff" />
        </div>
        <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', fontFamily: 'var(--font-headings)' }}>
          THADAM
        </span>
      </header>

      {/* Main Content */}
      <div style={contentStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 style={{
            fontSize: '44px',
            fontWeight: '800',
            lineHeight: '1.15',
            color: '#fff',
            fontFamily: 'var(--font-headings)'
          }}>
            Every Journey Begins With The <span className="text-gradient">Right Path.</span>
          </h1>
          <p style={{
            fontSize: '16.5px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            THADAM helps you discover, plan, travel and experience smarter journeys. Let artificial intelligence map your path.
          </p>

          <div style={{ display: 'flex', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
            <Button onClick={() => onNavigate('signup')} style={{ padding: '14px 28px' }}>
              Get Started
            </Button>
            <Button onClick={() => onNavigate('login')} variant="secondary" style={{ padding: '14px 28px' }}>
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <footer style={{ zIndex: 10 }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} THADAM AI Inc. Paths aligned globally.
        </p>
      </footer>
    </div>
  );
};

export default Welcome;
