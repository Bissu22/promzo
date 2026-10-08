"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function ChooseRolePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setLoading(false);
    }

    checkUser();
  }, []);

  async function chooseRole(role: "creator" | "business") {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        role: role,
      })
      .eq("id", user.id);

    if (error) {
      setSaving(false);
      alert(error.message);
      return;
    }

    window.location.href =
      role === "creator" ? "/creator" : "/business";
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">

        <div className="text-center">
          <a
            href="/"
            className="text-3xl font-extrabold text-purple-700"
          >
            Promzo
          </a>

          <h1 className="mt-12 text-3xl font-extrabold">
            Promzo par aap kya karna chahte hain?
          </h1>

          <p className="mt-3 text-gray-600">
            Apna account type select karein.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <button
            type="button"
            disabled={saving}
            onClick={() => chooseRole("creator")}
            className="rounded-3xl bg-white p-8 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl disabled:opacity-50"
          >
            <div className="text-6xl">🎬</div>

            <h2 className="mt-6 text-2xl font-extrabold">
              Creator
            </h2>

            <p className="mt-3 text-gray-600">
              Apne social media profile ko Promzo par list karein
              aur businesses se promotion opportunities paayein.
            </p>

            <div className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-center font-bold text-white">
              Continue as Creator
            </div>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => chooseRole("business")}
            className="rounded-3xl bg-white p-8 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl disabled:opacity-50"
          >
            <div className="text-6xl">🏢</div>

            <h2 className="mt-6 text-2xl font-extrabold">
              Business
            </h2>

            <p className="mt-3 text-gray-600">
              Creators search karein aur apne business ki
              promotion ke liye unse contact karein.
            </p>

            <div className="mt-6 rounded-xl bg-pink-600 px-5 py-3 text-center font-bold text-white">
              Continue as Business
            </div>
          </button>

        </div>

        {saving && (
          <p className="mt-6 text-center text-gray-500">
            Saving your choice...
          </p>
        )}

      </div>
    </main>
  );
}