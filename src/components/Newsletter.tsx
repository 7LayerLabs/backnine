"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadySubscribed) {
          setError("You're already subscribed! Check your email for your discount code.");
        } else {
          setError(data.error || "Something went wrong. Please try again.");
        }
        return;
      }

      setIsSubmitted(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-stone-900">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <span className="text-sm tracking-[0.3em] text-stone-400 uppercase">
          Stay Connected
        </span>
        <h2 className="text-4xl font-dm-serif text-white mt-2 mb-4">
          Join the Club
        </h2>
        <p className="text-stone-400 mb-8">
          Subscribe for exclusive drops, early access, and 10% off your first order.
        </p>
        {isSubmitted ? (
          <p className="text-emerald-400 font-medium">
            Thanks for subscribing! Check your email for your discount code.
          </p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="flex-1 px-6 py-4 bg-stone-800 text-white placeholder-stone-500 border border-stone-700 focus:outline-none focus:border-stone-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-white text-stone-900 font-medium hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {error && (
              <p className="text-amber-400 mt-4 text-sm">{error}</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
