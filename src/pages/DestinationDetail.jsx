import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  DollarSign, 
  Compass, 
  AlertTriangle, 
  Info, 
  ShoppingBag, 
  Coffee,
  CheckSquare,
  Square,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import Button from '../components/Button';
import { GlassCard } from '../components/Card';
import Modal from '../components/Modal';

const DestinationDetail = ({ destination, onBack, onStartPlanning }) => {
  const { bookmarks, toggleBookmark } = useWishlist();
  
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic packing checklist state loaded from destination details
  const [packedItems, setPackedItems] = useState(() => {
    const defaultList = destination.packingList || ['Power Bank', 'First Aid Kit', 'Water Bottle'];
    return defaultList.reduce((acc, item) => {
      acc[item] = false;
      return acc;
    }, {});
  });

  const isBookmarked = bookmarks.includes(destination.id);

  const handleShare = () => {
    navigator.clipboard.writeText(`https://thadam.ai/destinations/${destination.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePackingItem = (item) => {
    setPackedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const getPackedCount = () => {
    return Object.values(packedItems).filter(Boolean).length;
  };

  const getTotalPackingItems = () => {
    return Object.keys(packedItems).length;
  };

  const galleryList = [destination.image, ...(destination.gallery || [])];

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '36px',
    textAlign: 'left',
    animation: 'fadeIn 0.4s ease-out'
  };

  return (
    <div style={containerStyle}>
      
      {/* 1. Large Cover Hero Banner */}
      <div style={{
        position: 'relative',
        height: '420px',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}>
        <img 
          src={galleryList[activeGalleryIndex]} 
          alt={destination.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }} 
        />
        
        {/* Banner Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(11, 18, 32, 0.3) 0%, rgba(11, 18, 32, 0.9) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '28px'
        }}>
          {/* Header Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={onBack}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                transition: 'var(--transition-smooth)'
              }}
              className="circle-overlay-btn"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => toggleBookmark(destination.id)}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isBookmarked ? 'var(--error-color)' : '#fff',
                  transition: 'var(--transition-smooth)'
                }}
                className="circle-overlay-btn"
                aria-label="Bookmark"
              >
                <Heart size={18} fill={isBookmarked ? 'var(--error-color)' : 'none'} />
              </button>

              <button 
                onClick={handleShare}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'var(--transition-smooth)'
                }}
                className="circle-overlay-btn"
                aria-label="Share"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Bottom Title Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--secondary-color)', letterSpacing: '1.5px' }}>
                ★ {destination.rating} • {destination.location}
              </span>
              <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#fff', marginTop: '6px', fontFamily: 'var(--font-headings)' }}>
                {destination.name}
              </h1>
            </div>

            <Button onClick={onStartPlanning} style={{ padding: '14px 28px' }}>
              <Compass size={18} /> Start Planning Journey
            </Button>
          </div>
        </div>
      </div>

      {copied && (
        <div style={{ background: 'var(--accent-color)', color: '#fff', padding: '10px', borderRadius: '8px', textAlign: 'center', animation: 'slideDown 0.3s ease-out' }}>
          Dossier Link copied to clipboard!
        </div>
      )}

      {/* 2. Fullscreen Image Gallery Slider */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', fontFamily: 'var(--font-headings)' }}>Gallery Preview</h3>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }} className="hide-scrollbar">
          {galleryList.map((img, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setActiveGalleryIndex(idx);
                setLightboxOpen(true);
              }}
              style={{
                width: '140px',
                height: '90px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                border: activeGalleryIndex === idx ? '2.5px solid var(--primary-color)' : '1px solid var(--surface-border)',
                flexShrink: 0
              }}
            >
              <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }} className="gallery-img-hover-overlay">
                <Maximize2 size={16} color="#fff" />
              </div>
            </div>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .gallery-img-hover-overlay:hover {
            opacity: 1 !important;
          }
        `}} />
      </div>

      {/* 3. Destination Dossier Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
        
        {/* Info panel card */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '700', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} style={{ color: 'var(--secondary-color)' }} /> Overview Details
          </h4>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {destination.overview?.about || destination.description}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.5px', marginTop: '10px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Entry Fee:</span>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{destination.overview?.entryFee || 'Free'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Opening Hours:</span>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{destination.overview?.openingHours || '24 Hours'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Preferred Lingo:</span>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{destination.overview?.languages || 'English'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Currency:</span>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>{destination.overview?.currency || 'Indian Rupee (INR)'}</strong>
            </div>
          </div>
        </GlassCard>

        {/* AI Insight Advisory Panel */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'radial-gradient(circle at top right, rgba(37,99,235,0.06) 0%, rgba(255,255,255,0.01) 100%)' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '700', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: 'var(--primary-color)' }} /> AI Dossier Guide
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Best season:</span>
              <strong>{destination.aiGuide?.bestSeason || 'Winter months'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Family friendly:</span>
              <strong>{destination.aiGuide?.familyFriendly || 'Recommended'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Solo travellers:</span>
              <strong>{destination.aiGuide?.soloFriendly || 'Highly Recommended'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Couple friendly:</span>
              <strong>{destination.aiGuide?.coupleFriendly || 'Recommended'}</strong>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '12px', marginTop: '4px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>THADAM co-pilot scorecard</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Nature</span>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--accent-color)' }}>{destination.aiGuide?.scores?.nature || 90}%</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Adventure</span>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--secondary-color)' }}>{destination.aiGuide?.scores?.adventure || 80}%</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Photo</span>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--warning-color)' }}>{destination.aiGuide?.scores?.photography || 92}%</strong>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 4. Must Visit Attractions */}
      {destination.mustVisitPlaces && destination.mustVisitPlaces.length > 0 && (
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', fontFamily: 'var(--font-headings)' }}>Must Visit Attractions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {destination.mustVisitPlaces.map((place, idx) => (
              <GlassCard key={idx} style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '12px',
                  background: `url(${place.image}) center/cover no-repeat`,
                  flexShrink: 0
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '14.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.name}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                    🚗 {place.distance} • ⏰ {place.visitTime}
                  </span>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '4px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {place.desc}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* 5. Food, Lodging, and Shopping Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
        
        {/* Local Cuisine */}
        {destination.foodDetails && (
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Coffee size={16} style={{ color: 'var(--warning-color)' }} /> Dining & Gastronomy
            </h4>
            <div style={{ fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Top Specialties:</span>
                <strong style={{ display: 'block', marginTop: '2px', color: 'var(--text-primary)' }}>{destination.foodDetails.items?.join(', ') || destination.mustTryFood}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Top Rated Kitchens:</span>
                <strong style={{ display: 'block', marginTop: '2px', color: 'var(--text-primary)' }}>{destination.foodDetails.restaurants?.join(', ')}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Vegetarian Options:</span>
                <strong style={{ display: 'block', marginTop: '2px', color: 'var(--text-primary)' }}>{destination.foodDetails.vegOptions}</strong>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Accommodation Stays */}
        {destination.stayOptions && (
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={16} style={{ color: 'var(--accent-color)' }} /> Stay & Lodging
            </h4>
            <div style={{ fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Budget Guesthouses:</span>
                <strong style={{ display: 'block', marginTop: '2px', color: 'var(--text-primary)' }}>{destination.stayOptions.budget}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Resort Average:</span>
                <strong style={{ display: 'block', marginTop: '2px', color: 'var(--text-primary)' }}>{destination.stayOptions.premium}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Lodging Formats:</span>
                <strong style={{ display: 'block', marginTop: '2px', color: 'var(--text-primary)' }}>{destination.stayOptions.types?.join(', ')}</strong>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Local Shopping */}
        {destination.shopping && (
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={16} style={{ color: 'var(--primary-color)' }} /> Shopping & Souvenirs
            </h4>
            <div style={{ fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Traditional Souvenirs:</span>
                <strong style={{ display: 'block', marginTop: '2px', color: 'var(--text-primary)' }}>{destination.shopping.items?.join(', ')}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Main Bazaar Streets:</span>
                <strong style={{ display: 'block', marginTop: '2px', color: 'var(--text-primary)' }}>{destination.shopping.markets?.join(', ')}</strong>
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* 6. Safety Info & Interactive Packing Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="dossier-split-deck">
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 768px) {
            .dossier-split-deck {
              grid-template-columns: 1fr 1.2fr !important;
            }
          }
        `}} />

        {/* Safety Guidelines */}
        {destination.safety && (
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '4px solid var(--warning-color)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} style={{ color: 'var(--warning-color)' }} /> Safety Advisories
            </h4>
            <div style={{ fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>General Advice:</span>
                <p style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>{destination.safety.tips}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>SOS Helpline Numbers:</span>
                <p style={{ marginTop: '2px', color: 'var(--text-secondary)', fontWeight: '700' }}>{destination.safety.emergency}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Nearest Medical Facilities:</span>
                <p style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>{destination.safety.medical}</p>
              </div>
              <div>
                <span style={{ color: 'var(--error-color)' }}>Things to Avoid:</span>
                <p style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>{destination.safety.avoid}</p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Dynamic Packing Checklist */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={16} style={{ color: 'var(--accent-color)' }} /> Weather Packing Checklist
            </h4>
            <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
              {getPackedCount()} / {getTotalPackingItems()} packed
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.keys(packedItems).map((item) => (
              <div 
                key={item}
                onClick={() => togglePackingItem(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: packedItems[item] ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${packedItems[item] ? 'rgba(16,185,129,0.2)' : 'var(--surface-border)'}`,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                  userSelect: 'none'
                }}
              >
                {packedItems[item] ? (
                  <CheckSquare size={16} style={{ color: 'var(--accent-color)' }} />
                ) : (
                  <Square size={16} style={{ color: 'var(--text-muted)' }} />
                )}
                <span style={{ 
                  fontSize: '13px', 
                  color: packedItems[item] ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: packedItems[item] ? 'line-through' : 'none'
                }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* 7. Start Planning Journey Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button onClick={onStartPlanning} style={{ padding: '16px 40px', fontSize: '16px' }}>
          <Compass size={20} /> Establish Journey Plan &rarr;
        </Button>
      </div>

      {/* Lightbox full preview modal */}
      <Modal show={lightboxOpen} onClose={() => setLightboxOpen(false)} title="Image Full View">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ height: '380px', borderRadius: '16px', overflow: 'hidden' }}>
            <img src={galleryList[activeGalleryIndex]} alt="lightbox" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Image {activeGalleryIndex + 1} of {galleryList.length}</span>
            <button 
              onClick={() => setLightboxOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer' }}
            >
              Close Preview
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default DestinationDetail;
