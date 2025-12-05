import Navbar from "@/components/Navbar";
import VideoIntro from "@/components/VideoIntro";
import Hero from "@/components/Hero";
import FeaturedBanner from "@/components/FeaturedBanner";
import LifestyleSection from "@/components/LifestyleSection";
import ShopSection from "@/components/ShopSection";
import AboutSection from "@/components/AboutSection";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// DEV LABEL component - remove when done
const DevLabel = ({ name }: { name: string }) => (
  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 z-[100] shadow-lg rounded">
    {name}
  </div>
);

export default function Home() {
  return (
    <main>
      <Navbar />
      {/* 1. VIDEO INTRO */}
      <div className="relative"><DevLabel name="1. VIDEO INTRO" /><VideoIntro /></div>
      {/* 2. HERO */}
      <div className="relative"><DevLabel name="2. HERO" /><Hero /></div>
      {/* 3. FEATURED BANNER */}
      <div className="relative"><DevLabel name="3. FEATURED BANNER" /><FeaturedBanner /></div>
      {/* 4. LIFESTYLE */}
      <div className="relative"><DevLabel name="4. LIFESTYLE" /><LifestyleSection /></div>
      {/* 5. SHOP */}
      <div className="relative"><DevLabel name="5. SHOP" /><ShopSection /></div>
      {/* 6. ABOUT */}
      <div className="relative"><DevLabel name="6. ABOUT" /><AboutSection /></div>
      {/* 7. NEWSLETTER */}
      <div className="relative"><DevLabel name="7. NEWSLETTER" /><Newsletter /></div>
      {/* 8. CONTACT */}
      <div className="relative"><DevLabel name="8. CONTACT" /><Contact /></div>
      {/* 9. FOOTER */}
      <div className="relative"><DevLabel name="9. FOOTER" /><Footer /></div>
    </main>
  );
}
