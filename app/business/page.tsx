"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function BusinessPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [businessId, setBusinessId] = useState<number | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [category, setCategory] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [promotion, setPromotion] = useState("");

  useEffect(() => {
    loadBusinessProfile();
  }, []);

  async function loadBusinessProfile() {
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
      .eq("user_id", user.id)
      .order("id", { ascending: false })
      .limit(1);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const business = data?.[0];

    if (business) {
      setBusinessId(business.id);
      setBusinessName(business.business_name || "");
      setOwnerName(business.owner_name || "");
      setCategory(business.category || "");
      setWebsite(business.website || "");
      setCity(business.city || "");
      setPromotion(business.promotion || "");
    }

    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      alert("Pehle login karo.");
      window.location.href = "/login";
      return;
    }

    let error;

    if (businessId) {
      const result = await supabase
        .from("businesses")
        .update({
          business_name: businessName.trim(),
          owner_name: ownerName.trim(),
          category,
          website: website.trim(),
          city: city.trim(),
          promotion: promotion.trim(),
        })
        .eq("id", businessId)
        .eq("user_id", user.id);

      error = result.error;
    } else {
      const result = await supabase
        .from("businesses")
        .insert({
          user_id: user.id,
          business_name: businessName.trim(),
          owner_name: ownerName.trim(),
          category,
          website: website.trim(),
          city: city.trim(),
          promotion: promotion.trim(),
        })
        .select("id")
        .single();

      error = result.error;

      if (result.data) {
        setBusinessId(result.data.id);
      }
    }

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Business profile successfully save ho gaya!");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-purple-50 px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-lg font-semibold text-purple-700">
            Loading Business Profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <a
          href="/"
          className="text-2xl font-extrabold text-purple-700"
        >
          Promzo
        </a>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-xl md:p-10">
          <div className="text-center">
            <div className="text-5xl">🏢</div>

            <h1 className="mt-4 text-3xl font-extrabold">
              Business Profile
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your business information and promotion requirements.
            </p>
          </div>

          <form onSubmit={handleSave} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block font-semibold">
                Business / Brand Name
              </label>

              <input
                required
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter business name"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Owner / Contact Person
              </label>

              <input
                required
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Business Category
              </label>

              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
              >
                <option value="">Select category</option>
                <option>Fashion</option>
                <option>Beauty</option>
                <option>Food</option>
                <option>Education</option>
                <option>Technology</option>
                <option>Travel</option>
                <option>Gaming</option>
                <option>Finance</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Instagram / Website
              </label>

              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                City
              </label>

              <input
                required
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                What do you want to promote?
              </label>

              <textarea
                required
                rows={4}
                value={promotion}
                onChange={(e) => setPromotion(e.target.value)}
                placeholder="Tell creators about your promotion..."
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-purple-600 px-6 py-4 text-lg font-bold text-white hover:bg-purple-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Business Profile"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Free to join • Direct contact with creators
          </p>
        </div>
      </div>
    </main>
  );
}