export interface Destination {
  id: string;
  name: string;
  state: string;
  category: string[];
  distance: number;
  budgetRange: string;
  image: string;
  popularityScore: number;
  description: string;
}

export interface TripItinerary {
  overview: string;
  dayWisePlan: { day: number; title: string; activities: string[]; meals: string[] }[];
  hotels: { name: string; type: string; price: string; rating: number }[];
  transport: { mode: string; cost: string; duration: string }[];
  foodSuggestions: { name: string; type: string; price: string; mustTry: boolean }[];
  hiddenGems: { name: string; description: string }[];
  costBreakdown: { accommodation: string; transport: string; food: string; activities: string; total: string };
}

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Jaipur",
    state: "Rajasthan",
    category: ["Historic Places", "Shopping", "City Life"],
    distance: 280,
    budgetRange: "₹3,000 - ₹8,000",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600",
    popularityScore: 95,
    description: "The Pink City — a royal blend of history, culture, and vibrant markets."
  },
  {
    id: "2",
    name: "Agra",
    state: "Uttar Pradesh",
    category: ["Historic Places"],
    distance: 230,
    budgetRange: "₹2,500 - ₹6,000",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600",
    popularityScore: 98,
    description: "Home to the iconic Taj Mahal — a monument of eternal love."
  },
  {
    id: "3",
    name: "Rishikesh",
    state: "Uttarakhand",
    category: ["Adventure & Trekking", "Spiritual & Religious", "Nature & Scenic"],
    distance: 350,
    budgetRange: "₹2,000 - ₹5,000",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    popularityScore: 90,
    description: "The Yoga Capital of the World, nestled along the holy Ganges."
  },
  {
    id: "4",
    name: "Udaipur",
    state: "Rajasthan",
    category: ["Historic Places", "Nature & Scenic"],
    distance: 450,
    budgetRange: "₹4,000 - ₹10,000",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600",
    popularityScore: 92,
    description: "The City of Lakes — romantic palaces floating on shimmering waters."
  },
  {
    id: "5",
    name: "Goa",
    state: "Goa",
    category: ["Beaches", "Food & Culture", "City Life"],
    distance: 500,
    budgetRange: "₹5,000 - ₹15,000",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600",
    popularityScore: 96,
    description: "Sun, sand, and soul — India's ultimate beach paradise."
  },
  {
    id: "6",
    name: "Varanasi",
    state: "Uttar Pradesh",
    category: ["Spiritual & Religious", "Food & Culture"],
    distance: 400,
    budgetRange: "₹2,000 - ₹5,000",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600",
    popularityScore: 88,
    description: "The spiritual heart of India — ancient ghats and timeless rituals."
  },
  {
    id: "7",
    name: "Manali",
    state: "Himachal Pradesh",
    category: ["Nature & Scenic", "Adventure & Trekking"],
    distance: 480,
    budgetRange: "₹3,500 - ₹9,000",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600",
    popularityScore: 91,
    description: "Snow-capped peaks, lush valleys, and endless adventure."
  },
  {
    id: "8",
    name: "Hampi",
    state: "Karnataka",
    category: ["Historic Places"],
    distance: 350,
    budgetRange: "₹1,500 - ₹4,000",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
    popularityScore: 85,
    description: "A UNESCO World Heritage Site with stunning boulder-strewn landscapes."
  },
];

export const mockItinerary: TripItinerary = {
  overview: "Experience the royal grandeur of Jaipur over 3 unforgettable days. Explore majestic forts, vibrant bazaars, and savor authentic Rajasthani cuisine.",
  dayWisePlan: [
    {
      day: 1,
      title: "Forts & Palaces",
      activities: ["Visit Amber Fort", "Explore Nahargarh Fort", "Evening at Jal Mahal"],
      meals: ["Breakfast at hotel", "Lunch at LMB", "Dinner at Chokhi Dhani"],
    },
    {
      day: 2,
      title: "Culture & Markets",
      activities: ["City Palace tour", "Hawa Mahal visit", "Jantar Mantar", "Johari Bazaar shopping"],
      meals: ["Breakfast at hotel", "Lunch at Tapri Central", "Street food tour"],
    },
    {
      day: 3,
      title: "Hidden Gems & Departure",
      activities: ["Panna Meena Ka Kund", "Elefantastic elephant sanctuary", "Departure"],
      meals: ["Breakfast at hotel", "Brunch at Anokhi Café"],
    },
  ],
  hotels: [
    { name: "Hotel Pearl Palace", type: "Budget", price: "₹1,200/night", rating: 4.2 },
    { name: "Zostel Jaipur", type: "Budget", price: "₹600/night", rating: 4.0 },
    { name: "Holiday Inn Jaipur", type: "Balanced", price: "₹3,500/night", rating: 4.4 },
    { name: "Rambagh Palace", type: "Premium", price: "₹15,000/night", rating: 4.9 },
  ],
  transport: [
    { mode: "Train (Shatabdi)", cost: "₹700", duration: "4.5 hrs" },
    { mode: "Bus (Volvo)", cost: "₹500", duration: "5.5 hrs" },
    { mode: "Flight", cost: "₹3,000", duration: "1 hr" },
  ],
  foodSuggestions: [
    { name: "Dal Baati Churma", type: "Main Course", price: "₹200", mustTry: true },
    { name: "Laal Maas", type: "Non-Veg", price: "₹350", mustTry: true },
    { name: "Pyaaz Kachori", type: "Snack", price: "₹30", mustTry: true },
    { name: "Ghewar", type: "Dessert", price: "₹100", mustTry: false },
    { name: "Lassi", type: "Beverage", price: "₹50", mustTry: true },
  ],
  hiddenGems: [
    { name: "Panna Meena Ka Kund", description: "A stunning geometric stepwell perfect for photos." },
    { name: "Galtaji Temple", description: "A hidden temple complex with natural springs." },
    { name: "Patrika Gate", description: "A colorful, Instagrammable cultural gate." },
  ],
  costBreakdown: {
    accommodation: "₹3,600",
    transport: "₹1,400",
    food: "₹2,000",
    activities: "₹1,500",
    total: "₹8,500",
  },
};

export const interests = [
  { id: "historic", label: "Historic Places", icon: "🏛️" },
  { id: "nature", label: "Nature & Scenic", icon: "🌿" },
  { id: "spiritual", label: "Spiritual & Religious", icon: "🕉️" },
  { id: "beaches", label: "Beaches", icon: "🏖️" },
  { id: "adventure", label: "Adventure & Trekking", icon: "⛰️" },
  { id: "food", label: "Food & Culture", icon: "🍛" },
  { id: "city", label: "City Life", icon: "🌆" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
];

export const generateItinerary = (
  _destination: string,
  _budget: string,
  _interests: string[]
): TripItinerary => {
  return mockItinerary;
};
