"use client";

export default function FeaturedBanner() {
  const items = [
    { bold: "FREE SHIPPING",  rest: " on orders over $75" },
    { bold: "WELCOME10",      rest: " — 10% off your first order" },
    { bold: "Print on demand", rest: " — ships in 48 hours" },
    { bold: "New drops",       rest: " — headwear & hoodies now live" },
  ];

  return (
    <section className="bg-[#2D5016] py-3 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items, ...items].map((msg, i) => (
          <span key={i} className="text-[#F5F0E8] text-xs tracking-wide mx-10 font-inter">
            <span className="font-semibold text-[#C17D2A]">{msg.bold}</span>
            {msg.rest}
            <span className="mx-8 text-[#F5F0E8]/25">⬥</span>
          </span>
        ))}
      </div>
    </section>
  );
}
