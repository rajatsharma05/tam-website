export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using the Technology Awareness Month (TAM) website and services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on TAM's website for personal, non-commercial transitory viewing only.
              </p>
              <p className="text-gray-700 mb-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Event Registration</h2>
              <p className="text-gray-700 mb-4">
                By registering for TAM events, you agree to provide accurate and complete information. TAM reserves the right to refuse service, terminate accounts, or cancel orders at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                All payments for events and services must be made in full at the time of registration. Prices are subject to change without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The materials on TAM's website are provided on an 'as is' basis. TAM makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitations</h2>
              <p className="text-gray-700 mb-4">
                In no event shall TAM or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TAM's website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Revisions and Errata</h2>
              <p className="text-gray-700 mb-4">
                The materials appearing on TAM's website could include technical, typographical, or photographic errors. TAM does not warrant that any of the materials on its website are accurate, complete or current.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Links</h2>
              <p className="text-gray-700 mb-4">
                TAM has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by TAM of the site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Site Terms of Use Modifications</h2>
              <p className="text-gray-700 mb-4">
                TAM may revise these terms of use for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: technologyawarenessmonth@gmail.com<br />
                Phone: +91 6395896319
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
