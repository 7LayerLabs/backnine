"use client";

import Link from "next/link";

export default function VideoIntro() {
  return (
    <section className="relative w-full pt-16 sm:pt-0 sm:h-screen overflow-hidden bg-black">
      <video
        className="w-full h-auto sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:min-w-full sm:min-h-full sm:w-auto sm:h-auto sm:object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/golfview.mp4" type="video/mp4" />
      </video>
      <Link
        href="#home"
        className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center text-white/80 hover:text-white transition-colors"
      >
        <span className="text-sm tracking-widest uppercase mb-2">Scroll</span>
        <div className="w-px h-12 bg-white/50 animate-pulse"></div>
      </Link>
    </section>
  );
}
