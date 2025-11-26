export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'polos' | 'hoodies-crews' | 'headwear' | 'accessories';
  image: string;
  isNew?: boolean;
}

export const products: Product[] = [
  // Headwear
  { id: 'h1', name: 'Tour Performance Cap - Navy', price: 35, category: 'headwear', image: '/images/products/b9_cap1.jpeg', isNew: true },
  { id: 'h2', name: 'Tour Performance Cap - White', price: 35, category: 'headwear', image: '/images/products/b9_cap2.jpeg' },
  { id: 'h3', name: 'Tour Performance Cap - Black', price: 35, category: 'headwear', image: '/images/products/b9_cap3.jpeg' },
  { id: 'h4', name: 'Tour Performance Cap - Grey', price: 35, category: 'headwear', image: '/images/products/b9_cap4.jpeg' },
  { id: 'h5', name: 'Rope Hat - Forest', price: 40, category: 'headwear', image: '/images/products/b9_cap5.jpeg', isNew: true },
  { id: 'h6', name: 'Rope Hat - Stone', price: 40, category: 'headwear', image: '/images/products/b9_cap6.jpeg' },
  { id: 'h7', name: 'Winter Knit Beanie', price: 30, category: 'headwear', image: '/images/products/b9_wintercap.jpeg' },

  // Hoodies & Crews
  { id: 'hc1', name: 'Tech Fleece Hoodie - Light Blue', price: 85, category: 'hoodies-crews', image: '/images/products/b9_sweatshirt.jpeg', isNew: true },
  { id: 'hc2', name: 'Course Crewneck - Navy', price: 75, category: 'hoodies-crews', image: '/images/products/b9_sweatshirt2.jpeg' },
  { id: 'hc3', name: 'Performance Hoodie - Grey', price: 85, category: 'hoodies-crews', image: '/images/products/b9_sweatshirt3.jpeg' },

  // Polos (using tshirt image as placeholder if needed, or just generic)
  { id: 'p1', name: 'Signature Blade Polo', price: 65, category: 'polos', image: '/images/products/b9_tshirt.jpeg', isNew: true },
  
  // Accessories
  { id: 'a1', name: 'Premium Tour Towel', price: 25, category: 'accessories', image: '/images/products/b9_golftowel.jpeg' },
];

