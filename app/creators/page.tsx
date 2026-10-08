"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

type Creator = {
  id: number;
  name: string;
  creator_username: string;
  platform: string;
  profile_link: string;
  followers: number;
  category: string;
  city: string;
  about: string;
  avatar_url: string | null;
  available_for_promotion: boolean;
};

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function loadCreators() {
      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      setCreators((data || []) as Creator[]);
      setLoading(false);
    }

    loadCreators();
  }, []);

  const filteredCreators = creators.filter((creator) => {
    const text = search.toLowerCase().trim();

    const matchesSearch =
      text === "" ||
      creator.name?.toLowerCase().includes(text) ||
      creator.creator_username?.toLowerCase().includes(text) ||
      creator.city?.toLowerCase().includes(text) ||
      creator.category?.toLowerCase().includes(text);

    const matchesCategory =
      category === "All" || creator.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <a
          href="/"
          className="text-2xl font-extrabold text-purple-700"
        >
          Promzo
        </a>

        <div className="mt-10 text-center">
          <p className="font-semibold text-purple-600">
            PROMZO CREATORS
          </p>

          <h1 className="mt-2 text-4xl font-extrabold">
            Find Creators
          </h1>

          <p className="mt-3 text-gray-600">
            Search and discover creators for your promotion.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-3">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creator or city..."
            className="rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
          >
            <option value="All">All Categories</option>
            <option value="Fashion">Fashion</option>
            <option value="Beauty">Beauty</option>
            <option value="Gaming">Gaming</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Education">Education</option>
            <option value="Technology">Technology</option>
            <option value="Comedy">Comedy</option>
            <option value="Fitness">Fitness</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
            className="rounded-xl bg-purple-600 px-5 py-3 font-bold text-white"
          >
            Clear Filters
          </button>

        </div>

        {loading ? (
          <div className="mt-12 text-center text-gray-600">
            Loading creators...
          </div>
        ) : creators.length === 0 ? (
          <div className="mt-12 rounded-3xl bg-white p-10 text-center shadow-sm">

            <p className="text-lg font-semibold">
              No creators registered yet.
            </p>

            <a
              href="/creator"
              className="mt-5 inline-block rounded-xl bg-purple-600 px-6 py-3 font-bold text-white"
            >
              Join as Creator
            </a>

          </div>
        ) : filteredCreators.length === 0 ? (
          <div className="mt-12 rounded-3xl bg-white p-10 text-center shadow-sm">

            <p className="text-lg font-semibold">
              No creators found.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-5 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white"
            >
              Show All Creators
            </button>

          </div>
        ) : (
          <>
            <p className="mt-8 text-gray-600">
              Showing {filteredCreators.length} creator
              {filteredCreators.length !== 1 ? "s" : ""}
            </p>

            <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {filteredCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="rounded-3xl bg-white p-6 shadow-sm"
                >

                  {/* PROFILE PHOTO */}
                  <div className="flex items-center gap-4">

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-purple-100 bg-gray-100">

                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt={creator.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl text-gray-400">
                          👤
                        </span>
                      )}

                    </div>

                    <div className="min-w-0">
                      <h2 className="text-xl font-bold">
                        {creator.name}
                      </h2>

                      <p className="text-sm text-purple-600">
                        {creator.creator_username}
                      </p>
                    </div>

                  </div>

                  {/* PLATFORM */}
                  <div className="mt-4">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                      {creator.platform}
                    </span>
                  </div>

                  {/* STATS */}
                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Followers
                      </p>

                      <p className="font-bold">
                        {creator.followers?.toLocaleString() || "0"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Category
                      </p>

                      <p className="font-bold">
                        {creator.category}
                      </p>
                    </div>

                  </div>

                  {/* CITY */}
                  <p className="mt-4 text-sm text-gray-500">
                    📍 {creator.city}
                  </p>

                  {/* ABOUT */}
                  <p className="mt-4 text-gray-600">
                    {creator.about}
                  </p>

                  {/* AVAILABILITY */}
                  <div className="mt-4">
                    {creator.available_for_promotion !== false ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        🟢 Available for Promotion
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                        🔴 Not Available
                      </span>
                    )}
                  </div>

                  {/* VIEW PROFILE */}
                  <a
                    href={"/creators/" + creator.id}
                    className="mt-6 block rounded-xl bg-purple-600 px-5 py-3 text-center font-bold text-white"
                  >
                    View Profile
                  </a>

                </div>
              ))}

            </div>
          </>
        )}

      </div>
    </main>
  );
}