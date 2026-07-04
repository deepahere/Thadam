import React from 'react';

// Reusable Glass Card Wrapper
export const GlassCard = ({ children, className = '', onClick, style = {}, glowColor = 'var(--surface-glow)' }) => {
  const cardStyle = {
    background: 'var(--surface-color)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid var(--surface-border)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: 'var(--glass-shadow)',
    transition: 'var(--transition-smooth)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  return (
    <div 
      onClick={onClick} 
      style={cardStyle} 
      className={`glass-panel-el ${onClick ? 'hoverable-glass-card' : ''} ${className}`}
    >
      {children}
      <style dangerouslySetInnerHTML={{__html: `
        .hoverable-glass-card:hover {
          background: var(--surface-hover);
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px ${glowColor};
        }
        body.light-theme .hoverable-glass-card:hover {
          border-color: rgba(0,0,0,0.08);
          box-shadow: 0 12px 40px rgba(31, 38, 135, 0.08);
        }
      `}} />
    </div>
  );
};

// Reusable Onboarding/Explore Category Card
export const CategoryCard = ({ icon, label, selected = false, onClick }) => {
  const containerStyle = {
    background: selected ? 'rgba(37, 99, 235, 0.08)' : 'var(--surface-color)',
    border: `1.5px solid ${selected ? 'var(--primary-color)' : 'var(--surface-border)'}`,
    borderRadius: '16px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    userSelect: 'none'
  };

  return (
    <div 
      onClick={onClick} 
      style={containerStyle}
      className="category-card-el"
    >
      <span style={{ fontSize: '24px', display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={{ fontSize: '14.5px', fontWeight: '600', color: selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
        {label}
      </span>

      <style dangerouslySetInnerHTML={{__html: `
        .category-card-el:hover {
          background: ${selected ? 'rgba(37, 99, 235, 0.12)' : 'var(--surface-hover)'};
          transform: translateY(-2px);
        }
      `}} />
    </div>
  );
};

// Reusable Destination Card Placeholders
export const DestinationCard = ({ title, description, image, category, rating, onClick }) => {
  const containerStyle = {
    background: 'var(--surface-color)',
    border: '1px solid var(--surface-border)',
    borderRadius: '20px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)'
  };

  return (
    <div onClick={onClick} style={containerStyle} className="dest-card-el">
      <div style={{ height: '180px', width: '100%', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', position: 'relative', overflow: 'hidden' }}>
        {image ? (
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="dest-img" />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            🗺️ Navigation twin coordinates
          </div>
        )}
        <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#fff' }}>
          ★ {rating || '4.8'}
        </span>
      </div>
      <div style={{ padding: '16px' }}>
        <span style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--secondary-color)', fontWeight: '700', letterSpacing: '0.5px' }}>{category}</span>
        <h4 style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px', color: 'var(--text-primary)' }}>{title}</h4>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.4' }}>{description}</p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .dest-card-el:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }
        .dest-card-el:hover .dest-img {
          transform: scale(1.05);
        }
      `}} />
    </div>
  );
};
