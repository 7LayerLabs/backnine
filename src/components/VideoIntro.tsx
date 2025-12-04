"use client";

import Link from "next/link";

export default function VideoIntro() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <video
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/golfview.mov" type="video/mp4" />
      </video>
      <Link
        href="#home"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/80 hover:text-white transition-colors"
      >
        <span className="text-sm tracking-widest uppercase mb-2">Scroll</span>
        <div className="w-px h-12 bg-white/50 animate-pulse"></div>
      </Link>
    </section>
  );
}
