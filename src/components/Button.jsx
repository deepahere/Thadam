import React, { useRef } from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  ariaLabel,
  ...props
}) => {
  const buttonRef = useRef(null);

  const handleRipple = (e) => {
    if (disabled || loading || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const span = document.createElement('span');
    span.style.width = `${size}px`;
    span.style.height = `${size}px`;
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    span.classList.add('btn-ripple-span');

    // Remove existing ripples
    const existingRipples = button.querySelectorAll('.btn-ripple-span');
    existingRipples.forEach(r => r.remove());

    button.appendChild(span);

    setTimeout(() => {
      span.remove();
    }, 600);
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'btn-secondary-custom';
      case 'ghost':
        return 'btn-ghost-custom';
      case 'danger':
        return 'btn-danger-custom';
      case 'primary':
      default:
        return 'btn-primary-custom';
    }
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '14.5px',
    fontWeight: '600',
    fontFamily: 'var(--font-headings)',
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    opacity: (disabled || loading) ? 0.6 : 1,
    transition: 'var(--transition-smooth)',
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      style={baseStyle}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      onClick={(e) => {
        handleRipple(e);
        if (onClick) onClick(e);
      }}
      className={`btn-ripple ${getVariantClass()} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="spinner" style={{
          width: '16px',
          height: '16px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 1s infinite linear'
        }}></span>
      ) : null}
      {children}

      <style dangerouslySetInnerHTML={{__html: `
        .btn-ripple {
          outline: none !important;
        }
        .btn-ripple:focus,
        .btn-ripple:focus-visible {
          outline: none !important;
          box-shadow: 0 0 0 2px var(--bg-color), 0 0 0 4px var(--primary-color) !important;
        }
        .btn-ripple-span {
          position: absolute;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          transform: scale(0);
          animation: btn-ripple-anim 0.6s linear;
          pointer-events: none;
        }
        @keyframes btn-ripple-anim {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}} />
    </button>
  );
};

export default Button;
