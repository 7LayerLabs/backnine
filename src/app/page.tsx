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

export default function Home() {
  return (
    <main>
      <Navbar />
      <VideoIntro />
      <Hero />
      <FeaturedBanner />
      <LifestyleSection />
      <ShopSection />
      <AboutSection />
      <Newsletter />
      <Contact />
      <Footer />
    </main>
  );
}
