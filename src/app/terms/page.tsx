export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Founder Match, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Purpose of Service</h2>
            <p className="mb-4">
              Founder Match is a platform designed to help entrepreneurs find business co-founders and build professional relationships for startup ventures.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Provide accurate and truthful information about yourself and your experience</li>
              <li>Use the platform solely for finding business co-founders and professional networking</li>
              <li>Respect other users and maintain professional conduct</li>
              <li>Not use the platform for any illegal or unauthorized purpose</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Privacy and Data</h2>
            <p className="mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              Founder Match is a platform for connecting entrepreneurs. We are not responsible for the success or failure of any business relationships formed through our service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us at legal@foundermatch.com.
            </p>

            <p className="text-sm text-gray-600 mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}