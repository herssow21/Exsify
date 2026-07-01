import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen py-12 bg-[#F8FAFC] dark:bg-[#0B1120]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[hsl(var(--exsify-primary))] dark:text-gray-300 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[hsl(var(--exsify-primary))]/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-[hsl(var(--exsify-primary))]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] dark:text-white">Privacy Policy</h1>
          </div>

          <p className="text-gray-500 dark:text-gray-300 mb-8">
            Last updated: {currentYear}. EXSIFY Software (“EXSIFY”, “we”, “us”, or “our”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile applications, desktop applications, and related services (collectively, the “Services”).
          </p>

          <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">1. Information We Collect</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Account information:</strong> name, email address, country, region/county, currency preference, and profile image (if uploaded).</li>
                <li><strong>Usage data:</strong> app downloads, favorites, reviews, consultation requests, and interactions with the Services.</li>
                <li><strong>Device and log data:</strong> IP address, browser type, device identifiers, operating system, and pages visited.</li>
                <li><strong>User-generated content:</strong> media files, screenshots, logos, reviews, comments, or other materials you upload.</li>
                <li><strong>Communications:</strong> emails, support tickets, and other messages you send us.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To provide, maintain, and improve the Services.</li>
                <li>To process transactions, downloads, and account requests.</li>
                <li>To personalize your experience, such as currency and language preferences.</li>
                <li>To communicate with you about updates, security alerts, and support.</li>
                <li>To analyze usage trends and improve platform performance.</li>
                <li>To enforce our Terms of Service and protect our legal rights.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">3. Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Service providers:</strong> hosting, analytics, payment processing, and customer-support vendors under confidentiality obligations.</li>
                <li><strong>Legal authorities:</strong> when required by law, court order, or to protect our rights, users, or the public.</li>
                <li><strong>Business transfers:</strong> in connection with a merger, acquisition, or sale of assets, with notice to users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">4. Data Storage and Security</h2>
              <p>
                We use industry-standard technical and organizational measures to protect your data. Some data is stored locally in your browser for performance; backend data is stored on secured servers. No method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">5. Cookies and Similar Technologies</h2>
              <p>
                We use cookies and local storage to remember your preferences, keep you signed in, and analyze traffic. You can disable cookies through your browser settings, but some features may not function properly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">6. Account Deletion</h2>
              <p>
                You may request deletion of your account and associated personal data at any time by contacting us at{' '}
                <a href="mailto:info@exsify.com" className="text-[hsl(var(--exsify-primary))] hover:underline">info@exsify.com</a>{' '}
                or through the Profile page when signed in. We will delete or anonymize your data within a reasonable timeframe, except where retention is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">7. Children’s Privacy</h2>
              <p>
                The Services are not intended for children under 13 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the “Last updated” date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">10. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy, contact us at:
              </p>
              <address className="not-italic mt-2 text-gray-500 dark:text-gray-300">
                EXSIFY Software<br />
                12th st Eastleigh, Nairobi, Kenya<br />
                Email: <a href="mailto:info@exsify.com" className="text-[hsl(var(--exsify-primary))] hover:underline">info@exsify.com</a><br />
                Phone: <a href="tel:+254727880041" className="text-[hsl(var(--exsify-primary))] hover:underline">+254 727 880 041</a>
              </address>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
