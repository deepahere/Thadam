import React, { useState } from 'react';
import { Compass, User, Globe, Phone, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { GlassCard } from '../components/Card';

const ProfileSetup = ({ onFinish }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [country, setCountry] = useState('India');
  const [language, setLanguage] = useState('English');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [avatarColor, setAvatarColor] = useState('#2563EB'); // default blue
  const [error, setError] = useState('');

  const avatarColors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Please enter a valid display name');
      return;
    }

    updateProfile({
      name,
      country,
      language,
      emergencyContact,
      avatarColor
    });
    onFinish();
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '40px 24px',
    background: 'radial-gradient(circle at top right, #0A1424 0%, #060810 100%)',
    position: 'relative'
  };

  return (
    <div style={containerStyle} className="animate-fade">
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10 }}>
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
      </header>

      {/* Box */}
      <div style={{ maxWidth: '460px', width: '100%', margin: 'auto', zIndex: 10 }}>
        <GlassCard style={{ padding: '32px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-headings)' }}>
              Profile Setup
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Personalize your co-pilot credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: 'var(--error-color)' }}>
                {error}
              </div>
            )}

            {/* Avatar upload selection */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: '700',
                color: '#fff',
                position: 'relative',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}>
                {name ? name.charAt(0).toUpperCase() : 'U'}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: 'var(--primary-color)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2.5px solid var(--bg-color)',
                  color: '#fff'
                }}>
                  <Camera size={11} />
                </div>
              </div>
              
              {/* Select color scheme */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {avatarColors.map(c => (
                  <div 
                    key={c}
                    onClick={() => setAvatarColor(c)}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: c,
                      cursor: 'pointer',
                      border: avatarColor === c ? '2px solid #fff' : 'none',
                      transform: avatarColor === c ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.2s'
                    }}
                  />
                ))}
              </div>
            </div>

            <InputField
              label="Display Name"
              id="setup-name"
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              iconLeft={<User size={16} />}
              required
            />

            {/* Country Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', fontFamily: 'var(--font-headings)' }}>
                Country
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }}><Globe size={16} /></div>
                <select 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1.5px solid var(--surface-border)',
                    color: 'var(--text-primary)',
                    fontSize: '14.5px',
                    fontFamily: 'var(--font-body)',
                    appearance: 'none',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)'
                  }}
                  className="profile-select-el"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>
            </div>

            {/* Language Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', fontFamily: 'var(--font-headings)' }}>
                Preferred Language
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }}><Globe size={16} /></div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1.5px solid var(--surface-border)',
                    color: 'var(--text-primary)',
                    fontSize: '14.5px',
                    fontFamily: 'var(--font-body)',
                    appearance: 'none',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)'
                  }}
                  className="profile-select-el"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                </select>
              </div>
            </div>

            <InputField
              label="Emergency Contact (Optional)"
              id="setup-emergency"
              type="tel"
              placeholder="+91 98765 43210"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              iconLeft={<Phone size={16} />}
            />

            <Button type="submit" fullWidth style={{ marginTop: '10px' }}>
              Save Profile & Start Exploring
            </Button>
          </form>

        </GlassCard>
      </div>

      {/* Footer */}
      <footer style={{ zIndex: 10 }}>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
          Profile setups sync with emergency SOS protocols when active.
        </p>
      </footer>

      {/* Select focus rule rules overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        .profile-select-el:focus {
          border-color: var(--primary-color) !important;
          background: rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
        }
      `}} />
    </div>
  );
};

export default ProfileSetup;
