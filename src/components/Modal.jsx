import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  show,
  onClose,
  title,
  children,
  isBottomSheet = false, // renders as a mobile slide-up bottom sheet
  size = 'md', // 'sm' | 'md' | 'lg'
}) => {

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [show, onClose]);

  if (!show) return null;

  const getSizeWidth = () => {
    switch (size) {
      case 'sm': return '400px';
      case 'lg': return '800px';
      case 'md':
      default:
        return '540px';
    }
  };

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(6, 7, 10, 0.65)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: isBottomSheet ? 'flex-end' : 'center',
    justifyContent: 'center',
    padding: isBottomSheet ? 0 : '20px',
    animation: 'fadeIn 0.25s ease-out'
  };

  const modalStyle = isBottomSheet
    ? {
        width: '100%',
        maxHeight: '85vh',
        background: 'var(--bg-color)',
        borderTop: '1px solid var(--surface-border)',
        borderRadius: '24px 24px 0 0',
        padding: '24px',
        boxShadow: 'var(--shadow-lg)',
        animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }
    : {
        width: '100%',
        maxWidth: getSizeWidth(),
        background: 'var(--bg-color)',
        border: '1px solid var(--surface-border)',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: 'var(--shadow-lg)',
        animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      };

  return (
    <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true">
      <div 
        style={modalStyle} 
        onClick={(e) => e.stopPropagation()}
        className="modal-container-el"
      >
        {/* Drag handle for bottom sheets */}
        {isBottomSheet && (
          <div style={{ width: '40px', height: '4px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px', margin: '0 auto 16px', cursor: 'grab' }} />
        )}

        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          {title && (
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-headings)' }}>
              {title}
            </h3>
          )}
          <button 
            onClick={onClose}
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid var(--surface-border)', 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'var(--transition-smooth)'
            }}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ overflowY: 'auto', flex: 1 }} className="hide-scrollbar">
          {children}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
        }
      `}} />
    </div>
  );
};

export default Modal;
