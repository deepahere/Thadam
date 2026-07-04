import React, { createContext, useState, useEffect, useContext } from 'react';

const WishlistContext = createContext();

const defaultCollections = [
  { name: 'Summer Vacation', items: [] },
  { name: 'Dream Places', items: ['kerala-backwaters', 'gulmarg-luxury'] },
  { name: 'Weekend Plans', items: ['lonavala-hills'] }
];

export const WishlistProvider = ({ children }) => {
  const [collections, setCollections] = useState(() => {
    const stored = localStorage.getItem('thadam_wishlists');
    return stored ? JSON.parse(stored) : defaultCollections;
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const stored = localStorage.getItem('thadam_bookmarks');
    return stored ? JSON.parse(stored) : ['kerala-backwaters', 'gulmarg-luxury', 'lonavala-hills'];
  });

  useEffect(() => {
    localStorage.setItem('thadam_wishlists', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('thadam_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (destId, collectionName = 'Dream Places') => {
    setBookmarks(prev => {
      if (prev.includes(destId)) {
        // Remove from bookmarks
        const updatedBookmarks = prev.filter(id => id !== destId);
        // Also remove from all collections
        setCollections(prevColl => prevColl.map(col => ({
          ...col,
          items: col.items.filter(id => id !== destId)
        })));
        return updatedBookmarks;
      } else {
        // Add to bookmarks
        const updatedBookmarks = [...prev, destId];
        // Add to specific collection
        setCollections(prevColl => prevColl.map(col => {
          if (col.name === collectionName) {
            return { ...col, items: [...col.items, destId] };
          }
          return col;
        }));
        return updatedBookmarks;
      }
    });
  };

  const createCollection = (name) => {
    if (!name.trim()) return;
    if (collections.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    setCollections(prev => [...prev, { name: name.trim(), items: [] }]);
  };

  const deleteCollection = (name) => {
    setCollections(prev => prev.filter(c => c.name !== name));
  };

  const addPlaceToCollection = (destId, collectionName) => {
    setCollections(prev => prev.map(col => {
      if (col.name === collectionName && !col.items.includes(destId)) {
        return { ...col, items: [...col.items, destId] };
      }
      return col;
    }));
    setBookmarks(prev => prev.includes(destId) ? prev : [...prev, destId]);
  };

  return (
    <WishlistContext.Provider value={{ 
      collections, 
      bookmarks, 
      toggleBookmark, 
      createCollection, 
      deleteCollection, 
      addPlaceToCollection 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
