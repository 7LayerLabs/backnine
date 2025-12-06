// Color variant type for products with multiple colors
export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
}

// Product interface with color support
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "tops" | "headwear" | "accessories";
  badge?: "Bestseller" | "New";
  colors?: ColorVariant[];
}

// All products with their color variants
export const products: Product[] = [
  // 1. ROPE HAT
  {
    id: "rope-cap-white-green",
    name: "Classic Rope Hat",
    description: "Classic rope snapback",
    price: 38.0,
    image: "/sellable items/BackNine Rope Caps/cap-white-green-1.jpg",
    category: "headwear",
    colors: [
      { name: "White/Green", hex: "#2d5a27", image: "/sellable items/BackNine Rope Caps/cap-white-green-1.jpg" },
      { name: "White/Blue", hex: "#1e3a5f", image: "/sellable items/BackNine Rope Caps/cap-white-blue-1.jpg" },
      { name: "Navy/Blue", hex: "#1a3a6e", image: "/sellable items/BackNine Rope Caps/cap-blue-white-1.jpg" },
      { name: "Black/Teal", hex: "#008080", image: "/sellable items/BackNine Rope Caps/cap-black-blue-1.jpg" },
      { name: "Black/Gold", hex: "#d4af37", image: "/sellable items/BackNine Rope Caps/cap-black-yellow-1.jpg" },
      { name: "Navy/Sunset", hex: "#ff6b35", image: "/sellable items/BackNine Rope Caps/cap-blue-gradient-1.jpg" },
    ],
  },
  // 2. BEANIE
  {
    id: "beanie",
    name: "Pom Pom Beanie",
    description: "Warm knit beanie with pom",
    price: 32.0,
    image: "/sellable items/BackNine Beanie Hats/beanie-black-product.jpg",
    category: "headwear",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: "/sellable items/BackNine Beanie Hats/beanie-black-product.jpg" },
      { name: "Heather Black", hex: "#2d2d2d", image: "/sellable items/BackNine Beanie Hats/beanie-heather-black-product.jpg" },
      { name: "Heather Grey", hex: "#808080", image: "/sellable items/BackNine Beanie Hats/beanie-heather-grey-product.jpg" },
      { name: "Royal Heather", hex: "#4169e1", image: "/sellable items/BackNine Beanie Hats/beanie-royal-heather-product.jpg" },
    ],
  },
  // 3. LOGO HOODIE
  {
    id: "classic-hoodie",
    name: "Golfer Logo Hoodie",
    description: "Comfortable pullover hoodie",
    price: 75.0,
    image: "/sellable items/BackNine Golfer Logo Hoodie/hoodie-sport-grey.jpg",
    category: "tops",
    colors: [
      { name: "Sport Grey", hex: "#9e9e9e", image: "/sellable items/BackNine Golfer Logo Hoodie/hoodie-sport-grey.jpg" },
      { name: "White", hex: "#f5f5f5", image: "/sellable items/BackNine Golfer Logo Hoodie/hoodie-white.jpg" },
      { name: "Light Blue", hex: "#add8e6", image: "/sellable items/BackNine Golfer Logo Hoodie/hoodie-light-blue.jpg" },
      { name: "Light Pink", hex: "#ffb6c1", image: "/sellable items/BackNine Golfer Logo Hoodie/hoodie-light-pink.jpg" },
      { name: "Sand", hex: "#c2b280", image: "/sellable items/BackNine Golfer Logo Hoodie/hoodie-sand.jpg" },
      { name: "Dark Heather", hex: "#4a4a4a", image: "/sellable items/BackNine Golfer Logo Hoodie/hoodie-dark-heather.jpg" },
      { name: "Maroon", hex: "#800000", image: "/sellable items/BackNine Golfer Logo Hoodie/hoodie-maroon.jpg" },
      { name: "Red", hex: "#cc0000", image: "/sellable items/BackNine Golfer Logo Hoodie/hoodie-red.jpg" },
      { name: "Royal Blue", hex: "#4169e1", image: "/sellable items/BackNine Golfer Logo Hoodie/hoodie-royal-blue.jpg" },
    ],
  },
  // 4. PAR-TEE TIME HOODIE
  {
    id: "par-tee-hoodie",
    name: "Par-Tee Time Hoodie",
    description: "Vintage washed pullover hoodie",
    price: 75.0,
    image: "/sellable items/PAR-TEE TIME Back Nine Apparel Hoodie/hoodie-hydrangea-front.jpg",
    category: "tops",
    colors: [
      { name: "Hydrangea", hex: "#a3c1d9", image: "/sellable items/PAR-TEE TIME Back Nine Apparel Hoodie/hoodie-hydrangea-front.jpg" },
      { name: "Ivory", hex: "#fffff0", image: "/sellable items/PAR-TEE TIME Back Nine Apparel Hoodie/hoodie-ivory-front.jpg" },
      { name: "Peachy", hex: "#ffcba4", image: "/sellable items/PAR-TEE TIME Back Nine Apparel Hoodie/hoodie-peachy-front.jpg" },
    ],
  },
  // 5. SWEATSHIRT
  {
    id: "crewneck-sweatshirt",
    name: "Golf Player Sweatshirt",
    description: "Premium cotton blend crewneck",
    price: 65.0,
    image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-grey.jpg",
    category: "tops",
    colors: [
      { name: "Grey", hex: "#808080", image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-grey.jpg" },
      { name: "White", hex: "#f5f5f5", image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-white.jpg" },
      { name: "Bay", hex: "#6b8e6b", image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-bay.jpg" },
      { name: "Blue Jean", hex: "#5b7fa3", image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-blue-jean.jpg" },
      { name: "Blue Spruce", hex: "#4a6670", image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-blue-spruce.jpg" },
      { name: "Butter Yellow", hex: "#f5e6a3", image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-butter-yellow.jpg" },
      { name: "Chalky Mint", hex: "#a8d8c8", image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-chalky-mint.jpg" },
      { name: "Light Blue", hex: "#add8e6", image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-light-blue.jpg" },
      { name: "Peachy", hex: "#ffcba4", image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-peachy.jpg" },
      { name: "Pepper Charcoal", hex: "#4a4a4a", image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-pepper-charcoal.jpg" },
      { name: "Seafoam", hex: "#93e9be", image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-seafoam.jpg" },
    ],
  },
  // 6. T-SHIRT
  {
    id: "classic-tee",
    name: "Logo T-Shirt",
    description: "Soft comfort colors tee",
    price: 35.0,
    image: "/sellable items/BackNine Logo Tshirt/tshirt-white.jpg",
    category: "tops",
    colors: [
      { name: "White", hex: "#f5f5f5", image: "/sellable items/BackNine Logo Tshirt/tshirt-white.jpg" },
      { name: "Ivory", hex: "#fffff0", image: "/sellable items/BackNine Logo Tshirt/tshirt-ivory.jpg" },
      { name: "Butter", hex: "#f5e6a3", image: "/sellable items/BackNine Logo Tshirt/tshirt-butter.jpg" },
      { name: "Blue Jean", hex: "#5b7fa3", image: "/sellable items/BackNine Logo Tshirt/tshirt-blue-jean.jpg" },
      { name: "Chambray", hex: "#9bb8d3", image: "/sellable items/BackNine Logo Tshirt/tshirt-chambray.jpg" },
      { name: "Flo Blue", hex: "#6bb3d9", image: "/sellable items/BackNine Logo Tshirt/tshirt-flo-blue.jpg" },
      { name: "Island Reef", hex: "#93e9be", image: "/sellable items/BackNine Logo Tshirt/tshirt-island-reef.jpg" },
      { name: "Moss", hex: "#8a9a5b", image: "/sellable items/BackNine Logo Tshirt/tshirt-moss.jpg" },
      { name: "Khaki", hex: "#c3b091", image: "/sellable items/BackNine Logo Tshirt/tshirt-khaki.jpg" },
      { name: "Brick", hex: "#cb4154", image: "/sellable items/BackNine Logo Tshirt/tshirt-brick.jpg" },
      { name: "Crimson", hex: "#dc143c", image: "/sellable items/BackNine Logo Tshirt/tshirt-crimson.jpg" },
      { name: "Red", hex: "#cc0000", image: "/sellable items/BackNine Logo Tshirt/tshirt-red.jpg" },
      { name: "Graphite", hex: "#4a4a4a", image: "/sellable items/BackNine Logo Tshirt/tshirt-graphite.jpg" },
      { name: "Pepper", hex: "#3d3d3d", image: "/sellable items/BackNine Logo Tshirt/tshirt-pepper.jpg" },
      { name: "Espresso", hex: "#3c2415", image: "/sellable items/BackNine Logo Tshirt/tshirt-espresso.jpg" },
    ],
  },
  // 7. POLO
  {
    id: "polo",
    name: "Performance Polo",
    description: "Moisture-wicking polo shirt",
    price: 55.0,
    image: "/sellable items/BackNine Polo/polo-white.jpg",
    category: "tops",
    colors: [
      { name: "White", hex: "#f5f5f5", image: "/sellable items/BackNine Polo/polo-white.jpg" },
      { name: "Light Blue", hex: "#add8e6", image: "/sellable items/BackNine Polo/polo-light-blue.jpg" },
      { name: "Grey", hex: "#808080", image: "/sellable items/BackNine Polo/polo-grey.jpg" },
      { name: "Charcoal", hex: "#4a4a4a", image: "/sellable items/BackNine Polo/polo-charcoal.jpg" },
      { name: "Black", hex: "#1a1a1a", image: "/sellable items/BackNine Polo/polo-black.jpg" },
      { name: "Navy", hex: "#1a3a5c", image: "/sellable items/BackNine Polo/polo-navy.jpg" },
      { name: "Royal Blue", hex: "#4169e1", image: "/sellable items/BackNine Polo/polo-royal-blue.jpg" },
      { name: "Turquoise", hex: "#40e0d0", image: "/sellable items/BackNine Polo/polo-turquoise.jpg" },
      { name: "Green", hex: "#2d5a27", image: "/sellable items/BackNine Polo/polo-green.jpg" },
      { name: "Purple", hex: "#6b3fa0", image: "/sellable items/BackNine Polo/polo-purple.jpg" },
      { name: "Maroon", hex: "#800000", image: "/sellable items/BackNine Polo/polo-maroon.jpg" },
      { name: "Burgundy", hex: "#722f37", image: "/sellable items/BackNine Polo/polo-burgundy.jpg" },
      { name: "Red", hex: "#cc0000", image: "/sellable items/BackNine Polo/polo-red.jpg" },
    ],
  },
  // 8. PULLOVER
  {
    id: "pullover",
    name: "Quarter Zip Pullover",
    description: "Lightweight athletic pullover",
    price: 60.0,
    image: "/sellable items/BackNine Pullover/pullover-charcoal.jpg",
    category: "tops",
    colors: [
      { name: "Charcoal", hex: "#4a4a4a", image: "/sellable items/BackNine Pullover/pullover-charcoal.jpg" },
      { name: "Slate Grey", hex: "#708090", image: "/sellable items/BackNine Pullover/pullover-slate-grey.jpg" },
      { name: "Black", hex: "#1a1a1a", image: "/sellable items/BackNine Pullover/pullover-black.jpg" },
      { name: "Carolina Blue", hex: "#99badd", image: "/sellable items/BackNine Pullover/pullover-carolina-blue.jpg" },
      { name: "Royal Blue", hex: "#4169e1", image: "/sellable items/BackNine Pullover/pullover-royal-blue.jpg" },
      { name: "Forest Green", hex: "#228b22", image: "/sellable items/BackNine Pullover/pullover-forest-green.jpg" },
      { name: "Maroon", hex: "#800000", image: "/sellable items/BackNine Pullover/pullover-maroon.jpg" },
      { name: "Red", hex: "#cc0000", image: "/sellable items/BackNine Pullover/pullover-red.jpg" },
    ],
  },
  // 9. QUARTER ZIP
  {
    id: "quarter-zip",
    name: "Sport Wick Quarter Zip",
    description: "Performance quarter zip pullover",
    price: 65.0,
    image: "/sellable items/BackNine Quarter Zip/quarter-zip-charcoal.jpg",
    category: "tops",
    colors: [
      { name: "Charcoal", hex: "#4a4a4a", image: "/sellable items/BackNine Quarter Zip/quarter-zip-charcoal.jpg" },
      { name: "White", hex: "#f5f5f5", image: "/sellable items/BackNine Quarter Zip/quarter-zip-white.jpg" },
    ],
  },
  // 10. GOLF TOWEL
  {
    id: "golf-towel",
    name: "Golf Towel",
    description: "Microfiber waffle towel with clip",
    price: 24.0,
    image: "/sellable items/BackNine Golf Towel/golf-towel.jpg",
    category: "accessories",
  },
];
