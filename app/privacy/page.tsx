export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Privacy Policy
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Last updated: October 22, 2026
        </p>

        <p className="mb-6 text-gray-700">
          Promzo helps creators and businesses connect for promotional
          opportunities. This Privacy Policy explains how we handle
          information when you use our platform.
        </p>

        <h2 className="mb-2 text-xl font-semibold">1. Information We Collect</h2>
        <p className="mb-6 text-gray-700">
          We may collect information you provide when creating an account,
          such as your name, email address, profile details, platform links,
          messages, and reviews.
        </p>

        <h2 className="mb-2 text-xl font-semibold">2. How We Use Information</h2>
        <p className="mb-6 text-gray-700">
          We use information to operate Promzo, display creator and business
          profiles, support communication between users, maintain account
          security, and improve our services.
        </p>

        <h2 className="mb-2 text-xl font-semibold">3. Sharing of Information</h2>
        <p className="mb-6 text-gray-700">
          Profile information may be visible to other users according to
          platform settings. Users should avoid sharing passwords, financial
          details, or other sensitive information in public profiles or chats.
          We do not promise that all information will remain private if you
          choose to share it publicly.
        </p>

        <h2 className="mb-2 text-xl font-semibold">4. Messages and Reviews</h2>
        <p className="mb-6 text-gray-700">
          Messages and reviews are used to provide platform features.
          Access depends on account permissions and platform settings.
        </p>

        <h2 className="mb-2 text-xl font-semibold">5. Data Security</h2>
        <p className="mb-6 text-gray-700">
          We use technical measures intended to protect user information.
          However, no online service can guarantee absolute security.
        </p>

        <h2 className="mb-2 text-xl font-semibold">6. Your Choices</h2>
        <p className="mb-6 text-gray-700">
          You may contact our support team about your account information,
          privacy concerns, or requests to correct or delete information.
          Some records may need to be retained where required by law.
        </p>

        <h2 className="mb-2 text-xl font-semibold">7. Contact Us</h2>
        <p className="mb-6 text-gray-700">
          For privacy questions, contact us at{" "}
          <a
            href="mailto:promzo.support@gmail.com"
            className="text-blue-600 underline"
          >
            promzo.support@gmail.com
          </a>.
        </p>

        <a href="/" className="font-medium text-blue-600 hover:underline">
          Back to Home
        </a>
      </article>
    </main>
  );
}