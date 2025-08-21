export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Technology Awareness Month (&ldquo;TAM&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, register for events, or use our services.
              </p>
              <p className="text-gray-700 mb-4">
                By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">We may collect the following personal information:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Educational institution and academic details</li>
                <li>Event registration preferences and history</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Profile information and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 mb-4">When you visit our website, we automatically collect:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website information</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                <li>Providing and maintaining our services</li>
                <li>Processing event registrations and payments</li>
                <li>Communicating with you about events and updates</li>
                <li>Improving our website and services</li>
                <li>Analyzing usage patterns and trends</li>
                <li>Ensuring security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We may share information with trusted third-party service providers who assist us in operating our website, processing payments, or providing other services.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required by law or in response to valid legal requests, such as subpoenas or court orders.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Business Transfers</h3>
              <p className="text-gray-700 mb-4">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure hosting and infrastructure</li>
                <li>Employee training on data protection</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience and analyze website usage. You can control cookie settings through your browser preferences.
              </p>
              <p className="text-gray-700 mb-4">
                Types of cookies we use:
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                <li><strong>Essential cookies:</strong> Required for basic website functionality</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors use our website</li>
                <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing cookies:</strong> Used for targeted advertising (with consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <p className="text-gray-700 mb-4">
                Event registration data is typically retained for 3 years for record-keeping purposes, while website analytics data may be retained for shorter periods.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
              </p>
              <p className="text-gray-700 mb-4">
                We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> technologyawarenessmonth@gmail.com<br />
                  <strong>Phone:</strong> +91 6395896319<br />
                  <strong>Address:</strong> Technology Awareness Month, India<br />
                  <strong>Response Time:</strong> Within 48 hours
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                This Privacy Policy is governed by and construed in accordance with the laws of India. Any disputes arising from this policy will be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
