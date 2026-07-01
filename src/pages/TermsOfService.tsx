import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfService() {
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
              <FileText className="w-5 h-5 text-[hsl(var(--exsify-primary))]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] dark:text-white">Terms of Service</h1>
          </div>

          <p className="text-gray-500 dark:text-gray-300 mb-8">
            Last updated: {currentYear}. These Terms of Service (“Terms”) govern your access to and use of the websites, mobile applications, desktop applications, and other services provided by EXSIFY Software (“EXSIFY”, “we”, “us”, or “our”). By accessing or using the Services, you agree to be bound by these Terms.
          </p>

          <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By creating an account, downloading, installing, or using any EXSIFY product, you confirm that you are at least 13 years old (or the applicable age of digital consent in your jurisdiction) and have the legal capacity to enter into these Terms. If you use the Services on behalf of an organization, you represent that you have authority to bind that organization.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">2. Accounts and Security</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You agree to provide accurate, current, and complete information during registration.</li>
                <li>You must notify us immediately of any unauthorized use of your account.</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">3. Licenses and Restrictions</h2>
              <p>
                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to use the Services for your personal or internal business purposes. You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Reverse engineer, decompile, or disassemble any part of the Services.</li>
                <li>Use the Services for unlawful, fraudulent, or malicious purposes.</li>
                <li>Interfere with or disrupt the integrity or performance of the Services.</li>
                <li>Remove or alter any copyright, trademark, or proprietary notices.</li>
                <li>Resell, sublicense, or commercially exploit the Services without authorization.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">4. Purchases, Subscriptions, and Refunds</h2>
              <p>
                Certain Services may be offered for a fee. All prices are listed in US Dollars or your selected currency and are subject to change. Payments are processed through third-party payment providers. Refunds are provided only where required by applicable law or at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">5. User Content</h2>
              <p>
                You retain ownership of any content you upload, submit, or transmit through the Services. By providing content, you grant us a worldwide, royalty-free, non-exclusive license to use, reproduce, modify, and display that content solely to operate and improve the Services.
              </p>
              <p className="mt-2">
                You represent that you own or have the necessary rights to any content you submit and that it does not violate any third-party rights or applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">6. Intellectual Property</h2>
              <p>
                All trademarks, logos, software, designs, text, graphics, and other materials provided by EXSIFY are owned by EXSIFY or its licensors and are protected by intellectual property laws. Nothing in these Terms grants you any right to use our trademarks or branding without prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">7. Disclaimers</h2>
              <p>
                THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">8. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, EXSIFY AND ITS OFFICERS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">9. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless EXSIFY from any claims, damages, liabilities, costs, or expenses arising out of your use of the Services, your content, or your violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">10. Termination</h2>
              <p>
                We may suspend or terminate your access to the Services at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users or us. Upon termination, your right to use the Services ceases immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">11. Governing Law and Disputes</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to conflict-of-law principles. Any dispute arising under these Terms shall be resolved in the courts of Nairobi, Kenya.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">12. Changes to These Terms</h2>
              <p>
                We may modify these Terms from time to time. We will post the updated Terms on this page and update the “Last updated” date. Continued use of the Services after changes constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">13. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us:
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
