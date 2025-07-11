import {useTranslations} from 'next-intl'

export default function PrivacyPolicyPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-[var(--color-theme-surface-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[var(--color-theme-surface-secondary)] rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[var(--color-theme-text-primary)] mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-[var(--color-theme-text-secondary)] mb-6">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                1. Introduction
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                Welcome to Mappy.News ("we," "our," or "us"). We are committed to protecting your privacy and handling your personal information with care. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our news mapping platform and services.
              </p>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                Mappy.News is a geographic news visualization platform that displays news events on interactive maps, helping users understand global events through location-based context.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                2. Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                2.1 Information You Provide
              </h3>
              <ul className="list-disc pl-6 mb-4 text-[var(--color-theme-text-secondary)]">
                <li>Account registration information (email, username, password)</li>
                <li>News reports and submissions you create</li>
                <li>Comments and feedback</li>
                <li>Contact information when you reach out to us</li>
                <li>User preferences and settings</li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                2.2 Information We Collect Automatically
              </h3>
              <ul className="list-disc pl-6 mb-4 text-[var(--color-theme-text-secondary)]">
                <li>IP address and location data</li>
                <li>Device information (browser type, operating system, device identifiers)</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Map interaction data (zoom levels, areas viewed, markers clicked)</li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                2.3 Third-Party Information
              </h3>
              <ul className="list-disc pl-6 mb-4 text-[var(--color-theme-text-secondary)]">
                <li>News content from RSS feeds and news APIs</li>
                <li>Geographic data from mapping services</li>
                <li>Social media integration data (if you connect accounts)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 mb-4 text-[var(--color-theme-text-secondary)]">
                <li>Provide and maintain our mapping news service</li>
                <li>Personalize your experience and content recommendations</li>
                <li>Process and moderate user-submitted news reports</li>
                <li>Improve our algorithms for news categorization and location mapping</li>
                <li>Send notifications about relevant news in your areas of interest</li>
                <li>Analyze usage patterns to enhance our platform</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
                <li>Communicate with you about updates and support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                4. Information Sharing and Disclosure
              </h2>
              
              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                4.1 We May Share Information:
              </h3>
              <ul className="list-disc pl-6 mb-4 text-[var(--color-theme-text-secondary)]">
                <li>With your consent or at your direction</li>
                <li>With service providers who assist our operations</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights and prevent harm</li>
                <li>In connection with business transfers or mergers</li>
                <li>For research purposes (aggregated and anonymized data)</li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                4.2 Public Information
              </h3>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                News reports you submit, comments, and certain profile information may be publicly visible on our platform. Please exercise caution when sharing personal information in public areas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                5. Data Security
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 mb-4 text-[var(--color-theme-text-secondary)]">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication systems</li>
                <li>Secure data storage with trusted cloud providers</li>
                <li>Regular software updates and security patches</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                6. Your Rights and Choices
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 mb-4 text-[var(--color-theme-text-secondary)]">
                <li>Access and receive a copy of your personal information</li>
                <li>Update or correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Restrict or object to certain processing activities</li>
                <li>Data portability rights</li>
                <li>Withdraw consent (where applicable)</li>
                <li>Opt-out of marketing communications</li>
              </ul>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                To exercise these rights, please contact us at privacy@mappy.news.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                7. Cookies and Tracking Technologies
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze usage patterns. You can control cookie settings through your browser preferences.
              </p>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                Types of cookies we use:
              </p>
              <ul className="list-disc pl-6 mb-4 text-[var(--color-theme-text-secondary)]">
                <li>Essential cookies for platform functionality</li>
                <li>Performance cookies for analytics</li>
                <li>Preference cookies for user settings</li>
                <li>Marketing cookies for relevant advertisements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                8. Data Retention
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                10. Children's Privacy
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the effective date. Your continued use of our service after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                12. Contact Information
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-[var(--color-theme-surface-tertiary)] p-4 rounded-lg">
                <p className="text-[var(--color-theme-text-secondary)] mb-2">
                  <strong>Email:</strong> privacy@mappy.news
                </p>
                <p className="text-[var(--color-theme-text-secondary)] mb-2">
                  <strong>Address:</strong> Mappy.News Privacy Team<br/>
                  Aydınlı mahallesi Melisa sokak Kiptaş Aydınlık evleri sitesi<br/>
                  Istanbul, Istanbul, 34953
                </p>
                <p className="text-[var(--color-theme-text-secondary)]">
                  <strong>Response Time:</strong> We aim to respond to privacy inquiries within 30 days.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}