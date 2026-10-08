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

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    filterBusinesses();
  }, [search, category, city, businesses]);

  async function loadBusinesses() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setBusinesses(data || []);
    setFilteredBusinesses(data || []);
    setLoading(false);
  }

  function filterBusinesses() {
    let result = [...businesses];

    if (search.trim()) {
      const text = search.toLowerCase();

      result = result.filter((business) => {
        const businessName = business.business_name || "";
        const businessCategory = business.category || "";
        const businessCity = business.city || "";
        const businessPromotion = business.promotion || "";

        const allText =
          businessName +
          " " +
          businessCategory +
          " " +
          businessCity +
          " " +
          businessPromotion;

        return allText.toLowerCase().includes(text);
      });
    }

    if (category) {
      result = result.filter(
        (business) => business.category === category
      );
    }

    if (city) {
      result = result.filter(
        (business) =>
          (business.city || "").toLowerCase() === city.toLowerCase()
      );
    }

    setFilteredBusinesses(result);
  }

  const categories = Array.from(
    new Set(
      businesses
        .map((business) => business.category)
        .filter(Boolean)
    )
  );

  const cities = Array.from(
    new Set(
      businesses
        .map((business) => business.city)
        .filter(Boolean)
    )
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        <div className="flex items-center justify-between">

          <a
            href="/"
            className="text-2xl font-extrabold text-purple-700"
          >
            Promzo
          </a>

          <a
            href="/dashboard"
            className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white"
          >
            Dashboard
          </a>

        </div>

        <div className="mt-10 text-center">

          <h1 className="text-4xl font-extrabold text-gray-900">
            Find Businesses
          </h1>

          <p className="mt-3 text-gray-500">
            Find businesses looking for creators and promotion.
          </p>

        </div>

        <div className="mt-8 rounded-3xl bg-white p-5 shadow">

          <div className="grid gap-4 md:grid-cols-3">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search business, category..."
              className="rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
            >
              <option value="">
                All Categories
              </option>

              {categories.map((item) => (
                <option key={item} value={item || ""}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
            >
              <option value="">
                All Cities
              </option>

              {cities.map((item) => (
                <option key={item} value={item || ""}>
                  {item}
                </option>
              ))}
            </select>

          </div>

        </div>

        {loading ? (

          <div className="mt-10 text-center">
            <p className="text-gray-500">
              Loading businesses...
            </p>
          </div>

        ) : filteredBusinesses.length === 0 ? (

          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow">

            <div className="text-5xl">
              🏢
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              No businesses found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredBusinesses.map((business) => (

              <div
                key={business.id}
                className="rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                  🏢
                </div>

                <h2 className="mt-5 text-xl font-bold text-gray-900">
                  {business.business_name || "Business"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Owner: {business.owner_name || "Not provided"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  {business.category && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      {business.category}
                    </span>
                  )}

                  {business.city && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      📍 {business.city}
                    </span>
                  )}

                </div>

                {business.promotion && (

                  <div className="mt-5 rounded-2xl bg-gray-50 p-4">

                    <p className="text-xs font-bold uppercase text-gray-400">
                      Looking for
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {business.promotion}
                    </p>

                  </div>

                )}

                <a
                  href={"/businesses/" + business.id}
                  className="mt-5 block w-full rounded-xl bg-purple-600 px-4 py-3 text-center font-bold text-white hover:bg-purple-700"
                >
                  View Business
                </a>

              </div>

            ))}

          </div>

        )}

      </div>
    </main>
  );
}