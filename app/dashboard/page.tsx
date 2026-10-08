"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

type Profile = {
  full_name: string | null;
  email: string | null;
  role: string | null;
  status: string | null;
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [suspended, setSuspended] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, role, status")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      if (data.status === "suspended") {
        setSuspended(true);
        setProfile(data);
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    );
  }

  if (suspended) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">

          <div className="text-6xl">🚫</div>

          <h1 className="mt-5 text-3xl font-extrabold text-red-600">
            Account Suspended
          </h1>

          <p className="mt-4 text-gray-600">
            Aapka Promzo account temporarily suspended hai.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Agar aapko lagta hai ki ye galti se hua hai,
            to Promzo support se contact karein.
          </p>

          <button
            onClick={handleLogout}
            className="mt-7 w-full rounded-xl bg-black px-6 py-3 font-bold text-white"
          >
            Logout
          </button>

        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">

          <h1 className="text-2xl font-bold">
            Profile not found
          </h1>

          <a
            href="/choose-role"
            className="mt-5 inline-block rounded-xl bg-purple-600 px-6 py-3 font-bold text-white"
          >
            Choose Role
          </a>

        </div>
      </main>
    );
  }

  const isCreator = profile.role === "creator";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="flex items-center justify-between">

          <a
            href="/"
            className="text-2xl font-extrabold text-purple-700"
          >
            Promzo
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-red-500 px-5 py-2 font-bold text-red-500"
          >
            Logout
          </button>

        </div>

        {/* Welcome */}

        <div className="mt-10 rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-white shadow-xl">

          <p className="text-purple-100">
            {isCreator
              ? "Creator Dashboard"
              : "Business Dashboard"}
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            Hello, {profile.full_name || "User"} 👋
          </h1>

          <p className="mt-2 text-purple-100">
            {profile.email}
          </p>

        </div>

        {/* Creator Dashboard */}

        {isCreator ? (
          <>
            <div className="mt-8 grid gap-6 md:grid-cols-3">

              <a
                href="/inbox"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                <div className="text-5xl">📩</div>

                <h2 className="mt-5 text-xl font-extrabold">
                  My Inbox
                </h2>

                <p className="mt-2 text-gray-600">
                  Businesses ke messages dekhein aur reply karein.
                </p>

                <div className="mt-5 font-bold text-purple-600">
                  Open Inbox →
                </div>
              </a>

              <a
                href="/creator"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                <div className="text-5xl">🎬</div>

                <h2 className="mt-5 text-xl font-extrabold">
                  Creator Profile
                </h2>

                <p className="mt-2 text-gray-600">
                  Apna creator profile manage karein.
                </p>

                <div className="mt-5 font-bold text-purple-600">
                  Open Profile →
                </div>
              </a>

              <a
                href="/creators"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                <div className="text-5xl">👥</div>

                <h2 className="mt-5 text-xl font-extrabold">
                  Explore Creators
                </h2>

                <p className="mt-2 text-gray-600">
                  Promzo par available creators dekhein.
                </p>

                <div className="mt-5 font-bold text-purple-600">
                  Explore →
                </div>
              </a>

            </div>

            <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm">

              <h2 className="text-xl font-extrabold">
                Creator Tips 💡
              </h2>

              <p className="mt-3 text-gray-600">
                Apna profile complete rakhein, social profile link
                add karein aur businesses ke messages ka jaldi reply karein.
              </p>

            </div>
          </>
        ) : (
          /* Business Dashboard */

          <>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              <a
                href="/creators"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                <div className="text-5xl">🔎</div>

                <h2 className="mt-5 text-xl font-extrabold">
                  Find Creators
                </h2>

                <p className="mt-2 text-gray-600">
                  Apne business ke liye creators search karein.
                </p>

                <div className="mt-5 font-bold text-purple-600">
                  Search Creators →
                </div>
              </a>

              <a
                href="/business"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                <div className="text-5xl">🏢</div>

                <h2 className="mt-5 text-xl font-extrabold">
                  Business Profile
                </h2>

                <p className="mt-2 text-gray-600">
                  Apne business ki information manage karein.
                </p>

                <div className="mt-5 font-bold text-purple-600">
                  Open Profile →
                </div>
              </a>

              <a
                href="/creators"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                <div className="text-5xl">💬</div>

                <h2 className="mt-5 text-xl font-extrabold">
                  Contact Creators
                </h2>

                <p className="mt-2 text-gray-600">
                  Creator profile open karke directly contact karein.
                </p>

                <div className="mt-5 font-bold text-purple-600">
                  Contact →
                </div>
              </a>

              <a
                href="/inbox"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                <div className="text-5xl">📩</div>

                <h2 className="mt-5 text-xl font-extrabold">
                  My Inbox
                </h2>

                <p className="mt-2 text-gray-600">
                  Creators ke messages dekhein aur reply karein.
                </p>

                <div className="mt-5 font-bold text-purple-600">
                  Open Inbox →
                </div>
              </a>

            </div>

            <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm">

              <h2 className="text-xl font-extrabold">
                Business Tip 💡
              </h2>

              <p className="mt-3 text-gray-600">
                Creator select karte waqt followers ke saath category,
                city aur content quality bhi check karein.
              </p>

            </div>
          </>
        )}

      </div>
    </main>
  );
}