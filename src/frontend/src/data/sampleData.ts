import type { MenuItem } from "../backend.d";

export const SAMPLE_MENU_ITEMS: MenuItem[] = [
  // Starters
  {
    id: BigInt(1),
    name: "Crispy Calamari",
    description:
      "Golden-fried calamari with house-made marinara, fresh lemon, and herb aioli. A Brew classic.",
    available: true,
    category: "Starters",
    price: 12,
  },
  {
    id: BigInt(2),
    name: "Wood-Fired Bruschetta",
    description:
      "Heirloom tomatoes, fresh basil, and aged balsamic on grilled sourdough with garlic-infused olive oil.",
    available: true,
    category: "Starters",
    price: 10,
  },
  {
    id: BigInt(3),
    name: "Loaded Nachos",
    description:
      "House tortilla chips with slow-cooked pulled pork, jalapeños, smoked cheddar, pico de gallo, and crema.",
    available: true,
    category: "Starters",
    price: 14,
  },
  // Mains
  {
    id: BigInt(4),
    name: "Pan-Seared Salmon",
    description:
      "Atlantic salmon fillet with roasted asparagus, lemon beurre blanc, and crispy capers.",
    available: true,
    category: "Mains",
    price: 28,
  },
  {
    id: BigInt(5),
    name: "The Brew Craft Burger",
    description:
      "8oz dry-aged beef patty, sharp cheddar, caramelized onions, house pickles, and smoked aioli on a brioche bun.",
    available: true,
    category: "Mains",
    price: 18,
  },
  {
    id: BigInt(6),
    name: "Wild Mushroom Risotto",
    description:
      "Arborio rice with a medley of wild mushrooms, truffle oil, Parmesan, and fresh thyme.",
    available: true,
    category: "Mains",
    price: 22,
  },
  // Brews
  {
    id: BigInt(7),
    name: "Amber Hop IPA",
    description:
      "Our signature house IPA — bold citrus hops, a clean bitter finish, 6.2% ABV. Brewed in-house.",
    available: true,
    category: "Brews",
    price: 8,
  },
  {
    id: BigInt(8),
    name: "Midnight Craft Stout",
    description:
      "Rich, velvety stout with notes of dark chocolate and roasted coffee. 5.8% ABV.",
    available: true,
    category: "Brews",
    price: 9,
  },
  {
    id: BigInt(9),
    name: "Harvest Seasonal Ale",
    description:
      "A rotating seasonal ale featuring the finest local ingredients. Ask your server for today's selection.",
    available: true,
    category: "Brews",
    price: 8,
  },
  {
    id: BigInt(10),
    name: "Golden Lager",
    description:
      "Crisp and refreshing lager with a smooth malt character and clean finish. 4.5% ABV.",
    available: true,
    category: "Brews",
    price: 7,
  },
  // Desserts
  {
    id: BigInt(11),
    name: "Warm Chocolate Brownie",
    description:
      "Decadent dark chocolate brownie served warm with Tahitian vanilla ice cream and salted caramel drizzle.",
    available: true,
    category: "Desserts",
    price: 9,
  },
  {
    id: BigInt(12),
    name: "New York Cheesecake",
    description:
      "Classic creamy cheesecake on a graham cracker crust with fresh berry compote and whipped cream.",
    available: true,
    category: "Desserts",
    price: 10,
  },
  // Drinks
  {
    id: BigInt(13),
    name: "Sparkling Water",
    description:
      "San Pellegrino sparkling mineral water, served with fresh lemon or lime.",
    available: true,
    category: "Drinks",
    price: 4,
  },
  {
    id: BigInt(14),
    name: "House-Made Lemonade",
    description:
      "Fresh-squeezed lemonade with a hint of lavender and mint. Perfectly refreshing.",
    available: true,
    category: "Drinks",
    price: 5,
  },
];

export const MENU_CATEGORIES = [
  "Starters",
  "Mains",
  "Brews",
  "Desserts",
  "Drinks",
] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export const CATEGORY_IMAGES: Record<string, string> = {
  Starters: "/assets/generated/food-calamari.dim_400x300.jpg",
  Mains: "/assets/generated/food-salmon.dim_400x300.jpg",
  Brews: "/assets/generated/food-beer.dim_400x300.jpg",
  Desserts: "/assets/generated/food-brownie.dim_400x300.jpg",
  Drinks: "/assets/generated/food-beer.dim_400x300.jpg",
};

export const TIME_SLOTS = [
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];

export const DEFAULT_RESTAURANT_INFO = {
  about:
    "At Brew, we believe that exceptional food and handcrafted beer go hand in hand. Founded in 2018, our restaurant combines the warmth of a neighborhood pub with the culinary ambition of a modern kitchen. Every dish is prepared with locally sourced ingredients, and every brew is crafted on-site by our award-winning brewmaster.",
  email: "hello@brewrestaurant.com",
  address: "142 Barrel Lane, Craft District, San Francisco, CA 94110",
  openingHours:
    "Mon–Thu: 11:30 AM – 10:00 PM\nFri–Sat: 11:30 AM – 11:00 PM\nSun: 12:00 PM – 9:00 PM",
  phone: "+1 (415) 555-BREW",
};
