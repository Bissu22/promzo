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
  user_id: string | null;
};

export default function BusinessProfilePage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusiness();
  }, []);

  async function loadBusiness() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const businessId = window.location.pathname.split("/").pop();

    if (!businessId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setBusiness(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-center">
        <p className="text-gray-500">Loading business...</p>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-center">
        <h1 className="text-3xl font-bold">
          Business not found
        </h1>

        <a
          href="/businesses"
          className="mt-6 inline-block rounded-xl bg-purple-600 px-5 py-3 font-bold text-white"
        >
          Back to Businesses
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">

        <div className="flex items-center justify-between">
          <a
            href="/"
            className="text-2xl font-extrabold text-purple-700"
          >
            Promzo
          </a>

          <a
            href="/businesses"
            className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white"
          >
            Back
          </a>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-xl">

          <div className="bg-purple-600 px-6 py-10 text-center text-white">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-5xl">
              🏢
            </div>

            <h1 className="mt-5 text-3xl font-extrabold">
              {business.business_name || "Business"}
            </h1>

            {business.category && (
              <p className="mt-2 text-purple-100">
                {business.category}
              </p>
            )}

          </div>

          <div className="p-6 md:p-10">

            <div className="grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm font-semibold text-gray-400">
                  Owner / Contact
                </p>

                <p className="mt-2 text-lg font-bold text-gray-900">
                  {business.owner_name || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm font-semibold text-gray-400">
                  City
                </p>

                <p className="mt-2 text-lg font-bold text-gray-900">
                  {business.city || "Not provided"}
                </p>
              </div>

            </div>

            {business.website && (
              <div className="mt-5 rounded-2xl bg-gray-50 p-5">
                <p className="text-sm font-semibold text-gray-400">
                  Website
                </p>

                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-bold text-purple-600"
                >
                  Visit Website →
                </a>
              </div>
            )}

            {business.promotion && (
              <div className="mt-5 rounded-2xl bg-gray-50 p-5">
                <p className="text-sm font-semibold text-gray-400">
                  Looking For
                </p>

                <p className="mt-2 leading-7 text-gray-700">
                  {business.promotion}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <a
                href="/businesses"
                className="flex-1 rounded-xl border border-gray-300 px-5 py-3 text-center font-bold text-gray-700"
              >
                ← Back to Businesses
              </a>

              <a
                href="/creators"
                className="flex-1 rounded-xl bg-purple-600 px-5 py-3 text-center font-bold text-white"
              >
                Find Creators
              </a>

            </div>

            <a
              href={"/chat?business=" + business.id}
              className="mt-4 block w-full rounded-xl bg-green-600 px-5 py-3 text-center font-bold text-white hover:bg-green-700"
            >
              💬 Contact Business
            </a>

          </div>

        </div>

      </div>
    </main>
  );
}