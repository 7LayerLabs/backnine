import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
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

          <h1 className="text-4xl font-semibold text-stone-900 mb-4">Terms of Service</h1>
          <p className="text-stone-500 mb-8">Last updated: December 3, 2025</p>

          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-stone-600 leading-relaxed">
                Welcome to Back Nine Apparel. These Terms of Service (&quot;Terms&quot;) govern your access to and
                use of the Back Nine Apparel website at backnineapparel.com (the &quot;Site&quot;) and any purchases
                you make through the Site. By accessing or using our Site, you agree to be bound by these Terms.
              </p>
              <p className="text-stone-600 leading-relaxed mt-4">
                Please read these Terms carefully before using our Site. If you do not agree to these Terms,
                you must not access or use the Site.
              </p>
            </section>

            {/* Agreement to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-stone-600 mb-4">
                By accessing our Site, you confirm that you are at least 18 years of age, or if you are
                under 18, that you have obtained parental or guardian consent to use the Site. You agree
                to comply with these Terms and all applicable local, state, national, and international
                laws and regulations.
              </p>
              <p className="text-stone-600">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately
                upon posting to the Site. Your continued use of the Site following any changes constitutes
                your acceptance of the revised Terms.
              </p>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">2. Account Registration</h2>
              <p className="text-stone-600 mb-4">
                To access certain features of our Site, you may need to create an account. When creating
                an account, you agree to:
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="text-stone-600 mt-4">
                We reserve the right to suspend or terminate your account at any time for any reason,
                including violation of these Terms.
              </p>
            </section>

            {/* Products and Pricing */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">3. Products and Pricing</h2>
              <p className="text-stone-600 mb-4">
                We make every effort to display our products and their colors as accurately as possible.
                However, we cannot guarantee that your device&apos;s display will accurately reflect the actual
                color of products.
              </p>
              <p className="text-stone-600 mb-4">
                All prices are listed in US Dollars (USD) and are subject to change without notice.
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li>Modify or discontinue any product without prior notice</li>
                <li>Limit quantities available for purchase</li>
                <li>Refuse or cancel orders at our discretion</li>
                <li>Correct pricing errors, even after an order has been placed</li>
              </ul>
              <p className="text-stone-600 mt-4">
                In the event of a pricing error, we will notify you and give you the option to proceed
                at the correct price or cancel your order with a full refund.
              </p>
            </section>

            {/* Orders and Payment */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">4. Orders and Payment</h2>
              <p className="text-stone-600 mb-4">
                When you place an order through our Site, you are making an offer to purchase products
                subject to these Terms. All orders are subject to acceptance and availability.
              </p>
              <p className="text-stone-600 mb-4">By placing an order, you represent and warrant that:</p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li>You are authorized to use the payment method provided</li>
                <li>The information you provide is accurate and complete</li>
                <li>You will pay for the order, including applicable shipping and taxes</li>
              </ul>
              <p className="text-stone-600 mt-4">
                Payment is processed securely through Stripe. We accept major credit cards including
                Visa, Mastercard, American Express, and Discover. Your payment information is encrypted
                and we do not store your full credit card details.
              </p>
              <p className="text-stone-600 mt-4">
                We reserve the right to refuse or cancel any order for any reason, including but not
                limited to product availability, errors in pricing or product information, or suspected
                fraud.
              </p>
            </section>

            {/* Shipping and Delivery */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">5. Shipping and Delivery</h2>
              <p className="text-stone-600 mb-4">
                We currently ship to addresses within the United States and Canada. Shipping options
                and estimated delivery times will be displayed at checkout.
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li><strong>Free Standard Shipping:</strong> 5-7 business days (orders over $75)</li>
                <li><strong>Standard Shipping:</strong> 5-7 business days</li>
                <li><strong>Express Shipping:</strong> 2-3 business days</li>
              </ul>
              <p className="text-stone-600 mt-4">
                Delivery times are estimates only and are not guaranteed. We are not responsible for
                delays caused by shipping carriers, customs processing, weather, or other circumstances
                beyond our control.
              </p>
              <p className="text-stone-600 mt-4">
                Risk of loss and title for products pass to you upon delivery to the carrier. You are
                responsible for providing accurate shipping information. We are not liable for packages
                delivered to incorrect addresses due to customer error.
              </p>
            </section>

            {/* Returns and Refunds */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">6. Returns and Refunds</h2>
              <p className="text-stone-600 mb-4">
                We want you to be completely satisfied with your purchase. If you are not satisfied,
                you may return eligible items within 30 days of delivery.
              </p>

              <h3 className="text-lg font-medium text-stone-800 mb-2">Return Eligibility</h3>
              <p className="text-stone-600 mb-4">To be eligible for a return, items must be:</p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4 mb-6">
                <li>Unworn, unwashed, and in original condition</li>
                <li>With all original tags attached</li>
                <li>In original packaging</li>
                <li>Returned within 30 days of delivery</li>
              </ul>

              <h3 className="text-lg font-medium text-stone-800 mb-2">Non-Returnable Items</h3>
              <p className="text-stone-600 mb-4">The following items cannot be returned:</p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4 mb-6">
                <li>Items marked as final sale</li>
                <li>Items that have been worn, washed, or altered</li>
                <li>Items without original tags</li>
                <li>Gift cards</li>
              </ul>

              <h3 className="text-lg font-medium text-stone-800 mb-2">Refund Process</h3>
              <p className="text-stone-600">
                Once we receive and inspect your return, we will process your refund within 5-7 business
                days. Refunds will be issued to the original payment method. Original shipping costs are
                non-refundable unless the return is due to our error.
              </p>
            </section>

            {/* Exchanges */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">7. Exchanges</h2>
              <p className="text-stone-600">
                We do not offer direct exchanges at this time. If you need a different size or color,
                please return your original item for a refund and place a new order for the desired item.
                This ensures the fastest processing time.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">8. Intellectual Property</h2>
              <p className="text-stone-600 mb-4">
                All content on the Site, including but not limited to text, graphics, logos, images,
                photographs, product designs, and software, is the property of Back Nine Apparel or
                its content suppliers and is protected by United States and international copyright,
                trademark, and other intellectual property laws.
              </p>
              <p className="text-stone-600 mb-4">You may not:</p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li>Copy, reproduce, distribute, or create derivative works from our content</li>
                <li>Use our trademarks or trade dress without written permission</li>
                <li>Remove any copyright or proprietary notices from our content</li>
                <li>Use our content for any commercial purpose without authorization</li>
              </ul>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">9. Prohibited Conduct</h2>
              <p className="text-stone-600 mb-4">When using our Site, you agree not to:</p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Submit false or misleading information</li>
                <li>Upload or transmit viruses or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Site</li>
                <li>Use automated systems to access the Site without permission</li>
                <li>Engage in any fraudulent activity</li>
              </ul>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">10. Disclaimer of Warranties</h2>
              <p className="text-stone-600 mb-4">
                THE SITE AND ALL PRODUCTS ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
                OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-stone-600">
                WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT
                ANY DEFECTS WILL BE CORRECTED. WE DO NOT MAKE ANY WARRANTIES REGARDING THE USE OR THE
                RESULTS OF THE USE OF THE SITE IN TERMS OF ACCURACY, RELIABILITY, OR OTHERWISE.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-stone-600 mb-4">
                TO THE FULLEST EXTENT PERMITTED BY LAW, BACK NINE APPAREL AND ITS OFFICERS, DIRECTORS,
                EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA,
                USE, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR ANY PRODUCTS
                PURCHASED THROUGH THE SITE.
              </p>
              <p className="text-stone-600">
                IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID FOR THE PRODUCTS
                GIVING RISE TO THE CLAIM. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION
                OF LIABILITY, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">12. Indemnification</h2>
              <p className="text-stone-600">
                You agree to indemnify, defend, and hold harmless Back Nine Apparel and its officers,
                directors, employees, agents, and affiliates from and against any and all claims,
                liabilities, damages, losses, costs, and expenses (including reasonable attorneys&apos; fees)
                arising out of or related to your use of the Site, your violation of these Terms, or
                your violation of any rights of another.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">13. Governing Law and Jurisdiction</h2>
              <p className="text-stone-600">
                These Terms shall be governed by and construed in accordance with the laws of the State
                of Delaware, without regard to its conflict of law provisions. You agree to submit to
                the exclusive jurisdiction of the state and federal courts located in Delaware for the
                resolution of any disputes arising out of or relating to these Terms or your use of the Site.
              </p>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">14. Dispute Resolution</h2>
              <p className="text-stone-600 mb-4">
                Any dispute arising out of or relating to these Terms or the Site shall first be
                attempted to be resolved through informal negotiation. If the dispute cannot be
                resolved informally within 30 days, either party may pursue formal resolution.
              </p>
              <p className="text-stone-600">
                You agree to waive any right to a jury trial and to participate in a class action
                lawsuit or class-wide arbitration against Back Nine Apparel.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">15. Severability</h2>
              <p className="text-stone-600">
                If any provision of these Terms is found to be unenforceable or invalid, that provision
                shall be limited or eliminated to the minimum extent necessary, and the remaining
                provisions shall continue in full force and effect.
              </p>
            </section>

            {/* Entire Agreement */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">16. Entire Agreement</h2>
              <p className="text-stone-600">
                These Terms, together with our Privacy Policy and any other policies referenced herein,
                constitute the entire agreement between you and Back Nine Apparel regarding your use
                of the Site and supersede all prior agreements and understandings.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">17. Contact Us</h2>
              <p className="text-stone-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-stone-50 rounded-lg p-6">
                <p className="text-stone-800 font-medium">Back Nine Apparel</p>
                <p className="text-stone-600">Email: hello@backnineshop.com</p>
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
