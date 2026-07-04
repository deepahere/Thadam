import React from 'react';

const InputField = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  iconLeft,
  iconRight,
  onIconRightClick,
  ...props
}) => {
  const hasError = !!error;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
    textAlign: 'left'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: hasError ? 'var(--error-color)' : 'var(--text-secondary)',
    transition: 'color 0.2s ease',
    fontFamily: 'var(--font-headings)'
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    padding: `12px ${iconRight ? '44px' : '16px'} 12px ${iconLeft ? '44px' : '16px'}`,
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: `1.5px solid ${hasError ? 'var(--error-color)' : 'var(--surface-border)'}`,
    color: 'var(--text-primary)',
    fontSize: '14.5px',
    fontFamily: 'var(--font-body)',
    transition: 'var(--transition-smooth)',
    backdropFilter: 'blur(10px)',
    cursor: disabled ? 'not-allowed' : 'text'
  };

  const iconStyle = {
    position: 'absolute',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px'
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label} {required && <span style={{ color: 'var(--error-color)' }}>*</span>}
        </label>
      )}
      <div style={inputWrapperStyle}>
        {iconLeft && (
          <div style={{ ...iconStyle, left: '14px' }}>
            {iconLeft}
          </div>
        )}
        
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          style={inputStyle}
          className="auth-input-el"
          {...props}
        />

        {iconRight && (
          <div 
            onClick={onIconRightClick}
            style={{ 
              ...iconStyle, 
              right: '14px', 
              cursor: onIconRightClick ? 'pointer' : 'default',
              pointerEvents: onIconRightClick ? 'auto' : 'none'
            }}
          >
            {iconRight}
          </div>
        )}
      </div>
      
      {hasError && (
        <span 
          id={`${id}-error`} 
          style={{ 
            fontSize: '12px', 
            color: 'var(--error-color)', 
            marginTop: '2px',
            fontWeight: '500',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {error}
        </span>
      )}

      {/* Inject custom focus style rules */}
      <style dangerouslySetInnerHTML={{__html: `
        .auth-input-el:focus {
          border-color: var(--primary-color) !important;
          background: rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
        }
      `}} />
    </div>
  );
};

export default InputField;
