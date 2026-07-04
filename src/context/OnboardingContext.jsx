import React, { createContext, useState, useContext } from 'react';

const OnboardingContext = createContext();

const defaultPreferences = {
  travelStyle: 'Solo',
  destinations: [], // array of selected choices
  budget: 'Mid-range',
  frequency: 'Weekend',
  vehicle: 'Car'
};

export const OnboardingProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(defaultPreferences);

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleDestinationPreference = (dest) => {
    setPreferences(prev => {
      const current = prev.destinations;
      const index = current.indexOf(dest);
      let updated = [];
      if (index === -1) {
        updated = [...current, dest];
      } else {
        updated = current.filter(item => item !== dest);
      }
      return { ...prev, destinations: updated };
    });
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <OnboardingContext.Provider value={{ preferences, updatePreference, toggleDestinationPreference, resetPreferences }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
