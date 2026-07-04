import React, { useState } from 'react';
import { Compass, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import InputField from '../components/InputField';

const ForgotPassword = ({ onNavigate }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-color)',
    padding: '40px 24px'
  };

  const boxStyle = {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px'
  };

  return (
    <div style={containerStyle} className="animate-fade">
      <div style={boxStyle}>
        
        {/* Header Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onNavigate('login')}>
          <div style={{
            width: '36px',
            height: '36px',
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
        </div>

        {success ? (
          /* Success Screen View */
          <div className="animate-scale-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={32} style={{ color: 'var(--accent-color)' }} />
              <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Check your inbox</h1>
            </div>
            
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              We've sent a mock password reset link to <strong>{email}</strong>. Use the link to establish a new credential lock.
            </p>

            <Button 
              variant="secondary" 
              onClick={() => onNavigate('login')} 
              style={{ marginTop: '12px', width: '100%' }}
            >
              <ArrowLeft size={16} /> Back to Sign In
            </Button>
          </div>
        ) : (
          /* Request Email Form */
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Reset Password</h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Confirm your email to retrieve recovery links.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: 'var(--error-color)' }}>
                  {error}
                </div>
              )}

              <InputField
                label="Email Address"
                id="reset-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                iconLeft={<Mail size={16} />}
                required
              />

              <Button type="submit" loading={loading} fullWidth>
                Send Password Reset Link
              </Button>

              <button 
                type="button" 
                onClick={() => onNavigate('login')}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-secondary)', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '13.5px',
                  marginTop: '10px'
                }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
