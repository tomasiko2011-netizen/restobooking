// Restaurant photo URLs by cuisine type (Unsplash free)
const PHOTO_MAP: Record<string, string[]> = {
  "Восточная": [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
  ],
  "Узбекская": [
    "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
  ],
  "Казахская": [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
  ],
  "Грузинская": [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=400&fit=crop",
  ],
  "Итальянская": [
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1579684947550-22e945225d9a?w=600&h=400&fit=crop",
  ],
  "Стейки": [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
  ],
  "Паназиатская": [
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop",
  ],
  "Европейская": [
    "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=600&h=400&fit=crop",
  ],
  default: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop",
  ],
};

export function getPhotoUrl(cuisine: string | null, id: string): string {
  if (!cuisine) {
    const defaults = PHOTO_MAP.default;
    return defaults[hashCode(id) % defaults.length];
  }

  // Find matching cuisine keyword
  for (const [key, urls] of Object.entries(PHOTO_MAP)) {
    if (key !== "default" && cuisine.includes(key)) {
      return urls[hashCode(id) % urls.length];
    }
  }

  const defaults = PHOTO_MAP.default;
  return defaults[hashCode(id) % defaults.length];
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
