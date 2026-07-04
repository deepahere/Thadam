import React, { useState } from 'react';
import { Compass, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import InputField from '../components/InputField';

const Signup = ({ onNavigate }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Please enter your full name');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!termsAccepted) {
      setError('You must accept the Terms and Conditions');
      return;
    }

    setLoading(true);
    const res = await signup(name, email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr',
    background: 'var(--bg-color)'
  };

  const sideIllustrationStyle = {
    display: 'none',
    background: 'radial-gradient(circle at top left, #0D2240 0%, #060912 100%)',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  };

  return (
    <div style={containerStyle} className="animate-fade signup-layout-deck">
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 992px) {
          .signup-layout-deck {
            grid-template-columns: 1.2fr 1fr !important;
          }
          .signup-side-pane {
            display: flex !important;
          }
        }
      `}} />

      {/* Left Column Illustration (Desktop Only) */}
      <div style={sideIllustrationStyle} className="signup-side-pane">
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        <div style={{ zIndex: 10, maxWidth: '440px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '38px', fontWeight: '800', lineHeight: 1.2, color: '#fff', fontFamily: 'var(--font-headings)' }}>
            Join the collective of global <span className="text-gradient">travelers.</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '16px', lineHeight: 1.6 }}>
            Set preference parameters, sync co-pilot schedules, and experience seamless premium layout configurations.
          </p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>Shared Journeys</span>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>Carbon Budget</span>
          </div>
        </div>
      </div>

      {/* Right Column: Signup Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onNavigate('welcome')}>
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

          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Create Account</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Begin your path with our smart travel assistant.
            </p>
          </div>

          {/* Form container */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: 'var(--error-color)', fontWeight: '500' }}>
                {error}
              </div>
            )}

            <InputField
              label="Full Name"
              id="signup-name"
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              iconLeft={<User size={16} />}
              required
            />

            <InputField
              label="Email Address"
              id="signup-email"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              iconLeft={<Mail size={16} />}
              required
            />

            <InputField
              label="Password"
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconLeft={<Lock size={16} />}
              iconRight={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              onIconRightClick={() => setShowPassword(!showPassword)}
              required
            />

            <InputField
              label="Confirm Password"
              id="signup-confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              iconLeft={<Lock size={16} />}
              required
            />

            {/* Terms and Conditions Checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', userSelect: 'none', fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              <input 
                type="checkbox" 
                checked={termsAccepted} 
                onChange={(e) => setTermsAccepted(e.target.checked)} 
                style={{ width: '15px', height: '15px', marginTop: '2px', accentColor: 'var(--primary-color)' }}
              />
              <span>
                I agree to the{' '}
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("THADAM Platform Terms & Conditions loaded."); }} style={{ color: 'var(--secondary-color)', textDecoration: 'none', fontWeight: '600' }}>
                  Terms & Conditions
                </a>{' '}
                and Privacy Policy.
              </span>
            </label>

            <Button type="submit" loading={loading} fullWidth style={{ marginTop: '12px' }}>
              Create Account
            </Button>
          </form>

          {/* Social Logins Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }} />
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>Or signup with</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }} />
          </div>

          <Button variant="secondary" onClick={() => {}} fullWidth>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.444-2.889-6.444-6.444s2.889-6.444 6.444-6.444c1.637 0 3.13.623 4.27 1.636l3.151-3.15C19.264 2.226 15.977 1 12.24 1 5.922 1 1 5.922 1 12s4.922 11 11.24 11c6.586 0 11.24-4.636 11.24-11.24 0-.763-.075-1.485-.24-2.02L12.24 10.286z"/></svg> Google Account
          </Button>

          {/* Footer Navigation Link */}
          <div style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button 
              onClick={() => onNavigate('login')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer' }}
            >
              Sign In
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Signup;
