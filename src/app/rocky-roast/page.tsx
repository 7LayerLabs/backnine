"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const DEFAULT_ROAST = `Rocky,

Someone just paid actual money — their hard-earned dollar — specifically so we'd tell you the truth about your golf game. Think about that. They saw a button that said "roast Rocky's golf" and didn't hesitate.

We've seen your swing. Calling it a "swing" is generous. It's more like you're fighting off a wasp while having a seizure. The ball doesn't know whether to go left, right, or just sit there out of pity. Most of the time it chooses pity.

Your handicap isn't a number, it's a cry for help. You line up a putt like you're solving a crime — all that focus, all that intensity — then you still miss by four feet. The hole literally cannot move, Rocky. It's right there.

You lose more balls per round than most people own. The woods aren't a hazard for you, they're a second home. Fish in the pond have named a wing of their castle after you. "The Rocky Collection" — seven Titleists and a range ball you definitely stole.

Your driver? You should just leave it in the car. Actually, leave it at the store. But no — you step up, waggle like you're about to bomb one 280, then top it 40 yards into the ladies' tee markers.

The worst part? You still show up. Every week. Same delusion. "I'm hitting them good on the range." No you're not, Rocky. The range balls are just too depressed to fly properly and you've mistaken that for progress.

See you on the course (or in the trees looking for your ball).`;

export default function RockyRoastPage() {
  const [roastType, setRoastType] = useState<"custom" | "default">("default");
  const [customRoast, setCustomRoast] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const roastMessage = roastType === "custom" ? customRoast : DEFAULT_ROAST;

      if (roastType === "custom" && customRoast.trim().length < 10) {
        alert("Come on, put some effort into it! Write at least a few sentences.");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/checkout/rocky-roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roastMessage }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="border-b border-stone-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-semibold text-white hover:text-stone-300 transition-colors">
            ← Back Nine Apparel
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Roast Rocky&apos;s Golf Game
          </h1>
          <p className="text-xl text-stone-400 max-w-2xl mx-auto">
            For just <span className="text-green-500 font-bold">$1</span>, we&apos;ll send Rocky an email absolutely destroying his golf game. He&apos;ll never know who sent it. Pure chaos.
          </p>
        </div>

        {/* Who is Rocky */}
        <div className="bg-stone-900 rounded-xl p-6 mb-8 border border-stone-800">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-40 h-40 md:w-48 md:h-48 relative flex-shrink-0 rounded-xl overflow-hidden">
              <Image
                src="/apparel/marketing/rockygolf.png"
                alt="Rocky on the golf course"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2 text-stone-300">Who is Rocky?</h2>
              <p className="text-stone-400">
                Rocky thinks he can play golf. He cannot. He&apos;s lost more balls than he&apos;s found, his swing looks like a crime scene, and he still shows up every week convinced &quot;today&apos;s the day.&quot; It&apos;s not. The only thing good about his golf game is his apparel, thanks to Back Nine. Help us remind him.
              </p>
            </div>
          </div>
        </div>

        {/* Roast Options */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold">Choose Your Weapon</h2>

          {/* Option 1: Default Roast */}
          <div
            onClick={() => setRoastType("default")}
            className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
              roastType === "default"
                ? "border-green-500 bg-stone-900"
                : "border-stone-700 bg-stone-900/50 hover:border-stone-600"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  roastType === "default" ? "border-green-500" : "border-stone-600"
                }`}
              >
                {roastType === "default" && (
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Use Our Premium Roast</h3>
                <p className="text-stone-400 text-sm mb-4">
                  Professionally crafted. Absolutely brutal. Zero mercy.
                </p>
                <div className="bg-stone-950 rounded-lg p-4 text-sm text-stone-400 max-h-48 overflow-y-auto border border-stone-800">
                  <pre className="whitespace-pre-wrap font-sans">{DEFAULT_ROAST}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Option 2: Custom Roast */}
          <div
            onClick={() => setRoastType("custom")}
            className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
              roastType === "custom"
                ? "border-green-500 bg-stone-900"
                : "border-stone-700 bg-stone-900/50 hover:border-stone-600"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  roastType === "custom" ? "border-green-500" : "border-stone-600"
                }`}
              >
                {roastType === "custom" && (
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Write Your Own Roast</h3>
                <p className="text-stone-400 text-sm mb-4">
                  Got something personal? Let it out. We&apos;ll deliver it word for word.
                </p>
                {roastType === "custom" && (
                  <textarea
                    value={customRoast}
                    onChange={(e) => setCustomRoast(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Dear Rocky, let me tell you about your golf game..."
                    className="w-full h-48 bg-stone-950 border border-stone-700 rounded-lg p-4 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-green-500 resize-none"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="text-center">
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-500 disabled:bg-stone-700 disabled:cursor-not-allowed text-white font-bold text-xl px-12 py-4 rounded-xl transition-colors"
          >
            {isLoading ? "Loading..." : "Send the Roast — $1"}
          </button>
          <p className="text-stone-500 text-sm mt-4">
            Rocky will receive the email immediately after payment. No refunds. No mercy.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-16 border-t border-stone-800 pt-12">
          <h2 className="text-2xl font-bold mb-6">Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-stone-200 mb-2">Will Rocky know who sent it?</h3>
              <p className="text-stone-400">Nope. Complete anonymity. The email comes from Back Nine Apparel. Your identity stays hidden.</p>
            </div>
            <div>
              <h3 className="font-semibold text-stone-200 mb-2">Is this real?</h3>
              <p className="text-stone-400">100% real. Rocky is a real person. He really can&apos;t play golf. He really will receive this email.</p>
            </div>
            <div>
              <h3 className="font-semibold text-stone-200 mb-2">Can I send multiple roasts?</h3>
              <p className="text-stone-400">Absolutely. Stack &apos;em up. Rocky deserves it.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
