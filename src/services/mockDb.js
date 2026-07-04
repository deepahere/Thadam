import destinationsData from './destinations.json';

const categoryMapping = {
  "Hill Stations": "Hill Station",
  "Beaches": "Beach",
  "Waterfalls": "Waterfalls",
  "Temples": "Temple",
  "Historical Places": "Historical Places",
  "Wildlife & National Parks": "Wildlife",
  "Adventure Destinations": "Adventure",
  "Food Destinations": "Food",
  "Weekend Getaways": "Weekend Trips",
  "Hidden Gems": "Hidden Gems"
};

export const mockDestinations = destinationsData.map((d, index) => {
  const mappedCategory = categoryMapping[d.category] || d.category;
  
  // Construct categories array expected by pages
  const categoriesList = [mappedCategory];
  if (d.hiddenGem) categoriesList.push("Hidden Gems");
  if (d.category === "Weekend Getaways" || d.category === "Weekend Trips") {
    categoriesList.push("Weekend Trips");
  }
  if (d.familyFriendly) categoriesList.push("Family Trips");
  if (d.soloFriendly) categoriesList.push("Solo Travel");
  if (d.coupleFriendly) categoriesList.push("Romantic Trips");
  if (d.estimatedBudget === "Budget") categoriesList.push("Budget Trips");
  if (d.estimatedBudget === "Luxury") categoriesList.push("Luxury Trips");

  // Keep specific IDs matching hardcoded checks in the UI
  let customId = d.id;
  if (d.name === "Alappuzha Backwaters") {
    customId = "kerala-backwaters";
  } else if (d.name === "Gulmarg") {
    customId = "gulmarg-luxury";
  } else if (d.name === "Ziro Valley Pine Meadows" || d.name === "Ziro Valley") {
    customId = "ziro-valley";
  }
  
  return {
    ...d,
    id: customId,
    location: `${d.district ? d.district + ', ' : ''}${d.state}, India`,
    budget: d.estimatedBudget,
    budgetAmount: d.estimatedTotalBudget ? `₹${(d.estimatedStayCost + d.estimatedFoodCost).toLocaleString()} - ₹${d.estimatedTotalBudget.toLocaleString()}` : "₹10,000",
    bestTime: d.bestSeason,
    duration: d.idealTripDuration,
    image: d.images.heroImage,
    category: mappedCategory,
    categories: categoriesList,
    description: d.shortDescription,
    weather: d.weather,
    mustTryFood: d.famousFood,
    distance: (d.category === "Weekend Getaways" || d.category === "Weekend Trips" || mappedCategory === "Weekend Trips") ? (50 + (index % 10) * 20) : Math.round(d.latitude * 50),
    travelTime: "4h drive / 1.5h flight",
    lessCrowded: d.crowdLevel === "Low",
    scenic: d.natureRating > 80,
    peaceful: d.crowdLevel !== "High",
    localFavorite: d.rating > 4.7,
    hiddenGem: d.hiddenGem,
    recommended: d.rating >= 4.7,
    gallery: [
      d.images.galleryImage1,
      d.images.galleryImage2,
      d.images.galleryImage3,
      d.images.galleryImage4,
      d.images.galleryImage5
    ].filter(Boolean),
    overview: {
      about: d.history || d.shortDescription,
      entryFee: d.entryFee,
      openingHours: d.openingHours,
      languages: d.languagesSpoken,
      currency: "Indian Rupee (INR)",
      crowdLevel: d.crowdLevel
    },
    mustVisitPlaces: (d.mustVisitPlaces || "").split(", ").map((place, idx) => ({
      name: place,
      image: d.images[`galleryImage${(idx % 5) + 1}`] || d.images.heroImage,
      distance: `${(idx + 1) * 3} km`,
      desc: `Popular local attraction in ${d.name}.`,
      visitTime: "2 Hours"
    })),
    foodDetails: {
      items: (d.famousFood || "").split(", "),
      restaurants: (d["Nearby Restaurants"] || "Local Dine, Food Court").split(", "),
      vegOptions: "Vegetarian options are widely available at all local restaurants.",
      specialities: `Traditional dishes of ${d.state}`
    },
    stayOptions: {
      budget: `₹${d.estimatedStayCost ? Math.round(d.estimatedStayCost * 0.4) : 1000} - ₹${d.estimatedStayCost ? Math.round(d.estimatedStayCost * 0.8) : 2000}/night (Budget rooms)`,
      premium: `₹${d.estimatedStayCost ? Math.round(d.estimatedStayCost * 1.5) : 4000} - ₹${d.estimatedStayCost ? Math.round(d.estimatedStayCost * 3) : 8000}/night (Premium resorts)`,
      resortPrice: `₹${d.estimatedStayCost ? d.estimatedStayCost : 3000}/night avg`,
      types: ["Resorts", "Hotels", "Homestays"]
    },
    shopping: {
      markets: (d["Nearby Shopping"] || "Local craft market").split(", "),
      items: (d.shoppingItems || "Handicrafts, Souvenirs").split(", ")
    },
    safety: {
      tips: d.travelTips || "Follow standard travel guidelines.",
      emergency: `Police: 112 / ${d.emergencyNumber}`,
      medical: d.medicalFacilities || "District Hospital",
      avoid: d.thingsToAvoid || "Avoid isolated areas at night."
    },
    aiGuide: {
      whyVisit: d.whyVisit,
      bestSeason: d.bestSeason,
      familyFriendly: d.familyFriendly ? "Highly Recommended" : "Good",
      soloFriendly: d.soloFriendly ? "Highly Recommended" : "Good",
      coupleFriendly: d.coupleFriendly ? "Highly Recommended" : "Good",
      scores: {
        nature: d.natureRating,
        adventure: d.adventureRating,
        photography: d.photographyRating,
        overall: Math.round((d.natureRating + d.adventureRating + d.photographyRating) / 3)
      }
    },
    packingList: ["Comfortable Clothes", "Sunscreen", "Camera", "Water Bottle"]
  };
});

export const mockCategories = [
  { id: 'Beach', name: 'Beaches', icon: '🏖️', count: 25, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60' },
  { id: 'Hill Station', name: 'Hill Stations', icon: '🏔️', count: 30, image: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=500&auto=format&fit=crop&q=60' },
  { id: 'Waterfalls', name: 'Waterfalls', icon: '🌊', count: 25, image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=500&auto=format&fit=crop&q=60' },
  { id: 'Temple', name: 'Temples & Heritage', icon: '🏛️', count: 30, image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=500&auto=format&fit=crop&q=60' },
  { id: 'Adventure', name: 'Adventure Spots', icon: '🧗', count: 20, image: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=500&auto=format&fit=crop&q=60' },
  { id: 'Camping', name: 'Camping Grounds', icon: '⛺', count: 10, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop&q=60' },
  { id: 'Food', name: 'Culinary Trails', icon: '🍜', count: 20, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60' },
  { id: 'Historical Places', name: 'History Sites', icon: '📜', count: 25, image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=500&auto=format&fit=crop&q=60' },
  { id: 'Wildlife', name: 'Wildlife Safaris', icon: '🦁', count: 20, image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=500&auto=format&fit=crop&q=60' },
  { id: 'Road Trips', name: 'Road Trips', icon: '🚗', count: 14, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=60' },
  { id: 'Photography Spots', name: 'Photography Stops', icon: '📷', count: 25, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60' },
  { id: 'Hidden Gems', name: 'Hidden Gems', icon: '💎', count: 35, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&auto=format&fit=crop&q=60' },
  { id: 'Luxury Trips', name: 'Luxury Escapes', icon: '✨', count: 9, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&auto=format&fit=crop&q=60' },
  { id: 'Budget Trips', name: 'Budget Friendly', icon: '🪙', count: 19, image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=500&auto=format&fit=crop&q=60' },
  { id: 'Family Trips', name: 'Family Getaways', icon: '👨‍👩‍👧‍👦', count: 21, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&auto=format&fit=crop&q=60' },
  { id: 'Romantic Trips', name: 'Romantic Places', icon: '💖', count: 13, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&auto=format&fit=crop&q=60' },
  { id: 'Weekend Trips', name: 'Weekend Escapes', icon: '🏕️', count: 20, image: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=500&auto=format&fit=crop&q=60' },
  { id: 'Solo Travel', name: 'Solo Travels', icon: '👤', count: 17, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60' }
];

export const mockLocalEvents = [
  { id: 1, title: 'Ziro Music Festival', type: 'Music Festival', date: 'Sept 24 - 27', loc: 'Arunachal Pradesh', color: 'var(--primary-color)' },
  { id: 2, title: 'Goa Food & Wine Festival', type: 'Food Festival', date: 'Nov 12 - 15', loc: 'Panaji, Goa', color: 'var(--accent-color)' },
  { id: 3, title: 'Hampi Cultural Dance Utsav', type: 'Cultural Event', date: 'Jan 03 - 05', loc: 'Hampi Monuments', color: 'var(--warning-color)' },
  { id: 4, title: 'Munnar Tea Harvest Market', type: 'Weekend Market', date: 'Every Sat & Sun', loc: 'Munnar, Kerala', color: 'var(--secondary-color)' }
];
