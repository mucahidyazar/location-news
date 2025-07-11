import {useTranslations} from 'next-intl'

export default function TermsAndConditionsPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-[var(--color-theme-surface-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[var(--color-theme-surface-secondary)] rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[var(--color-theme-text-primary)] mb-8">
            Terms and Conditions
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
                1. Acceptance of Terms
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                Welcome to Mappy.News ("Service," "we," "us," or "our"). These Terms and Conditions ("Terms") govern your use of our news mapping platform and services. By accessing or using Mappy.News, you agree to be bound by these Terms.
              </p>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                If you disagree with any part of these Terms, you may not access or use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                2. Description of Service
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                Mappy.News is a digital platform that aggregates, categorizes, and displays news events on interactive maps. Our Service includes:
              </p>
              <ul className="list-disc pl-6 mb-4 text-[var(--color-theme-text-secondary)]">
                <li>Interactive news mapping and visualization</li>
                <li>News aggregation from various sources</li>
                <li>User-generated news reporting and submission</li>
                <li>Location-based news filtering and categorization</li>
                <li>Real-time news updates and notifications</li>
                <li>Community discussion and engagement features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                3. User Accounts and Registration
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                To access certain features of our Service, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-[var(--color-theme-text-secondary)]">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Use only one account per person</li>
              </ul>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                You must be at least 13 years old to create an account. Users under 18 must have parental consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                4. User Content and Conduct
              </h2>
              
              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                4.1 Content Guidelines
              </h3>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                You may submit news reports, comments, and other content ("User Content"). You agree that your User Content will:
              </p>
              <ul className="list-disc pl-6 mb-4 text-[var(--color-theme-text-secondary)]">
                <li>Be accurate and factual to the best of your knowledge</li>
                <li>Not violate any laws or regulations</li>
                <li>Not infringe on third-party rights</li>
                <li>Not contain hate speech, harassment, or threats</li>
                <li>Not include spam, advertising, or promotional content</li>
                <li>Be relevant to news and current events</li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                4.2 Prohibited Activities
              </h3>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-[var(--color-theme-text-secondary)]">
                <li>Publish false, misleading, or defamatory information</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt our Service</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to scrape or access our data</li>
                <li>Upload malicious code or viruses</li>
                <li>Engage in any illegal activities</li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                4.3 Content Moderation
              </h3>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                We reserve the right to review, edit, or remove any User Content that violates these Terms or our community guidelines. We may also suspend or terminate accounts that repeatedly violate our policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                5. Intellectual Property Rights
              </h2>
              
              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                5.1 Our Content
              </h3>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of Mappy.News and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>

              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                5.2 User Content License
              </h3>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publicly display, and distribute your content in connection with our Service.
              </p>

              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                5.3 Third-Party Content
              </h3>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                We aggregate news content from various sources. We respect the intellectual property rights of content creators and comply with applicable copyright laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                6. Privacy and Data Protection
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                7. Disclaimers and Limitations
              </h2>
              
              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                7.1 Service Availability
              </h3>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                We strive to provide reliable service but cannot guarantee uninterrupted access. The Service is provided "as is" without warranties of any kind.
              </p>

              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                7.2 Content Accuracy
              </h3>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                While we make efforts to ensure accuracy, we do not guarantee the completeness, reliability, or accuracy of news content. Users should verify information from primary sources.
              </p>

              <h3 className="text-xl font-semibold text-[var(--color-theme-text-primary)] mb-3">
                7.3 Limitation of Liability
              </h3>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                To the fullest extent permitted by law, Mappy.News shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                8. Termination
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms.
              </p>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                You may also terminate your account at any time by contacting us or using the account deletion feature in your profile settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                9. Governing Law and Jurisdiction
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Turkey, without regard to its conflict of law provisions.
              </p>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Turkey.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                10. Changes to Terms
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the effective date.
              </p>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                11. Severability
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                12. Contact Information
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-[var(--color-theme-surface-tertiary)] p-4 rounded-lg">
                <p className="text-[var(--color-theme-text-secondary)] mb-2">
                  <strong>Email:</strong> legal@mappy.news
                </p>
                <p className="text-[var(--color-theme-text-secondary)] mb-2">
                  <strong>Address:</strong> Mappy.News Legal Department<br/>
                  Aydınlı mahallesi Melisa sokak Kiptaş Aydınlık evleri sitesi<br/>
                  Istanbul, Istanbul, 34953
                </p>
                <p className="text-[var(--color-theme-text-secondary)]">
                  <strong>Response Time:</strong> We aim to respond to legal inquiries within 15 business days.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--color-theme-text-primary)] mb-4">
                13. Entire Agreement
              </h2>
              <p className="text-[var(--color-theme-text-secondary)] mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Mappy.News regarding your use of the Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}