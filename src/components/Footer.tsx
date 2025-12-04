import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Back Nine Apparel"
                width={50}
                height={50}
                className="rounded"
              />
              <h3 className="text-xl font-semibold">Back Nine</h3>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Premium golf lifestyle clothing for those who appreciate the finer
              things on and off the course.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="#shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="#shop" className="hover:text-white transition-colors">
                  Tops
                </Link>
              </li>
              <li>
                <Link href="#shop" className="hover:text-white transition-colors">
                  Headwear
                </Link>
              </li>
              <li>
                <Link href="#shop" className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="#our-story" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 text-center text-stone-500 text-sm">
          <p>&copy; 2025 Back Nine Apparel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
