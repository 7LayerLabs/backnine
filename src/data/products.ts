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
  // Detailed product info
  longDescription?: string;
  features?: string[];
  careInstructions?: string[];
  sizes?: string[];
  shipping?: string;
  // Availability (defaults to true if not set)
  available?: boolean;
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
    longDescription: "A nod to classic golf style, this rope cap brings vintage vibes to the modern course. The signature rope detail across the brim is a hallmark of traditional golf fashion, while the embroidered Back Nine Apparel logo keeps it current. The structured crown holds its shape round after round, and the adjustable snapback ensures a comfortable fit for any head size.",
    features: [
      "Cotton twill construction for durability and comfort",
      "Classic rope detail across the front of the brim",
      "Embroidered Back Nine Apparel logo on front panel",
      "Structured mid-profile crown for a flattering fit",
      "Adjustable plastic snapback closure",
      "Pre-curved visor for sun protection",
    ],
    careInstructions: ["Spot clean only recommended", "Hand wash cold if needed", "Air dry only", "Do not iron on embroidery"],
    sizes: ["One Size Fits Most"],
    shipping: "5-7 business days",
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
    longDescription: "Keep your head warm and your style on point with this cozy pom-pom beanie featuring the Back Nine Apparel logo. Perfect for cold morning tee times, winter rounds, or just looking good while grabbing coffee after a day on the course. The chunky knit construction provides warmth without bulk, while the playful pom-pom adds personality.",
    features: [
      "100% acrylic for warmth, softness, and durability",
      "Chunky knit construction for classic beanie style",
      "Embroidered Back Nine Apparel logo",
      "Oversized pom-pom topper",
      "Cuffed design for adjustable fit and extra ear coverage",
    ],
    careInstructions: ["Hand wash cold recommended", "Lay flat to dry", "Do not bleach", "Do not iron"],
    sizes: ["One Size Fits Most"],
    shipping: "5-7 business days",
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
    longDescription: "A soft, mid-weight hoodie built for slow mornings on the course and easy nights after the last putt. This hoodie features a clean, minimal golf-themed logo on the chest that reads \"Back Nine Apparel,\" giving it a quietly confident, club-ready look. The roomy kangaroo pocket and double-lined hood hold tees, gloves, and coffee. Wear it over a polo between rounds, drape it in the clubhouse, or pull it on for a cool evening walk along the fairway.",
    features: [
      "Roomy kangaroo pouch pocket for hands and small items",
      "Adjustable drawstring hood with double-lined construction",
      "50/50 cotton-poly blend for softness and durability",
      "Medium-weight fabric (8.0 oz/yd²) for layering",
      "Tear-away label for comfort",
    ],
    careInstructions: ["Machine wash cold", "Tumble dry low", "Do not iron on print", "Do not bleach"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
    shipping: "FREE shipping • 5-7 business days",
  },
  // 4. PAR-TEE TIME HOODIE
  {
    id: "par-tee-hoodie",
    name: "Par-Tee Time Hoodie",
    description: "Vintage washed pullover hoodie",
    price: 75.0,
    image: "/sellable items/PAR-TEE TIME Back Nine Apparel Hoodie/hoodie-hydrangea-front.jpg",
    category: "tops",
    badge: "New",
    colors: [
      { name: "Hydrangea", hex: "#a3c1d9", image: "/sellable items/PAR-TEE TIME Back Nine Apparel Hoodie/hoodie-hydrangea-front.jpg" },
      { name: "Ivory", hex: "#fffff0", image: "/sellable items/PAR-TEE TIME Back Nine Apparel Hoodie/hoodie-ivory-front.jpg" },
      { name: "Peachy", hex: "#ffcba4", image: "/sellable items/PAR-TEE TIME Back Nine Apparel Hoodie/hoodie-peachy-front.jpg" },
    ],
    longDescription: "A playful twist on golf culture, this hoodie brings humor and comfort together for anyone who knows the best part of a round is the time spent with friends. The \"PAR-TEE TIME\" design features a whimsical golf cart and bag illustration, perfect for those who appreciate the lighter side of the sport. Made from premium ring-spun cotton for exceptional softness.",
    features: [
      "80% ring-spun cotton, 20% polyester for a soft, durable feel",
      "Relaxed, unisex fit for comfortable all-day wear",
      "Double-lined hood with matching drawstrings",
      "Front pouch pocket for hands and small essentials",
      "Ribbed cuffs and waistband for a secure fit",
      "Pre-shrunk fabric to maintain size after washing",
    ],
    careInstructions: ["Machine wash cold", "Tumble dry low", "Do not iron on print", "Do not dryclean"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    shipping: "5-7 business days",
  },
  // 5. SWEATSHIRT
  {
    id: "crewneck-sweatshirt",
    name: "Golf Player Sweatshirt",
    description: "Premium cotton blend crewneck",
    price: 65.0,
    image: "/sellable items/BackNine Golf Player Sweatshirt/sweatshirt-grey.jpg",
    category: "tops",
    badge: "Bestseller",
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
    longDescription: "Light, roomy, and quietly confident - this garment-dyed sweatshirt wraps you in the kind of relaxed warmth you reach for after a long round on the course or a crisp morning walk. The subtle vintage wash softens the cotton blend and lets the embroidered golf motif sit like a badge of shared afternoons: wind, focus, and that small triumph when the club meets the ball.",
    features: [
      "80% ring-spun cotton, 20% polyester for a soft, durable medium-heavy fabric",
      "1x1 ribbed collar, cuffs, and bottom hem",
      "Necktape and half-moon back detail for comfort",
      "Embroidery-ready areas on left and center chest",
      "OEKO-TEX low-impact dyes for eco-friendly production",
    ],
    careInstructions: ["Machine wash cold", "Tumble dry low", "Do not iron on print", "Do not dryclean"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    shipping: "FREE shipping • 5-7 business days",
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
    longDescription: "A clean, understated tee that lets the logo do the talking. This minimal chest print t-shirt features the Back Nine Apparel golfer motif in a small, tasteful placement that says \"I play\" without shouting it. The garment-dyed cotton delivers that perfectly broken-in feel from the first wear, while the relaxed fit gives you room to move through your day.",
    features: [
      "100% ring-spun cotton for exceptional softness",
      "Garment-dyed for a vintage, lived-in look",
      "Relaxed fit through the body for comfort",
      "Ribbed collar that holds its shape",
      "Double-needle stitching on sleeves and hem",
      "Tear-away label for itch-free comfort",
    ],
    careInstructions: ["Machine wash cold", "Tumble dry low", "Do not iron on print", "Do not dryclean"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    shipping: "FREE shipping • 5-7 business days",
  },
  // 7. POLO
  {
    id: "polo",
    name: "Performance Polo",
    description: "Moisture-wicking polo shirt",
    price: 55.0,
    image: "/sellable items/BackNine Polo/polo-white-r.jpg",
    category: "tops",
    colors: [
      { name: "White", hex: "#f5f5f5", image: "/sellable items/BackNine Polo/polo-white-r.jpg" },
      { name: "Light Blue", hex: "#add8e6", image: "/sellable items/BackNine Polo/polo-light-blue.jpg" },
      { name: "Grey", hex: "#808080", image: "/sellable items/BackNine Polo/polo-grey.jpg" },
      { name: "Charcoal", hex: "#4a4a4a", image: "/sellable items/BackNine Polo/polo-charcoal.jpg" },
      { name: "Black", hex: "#1a1a1a", image: "/sellable items/BackNine Polo/polo-black-r.jpg" },
      { name: "Navy", hex: "#1a3a5c", image: "/sellable items/BackNine Polo/polo-navy.jpg" },
      { name: "Royal Blue", hex: "#4169e1", image: "/sellable items/BackNine Polo/polo-royal-blue.jpg" },
      { name: "Turquoise", hex: "#40e0d0", image: "/sellable items/BackNine Polo/polo-turquoise.jpg" },
      { name: "Green", hex: "#2d5a27", image: "/sellable items/BackNine Polo/polo-green.jpg" },
      { name: "Purple", hex: "#6b3fa0", image: "/sellable items/BackNine Polo/polo-purple.jpg" },
      { name: "Maroon", hex: "#800000", image: "/sellable items/BackNine Polo/polo-maroon.jpg" },
      { name: "Burgundy", hex: "#722f37", image: "/sellable items/BackNine Polo/polo-burgundy.jpg" },
      { name: "Red", hex: "#cc0000", image: "/sellable items/BackNine Polo/polo-red.jpg" },
    ],
    longDescription: "Lightweight performance polo designed for movement and long days in the sun. The breathable polyester keeps its shape and dries fast, while PosiCharge color-locking technology holds vibrant tones through repeated washes. A clean flat knit collar and three-button placket give it a tidy, sporty look. Wear it for active workdays, weekend rounds of golf, or layered under a jacket.",
    features: [
      "100% polyester for durability and quick-dry performance",
      "PosiCharge technology preserves color and reduces fading",
      "Lightweight fabric (3.8 oz/yd²) for breathability",
      "Flat knit collar with 3-button placket",
      "Dyed-to-match buttons for a polished look",
      "Tear-away label for itch-free wear",
    ],
    careInstructions: ["Machine wash cold", "Tumble dry low", "Do not iron on print", "Do not dryclean"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    shipping: "5-7 business days",
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
    longDescription: "A versatile quarter-zip pullover built for active days and polished enough for the office. The Sport-Wick moisture-wicking fabric pulls sweat away from your skin to keep you dry and comfortable during workouts, rounds of golf, or busy mornings. The stretch construction moves with you without losing shape.",
    features: [
      "90% polyester, 10% spandex for stretch and recovery",
      "Sport-Wick moisture-wicking technology",
      "Lightweight fabric (5.9 oz/yd²) for layering",
      "Cadet collar with contrast cover-stitching",
      "Set-in sleeves with open cuffs",
      "Embroidered Back Nine logo on left chest",
    ],
    careInstructions: ["Machine wash cold", "Tumble dry low", "Do not iron on embroidery", "Do not dryclean"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    shipping: "5-7 business days",
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
    longDescription: "Engineered for performance and styled for versatility, this Back Nine Apparel quarter-zip pullover transitions seamlessly from the golf course to everyday wear. The Sport-Wick moisture-wicking fabric actively pulls sweat away from your body, keeping you cool and dry whether you're walking 18 holes or heading into a meeting. The four-way stretch fabric moves with your swing and recovers its shape.",
    features: [
      "90% polyester, 10% spandex for stretch and recovery",
      "Sport-Wick moisture-wicking technology keeps you dry",
      "Lightweight fabric (5.9 oz/yd²) for layering versatility",
      "Cadet collar with contrast cover-stitching",
      "Set-in sleeves with open cuffs for a clean finish",
      "Embroidered Back Nine logo on left chest",
    ],
    careInstructions: ["Machine wash cold", "Tumble dry low", "Do not iron on embroidery", "Do not dryclean"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    shipping: "5-7 business days",
  },
  // 10. GOLF TOWEL
  {
    id: "golf-towel",
    name: "Golf Towel",
    description: "Microfiber waffle towel with clip",
    price: 24.0,
    image: "/sellable items/BackNine Golf Towel/golf-towel.jpg",
    category: "accessories",
    longDescription: "An essential addition to any golfer's bag, this Back Nine Golf Towel combines functionality with style. The high-quality microfiber construction quickly absorbs moisture and wipes away dirt, grass, and debris from your clubs, balls, and hands. The embroidered Back Nine logo adds personality to your gear, while the convenient clip attachment keeps the towel within easy reach.",
    features: [
      "Premium microfiber construction for superior absorbency",
      "Quick-drying fabric that resists odors",
      "Embroidered Back Nine Apparel logo",
      "Metal grommet and carabiner clip for easy bag attachment",
      "Generous size (16\" x 24\") for multiple uses",
      "Durable stitched edges prevent fraying",
    ],
    careInstructions: ["Machine wash cold", "Do not use fabric softener", "Tumble dry low", "Do not bleach"],
    sizes: ["One Size"],
    shipping: "5-7 business days",
  },
  // 11. ROCKY ROAST (Digital Product)
  {
    id: "rocky-roast",
    name: "Rocky Roast",
    description: "Send Rocky a brutal roast about his golf game",
    price: 1.0,
    image: "/apparel/marketing/rockygolfball.png",
    category: "accessories",
    longDescription: "Know someone named Rocky who thinks they can play golf? Let us handle it. For just $1, we'll send Rocky an absolutely devastating email roasting his golf game into oblivion. No mercy. No refunds. Just pure, unfiltered truth about his slice, his putting, and that time he lost 6 balls on a par 3. This is a digital product - the roast email is sent immediately after purchase.",
    features: [
      "Instant delivery via email",
      "Professionally crafted insults",
      "Zero chill included",
      "May cause emotional damage",
      "100% deserved",
    ],
    sizes: ["Digital Product"],
    shipping: "Instant email delivery",
  },
];
