import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for active session
    const storedUser = localStorage.getItem('thadam_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user session", err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (email && password.length >= 6) {
      const mockUser = {
        name: email.split('@')[0],
        email: email,
        avatar: '',
        country: 'India',
        language: 'English',
        emergencyContact: '',
        onboarded: false,
        profileSetup: false
      };
      setUser(mockUser);
      localStorage.setItem('thadam_user', JSON.stringify(mockUser));
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Invalid email or password (min 6 characters)' };
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    if (name && email && password.length >= 6) {
      const mockUser = {
        name: name,
        email: email,
        avatar: '',
        country: 'India',
        language: 'English',
        emergencyContact: '',
        onboarded: false,
        profileSetup: false
      };
      setUser(mockUser);
      localStorage.setItem('thadam_user', JSON.stringify(mockUser));
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Please enter valid details' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('thadam_user');
  };

  const forgotPassword = async (email) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    if (email.includes('@')) {
      return { success: true };
    }
    return { success: false, error: 'Invalid email address' };
  };

  const updateProfile = (profileData) => {
    if (!user) return;
    const updatedUser = { ...user, ...profileData, profileSetup: true };
    setUser(updatedUser);
    localStorage.setItem('thadam_user', JSON.stringify(updatedUser));
  };

  const setOnboardingFinished = () => {
    if (!user) return;
    const updatedUser = { ...user, onboarded: true };
    setUser(updatedUser);
    localStorage.setItem('thadam_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, forgotPassword, updateProfile, setOnboardingFinished }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
