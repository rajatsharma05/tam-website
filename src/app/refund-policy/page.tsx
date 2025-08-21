export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
              <p className="text-gray-700 mb-4">
                At Technology Awareness Month (TAM), we strive to provide the best possible experience for all our participants. This refund policy outlines the terms and conditions for refunds of event registrations and other services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Event Cancellation by TAM</h2>
              <p className="text-gray-700 mb-4">
                In the event that TAM cancels an event due to unforeseen circumstances, force majeure, or insufficient registrations:
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                <li>Full refunds will be issued to all registered participants</li>
                <li>Refunds will be processed within 7-10 business days</li>
                <li>Participants will be notified via email about the cancellation</li>
                <li>Alternative event dates may be offered when possible</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Participant Cancellation</h2>
              <p className="text-gray-700 mb-4">
                Participants may cancel their registration under the following conditions:
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Cancellation Timeline:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>30+ days before event:</strong> 100% refund</li>
                  <li><strong>15-29 days before event:</strong> 75% refund</li>
                  <li><strong>7-14 days before event:</strong> 50% refund</li>
                  <li><strong>Less than 7 days before event:</strong> No refund</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Refund Process</h2>
              <p className="text-gray-700 mb-4">
                To request a refund, participants must:
              </p>
              <ol className="list-decimal list-inside text-gray-700 ml-4 mb-4">
                <li>Submit a written cancellation request via email to technologyawarenessmonth@gmail.com</li>
                <li>Include the event name, registration date, and reason for cancellation</li>
                <li>Provide the original payment method details</li>
              </ol>
              <p className="text-gray-700 mb-4">
                Refund requests will be processed within 5-7 business days of receipt.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Non-Refundable Items</h2>
              <p className="text-gray-700 mb-4">
                The following items are non-refundable:
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                <li>Processing fees and transaction charges</li>
                <li>Merchandise and promotional items</li>
                <li>Donations to TAM</li>
                <li>Special event packages with non-transferable components</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Transfer Policy</h2>
              <p className="text-gray-700 mb-4">
                Instead of cancellation, participants may transfer their registration to another person:
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                <li>Transfer requests must be submitted at least 7 days before the event</li>
                <li>New participant must meet any eligibility requirements</li>
                <li>Transfer fee of ₹100 may apply</li>
                <li>Only one transfer per registration is allowed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Special Circumstances</h2>
              <p className="text-gray-700 mb-4">
                TAM may consider refunds in special circumstances such as:
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                <li>Medical emergencies with proper documentation</li>
                <li>Bereavement in the immediate family</li>
                <li>Military deployment or other official duties</li>
                <li>Natural disasters or travel restrictions</li>
              </ul>
              <p className="text-gray-700 mb-4">
                These cases will be reviewed individually and may require additional documentation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Payment Method Refunds</h2>
              <p className="text-gray-700 mb-4">
                Refunds will be processed using the original payment method:
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
                <li><strong>Digital Wallets:</strong> 3-5 business days</li>
                <li><strong>Bank Transfers:</strong> 7-14 business days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about refunds or to submit a refund request, please contact us:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> technologyawarenessmonth@gmail.com<br />
                  <strong>Phone:</strong> +91 6395896319<br />
                  <strong>Response Time:</strong> Within 24-48 hours
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Policy Updates</h2>
              <p className="text-gray-700 mb-4">
                TAM reserves the right to modify this refund policy at any time. Participants will be notified of any changes via email and the updated policy will be posted on our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
