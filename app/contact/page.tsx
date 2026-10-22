export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Contact Us
        </h1>

        <p className="mb-8 text-gray-600">
          Have a question or need help with Promzo? We are here to help.
          Contact our support team using the email below.
        </p>

        <div className="rounded-xl border border-gray-200 p-5">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Email Support
          </h2>

          <a
            href="mailto:promzo.support@gmail.com"
            className="font-medium text-blue-600 hover:underline"
          >
            promzo.support@gmail.com
          </a>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Promzo helps creators and businesses connect for promotional
          opportunities. Please contact us if you have questions about
          your account or the platform.
        </p>

        <a
          href="/"
          className="mt-8 inline-block rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}