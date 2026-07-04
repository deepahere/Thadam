import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Users, 
  Navigation, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Maximize
} from 'lucide-react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { GlassCard } from '../components/Card';

const JourneyPlannerWizard = ({ destination, onBack, onJourneyStarted }) => {
  const [step, setStep] = useState(1); // Steps 1 to 5

  // Step 1: Form Inputs
  const [source, setSource] = useState('Chennai, TN');
  const [travelDate, setTravelDate] = useState('');
  const [departureTime, setDepartureTime] = useState('06:00');
  const [vehicle, setVehicle] = useState('Personal Car');
  const [travellersCount, setTravellersCount] = useState(2);
  const [tripDays, setTripDays] = useState(parseInt(destination.duration) || 3);
  const [travelType, setTravelType] = useState('Family');

  // Step 2: Route Selection state
  const [selectedRoute, setSelectedRoute] = useState('Route A'); // 'Route A' (Fastest), 'Route B' (Budget), 'Route C' (Scenic)
  const [mapZoom, setMapZoom] = useState(6);
  const [mapFullscreen, setMapFullscreen] = useState(false);

  // Step 3: Budget State (Calculates dynamically based on chosen route and vehicle)
  const getFuelFactor = () => {
    if (vehicle === 'Bike') return 2.5;
    if (vehicle === 'High Speed Train' || vehicle === 'Air flight') return 0;
    return 6.5; // car/bus
  };

  const getDistanceNum = () => destination.distance || 150;

  const getBudgetData = () => {
    const dist = getDistanceNum();
    const fuel = Math.round(dist * getFuelFactor());
    const food = travellersCount * 1200 * tripDays;
    const hotel = Math.round(3500 * tripDays);
    const tickets = travellersCount * 400;
    const parking = 300;
    const shopping = selectedRoute === 'Route C' ? 2500 : 1500; // scenic stops has more local shopping
    const buffer = 2000;
    
    // Adjust total based on route discount
    let total = fuel + food + hotel + tickets + parking + shopping + buffer;
    if (selectedRoute === 'Route B') total = Math.round(total * 0.82); // 18% saving

    return { fuel, food, hotel, tickets, parking, shopping, buffer, total };
  };

  const budget = getBudgetData();

  const generateDefaultItinerary = (days, destName) => {
    const list = [];
    for (let d = 1; d <= days; d++) {
      if (d === 1) {
        list.push({
          dayNum: 1,
          title: 'Arrival & Settle',
          color: 'var(--primary-color)',
          events: [
            { id: '1-1', time: '06:00 AM', text: `Start Journey from source coordinates towards ${destName}` },
            { id: '1-2', time: '09:00 AM', text: 'Breakfast stop at local highway diner' },
            { id: '1-3', time: '01:00 PM', text: `Arrive at ${destName} & check-in to accommodations` },
            { id: '1-4', time: '04:00 PM', text: 'Evening stroll around viewpoints and local markets' }
          ]
        });
      } else if (d === days) {
        list.push({
          dayNum: d,
          title: 'Exploration & Departure',
          color: 'var(--accent-color)',
          events: [
            { id: `${d}-1`, time: '08:30 AM', text: `Morning visit to remaining historical sights in ${destName}` },
            { id: `${d}-2`, time: '01:30 PM', text: 'Lunch break trying local specialities' },
            { id: `${d}-3`, time: '03:00 PM', text: 'Souvenir shopping and collecting local handicrafts' },
            { id: `${d}-4`, time: '06:00 PM', text: 'Check-out hotel & initiate return route drive' }
          ]
        });
      } else {
        list.push({
          dayNum: d,
          title: `Day ${d}: Deep Exploration`,
          color: 'var(--secondary-color)',
          events: [
            { id: `${d}-1`, time: '09:00 AM', text: `Trek / local safari to major landmarks in ${destName}` },
            { id: `${d}-2`, time: '01:00 PM', text: 'Traditional lunch feast at popular local eatery' },
            { id: `${d}-3`, time: '03:30 PM', text: 'Explore hidden scenic spots and cultural centers' },
            { id: `${d}-4`, time: '07:30 PM', text: 'Relaxing bonfire or evening musical show' }
          ]
        });
      }
    }
    return list;
  };

  // Step 4: Itinerary Edit state
  const [itinerary, setItinerary] = useState(() => generateDefaultItinerary(tripDays, destination.name));

  useEffect(() => {
    setItinerary(generateDefaultItinerary(tripDays, destination.name));
  }, [tripDays, destination.name]);

  const handleEditItinerary = (dayNum, eventId, newText) => {
    setItinerary(prev => prev.map(day => {
      if (day.dayNum !== dayNum) return day;
      return {
        ...day,
        events: day.events.map(ev => ev.id === eventId ? { ...ev, text: newText } : ev)
      };
    }));
  };

  const handleNext = () => {
    if (step < 5) setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    textAlign: 'left',
    animation: 'fadeIn 0.4s ease-out'
  };

  // Route cards info
  const routesData = [
    { id: 'Route A', label: 'Fastest Path', eta: '3h 15m', dist: `${getDistanceNum()} km`, traffic: 'Optimal', fuel: `₹${Math.round(budget.fuel * 1.1)}`, toll: '₹480', roads: 'Excellent', recommended: true },
    { id: 'Route B', label: 'Budget Friendly', eta: '3h 45m', dist: `${Math.round(getDistanceNum() * 0.95)} km`, traffic: 'Moderate', fuel: `₹${Math.round(budget.fuel * 0.85)}`, toll: '₹0 (Toll Avoided)', roads: 'Good', recommended: false },
    { id: 'Route C', label: 'Scenic Passway', eta: '4h 30m', dist: `${Math.round(getDistanceNum() * 1.15)} km`, traffic: 'Low', fuel: `₹${Math.round(budget.fuel * 1.2)}`, toll: '₹120', roads: 'Moderate', recommended: false }
  ];

  return (
    <div style={containerStyle}>
      
      {/* Wizard Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={onBack}
            style={{
              background: 'var(--surface-color)',
              border: '1px solid var(--surface-border)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--secondary-color)', fontWeight: '700' }}>Journey Engine</span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>
              Plan Trip: {destination.name}
            </h2>
          </div>
        </div>

        <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
          Step {step} of 5
        </span>
      </div>

      {/* Progress timeline bar */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { label: 'Details' },
          { label: 'Routes' },
          { label: 'Budget' },
          { label: 'Itinerary' },
          { label: 'Confirm' }
        ].map((s, idx) => (
          <div 
            key={idx}
            style={{ 
              flex: 1, 
              height: '4px', 
              borderRadius: '2px', 
              background: idx + 1 <= step ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.08)',
              transition: 'background 0.3s ease'
            }} 
          />
        ))}
      </div>

      {/* STEP 1: JOURNEY PLANNING FORM */}
      {step === 1 && (
        <div className="animate-slide-up">
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px', fontFamily: 'var(--font-headings)' }}>
              🗺️ Journey Parameters Setup
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <InputField 
                label="Source (Departure)"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                iconLeft={<MapPin size={16} />}
              />
              <InputField 
                label="Destination (Arrival)"
                value={destination.name}
                disabled
                iconLeft={<MapPin size={16} />}
              />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Travel Date</label>
                <input 
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1.5px solid var(--surface-border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Departure Time</label>
                <input 
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1.5px solid var(--surface-border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Vehicle Class</label>
                <select 
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'var(--bg-color)',
                    border: '1.5px solid var(--surface-border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="Personal Car">Personal Car (Guzzler)</option>
                  <option value="Electric Sedan">Electric Car (Eco)</option>
                  <option value="Bike">Motorbike (Compact)</option>
                  <option value="High Speed Train">High Speed Train</option>
                  <option value="Air flight">Flight</option>
                </select>
              </div>

              <InputField 
                label="Number of Travellers"
                type="number"
                value={travellersCount}
                onChange={(e) => setTravellersCount(Math.max(1, parseInt(e.target.value) || 1))}
                iconLeft={<Users size={16} />}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Trip Duration (Days)</label>
                <input 
                  type="number" 
                  min="1"
                  max="14"
                  value={tripDays}
                  onChange={(e) => setTripDays(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1.5px solid var(--surface-border)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Travel Format</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Solo', 'Family', 'Friends', 'Couple'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTravelType(t)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        background: travelType === t ? 'var(--primary-color)' : 'var(--surface-color)',
                        border: `1.5px solid ${travelType === t ? 'var(--primary-color)' : 'var(--surface-border)'}`,
                        color: travelType === t ? '#fff' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* AI Suggestion Box */}
            <div style={{
              background: 'rgba(37,99,235,0.04)',
              border: '1px solid rgba(37,99,235,0.1)',
              padding: '16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginTop: '10px'
            }}>
              <Sparkles size={18} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '13px', color: '#fff', display: 'block' }}>THADAM AI Suggestion</strong>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.45 }}>
                  {tripDays <= 2 ? `Short weekend escape to ${destination.name}: optimize checkpoints to avoid late night driving.` : 
                   tripDays === 3 ? `Ideal duration for ${destination.name}: spend Day 2 exploring off-beat local sights and trying local cuisines.` : 
                   `Extended corridor exploration to ${destination.name}: we recommend budgeting buffer for souvenir shopping and leisure rests.`}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button onClick={handleNext}>
                Compare Routes <ArrowRight size={16} />
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* STEP 2: ROUTE COMPARISON & SVG INTERACTIVE MAP */}
      {step === 2 && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Dashboard Flex deck split */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="routes-deck-split">
            <style dangerouslySetInnerHTML={{__html: `
              @media (min-width: 992px) {
                .routes-deck-split {
                  grid-template-columns: 1fr 1.1fr !important;
                }
              }
            `}} />

            {/* Column 1: Compare Cards list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>
                Compare Routes
              </h3>
              
              {routesData.map(r => (
                <div 
                  key={r.id}
                  onClick={() => setSelectedRoute(r.id)}
                  style={{
                    background: selectedRoute === r.id ? 'rgba(37, 99, 235, 0.05)' : 'var(--surface-color)',
                    border: `1.5px solid ${selectedRoute === r.id ? 'var(--primary-color)' : 'var(--surface-border)'}`,
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="route-card-hover"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{r.label}</span>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{r.id} ({r.dist})</h4>
                    </div>
                    {r.recommended && (
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', background: 'var(--accent-color)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: '800' }}>
                        AI Recommended
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginTop: '12px', color: 'var(--text-secondary)' }}>
                    <span>⏱️ ETA: <strong>{r.eta}</strong></span>
                    <span>🚗 Traffic: <strong>{r.traffic}</strong></span>
                    <span>⛽ Fuel: <strong>{r.fuel}</strong></span>
                    <span>🪙 Tolls: <strong>{r.toll}</strong></span>
                  </div>
                </div>
              ))}
              <style dangerouslySetInnerHTML={{__html: `
                .route-card-hover:hover {
                  background: rgba(255,255,255,0.02);
                }
              `}} />
            </div>

            {/* Column 2: Vector SVG animated Map co-pilot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Vector Route Map</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setMapZoom(prev => Math.min(10, prev + 1))} style={{ background: 'var(--surface-color)', border: '1px solid var(--surface-border)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><ZoomIn size={14} /></button>
                  <button onClick={() => setMapZoom(prev => Math.max(3, prev - 1))} style={{ background: 'var(--surface-color)', border: '1px solid var(--surface-border)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><ZoomOut size={14} /></button>
                  <button onClick={() => setMapFullscreen(!mapFullscreen)} style={{ background: 'var(--surface-color)', border: '1px solid var(--surface-border)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><Maximize size={14} /></button>
                </div>
              </div>

              {/* Vector SVG Board Canvas */}
              <div style={{
                height: '300px',
                width: '100%',
                background: '#070C16',
                border: '1.5px solid var(--surface-border)',
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Simulated map grid */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                
                {/* SVG Drawing */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                  {/* Dynamic path based on selectedRoute */}
                  {selectedRoute === 'Route A' && (
                    <path d="M 60 220 Q 180 100, 320 60" fill="none" stroke="var(--primary-color)" strokeWidth="4" strokeDasharray="6" className="animated-map-dash" />
                  )}
                  {selectedRoute === 'Route B' && (
                    <path d="M 60 220 Q 200 240, 320 60" fill="none" stroke="var(--secondary-color)" strokeWidth="4" strokeDasharray="6" className="animated-map-dash" />
                  )}
                  {selectedRoute === 'Route C' && (
                    <path d="M 60 220 Q 100 120, 180 180 T 320 60" fill="none" stroke="var(--accent-color)" strokeWidth="4" strokeDasharray="6" className="animated-map-dash" />
                  )}

                  {/* Pulsing route dot */}
                  {selectedRoute === 'Route A' && <circle r="6" fill="#fff" className="pulsing-route-dot-A" />}
                  {selectedRoute === 'Route B' && <circle r="6" fill="#fff" className="pulsing-route-dot-B" />}
                  {selectedRoute === 'Route C' && <circle r="6" fill="#fff" className="pulsing-route-dot-C" />}

                  {/* Source Pin */}
                  <circle cx="60" cy="220" r="10" fill="var(--primary-color)" />
                  <circle cx="60" cy="220" r="4" fill="#fff" />

                  {/* Destination Pin */}
                  <circle cx="320" cy="60" r="10" fill="var(--error-color)" />
                  <circle cx="320" cy="60" r="4" fill="#fff" />
                </svg>

                {/* Floating GPS coordinates */}
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Zoom: {mapZoom}x • Lat: 19.076° N, Lng: 72.877° E
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Button onClick={handleBack} variant="secondary">Back</Button>
            <Button onClick={handleNext}>Confirm Budget <ArrowRight size={16} /></Button>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            .animated-map-dash {
              animation: map-dash-anim 30s infinite linear;
            }
            @keyframes map-dash-anim {
              to {
                stroke-dashoffset: -1000;
              }
            }
            .pulsing-route-dot-A {
              animation: dot-path-A 6s infinite linear;
            }
            .pulsing-route-dot-B {
              animation: dot-path-B 6s infinite linear;
            }
            .pulsing-route-dot-C {
              animation: dot-path-C 6s infinite linear;
            }
            @keyframes dot-path-A {
              0% { motion-path: path('M 60 220 Q 180 100, 320 60'); offset-distance: 0%; }
              100% { motion-path: path('M 60 220 Q 180 100, 320 60'); offset-distance: 100%; }
            }
            @keyframes dot-path-B {
              0% { motion-path: path('M 60 220 Q 200 240, 320 60'); offset-distance: 0%; }
              100% { motion-path: path('M 60 220 Q 200 240, 320 60'); offset-distance: 100%; }
            }
            @keyframes dot-path-C {
              0% { motion-path: path('M 60 220 Q 100 120, 180 180 T 320 60'); offset-distance: 0%; }
              100% { motion-path: path('M 60 220 Q 100 120, 180 180 T 320 60'); offset-distance: 100%; }
            }
          `}} />
        </div>
      )}

      {/* STEP 3: TRAVEL BUDGET PLANNER */}
      {step === 3 && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="budget-deck-split">
            <style dangerouslySetInnerHTML={{__html: `
              @media (min-width: 992px) {
                .budget-deck-split {
                  grid-template-columns: 1.1fr 1fr !important;
                }
              }
            `}} />

            {/* Column 1: Interactive budget item list cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>
                Budget Calculations
              </h3>
              
              {[
                { label: '⛽ Fuel & Tolls', val: budget.fuel, desc: 'Calculated from route distances & vehicle efficiency' },
                { label: '🍜 Meal Expenses', val: budget.food, desc: `${travellersCount} travellers • Food allowances` },
                { label: '🏨 Lodging Hotels', val: budget.hotel, desc: 'Average cost across trip days' },
                { label: '🎟️ Entry Tickets', val: budget.tickets, desc: 'Monument access and bookings' },
                { label: '🛒 Local Shopping', val: budget.shopping, desc: 'Souvenirs and local craft markets budget' },
                { label: '🚨 Safety Buffer', val: budget.buffer, desc: 'Emergency reserve fund' }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--surface-color)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '12px',
                    padding: '12px 16px'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '700' }}>{item.label}</span>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.desc}</p>
                  </div>
                  <strong style={{ fontSize: '14.5px', color: 'var(--text-primary)' }}>₹{item.val}</strong>
                </div>
              ))}

              {/* Total Card */}
              <div style={{
                background: 'var(--primary-gradient)',
                padding: '16px',
                borderRadius: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14.5px', fontWeight: '700', color: '#fff' }}>Total Estimated Budget:</span>
                <strong style={{ fontSize: '20px', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                  ₹{budget.total}
                </strong>
              </div>
            </div>

            {/* Column 2: SVG Pie Chart Visualizer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Expense Breakdown</h3>

              <div style={{
                height: '300px',
                background: 'var(--surface-color)',
                border: '1.5px solid var(--surface-border)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {/* Beautiful dynamic SVG pie chart */}
                <svg width="180" height="180" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--primary-color)" strokeWidth="6" strokeDasharray="30 70" strokeDashoffset="25" />
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--accent-color)" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="95" />
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--warning-color)" strokeWidth="6" strokeDasharray="20 80" strokeDashoffset="70" />
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--secondary-color)" strokeWidth="6" strokeDasharray="15 85" strokeDashoffset="50" />
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--error-color)" strokeWidth="6" strokeDasharray="10 90" strokeDashoffset="35" />
                  
                  <circle cx="21" cy="21" r="12" fill="#0B1220" />
                </svg>

                {/* Legend list indicators */}
                <div style={{ display: 'flex', gap: '12px', fontSize: '10.5px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><circle r="3" cx="3" cy="3" fill="var(--primary-color)" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-color)' }} /> Fuel</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><circle r="3" cx="3" cy="3" fill="var(--accent-color)" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)' }} /> Hotel</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><circle r="3" cx="3" cy="3" fill="var(--warning-color)" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--warning-color)' }} /> Food</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><circle r="3" cx="3" cy="3" fill="var(--secondary-color)" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary-color)' }} /> Shopping</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><circle r="3" cx="3" cy="3" fill="var(--error-color)" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--error-color)' }} /> Buffer</span>
                </div>
              </div>

              {/* Money Saving Tip panel */}
              <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <strong>Co-pilot Save Tip:</strong> Book staying accommodations during mid-week transitions to save up to 15% on resort averages.
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Button onClick={handleBack} variant="secondary">Back</Button>
            <Button onClick={handleNext}>Generate Itinerary <ArrowRight size={16} /></Button>
          </div>
        </div>
      )}

      {/* STEP 4: AI ITINERARY PLANNER */}
      {step === 4 && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>
            Editable AI Itinerary
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {itinerary.map(day => (
              <GlassCard key={day.dayNum} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: day.color, fontWeight: '800' }}>
                  Day {day.dayNum}: {day.title}
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {day.events.map(event => (
                    <div key={event.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏰ {event.time}</span>
                      <input 
                        type="text" 
                        value={event.text} 
                        onChange={(e) => handleEditItinerary(day.dayNum, event.id, e.target.value)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid var(--surface-border)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          fontFamily: 'var(--font-body)'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Button onClick={handleBack} variant="secondary">Back</Button>
            <Button onClick={handleNext}>Confirm Details <ArrowRight size={16} /></Button>
          </div>
        </div>
      )}

      {/* STEP 5: JOURNEY SUMMARY */}
      {step === 5 && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px', fontFamily: 'var(--font-headings)' }}>
              🏁 Journey Planning Summary
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', fontSize: '13.5px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Destination:</span>
                <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{destination.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Trip Duration:</span>
                <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{tripDays} Days</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Departure date:</span>
                <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{travelDate || 'Not configured'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Source start:</span>
                <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{source} • {departureTime}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Distance / Route:</span>
                <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{getDistanceNum()} km ({selectedRoute})</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Travellers count:</span>
                <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{travellersCount} ({travelType})</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Vehicle chosen:</span>
                <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{vehicle}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Estimated budget:</span>
                <strong style={{ display: 'block', color: 'var(--accent-color)', marginTop: '2px' }}>₹{budget.total}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Local Weather:</span>
                <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{destination.weather}</strong>
              </div>
            </div>

            {/* AI Recommendation review card */}
            <div style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.1)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Sparkles size={18} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '13px', color: '#fff', display: 'block' }}>AI Co-Pilot Checklist Verified</strong>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  Calculated packing checklists look optimal. We recommend checking tires and local weather advisories before starting.
                </p>
              </div>
            </div>

            {/* Large start journey action */}
            <Button onClick={onJourneyStarted} style={{ width: '100%', padding: '16px', fontSize: '16px', marginTop: '12px' }}>
              <Navigation size={18} /> Start Travel Journey Now
            </Button>
          </GlassCard>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleBack} variant="secondary">Back</Button>
          </div>
        </div>
      )}

    </div>
  );
};

export default JourneyPlannerWizard;
