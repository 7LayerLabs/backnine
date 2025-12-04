"use client";

import { useState } from "react";
import { db } from "@/lib/instant";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await db.auth.sendMagicCode({ email });
      setSentEmail(email);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send code";
      setError(errorMessage);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await db.auth.signInWithMagicCode({ email: sentEmail, code });
      onClose();
      setSentEmail("");
      setCode("");
      setEmail("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Invalid code";
      setError(errorMessage);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="float-right text-2xl text-stone-400 hover:text-stone-600"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-stone-900 mb-6">
          {sentEmail ? "Enter Code" : "Sign In"}
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {!sentEmail ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <p className="text-stone-600 text-sm mb-4">
              Enter your email to receive a sign-in code.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-stone-200 focus:outline-none focus:border-stone-400"
            />
            <button
              type="submit"
              className="w-full py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors"
            >
              Send Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <p className="text-stone-600 text-sm mb-4">
              We sent a code to <strong>{sentEmail}</strong>
            </p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              required
              className="w-full px-4 py-3 border border-stone-200 focus:outline-none focus:border-stone-400"
            />
            <button
              type="submit"
              className="w-full py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setSentEmail("")}
              className="w-full py-3 text-stone-600 hover:text-stone-900 transition-colors"
            >
              Use different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
