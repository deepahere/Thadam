import React, { useState } from 'react';
import { Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { useOnboarding } from '../context/OnboardingContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { CategoryCard, GlassCard } from '../components/Card';

const Onboarding = ({ onFinish }) => {
  const { setOnboardingFinished } = useAuth();
  const { preferences, updatePreference, toggleDestinationPreference } = useOnboarding();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    } else {
      setOnboardingFinished();
      onFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setOnboardingFinished();
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

  const stepsInfo = [
    { title: "What's your travel style?", subtitle: "Select the option that matches how you usually explore." },
    { title: "Where do you love to go?", subtitle: "Choose all destinations that match your wanderlust." },
    { title: "What is your budget index?", subtitle: "This helps THADAM customize price predictions." },
    { title: "How often do you travel?", subtitle: "Sync co-pilot frequencies." },
    { title: "Your primary travel vehicle?", subtitle: "Carbon calculations depend on this choice." }
  ];

  return (
    <div style={containerStyle} className="animate-fade">
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <button 
          onClick={handleSkip}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
        >
          Skip onboarding
        </button>
      </header>

      {/* Main Questionnaire Box */}
      <div style={{ maxWidth: '640px', width: '100%', margin: 'auto', zIndex: 10 }}>
        
        {/* Step count indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              style={{ 
                flex: 1, 
                height: '4px', 
                borderRadius: '2px', 
                background: i <= step ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.08)',
                transition: 'background 0.3s ease'
              }} 
            />
          ))}
        </div>

        <GlassCard style={{ padding: '36px', textAlign: 'left' }}>
          <div style={{ marginBottom: '28px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--secondary-color)', letterSpacing: '1px' }}>
              Step {step} of 5
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginTop: '6px', fontFamily: 'var(--font-headings)' }}>
              {stepsInfo[step - 1].title}
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              {stepsInfo[step - 1].subtitle}
            </p>
          </div>

          {/* STEP 1: Travel Style */}
          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { id: 'Solo', label: 'Solo Explorer', icon: '👤' },
                { id: 'Family', label: 'Family Trip', icon: '👨‍👩‍👧‍👦' },
                { id: 'Friends', label: 'Friends Getaway', icon: '🎉' },
                { id: 'Couple', label: 'Romantic Couple', icon: '💖' },
                { id: 'Business', label: 'Business Commute', icon: '💼' },
                { id: 'Adventure', label: 'Thrilling Adventure', icon: '🧗' }
              ].map(item => (
                <CategoryCard 
                  key={item.id} 
                  icon={item.icon} 
                  label={item.label} 
                  selected={preferences.travelStyle === item.id} 
                  onClick={() => updatePreference('travelStyle', item.id)} 
                />
              ))}
            </div>
          )}

          {/* STEP 2: Preferred Destinations */}
          {step === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { id: 'Beach', label: 'Sunny Beaches', icon: '🏖️' },
                { id: 'Mountains', label: 'Snowy Mountains', icon: '🏔️' },
                { id: 'Nature', label: 'Forests & Nature', icon: '🌲' },
                { id: 'Historical', label: 'Historical sites', icon: '🏛️' },
                { id: 'Food', label: 'Culinary tours', icon: '🍜' },
                { id: 'Road Trips', label: 'Epic Road Trips', icon: '🚗' }
              ].map(item => (
                <CategoryCard 
                  key={item.id} 
                  icon={item.icon} 
                  label={item.label} 
                  selected={preferences.destinations.includes(item.id)} 
                  onClick={() => toggleDestinationPreference(item.id)} 
                />
              ))}
            </div>
          )}

          {/* STEP 3: Travel Budget */}
          {step === 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {[
                { id: 'Budget', label: 'Budget friendly (Cost optimized)', icon: '🪙' },
                { id: 'Mid-range', label: 'Mid-range balance', icon: '💳' },
                { id: 'Luxury', label: 'Premium Luxury (Best comfort)', icon: '💎' }
              ].map(item => (
                <CategoryCard 
                  key={item.id} 
                  icon={item.icon} 
                  label={item.label} 
                  selected={preferences.budget === item.id} 
                  onClick={() => updatePreference('budget', item.id)} 
                />
              ))}
            </div>
          )}

          {/* STEP 4: Travel Frequency */}
          {step === 4 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { id: 'Daily', label: 'Daily Commute', icon: '🚇' },
                { id: 'Weekend', label: 'Weekend Trips', icon: '🏕️' },
                { id: 'Monthly', label: 'Monthly Escape', icon: '✈️' },
                { id: 'Occasionally', label: 'Occasionally', icon: '🌍' }
              ].map(item => (
                <CategoryCard 
                  key={item.id} 
                  icon={item.icon} 
                  label={item.label} 
                  selected={preferences.frequency === item.id} 
                  onClick={() => updatePreference('frequency', item.id)} 
                />
              ))}
            </div>
          )}

          {/* STEP 5: Preferred Vehicle */}
          {step === 5 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { id: 'Bike', label: 'Motorbike / Bicycle', icon: '🏍️' },
                { id: 'Car', label: 'Personal Car', icon: '🚗' },
                { id: 'Bus', label: 'Public Bus', icon: '🚌' },
                { id: 'Train', label: 'High Speed Train', icon: '🚆' },
                { id: 'Flight', label: 'Air flight', icon: '✈️' }
              ].map(item => (
                <CategoryCard 
                  key={item.id} 
                  icon={item.icon} 
                  label={item.label} 
                  selected={preferences.vehicle === item.id} 
                  onClick={() => updatePreference('vehicle', item.id)} 
                />
              ))}
            </div>
          )}

          {/* Button Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', gap: '14px' }}>
            {step > 1 ? (
              <Button onClick={handleBack} variant="secondary" style={{ padding: '12px 24px' }}>
                <ArrowLeft size={16} /> Back
              </Button>
            ) : (
              <div /> // dummy space
            )}
            
            <Button onClick={handleNext} style={{ padding: '12px 24px' }}>
              {step === 5 ? 'Finish' : 'Next'} <ArrowRight size={16} />
            </Button>
          </div>

        </GlassCard>
      </div>

      {/* Footer */}
      <footer style={{ zIndex: 10 }}>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
          Onboarding metrics are stored locally to personalize co-pilot recommendations.
        </p>
      </footer>
    </div>
  );
};

export default Onboarding;
