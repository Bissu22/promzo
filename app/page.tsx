"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setLoggedIn(!!user);
      setLoading(false);
    }

    checkUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-extrabold text-purple-700">
            Promzo
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="/creators" className="font-semibold text-gray-600 hover:text-purple-600">
              Creators
            </a>

            <a href="/business" className="font-semibold text-gray-600 hover:text-purple-600">
              Businesses
            </a>

            <a href="#how-it-works" className="font-semibold text-gray-600 hover:text-purple-600">
              How It Works
            </a>
          </nav>

          {!loading &&
            (loggedIn ? (
              <div className="flex items-center gap-3">
                <a href="/dashboard" className="rounded-xl bg-purple-600 px-5 py-2.5 font-bold text-white">
                  Dashboard
                </a>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-red-500 px-5 py-2.5 font-bold text-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <a href="/login" className="rounded-xl bg-purple-600 px-5 py-2.5 font-bold text-white">
                Login
              </a>
            ))}
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-bold uppercase tracking-wider text-purple-600">
              INDIA'S CREATOR & BUSINESS NETWORK
            </p>

            <h1 className="mt-5 text-5xl font-extrabold leading-tight md:text-6xl">
              Connect Businesses
              <span className="text-purple-600"> with Creators</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Promzo helps businesses find the right creators for
              promotion and helps creators discover new brand
              opportunities.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {loggedIn ? (
                <a
                  href="/dashboard"
                  className="rounded-xl bg-purple-600 px-7 py-4 font-bold text-white shadow-lg"
                >
                  Go to Dashboard →
                </a>
              ) : (
                <>
                  <a
                    href="/signup?role=creator"
                    className="rounded-xl bg-purple-600 px-7 py-4 font-bold text-white shadow-lg"
                  >
                    Join as Creator →
                  </a>

                  <a
                    href="/signup?role=business"
                    className="rounded-xl border-2 border-purple-600 px-7 py-4 font-bold text-purple-600"
                  >
                    Join as Business
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gray-50 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">Find the Right Creator</h2>
            <p className="mt-3 text-gray-600">
              Search creators by category, city and audience.
            </p>
          </div>

          <a
            href="/creators"
            className="mx-auto mt-7 block max-w-2xl rounded-2xl border bg-white px-6 py-4 text-gray-500 shadow-sm"
          >
            🔎 Search creators on Promzo...
          </a>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-extrabold">Popular Categories</h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            {[
              "Fashion",
              "Beauty",
              "Gaming",
              "Food",
              "Travel",
              "Education",
              "Technology",
              "Comedy",
              "Fitness",
              "Lifestyle",
            ].map((category) => (
              <a
                key={category}
                href="/creators"
                className="rounded-2xl border bg-white p-5 text-center font-bold shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-bold text-purple-600">HOW PROMZO WORKS</p>
            <h2 className="mt-3 text-4xl font-extrabold">
              Simple. Direct. Powerful.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="text-5xl">🔎</div>
              <h3 className="mt-6 text-xl font-extrabold">1. Discover</h3>
              <p className="mt-3 text-gray-600">
                Businesses search and discover creators based on
                category, city and audience.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="text-5xl">💬</div>
              <h3 className="mt-6 text-xl font-extrabold">2. Connect</h3>
              <p className="mt-3 text-gray-600">
                Businesses can directly contact creators and discuss
                promotion opportunities.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="text-5xl">🚀</div>
              <h3 className="mt-6 text-xl font-extrabold">3. Promote</h3>
              <p className="mt-3 text-gray-600">
                Creators and businesses work together to grow their
                audience and business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-purple-700 p-10 text-center text-white md:p-16">
          <h2 className="text-4xl font-extrabold">
            Need Promotion for Your Business?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-purple-100">
            Find creators who match your business and start a
            conversation directly.
          </p>

          <a
            href="/signup?role=business"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-4 font-bold text-purple-700"
          >
            Join as Business →
          </a>
        </div>
      </section>

      {/* CREATOR CTA */}
      {!loggedIn && (
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-6xl rounded-3xl bg-pink-50 p-10 text-center md:p-16">
            <h2 className="text-4xl font-extrabold">Are You a Creator?</h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Join Promzo and connect with businesses looking for
              creators.
            </p>

            <a
              href="/signup?role=creator"
              className="mt-8 inline-block rounded-xl bg-purple-600 px-7 py-4 font-bold text-white"
            >
              Join as Creator →
            </a>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t bg-white px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row">
          <div>
            <p className="text-xl font-extrabold text-purple-700">Promzo</p>
            <p className="mt-2 text-sm text-gray-500">
              Connecting businesses with creators.
            </p>
          </div>

          <div className="flex gap-6 text-sm font-semibold text-gray-500">
            <a href="/creators">Creators</a>
            <a href="/business">Businesses</a>
            <a href="/login">Login</a>
          </div>
        </div>
      </footer>
    </main>
  );
}