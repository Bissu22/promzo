"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

type Business = {
  id: number;
  business_name: string | null;
  owner_name: string | null;
  category: string | null;
  website: string | null;
  city: string | null;
  promotion: string | null;
};

export default function MyBusinessPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBusiness() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("businesses")
        .select(
          "id, business_name, owner_name, category, website, city, promotion"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      setBusiness(data);
      setLoading(false);
    }

    loadBusiness();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">
          Loading business profile...
        </p>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">

          <div className="text-6xl">🏢</div>

          <h1 className="mt-5 text-2xl font-extrabold">
            Business Profile Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            Abhi aapke account ke saath koi business profile connected nahi hai.
          </p>

          <a
            href="/business"
            className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 font-bold text-white"
          >
            Create Business Profile
          </a>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}

        <div className="flex items-center justify-between">

          <a
            href="/dashboard"
            className="text-2xl font-extrabold text-purple-700"
          >
            Promzo
          </a>

          <a
            href="/dashboard"
            className="rounded-xl border px-5 py-2 font-bold text-gray-700"
          >
            ← Dashboard
          </a>

        </div>

        {/* Business Header */}

        <div className="mt-8 rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-white shadow-xl">

          <div className="text-5xl">
            🏢
          </div>

          <h1 className="mt-4 text-3xl font-extrabold">
            {business.business_name}
          </h1>

          <p className="mt-2 text-purple-100">
            Your Business Profile
          </p>

        </div>

        {/* Basic Details */}

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <p className="text-sm font-semibold text-gray-500">
              Business Name
            </p>

            <h2 className="mt-2 text-xl font-bold">
              {business.business_name || "Not added"}
            </h2>

          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <p className="text-sm font-semibold text-gray-500">
              Owner / Contact Person
            </p>

            <h2 className="mt-2 text-xl font-bold">
              {business.owner_name || "Not added"}
            </h2>

          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <p className="text-sm font-semibold text-gray-500">
              Category
            </p>

            <h2 className="mt-2 text-xl font-bold">
              {business.category || "Not added"}
            </h2>

          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <p className="text-sm font-semibold text-gray-500">
              City
            </p>

            <h2 className="mt-2 text-xl font-bold">
              {business.city || "Not added"}
            </h2>

          </div>

        </div>

        {/* Website */}

        <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

          <p className="text-sm font-semibold text-gray-500">
            Instagram / Website
          </p>

          {business.website ? (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block break-all font-bold text-purple-600"
            >
              {business.website}
            </a>
          ) : (
            <p className="mt-2 text-gray-500">
              Not added
            </p>
          )}

        </div>

        {/* Promotion */}

        <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm">

          <p className="text-sm font-semibold text-gray-500">
            What You Want To Promote
          </p>

          <p className="mt-3 leading-7 text-gray-700">
            {business.promotion || "Not added"}
          </p>

        </div>

        {/* Find Creators */}

        <div className="mt-8 rounded-3xl bg-purple-50 p-7">

          <h2 className="text-xl font-extrabold text-purple-700">
            🚀 Find Creators
          </h2>

          <p className="mt-2 text-gray-600">
            Ab aap creators search karke apne business ke promotion
            ke liye directly contact kar sakte hain.
          </p>

          <a
            href="/creators"
            className="mt-5 inline-block rounded-xl bg-purple-600 px-6 py-3 font-bold text-white"
          >
            Find Creators →
          </a>

        </div>

      </div>
    </main>
  );
}