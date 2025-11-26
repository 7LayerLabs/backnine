import Image from 'next/image';
import Link from 'next/link';
import { products, Product } from '@/data/products';

interface ProductListingProps {
  category?: Product['category'];
  filterNew?: boolean;
  limit?: number;
}

export default function ProductListing({ category, filterNew, limit }: ProductListingProps) {
  let filteredProducts = products.filter(product => {
    if (category && product.category !== category) return false;
    if (filterNew && !product.isNew) return false;
    return true;
  });

  if (limit) {
    filteredProducts = filteredProducts.slice(0, limit);
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="py-24 text-center">
        <h3 className="text-2xl font-bold text-b9-navy mb-4">No products found.</h3>
        <p className="text-gray-600">Check back soon for new drops.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {filteredProducts.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id} className="group block">
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-4 rounded-sm">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.isNew && (
              <div className="absolute top-4 left-4">
                <span className="bg-b9-lime text-b9-navy text-xs font-bold px-3 py-1 uppercase tracking-widest">
                  New
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
              {product.category.replace('-', ' & ')}
            </p>
            <h3 className="text-lg font-bold text-b9-navy mb-1 group-hover:text-b9-green transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-900 font-medium">${product.price.toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
