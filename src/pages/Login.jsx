import React, { useState } from 'react';
import { Compass, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import InputField from '../components/InputField';

const Login = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
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

  // Support 2-column layout on desktop
  const sideIllustrationStyle = {
    display: 'none',
    background: 'radial-gradient(circle at bottom left, #0D2240 0%, #060912 100%)',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  };

  return (
    <div style={containerStyle} className="animate-fade login-layout-deck">
      {/* Inject desktop CSS overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 992px) {
          .login-layout-deck {
            grid-template-columns: 1.2fr 1fr !important;
          }
          .login-side-pane {
            display: flex !important;
          }
        }
      `}} />

      {/* Column 1: Spacious Travel Graphic (Desktop Only) */}
      <div style={sideIllustrationStyle} className="login-side-pane">
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        <div style={{ zIndex: 10, maxWidth: '440px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '38px', fontWeight: '800', lineHeight: 1.2, color: '#fff', fontFamily: 'var(--font-headings)' }}>
            Start navigating your next <span className="text-gradient">adventure.</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '16px', lineHeight: 1.6 }}>
            Explore off-beaten paths, calculate carbon budgets dynamically, and store memory logs of every trail.
          </p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>Discover</span>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>Plan</span>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>Travel</span>
          </div>
        </div>
      </div>

      {/* Column 2: Authentication Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
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
            <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Welcome back</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Sign in to explore your travel co-pilot.
            </p>
          </div>

          {/* Form container */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: 'var(--error-color)', fontWeight: '500' }}>
                {error}
              </div>
            )}

            <InputField
              label="Email Address"
              id="login-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              iconLeft={<Mail size={16} />}
              required
            />

            <InputField
              label="Password"
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconLeft={<Lock size={16} />}
              iconRight={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              onIconRightClick={() => setShowPassword(!showPassword)}
              required
            />

            {/* Checkbox and Forgot Password Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none', color: 'var(--text-secondary)' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  style={{ width: '15px', height: '15px', accentColor: 'var(--primary-color)' }}
                />
                Remember me
              </label>
              <button 
                type="button" 
                onClick={() => onNavigate('forgot_password')}
                style={{ background: 'none', border: 'none', color: 'var(--secondary-color)', fontWeight: '600', cursor: 'pointer' }}
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" loading={loading} fullWidth style={{ marginTop: '10px' }}>
              Sign In
            </Button>
          </form>

          {/* Social Logins Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }} />
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>Or connect with</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Button variant="secondary" onClick={() => {}} style={{ padding: '10px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.444-2.889-6.444-6.444s2.889-6.444 6.444-6.444c1.637 0 3.13.623 4.27 1.636l3.151-3.15C19.264 2.226 15.977 1 12.24 1 5.922 1 1 5.922 1 12s4.922 11 11.24 11c6.586 0 11.24-4.636 11.24-11.24 0-.763-.075-1.485-.24-2.02L12.24 10.286z"/></svg> Google
            </Button>
            <Button variant="secondary" onClick={() => {}} style={{ padding: '10px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.97.08 2.06-.52 2.82-1.33z"/></svg> Apple
            </Button>
          </div>

          {/* Footer Navigation link */}
          <div style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <button 
              onClick={() => onNavigate('signup')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer' }}
            >
              Sign Up
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
