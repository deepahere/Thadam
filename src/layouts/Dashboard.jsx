import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  Compass, 
  MapPin, 
  Map, 
  User, 
  Sparkles, 
  Bell, 
  Sun, 
  Moon, 
  Search, 
  Mic, 
  ChevronRight, 
  LogOut, 
  Heart, 
  Plus,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { mockDestinations, mockCategories, mockLocalEvents } from '../services/mockDb';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { GlassCard } from '../components/Card';
import Modal from '../components/Modal';
import DestinationDetail from '../pages/DestinationDetail';
import JourneyPlannerWizard from '../pages/JourneyPlannerWizard';
import CategoryDetail from '../pages/CategoryDetail';
import LiveJourneyPage from '../pages/LiveJourneyPage';
import PostJourneyPage from '../pages/PostJourneyPage';
import AiAssistantHub from '../pages/AiAssistantHub';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { collections, bookmarks, toggleBookmark, createCollection, deleteCollection } = useWishlist();
  
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'explore' | 'plan' | 'journey' | 'profile'
  const [selectedCategory, setSelectedCategory] = useState(null); // categoryId if exploring a specific category
  const [selectedDestDossier, setSelectedDestDossier] = useState(null);
  const [activePlannerDest, setActivePlannerDest] = useState(null);
  const [activeRunningJourney, setActiveRunningJourney] = useState(null);
  const [completedJourney, setCompletedJourney] = useState(null);
  const [userLocation, setUserLocation] = useState('Chennai, Tamil Nadu');

  // Search system
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [voiceSearching, setVoiceSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Munnar tea gardens',
    'Rishikesh river camp',
    'Historical places in Hampi'
  ]);

  // Wishlist collections inputs
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // AI Chat Co-pilot
  const [aiOpen, setAiOpen] = useState(false);
  const [aiDefaultView, setAiDefaultView] = useState('bento');

  // Notifications
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to THADAM! Discover scenic weekend getaways tailored from Chennai.', time: 'Just now', unread: true },
    { id: 2, text: 'Travel style preferences saved successfully.', time: '10m ago', unread: true },
    { id: 3, text: 'Safety checks complete. Travel twin co-pilot initialized.', time: '1h ago', unread: false }
  ]);

  // Dynamic greeting time picker
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Weather descriptions mapping
  const getWeather = () => {
    return { temp: '26°C', desc: 'Sunny / Dry', loc: userLocation };
  };

  // Autocomplete live suggestion handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const matches = mockDestinations.filter(d => 
      d.name.toLowerCase().includes(query) || 
      d.location.toLowerCase().includes(query) || 
      d.category.toLowerCase().includes(query)
    );
    setSearchSuggestions(matches);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
    const match = mockDestinations.find(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (match) {
      setSelectedDestDossier(match);
      setSearchOpen(false);
    } else {
      alert(`No matches for "${searchQuery}". Suggest trying "Munnar" or "Hampi".`);
    }
  };

  const handleVoiceSearch = () => {
    setVoiceSearching(true);
    setTimeout(() => {
      setVoiceSearching(false);
      setSearchQuery('Munnar');
    }, 1800);
  };



  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createCollection(newFolderName);
    setNewFolderName('');
    setNewFolderOpen(false);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const shellStyle = {
    minHeight: '100vh',
    background: 'var(--bg-color)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    paddingBottom: '90px'
  };

  // Featured destinations
  const destinationOfTheDay = mockDestinations.find(d => d.id === 'gulmarg-luxury') || mockDestinations[0];
  const hiddenGemOfTheDay = mockDestinations.find(d => d.id === 'ziro-valley') || mockDestinations[0];
  const weekendEscapes = mockDestinations.filter(d => d.distance < 300);

  if (aiOpen) {
    return <AiAssistantHub defaultView={aiDefaultView} onClose={() => setAiOpen(false)} onSelectDestination={setSelectedDestDossier} />;
  }

  if (completedJourney) {
    return <PostJourneyPage destination={completedJourney} onExit={() => setCompletedJourney(null)} />;
  }

  if (activeRunningJourney) {
    return (
      <LiveJourneyPage 
        destination={activeRunningJourney} 
        onExit={() => setActiveRunningJourney(null)} 
        onJourneyCompleted={(dest) => {
          setCompletedJourney(dest);
          setActiveRunningJourney(null);
        }}
      />
    );
  }

  return (
    <div style={shellStyle} className="animate-fade dashboard-shell-deck">
      {/* Inject grid overlays and responsive layouts overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 992px) {
          .dashboard-shell-deck {
            padding-left: 260px !important;
            padding-bottom: 0 !important;
          }
          .desktop-sidebar {
            display: flex !important;
          }
          .mobile-bottom-nav {
            display: none !important;
          }
        }
        .horizontal-scroll-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 8px 4px;
        }
        .horizontal-scroll-row::-webkit-scrollbar {
          height: 4px;
        }
        .horizontal-scroll-row::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
        }
      `}} />

      {/* Global Top Header Navigation Bar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid var(--surface-border)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Quick Search triggers */}
        <div 
          onClick={() => setSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--surface-color)',
            border: '1px solid var(--surface-border)',
            borderRadius: '14px',
            padding: '10px 16px',
            cursor: 'pointer',
            width: '100%',
            maxWidth: '260px',
            color: 'var(--text-secondary)',
            transition: 'var(--transition-smooth)'
          }}
          className="header-search-bar"
        >
          <Search size={16} />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>Search destinations...</span>
        </div>

        {/* Global theme controls, emergency warning details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={toggleTheme}
            style={{
              background: 'var(--surface-color)',
              border: '1px solid var(--surface-border)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              transition: 'var(--transition-smooth)'
            }}
            className="header-action-btn"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            onClick={() => {
              setNotificationsOpen(true);
              setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
            }}
            style={{
              background: 'var(--surface-color)',
              border: '1px solid var(--surface-border)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              position: 'relative',
              transition: 'var(--transition-smooth)'
            }}
            className="header-action-btn"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--error-color)',
                color: '#fff',
                fontSize: '9px',
                fontWeight: '800',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Core View Area */}
      <main style={{ padding: '32px 24px', flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        
        {/* MAIN ROUTER DISPATCHER FOR SUBPAGES */}
        {activePlannerDest ? (
          <JourneyPlannerWizard 
            destination={activePlannerDest}
            onBack={() => {
              setSelectedDestDossier(activePlannerDest);
              setActivePlannerDest(null);
            }}
            onJourneyStarted={() => {
              setActiveRunningJourney(activePlannerDest);
              setActivePlannerDest(null);
            }}
          />
        ) : selectedDestDossier ? (
          <DestinationDetail 
            destination={selectedDestDossier}
            onBack={() => setSelectedDestDossier(null)}
            onStartPlanning={() => {
              setActivePlannerDest(selectedDestDossier);
              setSelectedDestDossier(null);
            }}
          />
        ) : selectedCategory ? (
          <CategoryDetail 
            categoryId={selectedCategory} 
            onBack={() => setSelectedCategory(null)} 
            onSelectDestination={setSelectedDestDossier}
          />
        ) : (
          <>
            {/* TAB 1: HOME */}
            {activeTab === 'home' && (
              <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '48px', textAlign: 'left' }}>
                
                {/* 1. Large spacious Hero section */}
                <div style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #0A1931 0%, #060913 100%)',
                  padding: '48px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  {/* Weather and Location tags */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <span 
                      onClick={() => {
                        const newLoc = prompt("Enter your location:", userLocation);
                        if (newLoc !== null && newLoc.trim() !== '') {
                          setUserLocation(newLoc.trim());
                        }
                      }}
                      style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontWeight: '800',
                        color: 'var(--secondary-color)',
                        background: 'rgba(255,255,255,0.04)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: '1px solid var(--surface-border)',
                        cursor: 'pointer'
                      }}
                      title="Click to change location"
                    >
                      📍 {getWeather().loc} ✏️
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      🌤️ {getWeather().desc} • {getWeather().temp}
                    </span>
                  </div>

                  {/* Core Greeting & Search */}
                  <div>
                    <span style={{ fontSize: '14.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      {getGreeting()},
                    </span>
                    <h1 style={{ fontSize: '40px', fontWeight: '800', marginTop: '6px', fontFamily: 'var(--font-headings)', color: '#fff' }}>
                      Where do you want to <span className="text-gradient">go today?</span>
                    </h1>
                  </div>

                  {/* Large search co-pilot trigger bar */}
                  <div 
                    onClick={() => setSearchOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1.5px solid var(--surface-border)',
                      borderRadius: '16px',
                      padding: '14px 20px',
                      cursor: 'pointer',
                      width: '100%',
                      maxWidth: '540px',
                      color: 'var(--text-secondary)',
                      transition: 'var(--transition-smooth)'
                    }}
                    className="hero-search-trigger"
                  >
                    <Search size={18} />
                    <span style={{ fontSize: '14.5px', flex: 1, textAlign: 'left' }}>Ask THADAM or type destination...</span>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <Mic size={14} />
                    </div>
                  </div>
                </div>

                {/* 2. Quick Action Grid Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
                  {[
                    { label: 'Plan Journey', icon: '🗺️', action: () => setActiveTab('plan') },
                    { label: 'Explore Paths', icon: '🧭', action: () => setActiveTab('explore') },
                    { label: 'Budget Planner', icon: '🪙', action: () => { setAiDefaultView('personalization'); setAiOpen(true); } },
                    { label: 'AI co-pilot', icon: '✨', action: () => { setAiDefaultView('chat'); setAiOpen(true); } },
                    { label: 'My Collections', icon: '💖', action: () => setActiveTab('profile') }
                  ].map((card, idx) => (
                    <GlassCard 
                      key={idx} 
                      onClick={card.action} 
                      style={{ padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}
                    >
                      <span style={{ fontSize: '28px' }}>{card.icon}</span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{card.label}</span>
                    </GlassCard>
                  ))}
                </div>

                {/* 3. Continue Last Journey Track */}
                <GlassCard style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderLeft: '4px solid var(--primary-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '32px' }}>⛵</span>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Continue Last Journey</h4>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>Alappuzha Backwaters route log • Kerala</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      const match = mockDestinations.find(d => d.id === 'kerala-backwaters');
                      if (match) setSelectedDestDossier(match);
                    }}
                    style={{ padding: '8px 16px', fontSize: '12.5px' }}
                  >
                    Resume Route
                  </Button>
                </GlassCard>

                {/* 4. Destination of the Day (Large horizontal card banner) */}
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', fontFamily: 'var(--font-headings)' }}>Destination of the Day</h2>
                  <GlassCard style={{ padding: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr' }} className="dod-grid">
                    <style dangerouslySetInnerHTML={{__html: `
                      @media (min-width: 768px) {
                        .dod-grid {
                          grid-template-columns: 1.2fr 1fr !important;
                        }
                      }
                    `}} />
                    <div style={{ height: '240px', background: `url(${destinationOfTheDay.image}) center/cover no-repeat` }} />
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                      <span style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--secondary-color)', fontWeight: '700' }}>Featured Travel Spot</span>
                      <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{destinationOfTheDay.name}</h3>
                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {destinationOfTheDay.description} Why visit? {destinationOfTheDay.whyVisit}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--surface-border)', paddingTop: '12px', marginTop: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Best Time: {destinationOfTheDay.bestTime}</span>
                        <button 
                          onClick={() => setSelectedDestDossier(destinationOfTheDay)}
                          style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                        >
                          Explore Place &rarr;
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* 5. AI Recommendations Block */}
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', fontFamily: 'var(--font-headings)' }}>Personalized for You</h2>
                  <div className="horizontal-scroll-row">
                    {mockDestinations.filter(d => d.recommended).map(p => {
                      const isBookmarked = bookmarks.includes(p.id);
                      return (
                        <div key={p.id} style={{ minWidth: '280px', width: '280px', flexShrink: 0 }}>
                          <GlassCard style={{ padding: 0, borderRadius: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ position: 'relative', height: '160px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                              <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button 
                                onClick={() => toggleBookmark(p.id)}
                                style={{
                                  position: 'absolute',
                                  top: '12px',
                                  right: '12px',
                                  background: 'rgba(15, 23, 42, 0.6)',
                                  backdropFilter: 'blur(8px)',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: isBookmarked ? 'var(--error-color)' : '#fff',
                                  cursor: 'pointer'
                                }}
                              >
                                <Heart size={14} fill={isBookmarked ? 'var(--error-color)' : 'none'} />
                              </button>
                            </div>
                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'space-between' }}>
                              <div>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--secondary-color)', fontWeight: '700' }}>★ {p.rating} • {p.duration}</span>
                                <h4 style={{ fontSize: '15px', fontWeight: '700', marginTop: '2px' }}>{p.name}</h4>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>{p.description}</p>
                              </div>
                              <Button 
                                onClick={() => setSelectedDestDossier(p)} 
                                variant="secondary" 
                                style={{ padding: '8px', width: '100%', fontSize: '12px', marginTop: '12px' }}
                              >
                                Quick View
                              </Button>
                            </div>
                          </GlassCard>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Hidden Gem of the Day */}
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', fontFamily: 'var(--font-headings)' }}>Hidden Gem of the Day</h2>
                  <GlassCard style={{ padding: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap', background: 'radial-gradient(circle at top right, rgba(16,185,129,0.06) 0%, rgba(255,255,255,0.01) 100%)' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '16px',
                      background: `url(${hiddenGemOfTheDay.image}) center/cover no-repeat`,
                      flexShrink: 0
                    }} />
                    <div style={{ flex: 1, textAlign: 'left', minWidth: '220px' }}>
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', background: 'var(--accent-color)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: '800' }}>
                        Recommended for You (Less Crowded)
                      </span>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', marginTop: '6px' }}>{hiddenGemOfTheDay.name}</h3>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>{hiddenGemOfTheDay.description}</p>
                      <button 
                        onClick={() => setSelectedDestDossier(hiddenGemOfTheDay)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: '700', cursor: 'pointer', fontSize: '12px', marginTop: '8px', display: 'block' }}
                      >
                        Explore Hidden Gem &rarr;
                      </button>
                    </div>
                  </GlassCard>
                </div>

                {/* 7. Weekend Getaways (Close mileage filters from Mumbai) */}
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', fontFamily: 'var(--font-headings)' }}>Weekend Getaways</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                    {weekendEscapes.map(p => (
                      <GlassCard 
                        key={p.id} 
                        onClick={() => setSelectedDestDossier(p)}
                        style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer' }}
                      >
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: `url(${p.image}) center/cover no-repeat`, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: '14.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                            🚗 {p.distance} km away • {p.travelTime}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: '700', display: 'block', marginTop: '2px' }}>
                            Budget: {p.budgetAmount.split(' - ')[0]}
                          </span>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>

                {/* 8. Top Experiences Section */}
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', fontFamily: 'var(--font-headings)' }}>Top Experiences</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                    {[
                      { title: 'Sunrise Spots', emoji: '🌅' },
                      { title: 'Sunset Spots', emoji: '🌇' },
                      { title: 'Best Cafes', emoji: '☕' },
                      { title: 'Street Food', emoji: '🍢' },
                      { title: 'Adventure Activites', emoji: '🪂' },
                      { title: 'Nature Walks', emoji: '🥾' }
                    ].map((exp, idx) => (
                      <GlassCard 
                        key={idx}
                        onClick={() => {
                          setSelectedCategory('Adventure');
                        }}
                        style={{ padding: '14px', textAlign: 'center', cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: '24px' }}>{exp.emoji}</span>
                        <h4 style={{ fontSize: '12px', fontWeight: '700', marginTop: '6px', color: 'var(--text-secondary)' }}>{exp.title}</h4>
                      </GlassCard>
                    ))}
                  </div>
                </div>

                {/* 9. Local Events */}
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', fontFamily: 'var(--font-headings)' }}>Nearby Local Events</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    {mockLocalEvents.map(e => (
                      <GlassCard 
                        key={e.id}
                        style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: `4px solid ${e.color}` }}
                      >
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>{e.type}</span>
                        <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{e.title}</h4>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                          <span>📅 {e.date}</span>
                          <span>📍 {e.loc}</span>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>

                {/* 10. Travel Inspiration */}
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', fontFamily: 'var(--font-headings)' }}>Travel Inspiration</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                    {[
                      { title: 'Top 10 Places to Visit This Month', desc: 'A curated list of snowy peaks and tropical beach routes.' },
                      { title: 'Hidden Beaches in Maharashtra', desc: 'Quiet coves and sea forts away from typical tourist crowds.' },
                      { title: 'Epic Monsoon Road Trip Ideas', desc: 'The most scenic curves and passes to experience misty winds.' }
                    ].map((insp, idx) => (
                      <GlassCard 
                        key={idx}
                        onClick={() => setSelectedCategory('Beach')}
                        style={{ padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                        className="insp-hover-card"
                      >
                        <div>
                          <h4 style={{ fontSize: '14.5px', fontWeight: '700' }}>{insp.title}</h4>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{insp.desc}</p>
                        </div>
                        <ChevronRight size={16} color="var(--text-muted)" />
                      </GlassCard>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: EXPLORE (18 beautiful category grids) */}
            {activeTab === 'explore' && (
              <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Explore Categories</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginTop: '6px' }}>
                    Choose a path style to display featured gems and popular trails.
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '16px'
                }}>
                  {mockCategories.map((c) => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedCategory(c.id)}
                      style={{
                        height: '140px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'var(--transition-smooth)'
                      }}
                      className="category-explore-grid-card"
                    >
                      <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} className="explore-cat-img" />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent 30%, rgba(11,18,32,0.85) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '12px'
                      }}>
                        <span style={{ fontSize: '24px', marginBottom: '4px' }}>{c.icon}</span>
                        <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>{c.name}</h4>
                        <span style={{ fontSize: '9px', color: 'var(--secondary-color)', fontWeight: '600' }}>{c.count} trails</span>
                      </div>
                    </div>
                  ))}
                </div>

                <style dangerouslySetInnerHTML={{__html: `
                  .category-explore-grid-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-md);
                  }
                  .category-explore-grid-card:hover .explore-cat-img {
                    transform: scale(1.05);
                  }
                `}} />
              </div>
            )}

            {/* TAB 3: PLAN */}
            {activeTab === 'plan' && (
              <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>AI Route Planner</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginTop: '6px' }}>
                    Select any recommended corridor to configure budgets, compare routes, and build custom itineraries.
                  </p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '10px' }}>
                  {mockDestinations.map(d => (
                    <GlassCard 
                      key={d.id}
                      style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                      <div style={{ height: '140px', borderRadius: '12px', background: `url(${d.image}) center/cover no-repeat` }} />
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '800' }}>{d.name}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{d.location}</span>
                      </div>
                      <Button onClick={() => {
                        setActivePlannerDest(d);
                      }} style={{ width: '100%', padding: '10px', fontSize: '13px' }}>
                        Plan Journey
                      </Button>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: JOURNEY */}
            {activeTab === 'journey' && (
              <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Spatial Navigation Twin</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginTop: '6px' }}>
                    Active GPS telemetry coordinates and live weather forecast paths.
                  </p>
                </div>
                
                <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', minHeight: '300px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px' }}>🚗</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800' }}>No Active Live Navigation Track</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', maxWidth: '340px', lineHeight: 1.5 }}>
                    Select a route in the planner wizard or resume a route to begin live co-piloting.
                  </p>
                  <Button onClick={() => {
                    const match = mockDestinations[0]; // default backwaters
                    setActiveRunningJourney(match);
                  }} style={{ marginTop: '10px' }}>
                    Quick Start Demo Journey
                  </Button>
                </GlassCard>
              </div>
            )}

            {/* TAB 5: PROFILE (Contains Settings & Collections Wishlists) */}
            {activeTab === 'profile' && (
              <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '36px', textAlign: 'left' }}>
                
                {/* User avatar header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: user?.avatarColor || 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#fff',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                  }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-headings)' }}>{user?.name || 'Explorer'}</h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{user?.email}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span>📍 {user?.country || 'India'}</span>
                      <span>•</span>
                      <span>🌐 {user?.language || 'English'}</span>
                    </div>
                  </div>
                </div>

                {/* Save For Later: Wishlist Collections manager */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Wishlists & Collections</h2>
                    <Button 
                      onClick={() => setNewFolderOpen(true)}
                      style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Plus size={14} /> New Folder
                    </Button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {collections.map(col => {
                      const colPlaces = mockDestinations.filter(d => col.items.includes(d.id));
                      
                      return (
                        <GlassCard key={col.name} style={{ padding: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px', marginBottom: '14px' }}>
                            <div>
                              <h4 style={{ fontSize: '16px', fontWeight: '700' }}>📁 {col.name}</h4>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{col.items.length} items saved</span>
                            </div>
                            {col.name !== 'Dream Places' && col.name !== 'Weekend Plans' && (
                              <button 
                                onClick={() => deleteCollection(col.name)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>

                          {colPlaces.length === 0 ? (
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No items in this collection folder yet.</span>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                              {colPlaces.map(p => (
                                <div 
                                  key={p.id}
                                  onClick={() => setSelectedDestDossier(p)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    background: 'var(--surface-color)',
                                    border: '1px solid var(--surface-border)',
                                    borderRadius: '12px',
                                    padding: '10px',
                                    cursor: 'pointer'
                                  }}
                                  className="wishlist-item-card"
                                >
                                  <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: `url(${p.image}) center/cover no-repeat`, flexShrink: 0 }} />
                                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                    <h5 style={{ fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h5>
                                    <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{p.location}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </GlassCard>
                      );
                    })}
                  </div>
                </div>

                {/* Travel Insights */}
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', fontFamily: 'var(--font-headings)' }}>Travel Insights</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
                    <GlassCard style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ fontSize: '28px' }}>🚗</span>
                      <h4 style={{ fontSize: '20px', fontWeight: '800', marginTop: '6px' }}>2,850 km</h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total Distance Covered</span>
                    </GlassCard>
                    <GlassCard style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ fontSize: '28px' }}>🏕️</span>
                      <h4 style={{ fontSize: '20px', fontWeight: '800', marginTop: '6px' }}>6 city hubs</h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Places Explored</span>
                    </GlassCard>
                    <GlassCard style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ fontSize: '28px' }}>🏖️</span>
                      <h4 style={{ fontSize: '20px', fontWeight: '800', marginTop: '6px' }}>Nature</h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Favorite Category</span>
                    </GlassCard>
                  </div>
                </div>

                {/* Travel Achievements */}
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', fontFamily: 'var(--font-headings)' }}>Achievements & Badges</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    {[
                      { title: 'Mountain Explorer', icon: '🏔️', progress: 80, detail: 'Visited 4 of 5 hill tracks' },
                      { title: 'Beach Lover', icon: '🏖️', progress: 40, detail: 'Visited 2 of 5 coastline hubs' },
                      { title: 'Solo Explorer', icon: '👤', progress: 100, detail: 'Completed first independent travel' },
                      { title: 'Road Trip Expert', icon: '🚗', progress: 60, detail: 'Logged over 1500 highway km' }
                    ].map(ach => (
                      <GlassCard key={ach.title} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span style={{ fontSize: '24px' }}>{ach.icon}</span>
                          <div>
                            <strong style={{ fontSize: '13px', display: 'block' }}>{ach.title}</strong>
                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{ach.detail}</span>
                          </div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.06)', height: '4px', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
                          <div style={{ width: `${ach.progress}%`, height: '100%', background: 'var(--primary-color)' }} />
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>

                {/* Travel Calendar View */}
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', fontFamily: 'var(--font-headings)' }}>Travel Calendar</h2>
                  <GlassCard style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', fontSize: '12px' }}>
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <strong key={d} style={{ color: 'var(--text-muted)' }}>{d}</strong>
                      ))}
                      {Array.from({ length: 35 }).map((_, i) => {
                        const day = (i % 31) + 1;
                        const isTravelled = day === 3 || day === 12 || day === 24;
                        return (
                          <div 
                            key={i}
                            onClick={() => {
                              if (isTravelled) {
                                alert(`Travel Log: Trip summary saved for day ${day} of this month.`);
                              }
                            }}
                            style={{
                              padding: '8px 0',
                              borderRadius: '8px',
                              background: isTravelled ? 'var(--primary-color)' : 'transparent',
                              border: `1.5px solid ${isTravelled ? 'var(--primary-color)' : 'rgba(255,255,255,0.02)'}`,
                              color: isTravelled ? '#fff' : 'var(--text-secondary)',
                              cursor: isTravelled ? 'pointer' : 'default',
                              fontWeight: isTravelled ? '700' : 'normal'
                            }}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                </div>

                {/* Past Trip History Search/Filters */}
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', fontFamily: 'var(--font-headings)' }}>Trip History</h2>
                  
                  {/* Mock search/filter panel */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <input 
                      type="text" 
                      placeholder="Search past trips..."
                      style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1.5px solid var(--surface-border)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                    <select 
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'var(--bg-color)',
                        border: '1.5px solid var(--surface-border)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    >
                      <option value="">All Categories</option>
                      <option value="Nature">Nature</option>
                      <option value="Historical">Historical</option>
                      <option value="Beach">Beach</option>
                    </select>
                  </div>

                  {/* Past Trip list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { name: 'Gulmarg Snowy Peaks', date: 'Dec 2025', duration: '5 Days', budget: '₹22,000', rating: 5, category: 'Nature', image: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=200&auto=format&fit=crop&q=60' },
                      { name: 'Munnar Tea Estates', date: 'Oct 2025', duration: '3 Days', budget: '₹8,500', rating: 4, category: 'Nature', image: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=200&auto=format&fit=crop&q=60' }
                    ].map((trip, idx) => (
                      <GlassCard key={idx} style={{ padding: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: `url(${trip.image}) center/cover no-repeat`, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{trip.name}</h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            📅 {trip.date} • ⏱️ {trip.duration} • 💰 Budget: {trip.budget}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: 'var(--warning-color)', fontWeight: '700' }}>{'★'.repeat(trip.rating)}</span>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>

                {/* Core Settings layout block */}
                <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '16.5px', fontWeight: '700', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px', fontFamily: 'var(--font-headings)' }}>
                    System Settings
                  </h3>

                  {/* Dark/Light toggler */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>Platform Theme</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Choose between dark or light system layouts.</div>
                    </div>
                    <Button variant="secondary" onClick={toggleTheme} style={{ padding: '8px 16px', fontSize: '13px' }}>
                      {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                    </Button>
                  </div>

                  {/* Disconnect active session */}
                  <Button variant="danger" onClick={logout} style={{ marginTop: '10px' }}>
                    <LogOut size={16} /> Disconnect Active Session
                  </Button>
                </GlassCard>

              </div>
            )}
          </>
        )}

      </main>

      {/* Floating AI Assistant Action Trigger */}
      <button 
        onClick={() => { setAiDefaultView('bento'); setAiOpen(true); }}
        style={{
          position: 'fixed',
          bottom: activeTab === 'profile' ? '100px' : '100px',
          right: '24px',
          background: 'var(--primary-gradient)',
          border: '1.5px solid var(--primary-color)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(37, 99, 235, 0.45)',
          zIndex: 1000,
          transition: 'transform 0.2s',
          animation: 'pulseGlow 2.5s infinite ease-in-out'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Ask THADAM co-pilot"
      >
        <Sparkles size={24} />
      </button>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav 
        className="mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          right: '16px',
          height: '66px',
          background: 'rgba(11, 18, 32, 0.72)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid var(--surface-border)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 12px',
          boxShadow: 'var(--glass-shadow)',
          zIndex: 1000
        }}
      >
        {[
          { id: 'home', label: 'Home', icon: <HomeIcon size={18} /> },
          { id: 'explore', label: 'Explore', icon: <Compass size={18} /> },
          { id: 'plan', label: 'Plan', icon: <MapPin size={18} /> },
          { id: 'journey', label: 'Journey', icon: <Map size={18} /> },
          { id: 'profile', label: 'Profile', icon: <User size={18} /> }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedCategory(null); // reset category page
            }}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)',
              transition: 'color 0.2s'
            }}
          >
            {tab.icon}
            <span style={{ fontSize: '10px', fontWeight: '700' }}>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside 
        className="desktop-sidebar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '260px',
          background: 'var(--bg-color)',
          borderRight: '1px solid var(--surface-border)',
          padding: '32px 24px',
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 101
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
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

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'home', label: 'Home', icon: <HomeIcon size={16} /> },
              { id: 'explore', label: 'Explore Paths', icon: <Compass size={16} /> },
              { id: 'plan', label: 'Route Planner', icon: <MapPin size={16} /> },
              { id: 'journey', label: 'Active Journey', icon: <Map size={16} /> },
              { id: 'profile', label: 'Profile Setup', icon: <User size={16} /> }
            ].map(tab => (
              <div 
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedCategory(null); // reset category page
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: activeTab === tab.id ? 'rgba(37, 99, 235, 0.06)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'var(--transition-smooth)'
                }}
                className="desktop-nav-item"
              >
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            ))}
          </nav>

        </div>

        {/* Sidebar Footer User profile snippet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--surface-border)', paddingTop: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: user?.avatarColor || 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '700',
            color: '#fff'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </div>
      </aside>



      {/* DYNAMIC SMART SEARCH OVERLAY MODAL */}
      <Modal 
        show={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        title="Explore Destinations"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <InputField 
                placeholder={voiceSearching ? "Listening to path request..." : "Where do you want to go?"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                iconLeft={<Search size={16} />}
                iconRight={<Mic size={16} className={voiceSearching ? "live-status-dot" : ""} style={{ cursor: 'pointer', color: voiceSearching ? 'var(--error-color)' : 'var(--text-muted)' }} />}
                onIconRightClick={handleVoiceSearch}
                required
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {/* Autocomplete live suggestions list */}
          {searchSuggestions.length > 0 && (
            <div style={{ textAlign: 'left', border: '1px solid var(--surface-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', maxHeight: '180px', overflowY: 'auto' }} className="hide-scrollbar">
              {searchSuggestions.map(d => (
                <div 
                  key={d.id}
                  onClick={() => {
                    setSelectedDestDossier(d);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    fontSize: '13.5px',
                    borderBottom: '1px solid var(--surface-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  className="search-sugg-hover"
                >
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{d.name}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{d.location}</span>
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--secondary-color)', fontWeight: '700' }}>★ {d.rating}</span>
                </div>
              ))}
            </div>
          )}

          {/* Recents and popular keywords selection */}
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent Searches</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentSearches.map((s, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setSearchQuery(s);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--surface-color)',
                    cursor: 'pointer',
                    fontSize: '13.5px'
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{s}</span>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>

        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .search-sugg-hover:hover {
            background: var(--surface-hover);
          }
        `}} />
      </Modal>

      {/* NEW WISH LIST FOLDER DIALOG */}
      <Modal 
        show={newFolderOpen} 
        onClose={() => setNewFolderOpen(false)} 
        title="Create Wishlist Collection"
      >
        <form onSubmit={handleCreateFolder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <InputField 
            label="Collection Folder Name"
            placeholder="e.g. Dream Escapes"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            required
          />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button onClick={() => setNewFolderOpen(false)} variant="secondary">Cancel</Button>
            <Button type="submit">Create Folder</Button>
          </div>
        </form>
      </Modal>

      {/* NOTIFICATIONS BELL DRAWER */}
      <Modal 
        show={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
        title="System Alerts"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map(n => (
            <div 
              key={n.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.01)',
                border: `1.5px solid ${n.unread ? 'rgba(37, 99, 235, 0.2)' : 'var(--surface-border)'}`,
                borderLeft: n.unread ? '4px solid var(--primary-color)' : '1.5px solid var(--surface-border)',
                textAlign: 'left'
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-primary)' }}>{n.text}</p>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>



    </div>
  );
};

export default Dashboard;
