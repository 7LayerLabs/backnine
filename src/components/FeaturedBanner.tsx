"use client";

export default function FeaturedBanner() {
  const messages = [
    { text: "FREE SHIPPING on orders over $75", highlight: "FREE SHIPPING" },
    { text: "Join the Club & get 10% OFF your first order", highlight: "10% OFF" },
    { text: "Premium golf lifestyle apparel", highlight: "Premium" },
  ];

  return (
    <section className="bg-emerald-700 py-4 overflow-hidden">
      <div className="relative">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...messages, ...messages, ...messages].map((msg, i) => (
            <span key={i} className="text-white text-sm tracking-wide mx-12">
              <span className="font-semibold">{msg.highlight}</span>
              {msg.text.replace(msg.highlight, "")}
              <span className="mx-8 text-white/50">★</span>
            </span>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
