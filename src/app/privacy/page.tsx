import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-stone-50 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center text-stone-600 hover:text-stone-900 mb-8"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <h1 className="text-4xl font-semibold text-stone-900 mb-4">Privacy Policy</h1>
          <p className="text-stone-500 mb-8">Last updated: December 3, 2025</p>

          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-stone-600 leading-relaxed">
                Back Nine Apparel (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to
                protecting your personal data. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you visit our website backnineapparel.com (the &quot;Site&quot;)
                or make a purchase from us.
              </p>
              <p className="text-stone-600 leading-relaxed mt-4">
                Please read this Privacy Policy carefully. By using our Site, you consent to the practices
                described in this policy. If you do not agree with the terms of this Privacy Policy,
                please do not access the Site.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">1. Information We Collect</h2>

              <h3 className="text-lg font-medium text-stone-800 mb-2">Personal Information You Provide</h3>
              <p className="text-stone-600 mb-4">
                We collect personal information that you voluntarily provide when you:
              </p>
              <ul className="list-disc list-inside text-stone-600 mb-6 space-y-2 ml-4">
                <li>Create an account or register on our Site</li>
                <li>Place an order or make a purchase</li>
                <li>Subscribe to our newsletter or marketing communications</li>
                <li>Contact us with inquiries or customer service requests</li>
                <li>Participate in promotions, surveys, or contests</li>
              </ul>
              <p className="text-stone-600 mb-4">This information may include:</p>
              <ul className="list-disc list-inside text-stone-600 mb-6 space-y-2 ml-4">
                <li>Name (first and last)</li>
                <li>Email address</li>
                <li>Mailing address and shipping address</li>
                <li>Phone number</li>
                <li>Payment information (credit card numbers, billing address)</li>
                <li>Account login credentials</li>
                <li>Order history and preferences</li>
              </ul>

              <h3 className="text-lg font-medium text-stone-800 mb-2">Automatically Collected Information</h3>
              <p className="text-stone-600 mb-4">
                When you access our Site, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside text-stone-600 mb-6 space-y-2 ml-4">
                <li>IP address and device identifiers</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website or source</li>
                <li>Click patterns and navigation paths</li>
                <li>Date and time of visits</li>
              </ul>

              <h3 className="text-lg font-medium text-stone-800 mb-2">Cookies and Tracking Technologies</h3>
              <p className="text-stone-600">
                We use cookies, web beacons, and similar tracking technologies to collect information
                about your browsing activities. Cookies are small data files stored on your device that
                help us improve your experience, analyze site traffic, and personalize content. You can
                control cookies through your browser settings, though disabling cookies may affect site functionality.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-stone-600 mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li>Process and fulfill your orders, including shipping and delivery</li>
                <li>Send order confirmations, shipping notifications, and receipts</li>
                <li>Communicate with you about your account or transactions</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send promotional emails and marketing communications (with your consent)</li>
                <li>Personalize your shopping experience and product recommendations</li>
                <li>Improve our website, products, and services</li>
                <li>Analyze trends and gather demographic information</li>
                <li>Detect, prevent, and address fraud or security issues</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">3. How We Share Your Information</h2>
              <p className="text-stone-600 mb-4">
                We do not sell, rent, or trade your personal information to third parties for their
                marketing purposes. We may share your information in the following circumstances:
              </p>

              <h3 className="text-lg font-medium text-stone-800 mb-2">Service Providers</h3>
              <p className="text-stone-600 mb-4">
                We share information with third-party vendors who perform services on our behalf, including:
              </p>
              <ul className="list-disc list-inside text-stone-600 mb-6 space-y-2 ml-4">
                <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
                <li><strong>Shipping carriers:</strong> Order fulfillment and delivery (USPS, UPS, FedEx)</li>
                <li><strong>InstantDB:</strong> Database and authentication services</li>
                <li><strong>Email service providers:</strong> Transactional and marketing emails</li>
                <li><strong>Analytics providers:</strong> Website analytics and performance monitoring</li>
              </ul>

              <h3 className="text-lg font-medium text-stone-800 mb-2">Legal Requirements</h3>
              <p className="text-stone-600 mb-4">
                We may disclose your information if required by law, court order, or governmental authority,
                or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
              </p>

              <h3 className="text-lg font-medium text-stone-800 mb-2">Business Transfers</h3>
              <p className="text-stone-600">
                In the event of a merger, acquisition, or sale of all or a portion of our assets,
                your personal information may be transferred as part of that transaction.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">4. Data Security</h2>
              <p className="text-stone-600 mb-4">
                We implement appropriate technical and organizational security measures to protect your
                personal information against unauthorized access, alteration, disclosure, or destruction.
                These measures include:
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li>SSL/TLS encryption for all data transmission</li>
                <li>Secure payment processing through PCI-DSS compliant providers (Stripe)</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure data storage with encryption at rest</li>
              </ul>
              <p className="text-stone-600 mt-4">
                While we strive to protect your personal information, no method of transmission over the
                Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">5. Data Retention</h2>
              <p className="text-stone-600">
                We retain your personal information for as long as necessary to fulfill the purposes
                outlined in this Privacy Policy, unless a longer retention period is required or permitted
                by law. This includes retaining your information to comply with legal obligations, resolve
                disputes, and enforce our agreements. Order information is typically retained for 7 years
                for tax and accounting purposes.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">6. Your Rights and Choices</h2>
              <p className="text-stone-600 mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request that we delete your personal information (subject to legal exceptions)</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-stone-600 mt-4">
                To exercise any of these rights, please contact us at hello@backnineapparel.com.
                We will respond to your request within 30 days.
              </p>
            </section>

            {/* California Privacy Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">7. California Privacy Rights (CCPA)</h2>
              <p className="text-stone-600 mb-4">
                If you are a California resident, you have additional rights under the California Consumer
                Privacy Act (CCPA):
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li>The right to know what personal information is collected, used, shared, or sold</li>
                <li>The right to delete personal information held by businesses</li>
                <li>The right to opt-out of the sale of personal information</li>
                <li>The right to non-discrimination for exercising your CCPA rights</li>
              </ul>
              <p className="text-stone-600 mt-4">
                We do not sell your personal information. To make a CCPA request, contact us at
                hello@backnineapparel.com.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">8. Children&apos;s Privacy</h2>
              <p className="text-stone-600">
                Our Site is not intended for children under the age of 13. We do not knowingly collect
                personal information from children under 13. If we learn that we have collected personal
                information from a child under 13, we will take steps to delete that information promptly.
                If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">9. Third-Party Links</h2>
              <p className="text-stone-600">
                Our Site may contain links to third-party websites or services. We are not responsible
                for the privacy practices of these third parties. We encourage you to read the privacy
                policies of any third-party sites you visit.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">10. International Data Transfers</h2>
              <p className="text-stone-600">
                Your information may be transferred to and processed in countries other than your country
                of residence. These countries may have data protection laws that are different from the laws
                of your country. By using our Site, you consent to the transfer of your information to the
                United States and other countries where we or our service providers operate.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-stone-600">
                We may update this Privacy Policy from time to time to reflect changes in our practices
                or for legal, operational, or regulatory reasons. We will notify you of any material changes
                by posting the updated policy on this page with a new &quot;Last updated&quot; date. We encourage you
                to review this Privacy Policy periodically.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">12. Contact Us</h2>
              <p className="text-stone-600 mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our
                privacy practices, please contact us:
              </p>
              <div className="bg-stone-50 rounded-lg p-6">
                <p className="text-stone-800 font-medium">Back Nine Apparel</p>
                <p className="text-stone-600">Email: hello@backnineapparel.com</p>
                <p className="text-stone-600 mt-4">
                  We will respond to your inquiry within 30 days.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
