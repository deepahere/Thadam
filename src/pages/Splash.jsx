import React, { useEffect } from 'react';
import { Compass } from 'lucide-react';

const Splash = ({ onFinish }) => {
  useEffect(() => {
    // Wait for animation to finish then navigate
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const containerStyle = {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(circle at center, #0B162C 0%, #060810 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle} className="animate-fade">
      {/* Animated map grid vector background overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.05,
        backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }} />

      {/* Logo container with scale and rotation keyframe */}
      <div style={{
        animation: 'revealLogo 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        zIndex: 10
      }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 36px rgba(37, 99, 235, 0.4)',
          position: 'relative'
        }}>
          <Compass size={44} color="#fff" style={{ animation: 'pulseGlow 2.5s infinite ease-in-out' }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'var(--font-headings)',
            fontSize: '44px',
            fontWeight: '800',
            letterSpacing: '0.05em',
            color: '#fff',
            textShadow: '0 4px 20px rgba(255,255,255,0.1)'
          }}>
            THADAM
          </h1>
          <p style={{
            fontSize: '14.5px',
            color: 'var(--text-secondary)',
            fontWeight: '500',
            marginTop: '8px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            opacity: 0,
            animation: 'fadeIn 1s 0.8s ease-out forwards'
          }}>
            Your AI Travel Companion
          </p>
        </div>
      </div>
    </div>
  );
};

export default Splash;
