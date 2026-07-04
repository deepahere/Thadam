import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  Search, 
  Send, 
  Copy,
  Download,
  Award
} from 'lucide-react';
import Button from '../components/Button';
import { GlassCard } from '../components/Card';
import InputField from '../components/InputField';
import { mockDestinations } from '../services/mockDb';

const AiAssistantHub = ({ onClose, onSelectDestination, defaultView = 'bento' }) => {
  const [activeView, setActiveView] = useState(defaultView);

  useEffect(() => {
    setActiveView(defaultView);
  }, [defaultView]);

  // Chat conversational states
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: "Greetings! I'm your THADAM AI Companion. Ready to map scenic corridors or compare budget itineraries. What would you like to explore?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Personalization States
  const [prefStyle, setPrefStyle] = useState('Nature Walks');
  const [prefExplorer, setPrefExplorer] = useState('Solo');
  const [prefBudget, setPrefBudget] = useState('Mid-range');
  const [prefVehicle, setPrefVehicle] = useState('Electric Sedan');
  const [prefWeather, setPrefWeather] = useState('Cool / Breezy');

  // Goals & Challenges State
  const [userXP, setUserXP] = useState(380);
  const [goals] = useState([
    { id: 1, text: 'Visit 10 Hill Stations', current: 4, target: 10, category: 'Hill Station' },
    { id: 2, text: 'Visit 25 Temples', current: 12, target: 25, category: 'Temple' },
    { id: 3, text: 'Complete 5 Road Trips', current: 3, target: 5, category: 'Road Trips' }
  ]);
  const [challenges, setChallenges] = useState([
    { id: 1, text: 'Try a new local street food dish', xp: 50, done: false },
    { id: 2, text: 'Take a scenic sunrise photograph', xp: 100, done: false },
    { id: 3, text: 'Explore one hidden gem this week', xp: 150, done: true } // completed
  ]);

  // Itinerary Generator Inputs
  const [itineraryTarget, setItineraryTarget] = useState('Alappuzha Backwaters');
  const [itineraryDays, setItineraryDays] = useState(2);
  const [itineraryOutput, setItineraryOutput] = useState({
    morning: 'Depart from source. Stop at highway breakfast point for local specialties.',
    afternoon: 'Arrive and check in. Enjoy a traditional afternoon houseboat canal cruise.',
    evening: 'Stroll along the coastal beach. Watch local sunset vistas.',
    night: 'Dine at local clay-pot restaurants. Overnight lake rest.'
  });
  const [itineraryEditing, setItineraryEditing] = useState(false);

  // Travel Story State
  const [storyText] = useState(
    "This weekend you explored Munnar tea estates, tried traditional filter coffee, captured misty mountain peaks and created unforgettable memories."
  );
  const [copiedStory, setCopiedStory] = useState(false);

  // Proactive Alerts list
  const systemAlerts = [
    { text: 'Perfect weather for a hill station trip tomorrow.', time: 'Just now', type: 'info' },
    { text: 'Heavy rain expected on Lonavala road passes.', time: '2h ago', type: 'warning' },
    { text: 'Packing checklist successfully synchronized.', time: '5h ago', type: 'success' }
  ];

  // Micro-interaction handlers
  const handleSendChat = (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    if (!textToSend) setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = "I've analyzed that request! We can map scenic routes and compare budget levels. Would you like me to generate a 2-day itinerary?";
      const lower = text.toLowerCase();
      if (lower.includes('weekend') || lower.includes('chennai') || lower.includes('trip')) {
        reply = "Munnar tea estates and Lonavala Pass offer great weekend corridors under 300km. I have loaded details on your recommendations panel.";
      } else if (lower.includes('budget') || lower.includes('5000')) {
        reply = "For budgets under ₹5000, Lonavala Hills and Hampi Ruins guest lodges are ideal. I have adjusted your preference card to Budget.";
        setPrefBudget('Budget');
      } else if (lower.includes('romantic') || lower.includes('couple')) {
        reply = "Alappuzha houseboat cruises offer highly-rated romantic packages. I can formulate the itinerary now.";
        setItineraryTarget('Alappuzha Backwaters');
      }
      setChatMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    }, 1200);
  };

  const handleVoiceTrigger = () => {
    setVoiceActive(true);
    setTimeout(() => {
      setVoiceActive(false);
      handleSendChat("Suggest a weekend budget trip");
    }, 2200);
  };

  const handleClaimXP = (id, xp) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, done: true } : c));
    setUserXP(prev => prev + xp);
  };

  const handleCopyStory = () => {
    navigator.clipboard.writeText(storyText);
    setCopiedStory(true);
    setTimeout(() => setCopiedStory(false), 2000);
  };

  // Helper greeting picker
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#070C16',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      overflowY: 'auto'
    }} className="hide-scrollbar">
      
      {/* AI Hub Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid var(--surface-border)',
        background: 'rgba(11, 18, 32, 0.6)',
        backdropFilter: 'blur(24px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--secondary-color)', fontWeight: '700' }}>Apple Intelligence Co-Pilot</span>
            <h4 style={{ fontSize: '15px', fontWeight: '800' }}>THADAM Assistant Hub</h4>
          </div>
        </div>

        {/* XP Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <Award size={14} color="#F59E0B" />
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#F59E0B' }}>{userXP} XP</span>
        </div>
      </header>

      {/* Primary view dispatcher tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        padding: '12px 24px', 
        borderBottom: '1px solid var(--surface-border)',
        background: 'rgba(7, 12, 22, 0.4)'
      }} className="hide-scrollbar">
        {[
          { id: 'bento', label: 'Bento Hub', icon: '🍱' },
          { id: 'chat', label: 'Conversational Chat', icon: '💬' },
          { id: 'itinerary', label: 'Itinerary Planner', icon: '📝' },
          { id: 'personalization', label: 'Profile Preferences', icon: '👤' }
        ].map(view => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              background: activeView === view.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activeView === view.id ? 'var(--primary-color)' : 'var(--surface-border)'}`,
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {view.icon} {view.label}
          </button>
        ))}
      </div>

      {/* CORE VIEW PORTS */}
      <main style={{ padding: '32px 24px', flex: 1, maxWidth: '1000px', width: '100%', margin: '0 auto', textAlign: 'left' }}>
        
        {/* 1. BENTO ASSISTANT HUB VIEW */}
        {activeView === 'bento' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Bento Grid layout split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="bento-grid-panel">
              <style dangerouslySetInnerHTML={{__html: `
                @media (min-width: 768px) {
                  .bento-grid-panel {
                    grid-template-columns: 1.2fr 1fr !important;
                  }
                }
              `}} />

              {/* Column 1: AI Home greet & chat suggestions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* AI Home greeting card */}
                <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', overflow: 'hidden' }}>
                  {/* Glowing backdrop circle */}
                  <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '140px', height: '140px', borderRadius: '50%', background: 'var(--primary-gradient)', filter: 'blur(40px)', opacity: 0.15 }} />

                  {/* AI Illustration Banner */}
                  <div style={{
                    height: '110px',
                    borderRadius: '12px',
                    background: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60) center/cover no-repeat',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    marginBottom: '6px',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ background: 'rgba(7, 12, 22, 0.6)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', color: '#fff' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-color)', animation: 'pulse-dot 1.5s infinite' }} />
                      THADAM AI Active
                    </div>
                  </div>

                  <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    {getGreeting()},
                  </span>
                  <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-headings)', color: '#fff', lineHeight: 1.2 }}>
                    Where would you like to <span className="text-gradient">travel today?</span>
                  </h1>

                  {/* Ask Input trigger */}
                  <div 
                    onClick={() => setActiveView('chat')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1.5px solid var(--surface-border)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <Search size={16} />
                    <span style={{ fontSize: '13.5px', flex: 1 }}>Ask anything or suggest a weekend trip...</span>
                    <Mic size={16} color="var(--primary-color)" />
                  </div>
                </GlassCard>

                {/* Smart recommendations row */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', fontFamily: 'var(--font-headings)' }}>Suggested for You</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    {mockDestinations.map(d => (
                      <GlassCard 
                        key={d.id}
                        onClick={() => {
                          if (onSelectDestination) {
                            onSelectDestination(d);
                            onClose();
                          }
                        }}
                        style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                        className="bento-sugg-card"
                      >
                        <div style={{ height: '100px', background: `url(${d.image}) center/cover no-repeat` }} />
                        <div style={{ padding: '12px' }}>
                          <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--secondary-color)', fontWeight: '800' }}>★ {d.rating}</span>
                          <h4 style={{ fontSize: '13.5px', fontWeight: '700', color: '#fff', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</h4>
                          <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>⏱️ {d.duration} • {d.budget}</span>
                        </div>
                      </GlassCard>
                    ))}
                    <style dangerouslySetInnerHTML={{__html: `
                      .bento-sugg-card:hover {
                        transform: translateY(-2px);
                      }
                    `}} />
                  </div>
                </div>

                {/* Travel Story Generated widget */}
                <GlassCard style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--accent-color)', fontWeight: '800' }}>AI Story Generator</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handleCopyStory} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Copy story"><Copy size={14} /></button>
                      <button onClick={() => alert("Travel story downloaded successfully!")} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Download story"><Download size={14} /></button>
                    </div>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.45 }}>
                    "{storyText}"
                  </p>
                  {copiedStory && <span style={{ fontSize: '10px', color: 'var(--accent-color)' }}>Story copied to clipboard!</span>}
                </GlassCard>
              </div>

              {/* Column 2: Personalization preferences and Goals list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Insights and stats cards */}
                <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h4 style={{ fontSize: '14.5px', fontWeight: '700', borderBottom: '1px solid var(--surface-border)', paddingBottom: '6px' }}>AI Companion Insights</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Travel Style:</span>
                      <strong>{prefStyle}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Explorer Format:</span>
                      <strong>{prefExplorer}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Budget Level:</span>
                      <strong>{prefBudget}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Vehicle Preference:</span>
                      <strong>{prefVehicle}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Preferred Weather:</span>
                      <strong>{prefWeather}</strong>
                    </div>
                  </div>
                  
                  <Button variant="secondary" onClick={() => setActiveView('personalization')} style={{ padding: '8px', fontSize: '11px', width: '100%' }}>
                    Adjust Preferences &rarr;
                  </Button>
                </GlassCard>

                {/* Goals Tracker */}
                <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '14.5px', fontWeight: '700' }}>Travel Goals</h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {goals.map(g => (
                      <div key={g.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span>{g.text}</span>
                          <strong>{g.current} / {g.target}</strong>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.06)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${(g.current / g.target) * 100}%`, height: '100%', background: 'var(--primary-color)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Weekly Challenges */}
                <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '14.5px', fontWeight: '700' }}>Weekly Challenges</h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {challenges.map(c => (
                      <div 
                        key={c.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: c.done ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.01)',
                          border: `1px solid ${c.done ? 'rgba(16,185,129,0.2)' : 'var(--surface-border)'}`
                        }}
                      >
                        <span style={{ fontSize: '11.5px', color: c.done ? 'var(--text-muted)' : '#fff', textDecoration: c.done ? 'line-through' : 'none' }}>
                          {c.text}
                        </span>
                        
                        {c.done ? (
                          <span style={{ fontSize: '10px', color: 'var(--accent-color)', fontWeight: '700' }}>Claimed</span>
                        ) : (
                          <button
                            onClick={() => handleClaimXP(c.id, c.xp)}
                            style={{
                              background: 'var(--primary-color)',
                              border: 'none',
                              color: '#fff',
                              fontSize: '10px',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: '700'
                            }}
                          >
                            +{c.xp} XP
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </GlassCard>

              </div>
            </div>

            {/* Proactive Notifications Alerts */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', fontFamily: 'var(--font-headings)' }}>Smart Notifications</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {systemAlerts.map((alertItem, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1.5px solid var(--surface-border)',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: alertItem.type === 'warning' ? 'var(--warning-color)' : 'var(--accent-color)' }} />
                      <span>{alertItem.text}</span>
                    </div>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{alertItem.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. AI Chat & voice assistant screen */}
        {activeView === 'chat' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '520px', justifyContent: 'space-between' }}>
            
            {/* Conversation History dialog */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1, paddingRight: '6px' }} className="hide-scrollbar">
              {chatMessages.map((m, idx) => (
                <div 
                  key={idx}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: m.sender === 'user' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.02)',
                    border: m.sender === 'user' ? 'none' : '1px solid var(--surface-border)',
                    color: m.sender === 'user' ? '#fff' : 'var(--text-primary)',
                    padding: '12px 16px',
                    borderRadius: m.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    fontSize: '13.5px',
                    maxWidth: '85%',
                    lineHeight: '1.45',
                    textAlign: 'left'
                  }}
                >
                  {m.text}
                </div>
              ))}

              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)', padding: '10px 14px', borderRadius: '4px 16px 16px 16px', fontSize: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span className="dot-pulse">●</span>
                  <span className="dot-pulse">●</span>
                  <span className="dot-pulse">●</span>
                </div>
              )}
            </div>

            {/* Quick replies track */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', margin: '14px 0 6px' }} className="hide-scrollbar">
              {[
                { text: 'Suggest a weekend trip', label: '🚗 Weekend Suggest' },
                { text: 'Budget trip under ₹5000', label: '🪙 Under ₹5000' },
                { text: 'Romantic escape routes', label: '💖 Romantic Spots' },
                { text: 'Rainy season destinations', label: '🌧️ Monsoon Escapes' }
              ].map(rep => (
                <button
                  key={rep.text}
                  onClick={() => handleSendChat(rep.text)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1.5px solid var(--surface-border)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {rep.label}
                </button>
              ))}
            </div>

            {/* Chat inputs console */}
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--surface-border)', paddingTop: '14px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <InputField 
                  placeholder={voiceActive ? "Listening to path parameters..." : "Ask anything or ask co-pilot..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChat();
                  }}
                />
              </div>

              {/* Animated Microphone Wave */}
              <button 
                onClick={handleVoiceTrigger}
                style={{
                  background: voiceActive ? 'var(--error-color)' : 'rgba(255,255,255,0.03)',
                  border: '1.5px solid var(--surface-border)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Mic size={18} />
                {voiceActive && (
                  <div style={{
                    position: 'absolute',
                    inset: '-4px',
                    border: '1.5px solid var(--error-color)',
                    borderRadius: '16px',
                    animation: 'rippleWave 1s infinite linear'
                  }} />
                )}
              </button>

              <Button onClick={() => handleSendChat()} style={{ padding: '12px 18px' }}>
                <Send size={16} />
              </Button>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
              .dot-pulse {
                animation: pulse-dot 1.2s infinite ease-in-out;
              }
              .dot-pulse:nth-child(2) { animation-delay: 0.2s; }
              .dot-pulse:nth-child(3) { animation-delay: 0.4s; }
              @keyframes pulse-dot {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
              }
              @keyframes rippleWave {
                to { transform: scale(1.3); opacity: 0; }
              }
            `}} />

          </div>
        )}

        {/* 3. AI ITINERARY GENERATOR */}
        {activeView === 'itinerary' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>AI Itinerary Assistant</h3>
              
              <Button onClick={() => setItineraryEditing(!itineraryEditing)} variant="secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                {itineraryEditing ? 'Save Changes' : 'Edit Itinerary'}
              </Button>
            </div>

            <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <InputField 
                  label="Target Destination"
                  value={itineraryTarget}
                  onChange={(e) => setItineraryTarget(e.target.value)}
                />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Duration (Days)</label>
                  <input 
                    type="number" 
                    value={itineraryDays} 
                    onChange={(e) => setItineraryDays(parseInt(e.target.value) || 2)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1.5px solid var(--surface-border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              {/* Day Breakdown timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid var(--surface-border)', paddingTop: '16px', marginTop: '10px' }}>
                {[
                  { id: 'morning', label: '🌅 Morning Segment' },
                  { id: 'afternoon', label: '☀️ Afternoon Segment' },
                  { id: 'evening', label: '🌇 Evening Segment' },
                  { id: 'night', label: '🌙 Night Rest' }
                ].map(segment => (
                  <div key={segment.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--secondary-color)' }}>{segment.label}</span>
                    
                    {itineraryEditing ? (
                      <input 
                        type="text" 
                        value={itineraryOutput[segment.id]}
                        onChange={(e) => setItineraryOutput({ ...itineraryOutput, [segment.id]: e.target.value })}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid var(--surface-border)',
                          color: '#fff',
                          fontSize: '13px'
                        }}
                      />
                    ) : (
                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>{itineraryOutput[segment.id]}</p>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* 4. USER TRIP PERSONALIZATION */}
        {activeView === 'personalization' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Travel Preferences Personalization</h3>

            <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Travel Style</label>
                  <select 
                    value={prefStyle} 
                    onChange={(e) => setPrefStyle(e.target.value)}
                    style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-color)', border: '1.5px solid var(--surface-border)', color: '#fff' }}
                  >
                    <option value="Nature Walks">Nature & Outdoors</option>
                    <option value="Heritage Explorations">Heritage & Temples</option>
                    <option value="Adventure Climbing">Adventure Climbing</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Explorer Format</label>
                  <select 
                    value={prefExplorer} 
                    onChange={(e) => setPrefExplorer(e.target.value)}
                    style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-color)', border: '1.5px solid var(--surface-border)', color: '#fff' }}
                  >
                    <option value="Solo">Solo Explorer 👤</option>
                    <option value="Family">Family Getaway 👨‍👩‍👧‍👦</option>
                    <option value="Friends">Friends Trip 🎉</option>
                    <option value="Couple">Romantic Couple 💖</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Budget Mode</label>
                  <select 
                    value={prefBudget} 
                    onChange={(e) => setPrefBudget(e.target.value)}
                    style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-color)', border: '1.5px solid var(--surface-border)', color: '#fff' }}
                  >
                    <option value="Budget">Budget Limit (₹5000 max)</option>
                    <option value="Mid-range">Mid-range Mode</option>
                    <option value="Luxury">Luxury Escapes</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Preferred Vehicle</label>
                  <select 
                    value={prefVehicle} 
                    onChange={(e) => setPrefVehicle(e.target.value)}
                    style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-color)', border: '1.5px solid var(--surface-border)', color: '#fff' }}
                  >
                    <option value="Electric Sedan">Electric Sedan (Eco)</option>
                    <option value="Personal SUV">SUV (High Speed)</option>
                    <option value="Motorbike">Bike (Compact)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Preferred Weather</label>
                  <select 
                    value={prefWeather} 
                    onChange={(e) => setPrefWeather(e.target.value)}
                    style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-color)', border: '1.5px solid var(--surface-border)', color: '#fff' }}
                  >
                    <option value="Cool / Breezy">Cool / Winter Breezy</option>
                    <option value="Monsoons">Active Monsoons (Rain)</option>
                    <option value="Tropical Warm">Tropical Warm</option>
                  </select>
                </div>
              </div>

              <Button onClick={() => {
                alert("Preferences updated successfully. Recommendations dynamically re-ranking.");
                setActiveView('bento');
              }} style={{ width: '100%', padding: '12px' }}>
                Save Travel Preferences
              </Button>
            </GlassCard>
          </div>
        )}

      </main>

    </div>
  );
};

export default AiAssistantHub;
