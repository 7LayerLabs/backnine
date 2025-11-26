import { products } from '@/data/products';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery (Single Image for now) */}
          <div className="relative aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          <div>
            <span className="text-b9-green font-bold uppercase tracking-widest text-xs mb-2 block">
              {product.category.replace('-', ' & ')}
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-b9-navy mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-medium text-gray-900 mb-8">
              ${product.price.toFixed(2)}
            </p>

            <div className="prose prose-gray mb-8">
              <p>
                Engineered for performance and style. This piece features our signature moisture-wicking fabric
                and an athletic fit designed for movement. Perfect for 18 holes or a casual day out.
              </p>
            </div>

            {/* Size Selector Placeholder */}
            <div className="mb-8">
              <label className="block text-sm font-bold uppercase tracking-widest text-b9-navy mb-3">
                Select Size
              </label>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    className="w-12 h-12 border border-gray-200 flex items-center justify-center text-sm font-bold text-b9-navy hover:border-b9-navy hover:bg-b9-navy hover:text-white transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full bg-b9-navy text-white py-5 font-bold uppercase tracking-widest hover:bg-b9-green transition-colors">
              Add to Cart
            </button>

            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-b9-navy">Free over $100</span>
              </div>
              <div className="flex justify-between">
                <span>Returns</span>
                <span className="font-medium text-b9-navy">30 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

