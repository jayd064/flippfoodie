// Global Product Database with Real Indian Products and Amazon Affiliate Links

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  healthScore: number;
  isVillain: boolean;
  affiliateUrl: string;
  heroSwapId?: string; // ID of the healthier alternative
  villainRoast?: string;
}

export const products: Product[] = [
  // Noodles
  {
    id: "maggi",
    name: "Maggi 2-Minute Noodles",
    brand: "Nestle",
    category: "noodles",
    image: "https://m.media-amazon.com/images/I/81vJyEj2RlL._SL1500_.jpg",
    healthScore: 22,
    isVillain: true,
    affiliateUrl: "https://amzn.to/4pmQAxg",
    heroSwapId: "wickedgud",
    villainRoast: "Maida + MSG = Gut destroyer 💀",
  },
  {
    id: "wickedgud",
    name: "WickedGud Noodles",
    brand: "WickedGud",
    category: "noodles",
    image: "https://m.media-amazon.com/images/I/71VN-OFzCZL._SL1500_.jpg",
    healthScore: 78,
    isVillain: false,
    affiliateUrl: "https://amzn.to/3Lcz8O0",
  },

  // Peanut Butter
  {
    id: "droetker-pb",
    name: "Dr. Oetker Peanut Butter",
    brand: "Dr. Oetker",
    category: "spreads",
    image: "https://m.media-amazon.com/images/I/71wvYzV4URL._SL1500_.jpg",
    healthScore: 35,
    isVillain: true,
    affiliateUrl: "https://amzn.to/495Pl0E",
    heroSwapId: "butternut",
    villainRoast: "Hidden sugars & palm oil 🤢",
  },
  {
    id: "butternut",
    name: "Butternut Co. Peanut Butter",
    brand: "Butternut Co.",
    category: "spreads",
    image: "https://m.media-amazon.com/images/I/61U5-aN-URL._SL1280_.jpg",
    healthScore: 82,
    isVillain: false,
    affiliateUrl: "https://amzn.to/45p5njM",
  },

  // Biscuits
  {
    id: "parleg",
    name: "Parle-G Biscuits",
    brand: "Parle",
    category: "biscuits",
    image: "https://m.media-amazon.com/images/I/81Ow0ynNXqL._SL1500_.jpg",
    healthScore: 32,
    isVillain: true,
    affiliateUrl: "https://amzn.to/49pI7U7",
    heroSwapId: "desiculture",
    villainRoast: "Maida + refined sugar combo 🍪💔",
  },
  {
    id: "desiculture",
    name: "Desi Culture Cookies",
    brand: "Desi Culture",
    category: "biscuits",
    image: "https://m.media-amazon.com/images/I/71NtBxVdURL._SL1500_.jpg",
    healthScore: 75,
    isVillain: false,
    affiliateUrl: "https://amzn.to/49jd5xb",
  },

  // Energy Bars
  {
    id: "dairymilk",
    name: "Dairy Milk Silk",
    brand: "Cadbury",
    category: "chocolates",
    image: "https://m.media-amazon.com/images/I/71bsClnBWeL._SL1500_.jpg",
    healthScore: 18,
    isVillain: true,
    affiliateUrl: "https://amzn.to/4sp6cTy",
    heroSwapId: "wholetruth",
    villainRoast: "Sugar bomb disguised as treat 🍫☠️",
  },
  {
    id: "wholetruth",
    name: "The Whole Truth Protein Bar",
    brand: "The Whole Truth",
    category: "chocolates",
    image: "https://m.media-amazon.com/images/I/61xNfI2p5oL._SL1200_.jpg",
    healthScore: 85,
    isVillain: false,
    affiliateUrl: "https://amzn.to/49DmnVS",
  },

  // Condiments
  {
    id: "kissan",
    name: "Kissan Tomato Ketchup",
    brand: "Kissan",
    category: "condiments",
    image: "https://m.media-amazon.com/images/I/61wl6R4fYNL._SL1000_.jpg",
    healthScore: 28,
    isVillain: true,
    affiliateUrl: "https://amzn.to/3YT61lR",
    heroSwapId: "truetomato",
    villainRoast: "More sugar than tomato 🍅🤮",
  },
  {
    id: "truetomato",
    name: "True Elements Tomato Sauce",
    brand: "True Elements",
    category: "condiments",
    image: "https://m.media-amazon.com/images/I/61LO8RBZQ5L._SL1100_.jpg",
    healthScore: 76,
    isVillain: false,
    affiliateUrl: "https://amzn.to/4prtqpB",
  },

  // Cereal
  {
    id: "kelloggs",
    name: "Kellogg's Chocos",
    brand: "Kellogg's",
    category: "cereals",
    image: "https://m.media-amazon.com/images/I/71uLXR5pUkL._SL1500_.jpg",
    healthScore: 25,
    isVillain: true,
    affiliateUrl: "https://amzn.to/4jnbU4h",
    heroSwapId: "monsoon",
    villainRoast: "Breakfast diabetes starter kit 🥣💀",
  },
  {
    id: "monsoon",
    name: "Monsoon Harvest Muesli",
    brand: "Monsoon Harvest",
    category: "cereals",
    image: "https://m.media-amazon.com/images/I/81bCq0RZbJL._SL1500_.jpg",
    healthScore: 88,
    isVillain: false,
    affiliateUrl: "https://amzn.to/3N30Zko",
  },

  // Chips
  {
    id: "lays",
    name: "Lays Magic Masala",
    brand: "PepsiCo",
    category: "snacks",
    image: "https://m.media-amazon.com/images/I/81vg3dU8GEL._SL1500_.jpg",
    healthScore: 15,
    isVillain: true,
    affiliateUrl: "https://amzn.to/4js87CT",
    heroSwapId: "eatanytime",
    villainRoast: "Fried palm oil crisp 🍟💔",
  },
  {
    id: "eatanytime",
    name: "Eat Anytime Protein Chips",
    brand: "Eat Anytime",
    category: "snacks",
    image: "https://m.media-amazon.com/images/I/71L+VftydtL._SL1500_.jpg",
    healthScore: 72,
    isVillain: false,
    affiliateUrl: "https://amzn.to/3N4bQKH",
  },

  // Ghee
  {
    id: "vanaspati",
    name: "Generic Vanaspati Ghee",
    brand: "Various",
    category: "dairy",
    image: "https://m.media-amazon.com/images/I/61QK3YoJNOL._SL1200_.jpg",
    healthScore: 20,
    isVillain: true,
    affiliateUrl: "https://amzn.to/4bisIax",
    heroSwapId: "rosiera2",
    villainRoast: "Trans fat central 🧈☠️",
  },
  {
    id: "rosiera2",
    name: "ROSIER A2 Desi Ghee",
    brand: "ROSIER",
    category: "dairy",
    image: "https://m.media-amazon.com/images/I/61u7m0zhGiL._SL1500_.jpg",
    healthScore: 92,
    isVillain: false,
    affiliateUrl: "https://amzn.to/4q6z69D",
  },

  // Beverages
  {
    id: "frooti",
    name: "Frooti Mango Drink",
    brand: "Parle Agro",
    category: "drinks",
    image: "https://m.media-amazon.com/images/I/51jUhvQ5oRL._SL1000_.jpg",
    healthScore: 22,
    isVillain: true,
    affiliateUrl: "https://amzn.to/3YmFrBy",
    heroSwapId: "rawpressery",
    villainRoast: "Sugar water with mango flavor 🥭🤢",
  },
  {
    id: "rawpressery",
    name: "Raw Pressery Cold Pressed Juice",
    brand: "Raw Pressery",
    category: "drinks",
    image: "https://m.media-amazon.com/images/I/51PdJO5NIEL._SL1100_.jpg",
    healthScore: 80,
    isVillain: false,
    affiliateUrl: "https://amzn.to/44XDK1c",
  },

  // Sweet Spreads
  {
    id: "nutella",
    name: "Nutella Hazelnut Spread",
    brand: "Ferrero",
    category: "spreads",
    image: "https://m.media-amazon.com/images/I/81aGfOsQK-L._SL1500_.jpg",
    healthScore: 24,
    isVillain: true,
    affiliateUrl: "https://amzn.to/4sozhP5",
    heroSwapId: "pintola",
    villainRoast: "60% sugar, 13% palm oil 🍫💀",
  },
  {
    id: "pintola",
    name: "Pintola Almond Butter",
    brand: "Pintola",
    category: "spreads",
    image: "https://m.media-amazon.com/images/I/51IiKt+dU4L._SL1000_.jpg",
    healthScore: 86,
    isVillain: false,
    affiliateUrl: "https://amzn.to/49CYVbm",
  },
];

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getHeroSwap = (villainId: string): Product | undefined => {
  const villain = getProductById(villainId);
  if (villain?.heroSwapId) {
    return getProductById(villain.heroSwapId);
  }
  return undefined;
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
  );
};

export const getVillains = (): Product[] => {
  return products.filter((p) => p.isVillain);
};

export const getHeroes = (): Product[] => {
  return products.filter((p) => !p.isVillain);
};

export const categoryMeta: Record<string, { emoji: string; title: string }> = {
  biscuits: { emoji: "🍪", title: "Biscuits" },
  drinks: { emoji: "🥤", title: "Drinks" },
  chocolates: { emoji: "🍫", title: "Chocolates" },
  noodles: { emoji: "🍜", title: "Noodles" },
  snacks: { emoji: "🍿", title: "Snacks" },
  dairy: { emoji: "🥛", title: "Dairy" },
  spreads: { emoji: "🥜", title: "Spreads" },
  condiments: { emoji: "🍅", title: "Condiments" },
  cereals: { emoji: "🥣", title: "Cereals" },
};

export const getAllCategories = (): string[] => {
  return [...new Set(products.map((p) => p.category))];
};
