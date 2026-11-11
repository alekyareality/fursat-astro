// Rail / chip groups for /menu. Section names must match food.json / drinks.json exactly.
export type Side = 'food' | 'drinks';
export interface Group { id: string; side: Side; label: string; sections: string[]; icon: string }

export const FOOD_GROUPS: Group[] = [
  { id: 'f-biryani', side: 'food', label: 'Biryani & rice', sections: ['Biryani & rice'], icon: 'bowl' },
  { id: 'f-starters', side: 'food', label: 'Starters', sections: ['Appetizers', 'Finger bites', 'Regional specials', 'Quick Bites'], icon: 'skewer' },
  { id: 'f-mains', side: 'food', label: 'Mains', sections: ['Mains', 'Asian mains', 'Pasta', 'Pizza'], icon: 'plate' },
  { id: 'f-breads', side: 'food', label: 'Breads & sides', sections: ['Indian Breads', 'Extras/Sides'], icon: 'bread' },
  { id: 'f-soups', side: 'food', label: 'Soups & salads', sections: ['Soups', 'Healthy Salads', 'Healthy bowls'], icon: 'leaf' },
  { id: 'f-breakfast', side: 'food', label: 'Breakfast & South Indian', sections: ['All day breakfast', 'South Indian'], icon: 'sun' },
  { id: 'f-more', side: 'food', label: 'Burgers, kids & specials', sections: ['Sandwiches & burgers', 'Kids menu', "Sreemukhi's special menu"], icon: 'burger' },
  { id: 'f-desserts', side: 'food', label: 'Desserts & cookies', sections: ['Desserts', 'Cookies'], icon: 'cake' },
];

export const DRINK_GROUPS: Group[] = [
  { id: 'd-cocktails', side: 'drinks', label: 'Cocktails', sections: ['Silly Classic', 'The Classic', 'Long Island Iced Tea', 'Shooters'], icon: 'cocktail' },
  { id: 'd-whisky', side: 'drinks', label: 'Whisky', sections: ['Whisky'], icon: 'whisky' },
  { id: 'd-white', side: 'drinks', label: 'White spirits', sections: ['Vodka', 'Gin', 'Rum', 'Tequila'], icon: 'bottle' },
  { id: 'd-brandy', side: 'drinks', label: 'Brandy & Liqueur', sections: ['Brandy', 'Liqueur'], icon: 'snifter' },
  { id: 'd-winebeer', side: 'drinks', label: 'Wine & Beer', sections: ['Wines', 'Beer'], icon: 'wine' },
  { id: 'd-mocktails', side: 'drinks', label: 'Mocktails & Soft drinks', sections: ['Mocktails', 'Soft Drinks'], icon: 'mocktail' },
  { id: 'd-shakes', side: 'drinks', label: 'Shakes & Smoothies', sections: ['Milk Shakes', 'Smoothies'], icon: 'shake' },
  { id: 'd-coffee', side: 'drinks', label: 'Coffee & Tea', sections: ['Coffee', 'Tea'], icon: 'cup' },
];

// Chips under the stage. `to` is a group id; Beverages jumps to the drinks side.
export const CHIPS: { label: string; to: string | null; side?: Side }[] = [
  { label: 'All', to: null },
  { label: 'Biryani & rice', to: 'f-biryani' },
  { label: 'Starters', to: 'f-starters' },
  { label: 'Mains', to: 'f-mains' },
  { label: 'Breads', to: 'f-breads' },
  { label: 'Desserts', to: 'f-desserts' },
  { label: 'Beverages', to: 'd-cocktails', side: 'drinks' },
];

// Simple line icons (24px grid, stroke only).
export const ICONS: Record<string, string> = {
  cocktail: '<path d="M5 4h14l-7 8v7M8 20h8"/>',
  whisky: '<path d="M6 5h12l-1 14H7L6 5zM7 11h10"/>',
  bottle: '<path d="M10 3h4v4l2 3v10H8V10l2-3V3z"/>',
  snifter: '<path d="M8 4h8c1 5 0 9-4 9S7 9 8 4zM12 13v6M8 20h8"/>',
  wine: '<path d="M7 3h10c0 5-2 8-5 8S7 8 7 3zM12 11v9M8 21h8"/>',
  mocktail: '<path d="M8 3h8l-1 17H9L8 3zM8 9h8"/>',
  shake: '<path d="M7 7h10l-1 13H8L7 7zM6 7h12M14 3l-1 4"/>',
  cup: '<path d="M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9zM16 10h2a2 2 0 0 1 0 4h-2"/>',
  bowl: '<path d="M3 11h18a9 9 0 0 1-18 0zM8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/>',
  skewer: '<path d="M4 20 20 4M8 12l3 3M12 8l3 3"/>',
  plate: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>',
  bread: '<path d="M4 14c0-4 3-7 8-7s8 3 8 7v4H4v-4zM9 11l-1 3M13 10l-1 3M17 11l-1 3"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-12 14M5 19l8-8"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  burger: '<path d="M4 10c0-4 4-6 8-6s8 2 8 6H4zM3 14h18M4 18c0 1.5 2 2 8 2s8-.5 8-2v-1H4v1z"/>',
  cake: '<path d="M5 20V11h14v9M3 20h18M7 11V8M12 11V7M17 11V8M12 4v1"/>',
};
