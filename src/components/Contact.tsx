"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to email service (Resend)
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-dm-serif text-stone-900 text-center mb-12">
          Get In Touch
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h4 className="font-semibold text-stone-900 mb-2">Email</h4>
              <p className="text-stone-600">hello@backnineapparel.com</p>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 mb-2">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>
          <div>
            {isSubmitted ? (
              <p className="text-emerald-600 font-medium">
                Thanks for reaching out! We&apos;ll get back to you soon.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-stone-200 focus:outline-none focus:border-stone-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-stone-200 focus:outline-none focus:border-stone-400"
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-stone-200 focus:outline-none focus:border-stone-400 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
