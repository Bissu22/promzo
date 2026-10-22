export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Terms & Conditions
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Last updated: October 22, 2026
        </p>

        <p className="mb-6 text-gray-700">
          Welcome to Promzo. By accessing or using our platform, you agree
          to these Terms & Conditions. If you do not agree, please do not
          use the platform.
        </p>

        <h2 className="mb-2 text-xl font-semibold">
          1. About Promzo
        </h2>
        <p className="mb-6 text-gray-700">
          Promzo connects creators and businesses so they can discover
          each other and discuss promotional opportunities. Initially,
          Promzo provides this connection service without charging a
          platform joining fee.
        </p>

        <h2 className="mb-2 text-xl font-semibold">
          2. User Accounts
        </h2>
        <p className="mb-6 text-gray-700">
          You must provide accurate information when creating an account.
          You are responsible for protecting your login credentials and
          for activity performed through your account.
        </p>

        <h2 className="mb-2 text-xl font-semibold">
          3. Creator and Business Responsibilities
        </h2>
        <p className="mb-6 text-gray-700">
          Creators and businesses are responsible for checking each
          other's details and agreeing on campaign scope, payment,
          deadlines, and deliverables before starting a promotion.
        </p>

        <h2 className="mb-2 text-xl font-semibold">
          4. Payments and Promotions
        </h2>
        <p className="mb-6 text-gray-700">
          Unless a separate feature explicitly states otherwise, payments
          for promotional deals are arranged directly between the creator
          and the business. Promzo does not guarantee payment, campaign
          results, or the conduct of either party.
        </p>

        <h2 className="mb-2 text-xl font-semibold">
          5. Prohibited Activities
        </h2>
        <p className="mb-6 text-gray-700">
          Users must not post fraudulent, misleading, unlawful, abusive,
          or infringing content; impersonate others; misuse personal
          information; or attempt to compromise platform security.
        </p>

        <h2 className="mb-2 text-xl font-semibold">
          6. Reviews and Messages
        </h2>
        <p className="mb-6 text-gray-700">
          Users must communicate respectfully and submit honest reviews.
          Harassment, threats, spam, and knowingly false reviews are not
          permitted.
        </p>

        <h2 className="mb-2 text-xl font-semibold">
          7. Suspension and Termination
        </h2>
        <p className="mb-6 text-gray-700">
          Promzo may restrict or suspend accounts that violate these
          terms, misuse the platform, or create security risks, subject
          to applicable law.
        </p>

        <h2 className="mb-2 text-xl font-semibold">
          8. Limitation of Liability
        </h2>
        <p className="mb-6 text-gray-700">
          To the extent permitted by applicable law, Promzo is not
          responsible for disputes, losses, or damages arising from
          arrangements made directly between users.
        </p>

        <h2 className="mb-2 text-xl font-semibold">
          9. Changes to These Terms
        </h2>
        <p className="mb-6 text-gray-700">
          We may update these terms from time to time. Updated terms
          will be published on this page with a revised date.
        </p>

        <h2 className="mb-2 text-xl font-semibold">
          10. Contact Us
        </h2>
        <p className="mb-6 text-gray-700">
          For questions about these terms, contact{" "}
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