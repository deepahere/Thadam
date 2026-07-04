import React, { useState, useEffect } from 'react';
import { ArrowLeft, SlidersHorizontal, Heart, Eye } from 'lucide-react';
import { mockDestinations, mockCategories } from '../services/mockDb';
import { useWishlist } from '../context/WishlistContext';
import Button from '../components/Button';
import { GlassCard } from '../components/Card';

const CategoryDetail = ({ categoryId, onBack, onSelectDestination }) => {
  const { bookmarks, toggleBookmark } = useWishlist();
  const [filterBudget, setFilterBudget] = useState('All'); // 'All' | 'Budget' | 'Mid-range' | 'Luxury'
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const category = mockCategories.find(c => c.id === categoryId) || {
    name: categoryId,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60'
  };

  useEffect(() => {
    setLoading(true);
    // Filter destinations by category tags
    const filtered = mockDestinations.filter(d => 
      d.categories?.includes(categoryId) || d.category === categoryId
    );
    
    // Apply budget filters
    const finalPlaces = filterBudget === 'All' 
      ? filtered 
      : filtered.filter(p => p.budget === filterBudget);
      
    setPlaces(finalPlaces);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [categoryId, filterBudget]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setLoading(false);
    }, 600);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    textAlign: 'left',
    animation: 'fadeIn 0.4s ease-out'
  };

  return (
    <div style={containerStyle}>
      
      {/* Category Hero Banner */}
      <div style={{
        height: '280px',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'var(--shadow-md)'
      }}>
        <img 
          src={category.image} 
          alt={category.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(11, 18, 32, 0.4) 0%, rgba(11, 18, 32, 0.9) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px'
        }}>
          {/* Back Action */}
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
            aria-label="Back to explore"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--secondary-color)', letterSpacing: '1.5px' }}>
              Category Exploration
            </span>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', marginTop: '4px', fontFamily: 'var(--font-headings)' }}>
              {category.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px solid var(--surface-border)',
        paddingBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14.5px' }}>
          <SlidersHorizontal size={16} />
          <span style={{ fontWeight: '600' }}>Filters:</span>
        </div>

        {/* Budget filters */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Budget', 'Mid-range', 'Luxury'].map(b => (
            <button
              key={b}
              onClick={() => setFilterBudget(b)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                background: filterBudget === b ? 'var(--primary-color)' : 'var(--surface-color)',
                border: `1px solid ${filterBudget === b ? 'var(--primary-color)' : 'var(--surface-border)'}`,
                color: filterBudget === b ? '#fff' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
              className="budget-filter-btn"
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Category content displays */}
      {loading && places.length === 0 ? (
        /* Loader skeletons */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '320px', borderRadius: '20px', background: 'var(--surface-color)', animation: 'shimmer 1.5s infinite linear' }} />
          ))}
        </div>
      ) : places.length === 0 ? (
        /* Empty State */
        <div style={{ textAlign: 'center', padding: '60px 24px' }} className="animate-fade">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>No places found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', maxWidth: '320px', margin: '6px auto' }}>
            No destinations in this category match your selected filter criteria.
          </p>
          <Button variant="secondary" onClick={() => setFilterBudget('All')} style={{ marginTop: '16px' }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        /* Masonry styled grid */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {places.slice(0, visibleCount).map((p) => {
              const isBookmarked = bookmarks.includes(p.id);
              
              return (
                <GlassCard 
                  key={p.id} 
                  style={{ padding: 0, borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      className="category-card-img"
                    />
                    
                    {/* Floating Bookmark overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(p.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isBookmarked ? 'var(--error-color)' : '#fff',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'var(--transition-smooth)'
                      }}
                      aria-label="Bookmark"
                    >
                      <Heart size={15} fill={isBookmarked ? 'var(--error-color)' : 'none'} />
                    </button>

                    {/* Quick Preview overlay */}
                    <button
                      onClick={() => onSelectDestination(p)}
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        zIndex: 10,
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      <Eye size={12} /> Preview
                    </button>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--secondary-color)', fontWeight: '700' }}>
                        ★ {p.rating} • {p.duration}
                      </span>
                      <h4 style={{ fontSize: '16.5px', fontWeight: '700', marginTop: '2px', color: 'var(--text-primary)' }}>{p.name}</h4>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>{p.description}</p>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--surface-border)', paddingTop: '12px', marginTop: '12px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>EST. BUDGET</span>
                      <strong style={{ fontSize: '13px', color: 'var(--accent-color)' }}>{p.budgetAmount.split(' - ')[0]}</strong>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Load More option */}
          {visibleCount < places.length && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <Button onClick={loadMore} loading={loading} variant="secondary">
                Load More Destinations
              </Button>
            </div>
          )}

        </div>
      )}

      {/* Inject custom visual animations hover rules */}
      <style dangerouslySetInnerHTML={{__html: `
        .category-card-img:hover {
          transform: scale(1.05);
        }
      `}} />

    </div>
  );
};

export default CategoryDetail;
