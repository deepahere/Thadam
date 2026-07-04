import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Navigation, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Compass as CompassIcon, 
  Mic, 
  AlertTriangle, 
  CloudRain,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  Play,
  Pause,
  Zap
} from 'lucide-react';
import Button from '../components/Button';
import { GlassCard } from '../components/Card';
import Modal from '../components/Modal';

const LiveJourneyPage = ({ destination, onExit, onJourneyCompleted }) => {
  // Navigation Simulation States
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(15); // Percentage of route completed
  const [speed, setSpeed] = useState(62); // km/h
  const [remainingDist, setRemainingDist] = useState(Math.round(destination.distance * 0.85) || 120);
  const [etaMins, setEtaMins] = useState(115);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [compassHeading, setCompassHeading] = useState(42);

  // Bottom drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('timeline'); // 'timeline' | 'alerts' | 'discover' | 'food' | 'services' | 'weather' | 'parking' | 'tips'

  // Voice co-pilot simulation
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Voice Guidance Ready');

  // Emergency SOS confirmation
  const [sosOpen, setSosOpen] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);

  // Nearby Services tab selection
  const [serviceCategory, setServiceCategory] = useState('Fuel'); // 'Fuel' | 'EV' | 'Hospital' | 'ATM' | 'Police'

  // Travel Tips Carousel State
  const [tipIndex, setTipIndex] = useState(0);
  const travelTips = [
    { title: 'Local Delicacy Spot Nearby', desc: 'Try the traditional steamed snacks at the next toll exit, highly recommended by locals.' },
    { title: 'Scenic Sunrise Spot Ahead', desc: 'A stunning valley overview overlook point lies just 4 km ahead on your left side.' },
    { title: 'Slippery Pass Caution', desc: 'Expect foggy curves and wet asphalt in the upcoming ghat descent. Keep cruise speed under 45 km/h.' },
    { title: 'Sightseeing Detour Alert', desc: 'A historical fortress entrance is located just 12 minutes off the main corridor path.' }
  ];

  // Dynamic calculations simulation loop
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            onJourneyCompleted(destination);
            return 100;
          }
          return prev + 0.5;
        });
        setRemainingDist(prev => Math.max(0, prev - 1));
        setEtaMins(prev => Math.max(0, prev - 1));
        setSpeed(() => Math.floor(55 + Math.random() * 15));
        setCompassHeading(prev => (prev + (Math.random() > 0.5 ? 2 : -2) + 360) % 360);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, destination, onJourneyCompleted]);

  // Alert categories along the route
  const liveAlerts = [
    { id: 1, title: 'Road Construction Area', desc: 'Lane merge operations ahead on NH-48 sector.', severity: 'Moderate', action: 'Merge to right corridor lane', color: 'var(--warning-color)' },
    { id: 2, title: 'Active Monsoon Rainfall', desc: 'Sudden downpours reported 15 km ahead causing wet roads.', severity: 'High', action: 'Reduce speed to 50 km/h', color: 'var(--error-color)' },
    { id: 3, title: 'Slow Moving Traffic Flow', desc: 'Congestion buildup near the municipal toll boundary pass.', severity: 'Low', action: 'Route A remains fastest route', color: 'var(--accent-color)' }
  ];

  // Scenic Discover points along route
  const discoverPoints = [
    { name: 'Valley Point overlook', dist: '1.2 km off route', detour: '6 min detour', rate: '4.8', desc: 'Panoramic lookouts of high tea-valley boundaries.', image: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=400&auto=format&fit=crop&q=60' },
    { name: 'Misty Waterfall descent', dist: '3.5 km off route', detour: '10 min detour', rate: '4.7', desc: 'Scenic water drop cascading near pass lanes.', image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400&auto=format&fit=crop&q=60' },
    { name: 'Ancient Cliff temple', dist: '2.0 km off route', detour: '8 min detour', rate: '4.6', desc: 'Heritage rock carvings from 11th century era.', image: 'https://images.unsplash.com/photo-1600100397990-a4787a229ba7?w=400&auto=format&fit=crop&q=60' }
  ];

  // Dining stops along the path
  const diningStops = [
    { name: 'Highway Highway Diner', dish: 'Spicy Veg Thali & Chai', price: '₹200 avg', rate: '4.5', dist: '4 km ahead', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=60' },
    { name: 'Banyan tree Cafe stop', dish: 'Filter Coffee & Fritters', price: '₹120 avg', rate: '4.6', dist: '11 km ahead', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=60' }
  ];

  // Services list mapping
  const serviceStations = {
    Fuel: [
      { name: 'National Fuel Station', loc: '3.2 km ahead', status: 'Open 24/7' },
      { name: 'Bharat Highway Fuel Stop', loc: '9.0 km ahead', status: 'Restrooms available' }
    ],
    EV: [
      { name: 'EV Supercharger corridor', loc: '5.5 km ahead', status: '4 slots free • Fast Charge' },
      { name: 'Eco Corridor Plug Point', loc: '12 km ahead', status: 'Type-2 connector free' }
    ],
    Hospital: [
      { name: 'Highway Trauma Center', loc: '14 km ahead', status: 'Emergency services active' }
    ],
    ATM: [
      { name: 'SBI Highway Cash ATM', loc: '1.5 km ahead', status: 'Active cash available' }
    ],
    Police: [
      { name: 'State Highway Patrol Base', loc: '8.2 km ahead', status: 'Toll post outpost' }
    ]
  };

  // Parking lots near destination
  const parkingLots = [
    { name: 'Covered Valley Lot A', fee: '₹50/hour', space: '14 spots free', walk: '3 min walk', tag: 'Covered' },
    { name: 'Open Scenic Lot B', fee: '₹30/hour', space: '28 spots free', walk: '6 min walk', tag: 'Open-Air' }
  ];

  // Timeline Checkpoints
  const journeyTimeline = [
    { name: 'Source Departure (Chennai)', detail: 'Passed successfully', done: true },
    { name: 'Fuel & Air Check Stop', detail: 'National Fuel Station • 3.2 km', done: true },
    { name: 'Scenic Hill Overlook Rest', detail: 'Valley overlook • Detour stop', done: false },
    { name: 'Destination Arrival', detail: destination.name, done: false }
  ];

  const handleVoiceAssistantTrigger = () => {
    setVoiceActive(true);
    setVoiceStatus('Listening to path requests...');
    setTimeout(() => {
      setVoiceActive(false);
      setVoiceStatus('Co-Pilot: Nearest cafes mapped successfully on search suggest.');
    }, 2500);
  };

  const handleTriggerSOS = () => {
    setSosOpen(true);
  };

  const handleConfirmSOS = () => {
    setSosOpen(false);
    setSosSuccess(true);
    setTimeout(() => setSosSuccess(false), 5000);
  };

  // ETA Calculation format
  const getEtaString = () => {
    const hr = Math.floor(etaMins / 60);
    const mins = etaMins % 60;
    return hr > 0 ? `${hr}h ${mins}m` : `${mins} mins`;
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#070C16',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      
      {/* 1. MAP BACKGROUND LAYOUT (~75% or Fullscreen layout back) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        height: drawerOpen ? '45%' : '100%',
        transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        background: '#080E1A',
        overflow: 'hidden'
      }}>
        {/* Mock Map graphics drawing */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
        
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {/* Main Road Route Path line */}
          <path 
            d={`M 150 450 Q 300 200, 480 320 T 750 120`}
            fill="none" 
            stroke="rgba(37, 99, 235, 0.2)" 
            strokeWidth="10" 
            strokeLinecap="round" 
          />
          <path 
            d={`M 150 450 Q 300 200, 480 320 T 750 120`}
            fill="none" 
            stroke="var(--primary-color)" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeDasharray="8 8"
            className="navigation-road-flow"
          />

          {/* Vehicle Marker Pin position dynamically interpolating */}
          <g transform={`translate(${150 + (600 * (progress/100))}, ${350 - (200 * (progress/100))})`}>
            <circle r="22" fill="rgba(37, 99, 235, 0.25)" className="vehicle-pulse-ring" />
            <circle r="12" fill="var(--primary-color)" />
            <polygon points="-5,5 0,-10 5,5" fill="#fff" transform={`rotate(${compassHeading})`} />
          </g>

          {/* Source pin */}
          <circle cx="150" cy="450" r="10" fill="var(--secondary-color)" />
          <circle cx="150" cy="450" r="4" fill="#fff" />

          {/* Destination pin */}
          <circle cx="750" cy="120" r="12" fill="var(--error-color)" />
          <polygon points="750,112 743,124 757,124" fill="#fff" />
        </svg>

        {/* Map UI Floating Controls */}
        <div style={{
          position: 'absolute',
          bottom: drawerOpen ? '16px' : '150px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 10
        }}>
          {/* Recenter */}
          <button 
            onClick={() => setCompassHeading(0)} 
            style={{
              background: 'rgba(15,23,42,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff'
            }}
            title="Recenter Map"
          >
            <CompassIcon size={18} style={{ transform: `rotate(${-compassHeading}deg)`, transition: 'transform 0.2s' }} />
          </button>

          {/* Mute voice Toggle */}
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            style={{
              background: 'rgba(15,23,42,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff'
            }}
            title="Toggle voice alerts"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Fullscreen Map Toggle */}
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            style={{
              background: 'rgba(15,23,42,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff'
            }}
            title="Fullscreen Map"
          >
            <Maximize2 size={18} />
          </button>

          {/* Emergency SOS button */}
          <button 
            onClick={handleTriggerSOS} 
            style={{
              background: 'var(--error-color)',
              border: 'none',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              boxShadow: '0 4px 18px rgba(239, 68, 68, 0.45)',
              fontWeight: '800',
              fontSize: '11px'
            }}
          >
            SOS
          </button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .navigation-road-flow {
            animation: road-flow-animation 12s infinite linear;
          }
          @keyframes road-flow-animation {
            to { stroke-dashoffset: -200; }
          }
          .vehicle-pulse-ring {
            animation: pulse-ring-anim 1.8s infinite ease-out;
          }
          @keyframes pulse-ring-anim {
            0% { transform: scale(0.6); opacity: 1; }
            100% { transform: scale(1.4); opacity: 0; }
          }
        `}} />
      </div>

      {/* 2. TOP FLOATING NAVIGATION HUD BAR */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        alignItems: 'center',
        background: 'rgba(11, 18, 32, 0.65)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--surface-border)',
        borderRadius: '16px',
        padding: '12px 18px',
        color: '#fff',
        boxShadow: 'var(--glass-shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onExit}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--secondary-color)', fontWeight: '700' }}>Active Corridor Route</span>
            <h4 style={{ fontSize: '15px', fontWeight: '800' }}>{destination.name}</h4>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>ETA</span>
            <strong style={{ display: 'block', color: 'var(--accent-color)' }}>{getEtaString()}</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>DISTANCE</span>
            <strong style={{ display: 'block' }}>{remainingDist} km</strong>
          </div>
          <div style={{ textAlign: 'right', display: 'none' }} className="desktop-hud-time">
            <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>TIME</span>
            <strong style={{ display: 'block' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 768px) {
            .desktop-hud-time {
              display: block !important;
            }
          }
        `}} />
      </div>

      {/* 3. BOTTOM SUMMARY CARD NAVIGATION PANEL */}
      {!drawerOpen && (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '20px',
          right: '20px',
          zIndex: 100,
          background: 'rgba(11, 18, 32, 0.72)',
          backdropFilter: 'blur(28px)',
          border: '1px solid var(--surface-border)',
          borderRadius: '20px',
          padding: '16px 20px',
          boxShadow: 'var(--glass-shadow)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Progress bar info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Navigation size={18} style={{ color: 'var(--primary-color)', transform: 'rotate(45deg)' }} />
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Next Instruction</span>
                <strong style={{ display: 'block', fontSize: '13.5px', color: '#fff', marginTop: '2px', textAlign: 'left' }}>
                  Keep Left at fork onto Bypass NH-48 in 800m
                </strong>
              </div>
            </div>

            <button 
              onClick={() => setDrawerOpen(true)}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--surface-border)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <ChevronUp size={16} />
            </button>
          </div>

          {/* Progress line */}
          <div style={{ background: 'rgba(255,255,255,0.06)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-gradient)' }} />
          </div>

          {/* Live stats */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CURRENT SPEED</span>
                <strong style={{ display: 'block', fontSize: '15px', color: 'var(--accent-color)', marginTop: '2px' }}>{speed} km/h</strong>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>REMAINING</span>
                <strong style={{ display: 'block', fontSize: '15px', color: '#fff', marginTop: '2px' }}>{remainingDist} km • {getEtaString()}</strong>
              </div>
            </div>

            {/* Voice co-pilot simulation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{voiceStatus}</span>
              <button 
                onClick={handleVoiceAssistantTrigger}
                style={{
                  background: voiceActive ? 'var(--error-color)' : 'var(--primary-gradient)',
                  border: 'none',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: voiceActive ? '0 0 12px var(--error-color)' : 'none'
                }}
              >
                <Mic size={16} />
              </button>

              <Button 
                onClick={() => onJourneyCompleted(destination)}
                style={{ padding: '8px 16px', fontSize: '11.5px', background: 'var(--accent-color)', border: 'none' }}
              >
                Complete Trip 🎉
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. EXPANDABLE DRAWER OVERLAY DETAILS SHEET */}
      {drawerOpen && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '55%',
          background: 'rgba(11, 18, 32, 0.85)',
          backdropFilter: 'blur(32px)',
          borderTop: '1px solid var(--surface-border)',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 200,
          animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          
          {/* Drawer Handle Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '16px 24px', 
            borderBottom: '1px solid var(--surface-border)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--primary-color)' }} />
              <span style={{ fontSize: '13.5px', fontWeight: '800', textTransform: 'uppercase', color: '#fff', letterSpacing: '0.5px' }}>
                AI Travel Companion Dossier
              </span>
            </div>

            <button 
              onClick={() => setDrawerOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: 'none',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Drawer Horizontal Tabs list */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto', 
            padding: '12px 24px', 
            borderBottom: '1px solid var(--surface-border)'
          }} className="hide-scrollbar">
            {[
              { id: 'timeline', label: 'Checkpoints', icon: '📍' },
              { id: 'alerts', label: 'Live Alerts', icon: '⚠️' },
              { id: 'discover', label: 'Discover Spot', icon: '💎' },
              { id: 'food', label: 'Food Stops', icon: '🍜' },
              { id: 'services', label: 'Services', icon: '⚡' },
              { id: 'weather', label: 'Weather Forecast', icon: '🌦️' },
              { id: 'parking', label: 'Parking Finder', icon: '🚗' },
              { id: 'tips', label: 'Travel Tips', icon: '💡' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDrawerTab(tab.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  background: drawerTab === tab.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${drawerTab === tab.id ? 'var(--primary-color)' : 'var(--surface-border)'}`,
                  color: '#fff',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Drawer Tab Content Viewer Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }} className="hide-scrollbar">
            
            {/* TAB: TIMELINE CHECKPOINTS */}
            {drawerTab === 'timeline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', textAlign: 'left' }}>Journey Timeline Checkpoints</h4>
                <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                  {journeyTimeline.map((checkpoint, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-32px',
                        top: '2px',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: checkpoint.done ? 'var(--accent-color)' : 'var(--surface-border)',
                        border: '3px solid #0B1220'
                      }} />
                      <strong style={{ display: 'block', fontSize: '13.5px', color: checkpoint.done ? '#fff' : 'var(--text-secondary)' }}>{checkpoint.name}</strong>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{checkpoint.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: LIVE ALERTS */}
            {drawerTab === 'alerts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.3s' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', textAlign: 'left' }}>Active Corridor Warning Alerts</h4>
                
                {liveAlerts.map(alertItem => (
                  <GlassCard 
                    key={alertItem.id} 
                    style={{ padding: '14px 16px', borderLeft: `4px solid ${alertItem.color}`, display: 'flex', gap: '14px', alignItems: 'center', textAlign: 'left' }}
                  >
                    <AlertTriangle size={20} style={{ color: alertItem.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <strong style={{ fontSize: '14px', color: '#fff' }}>{alertItem.title}</strong>
                        <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: alertItem.color }}>{alertItem.severity}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>{alertItem.desc}</p>
                      <span style={{ fontSize: '11px', color: 'var(--secondary-color)', display: 'block', marginTop: '6px' }}>Suggested Actions: {alertItem.action}</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* TAB: DISCOVER ALONG ROUTE */}
            {drawerTab === 'discover' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.3s' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', textAlign: 'left' }}>Scenic Discoveries Along Corridor</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {discoverPoints.map((point, idx) => (
                    <GlassCard key={idx} style={{ padding: '12px', display: 'flex', gap: '14px', alignItems: 'center', textAlign: 'left' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: `url(${point.image}) center/cover no-repeat`, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5 style={{ fontSize: '13.5px', fontWeight: '700', color: '#fff' }}>{point.name}</h5>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>★ {point.rate} • 🚗 {point.dist} ({point.detour})</span>
                        <Button 
                          onClick={() => alert(`${point.name} waypoint added to active travel trajectory calculations.`)}
                          variant="secondary" 
                          style={{ padding: '4px 8px', fontSize: '10px', marginTop: '6px', width: '100%' }}
                        >
                          + Add to Journey
                        </Button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: FOOD ALONG ROUTE */}
            {drawerTab === 'food' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.3s' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', textAlign: 'left' }}>Dining & Pitstops Recommendations</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {diningStops.map((stop, idx) => (
                    <GlassCard key={idx} style={{ padding: '12px', display: 'flex', gap: '14px', alignItems: 'center', textAlign: 'left' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: `url(${stop.image}) center/cover no-repeat`, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5 style={{ fontSize: '13.5px', fontWeight: '700', color: '#fff' }}>{stop.name}</h5>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', display: 'block' }}>🔥 {stop.dish}</span>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>★ {stop.rate} • {stop.price} • {stop.dist}</span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SERVICES AT CORRIDOR */}
            {drawerTab === 'services' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.3s' }}>
                
                {/* Horizontal mini selectors */}
                <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px' }}>
                  {['Fuel', 'EV', 'Hospital', 'ATM', 'Police'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setServiceCategory(cat)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        background: serviceCategory === cat ? 'rgba(255,255,255,0.06)' : 'transparent',
                        border: 'none',
                        color: serviceCategory === cat ? 'var(--accent-color)' : 'var(--text-muted)',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {cat === 'EV' ? <Zap size={10} style={{ display: 'inline-block', marginRight: '4px' }} /> : ''}
                      {cat}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                  {serviceStations[serviceCategory]?.map((s, idx) => (
                    <div 
                      key={idx} 
                      style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--surface-border)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <strong style={{ fontSize: '13px', color: '#fff' }}>{s.name}</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>📍 Location: {s.loc}</span>
                      </div>
                      <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.06)', color: 'var(--accent-color)', padding: '3px 8px', borderRadius: '4px' }}>{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: WEATHER ALONG THE JOURNEY */}
            {drawerTab === 'weather' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s', textAlign: 'left' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>Weather Forecast Along Corridor</h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rain Probability</span>
                    <strong style={{ display: 'block', fontSize: '18px', color: 'var(--primary-color)', marginTop: '4px' }}>82%</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Wind Speed</span>
                    <strong style={{ display: 'block', fontSize: '18px', color: '#fff', marginTop: '4px' }}>14 km/h</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Visibility Range</span>
                    <strong style={{ display: 'block', fontSize: '18px', color: '#fff', marginTop: '4px' }}>8.5 km</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Road Condition</span>
                    <strong style={{ display: 'block', fontSize: '18px', color: 'var(--warning-color)', marginTop: '4px' }}>Wet / Slick</strong>
                  </div>
                </div>

                <div style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.1)', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CloudRain size={16} style={{ color: 'var(--primary-color)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: '13px', color: '#fff' }}>AI Co-Pilot Advice</strong>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Rainfall zone expected in 20 minutes. Prepare umbrellas and maintain distance parameters on wet pass roads.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PARKING FINDER */}
            {drawerTab === 'parking' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.3s' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', textAlign: 'left' }}>Destination Parking Finder</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                  {parkingLots.map((lot, idx) => (
                    <div 
                      key={idx}
                      style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--surface-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <strong style={{ fontSize: '13.5px', color: '#fff' }}>{lot.name}</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>🚶 {lot.walk} walk • Rate: {lot.fee}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '10.5px', background: 'rgba(16,185,129,0.06)', color: 'var(--accent-color)', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>{lot.space}</span>
                        <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>{lot.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TRAVEL TIPS CAROUSEL */}
            {drawerTab === 'tips' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.3s', textAlign: 'left' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>Localized Travel Tips</h4>
                
                <GlassCard style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '4px solid var(--primary-color)' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--secondary-color)', fontWeight: '800' }}>
                    Tip {tipIndex + 1} of {travelTips.length}
                  </span>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{travelTips[tipIndex].title}</h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{travelTips[tipIndex].desc}</p>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      onClick={() => setTipIndex(prev => Math.max(0, prev - 1))}
                      disabled={tipIndex === 0}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--surface-border)',
                        color: tipIndex === 0 ? 'var(--text-muted)' : '#fff',
                        borderRadius: '6px',
                        fontSize: '11px',
                        cursor: tipIndex === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Prev
                    </button>
                    <button 
                      onClick={() => setTipIndex(prev => Math.min(travelTips.length - 1, prev + 1))}
                      disabled={tipIndex === travelTips.length - 1}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--surface-border)',
                        color: tipIndex === travelTips.length - 1 ? 'var(--text-muted)' : '#fff',
                        borderRadius: '6px',
                        fontSize: '11px',
                        cursor: tipIndex === travelTips.length - 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Next
                    </button>
                  </div>
                </GlassCard>
              </div>
            )}

          </div>

          {/* Expanded Drawer live speed summary footer */}
          <div style={{ 
            background: 'rgba(7,12,22,0.85)', 
            padding: '14px 24px', 
            borderTop: '1px solid var(--surface-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            <span>Speed: <strong>{speed} km/h</strong> • Signal: <strong>Strong GPS</strong></span>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px solid var(--surface-border)',
                padding: '6px 12px',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              {isPlaying ? 'Pause simulation' : 'Resume simulation'}
            </button>
          </div>

        </div>
      )}

      {/* Emergency Confirm Modal */}
      <Modal show={sosOpen} onClose={() => setSosOpen(false)} title="Confirm Emergency SOS Trigger">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)', padding: '14px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <AlertTriangle size={24} style={{ color: 'var(--error-color)', flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '14.5px', color: '#fff' }}>SOS Activation Alert</strong>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                This will trigger your active GPS coordinates and broadcast emergency logs to roadside dispatchers.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <strong>SOS Emergency Contacts:</strong>
            <span style={{ color: 'var(--text-secondary)' }}>📞 Medical SOS: 112 / 102</span>
            <span style={{ color: 'var(--text-secondary)' }}>📞 Police Highway SOS: 100</span>
            <span style={{ color: 'var(--text-secondary)' }}>📞 Roadside towing: 1800-455-898</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button onClick={() => setSosOpen(false)} variant="secondary">Cancel</Button>
            <Button onClick={handleConfirmSOS} variant="danger">Confirm SOS Broadcast</Button>
          </div>
        </div>
      </Modal>

      {/* SOS Success Banner */}
      {sosSuccess && (
        <div style={{
          position: 'absolute',
          top: '90px',
          left: '20px',
          right: '20px',
          background: 'var(--error-color)',
          color: '#fff',
          padding: '12px 18px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <span style={{ fontSize: '13.5px', fontWeight: '700' }}>⚠️ EMERGENCY SOS TRANSMITTED. Dispatchers and emergency contacts notified.</span>
          <button onClick={() => setSosSuccess(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}

    </div>
  );
};

export default LiveJourneyPage;
