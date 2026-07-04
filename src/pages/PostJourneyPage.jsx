import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Share2, 
  Download, 
  Play, 
  Pause,
  X,
  Heart
} from 'lucide-react';
import Button from '../components/Button';
import { GlassCard } from '../components/Card';
import InputField from '../components/InputField';

const PostJourneyPage = ({ destination, onExit }) => {
  const [activeTab, setActiveTab] = useState('completion'); // 'completion' | 'summary' | 'journal' | 'gallery' | 'timeline' | 'replay' | 'share'

  // Confetti particles simulation for completion screen
  const [confetti, setConfetti] = useState([]);
  useEffect(() => {
    if (activeTab === 'completion') {
      const particles = Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * -20,
        size: 5 + Math.random() * 8,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 3
      }));
      setConfetti(particles);
    } else {
      setConfetti([]);
    }
  }, [activeTab]);

  // Simulated Journal State
  const [journalTitle, setJournalTitle] = useState(`${destination.name} Escape`);
  const [journalMood, setJournalMood] = useState('Happy ⚡');
  const [journalNotes, setJournalNotes] = useState('An absolutely spectacular trip. The weather was perfect and local street foods were delicious.');
  const [journalRating, setJournalRating] = useState(5);
  const [journalCompanions, setJournalCompanions] = useState('Family');
  const [journalSaved, setJournalSaved] = useState(false);

  // Gallery categorization state
  const galleryPhotos = [
    { url: destination.image, cat: 'Nature', fav: true },
    { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60', cat: 'Food', fav: false },
    { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60', cat: 'Landmarks', fav: true },
    { url: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=500&auto=format&fit=crop&q=60', cat: 'Nature', fav: false },
    { url: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=500&auto=format&fit=crop&q=60', cat: 'Adventure', fav: false }
  ];

  const [activePhoto, setActivePhoto] = useState(null);
  const [likedPhotos, setLikedPhotos] = useState({});

  // Route playback simulation state
  const [replayProgress, setReplayProgress] = useState(0);
  const [replayPlaying, setReplayPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (replayPlaying) {
      interval = setInterval(() => {
        setReplayProgress(prev => (prev >= 100 ? 0 : prev + 2));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [replayPlaying]);

  // Calculations based on destination parameters
  const budgetSum = {
    fuel: Math.round(destination.distance * 6.5),
    food: 4200,
    hotel: 7200,
    parking: 200,
    shopping: 1800,
    total: Math.round(destination.distance * 6.5) + 4200 + 7200 + 200 + 1800,
    saved: 1200
  };

  const handleSaveJournal = (e) => {
    e.preventDefault();
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2500);
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

      {/* Confetti canvas animation container */}
      {activeTab === 'completion' && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10000, overflow: 'hidden' }}>
          {confetti.map(p => (
            <div 
              key={p.id}
              style={{
                position: 'absolute',
                top: `${p.y}%`,
                left: `${p.x}%`,
                width: `${p.size}px`,
                height: `${p.size * 1.5}px`,
                background: p.color,
                borderRadius: '2px',
                opacity: 0.8,
                transform: 'rotate(45deg)',
                animation: `fall ${p.duration}s linear infinite`,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fall {
              0% { top: -5%; transform: rotate(0deg) translateX(0); }
              50% { transform: rotate(180deg) translateX(20px); }
              100% { top: 105%; transform: rotate(360deg) translateX(-20px); }
            }
          `}} />
        </div>
      )}

      {/* Page Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid var(--surface-border)',
        background: 'rgba(11, 18, 32, 0.5)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onExit}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--secondary-color)', fontWeight: '700' }}>Post-Journey Memories</span>
            <h4 style={{ fontSize: '15px', fontWeight: '800' }}>{destination.name} Summary</h4>
          </div>
        </div>

        <span style={{ fontSize: '11px', textTransform: 'uppercase', background: 'var(--accent-color)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontWeight: '800' }}>
          Trip Archived 🏁
        </span>
      </header>

      {/* Navigation Sub-Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        overflowX: 'auto', 
        padding: '12px 24px', 
        borderBottom: '1px solid var(--surface-border)',
        background: 'rgba(7, 12, 22, 0.4)'
      }} className="hide-scrollbar">
        {[
          { id: 'completion', label: 'Completion', icon: '🎉' },
          { id: 'summary', label: 'Expense Summary', icon: '🪙' },
          { id: 'journal', label: 'Diary Journal', icon: '📝' },
          { id: 'gallery', label: 'Memories Gallery', icon: '🖼️' },
          { id: 'timeline', label: 'Checkpoints Path', icon: '📍' },
          { id: 'replay', label: 'Replay Simulation', icon: '🎬' },
          { id: 'share', label: 'Share Story', icon: '✨' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              background: activeTab === tab.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activeTab === tab.id ? 'var(--primary-color)' : 'var(--surface-border)'}`,
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT VIEWER AREA */}
      <main style={{ padding: '32px 24px', flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', textAlign: 'left' }}>
        
        {/* 1. TRIP COMPLETION PANEL */}
        {activeTab === 'completion' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <GlassCard style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16,185,129,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-color)',
                fontSize: '28px'
              }}>
                🎉
              </div>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Journey Completed Successfully!</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px', maxWidth: '480px', margin: '6px auto 0' }}>
                  You have successfully navigated to **{destination.name}**. Take a look at your stats and save your memories!
                </p>
              </div>

              {/* Cover card */}
              <div style={{
                width: '100%',
                maxWidth: '480px',
                height: '220px',
                borderRadius: '16px',
                background: `url(${destination.image}) center/cover no-repeat`,
                marginTop: '12px',
                boxShadow: 'var(--shadow-md)',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', color: '#fff' }}>
                  ★ {destination.rating} • {destination.location}
                </div>
              </div>

              {/* Stats deck grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                width: '100%',
                maxWidth: '480px',
                marginTop: '12px'
              }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--surface-border)', padding: '12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DISTANCE</span>
                  <strong style={{ display: 'block', fontSize: '15px', marginTop: '4px' }}>{destination.distance} km</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--surface-border)', padding: '12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>TRAVEL TIME</span>
                  <strong style={{ display: 'block', fontSize: '15px', marginTop: '4px' }}>{destination.duration}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--surface-border)', padding: '12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>JOURNEY SCORE</span>
                  <strong style={{ display: 'block', fontSize: '15px', color: 'var(--accent-color)', marginTop: '4px' }}>96 / 100</strong>
                </div>
              </div>

              {/* Memory indicators */}
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', display: 'block', marginTop: '8px' }}>
                📸 **5 trip memories captured** and sorted successfully.
              </span>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Button onClick={() => setActiveTab('summary')}>Review Expenses</Button>
                <Button variant="secondary" onClick={() => setActiveTab('journal')}>Write Journal Entry</Button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* 2. TRIP SUMMARY & BUDGET DETAILS */}
        {activeTab === 'summary' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Expense & Budget Summary</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '14.5px', fontWeight: '700', borderBottom: '1px solid var(--surface-border)', paddingBottom: '6px' }}>Cost Breakdown</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Fuel Charges:</span>
                    <strong>₹{budgetSum.fuel}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Food Expenses:</span>
                    <strong>₹{budgetSum.food}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Hotel Stays:</span>
                    <strong>₹{budgetSum.hotel}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Parking:</span>
                    <strong>₹{budgetSum.parking}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Shopping:</span>
                    <strong>₹{budgetSum.shopping}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--surface-border)', paddingTop: '8px', marginTop: '4px', fontSize: '14.5px' }}>
                    <span>Total Expense:</span>
                    <strong style={{ color: 'var(--accent-color)' }}>₹{budgetSum.total}</strong>
                  </div>
                </div>
              </GlassCard>

              {/* Insights and highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <GlassCard style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent-color)', fontWeight: '800' }}>Budget Savings</span>
                  <h4 style={{ fontSize: '18px', fontWeight: '800' }}>You saved ₹{budgetSum.saved}!</h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Avoided heavy tolls and mid-week accommodation markdowns saved you substantial budgets.
                  </p>
                </GlassCard>

                <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700' }}>Route Weather Review</h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    Sunny sky conditions with short misty wind intervals near the pass. Dry pavement throughout.
                  </p>
                </GlassCard>
              </div>
            </div>
          </div>
        )}

        {/* 3. TRAVEL JOURNAL DIARY */}
        {activeTab === 'journal' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Notebook Travel Journal</h3>
            
            <GlassCard style={{ padding: '24px', background: 'var(--bg-color)', border: '1.5px solid var(--surface-border)' }}>
              <form onSubmit={handleSaveJournal} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <InputField 
                  label="Journal Title"
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  required
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Mood Index</label>
                    <select 
                      value={journalMood}
                      onChange={(e) => setJournalMood(e.target.value)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1.5px solid var(--surface-border)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option value="Happy ⚡">Happy ⚡</option>
                      <option value="Peaceful 🌸">Peaceful 🌸</option>
                      <option value="Adventurous 🧗">Adventurous 🧗</option>
                      <option value="Tired ☕">Tired ☕</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Rating (Out of 5 stars)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5"
                      value={journalRating}
                      onChange={(e) => setJournalRating(parseInt(e.target.value) || 5)}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Diary Notes</label>
                  <textarea 
                    rows="4"
                    value={journalNotes}
                    onChange={(e) => setJournalNotes(e.target.value)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1.5px solid var(--surface-border)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13.5px',
                      resize: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Travel Companions</label>
                  <input 
                    type="text" 
                    value={journalCompanions}
                    onChange={(e) => setJournalCompanions(e.target.value)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1.5px solid var(--surface-border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                {journalSaved && (
                  <div style={{ background: 'var(--accent-color)', color: '#fff', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '13px' }}>
                    Journal saved to active local history archives!
                  </div>
                )}

                <Button type="submit" style={{ width: '100%', padding: '14px' }}>
                  <BookOpen size={16} /> Save Journal Entry
                </Button>
              </form>
            </GlassCard>
          </div>
        )}

        {/* 4. MEMORY GALLERY */}
        {activeTab === 'gallery' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Memory Gallery Albums</h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {galleryPhotos.map((photo, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActivePhoto(photo.url)}
                  style={{
                    position: 'relative',
                    height: '160px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="gallery-card-hover"
                >
                  <img src={photo.url} alt="memories" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    padding: '10px'
                  }}>
                    <span style={{ fontSize: '10px', color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{photo.cat}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setLikedPhotos(prev => ({ ...prev, [idx]: !prev[idx] }));
                      }}
                      style={{ background: 'none', border: 'none', color: likedPhotos[idx] ? 'var(--error-color)' : '#fff', cursor: 'pointer' }}
                    >
                      <Heart size={14} fill={likedPhotos[idx] ? 'var(--error-color)' : 'none'} />
                    </button>
                  </div>
                </div>
              ))}
              <style dangerouslySetInnerHTML={{__html: `
                .gallery-card-hover:hover {
                  transform: scale(1.03);
                }
              `}} />
            </div>
          </div>
        )}

        {/* 5. TRIP TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Chronological Timeline Log</h3>

            <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {[
                { time: '06:00 AM', title: 'Started Journey', desc: 'Left Chennai central route' },
                { time: '08:30 AM', title: 'Breakfast Pitstop', desc: 'Stopped for chai and local vada pav' },
                { time: '11:15 AM', title: 'Scenic Valley Viewpoint', desc: 'Brief stop to capture misty wind passes' },
                { time: '01:00 PM', title: 'Lunch Spot Diner', desc: 'Local delicacies tasting stop' },
                { time: '03:45 PM', title: 'Arrival & Destination Check-In', desc: 'Arrived at destination hotels' }
              ].map((item, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '2px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'var(--primary-color)',
                    border: '3px solid #0B1220'
                  }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ {item.time}</span>
                  <strong style={{ display: 'block', fontSize: '14px', color: '#fff', marginTop: '2px' }}>{item.title}</strong>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TRIP REPLAY PATH PLAYBACK */}
        {activeTab === 'replay' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Animated Route Replay</h3>

            <GlassCard style={{ padding: '24px', background: '#070C16', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                height: '240px',
                width: '100%',
                background: '#0B1220',
                borderRadius: '16px',
                position: 'relative',
                border: '1px solid var(--surface-border)',
                overflow: 'hidden'
              }}>
                {/* SVG path mapping route */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                  <path d="M 50 180 Q 200 100, 350 80 T 550 50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                  <path 
                    d="M 50 180 Q 200 100, 350 80 T 550 50" 
                    fill="none" 
                    stroke="var(--accent-color)" 
                    strokeWidth="4" 
                    strokeDasharray="400"
                    strokeDashoffset={400 - (400 * (replayProgress/100))}
                  />
                  
                  {/* Replaying vehicle dot */}
                  <circle 
                    r="6" 
                    fill="#fff" 
                    cx={50 + (500 * (replayProgress/100))} 
                    cy={180 - (130 * (replayProgress/100))} 
                  />
                </svg>

                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', color: '#fff' }}>
                  Replaying corridor details: {replayProgress}% completed
                </div>
              </div>

              {/* Playback Controls */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  onClick={() => setReplayPlaying(!replayPlaying)}
                  style={{
                    background: 'var(--primary-color)',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px'
                  }}
                >
                  {replayPlaying ? <Pause size={14} /> : <Play size={14} />}
                  {replayPlaying ? 'Pause Replay' : 'Play Replay'}
                </button>
                
                <button
                  onClick={() => {
                    setReplayProgress(0);
                    setReplayPlaying(false);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--surface-border)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Reset
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* 7. SHARE STORIES SHEET */}
        {activeTab === 'share' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Generate Travel Story Card</h3>

            <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1.5px solid var(--surface-border)' }}>
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--secondary-color)', fontWeight: '800' }}>MEMORIES CAPTURED</span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>{journalTitle} Story</h2>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Weather: Sunny • Companions: {journalCompanions}</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--surface-border)', padding: '16px', borderRadius: '12px', fontStyle: 'italic', fontSize: '13px', color: 'var(--text-secondary)' }}>
                "A peaceful weekend escape filled with nature, local food and unforgettable sunsets."
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                <span>🏎️ Total distance covered: <strong>{destination.distance} km</strong></span>
                <span>⏱️ Duration: <strong>{destination.duration}</strong></span>
                <span>🔥 Favorite Dish: <strong>{destination.mustTryFood.split(', ')[0]}</strong></span>
                <span>🌸 Travel Mood: <strong>{journalMood}</strong></span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <Button onClick={() => alert("Story card shared successfully to linked social accounts!")}>
                  <Share2 size={16} /> Share Story
                </Button>
                <Button variant="secondary" onClick={() => alert("Story template card downloaded successfully to downloads directory.")}>
                  <Download size={16} /> Download Story
                </Button>
              </div>
            </GlassCard>
          </div>
        )}

      </main>

      {/* Fullscreen Photo Lightbox Modal */}
      {activePhoto && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.95)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <button 
            onClick={() => setActivePhoto(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
          
          <div style={{ maxWidth: '90%', maxHeight: '75%', borderRadius: '16px', overflow: 'hidden' }}>
            <img src={activePhoto} alt="lightbox preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
      )}

    </div>
  );
};

export default PostJourneyPage;
