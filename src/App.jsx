import React, { useState, useEffect } from 'react';
import Splash from './pages/Splash';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Onboarding from './pages/Onboarding';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './layouts/Dashboard';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState('splash'); // 'splash' | 'welcome' | 'login' | 'signup' | 'forgot_password' | 'onboarding' | 'profile_setup' | 'dashboard'

  // Sync view route on login session changes after splash finished
  useEffect(() => {
    if (view === 'splash' || loading) return;

    if (!user) {
      // If not logged in, direct back to welcome if they were on dashboard/onboarding
      if (['onboarding', 'profile_setup', 'dashboard'].includes(view)) {
        setView('welcome');
      }
    } else {
      // If logged in
      if (!user.onboarded) {
        setView('onboarding');
      } else if (!user.profileSetup) {
        setView('profile_setup');
      } else {
        setView('dashboard');
      }
    }
  }, [user, loading, view]);

  const handleSplashFinish = () => {
    if (user) {
      if (!user.onboarded) {
        setView('onboarding');
      } else if (!user.profileSetup) {
        setView('profile_setup');
      } else {
        setView('dashboard');
      }
    } else {
      setView('welcome');
    }
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.06)',
          borderTopColor: 'var(--primary-color)',
          borderRadius: '50%',
          animation: 'spin 1s infinite linear'
        }} className="spinner" />
        <h4 style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '14px', fontWeight: '500' }}>
          Loading THADAM...
        </h4>
      </div>
    );
  }

  // View Router dispatcher
  switch (view) {
    case 'splash':
      return <Splash onFinish={handleSplashFinish} />;
    case 'welcome':
      return <Welcome onNavigate={setView} />;
    case 'login':
      return <Login onNavigate={setView} />;
    case 'signup':
      return <Signup onNavigate={setView} />;
    case 'forgot_password':
      return <ForgotPassword onNavigate={setView} />;
    case 'onboarding':
      return <Onboarding onFinish={() => setView('profile_setup')} />;
    case 'profile_setup':
      return <ProfileSetup onFinish={() => setView('dashboard')} />;
    case 'dashboard':
      return <Dashboard />;
    default:
      return <Welcome onNavigate={setView} />;
  }
}

export default App;
