"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

type Creator = {
  id: number;
  name: string | null;
  creator_username: string | null;
  platform: string | null;
  profile_link: string | null;
  followers: number | null;
  category: string | null;
  city: string | null;
  about: string | null;
  user_id: string | null;
  avatar_url: string | null;
  available_for_promotion: boolean;
};

export default function CreatorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [creatorId, setCreatorId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [profileLink, setProfileLink] = useState("");
  const [followers, setFollowers] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [about, setAbout] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [availableForPromotion, setAvailableForPromotion] =
    useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);

    const result = await supabase.auth.getUser();
    const user = result.data.user;

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setCurrentUserId(user.id);

    const response = await supabase
      .from("creators")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false })
      .limit(1);

    if (response.error) {
      setLoading(false);
      alert(response.error.message);
      return;
    }

    if (response.data && response.data.length > 0) {
      const creator = response.data[0] as Creator;

      setCreatorId(creator.id);
      setName(creator.name || "");
      setUsername(creator.creator_username || "");
      setPlatform(creator.platform || "Instagram");
      setProfileLink(creator.profile_link || "");
      setFollowers(
        creator.followers !== null
          ? String(creator.followers)
          : ""
      );
      setCategory(creator.category || "");
      setCity(creator.city || "");
      setAbout(creator.about || "");
      setAvatarUrl(creator.avatar_url || "");

      setAvailableForPromotion(
        creator.available_for_promotion !== false
      );
    }

    setLoading(false);
  }

  async function uploadAvatar(file: File) {
    if (!currentUserId) {
      alert("User account not found.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size 5MB se kam honi chahiye.");
      return;
    }

    setUploading(true);

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = currentUserId + "/avatar." + extension;

    const uploadResult = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadResult.error) {
      setUploading(false);
      alert(uploadResult.error.message);
      return;
    }

    const publicResult = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const newAvatarUrl = publicResult.data.publicUrl;

    setAvatarUrl(newAvatarUrl);

    if (creatorId) {
      const updateResult = await supabase
        .from("creators")
        .update({
          avatar_url: newAvatarUrl,
        })
        .eq("id", creatorId)
        .eq("user_id", currentUserId);

      if (updateResult.error) {
        setUploading(false);
        alert(updateResult.error.message);
        return;
      }
    }

    setUploading(false);
    alert("Profile photo uploaded successfully!");
  }

  async function saveProfile() {
    if (!currentUserId) {
      alert("User account not found.");
      return;
    }

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!username.trim()) {
      alert("Please enter your creator username.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!city.trim()) {
      alert("Please enter your city.");
      return;
    }

    setSaving(true);

    const creatorData = {
      user_id: currentUserId,
      name: name.trim(),
      creator_username: username.trim(),
      platform,
      profile_link: profileLink.trim(),
      followers: Number(followers) || 0,
      category,
      city: city.trim(),
      about: about.trim(),
      avatar_url: avatarUrl || null,
      available_for_promotion: availableForPromotion,
    };

    let saveError = null;

    if (creatorId) {
      const updateResult = await supabase
        .from("creators")
        .update(creatorData)
        .eq("id", creatorId)
        .eq("user_id", currentUserId);

      saveError = updateResult.error;
    } else {
      const insertResult = await supabase
        .from("creators")
        .insert(creatorData);

      saveError = insertResult.error;
    }

    setSaving(false);

    if (saveError) {
      alert(saveError.message);
      return;
    }

    alert(
      creatorId
        ? "Creator profile updated successfully!"
        : "Creator registration successfully complete!"
    );

    window.location.href = "/dashboard";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a
            href="/"
            className="text-2xl font-extrabold text-purple-700"
          >
            Promzo
          </a>

          <div className="flex flex-wrap gap-2">
            <a
              href="/businesses"
              className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
            >
              Find a Business
            </a>

            <a
              href="/dashboard"
              className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white"
            >
              Dashboard
            </a>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900">
            {creatorId
              ? "My Creator Profile"
              : "Register as Creator"}
          </h1>

          <p className="mt-2 text-gray-500">
            {creatorId
              ? "Update your profile so businesses can find and contact you."
              : "Complete your creator profile so businesses can find you on Promzo."}
          </p>

          {/* PROFILE PHOTO */}
          <div className="mt-8 flex flex-col items-center">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-purple-100 bg-gray-100">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-5xl text-gray-400">
                  👤
                </span>
              )}
            </div>

            <label className="mt-4 cursor-pointer rounded-xl bg-purple-600 px-5 py-3 font-bold text-white hover:bg-purple-700">
              {uploading
                ? "Uploading..."
                : "📷 Upload Profile Photo"}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    uploadAvatar(file);
                  }

                  event.target.value = "";
                }}
              />
            </label>

            <p className="mt-2 text-sm text-gray-500">
              JPG, PNG or WEBP • Maximum 5MB
            </p>
          </div>

          {/* PROMOTION AVAILABILITY */}
          <div className="mt-8 rounded-2xl border bg-gray-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-gray-900">
                  Promotion Availability
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Businesses ko batayein ki aap promotion
                  ke liye available hain ya nahi.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAvailableForPromotion(!availableForPromotion)
                }
                className={
                  availableForPromotion
                    ? "rounded-full bg-green-500 px-5 py-3 font-bold text-white"
                    : "rounded-full bg-gray-400 px-5 py-3 font-bold text-white"
                }
              >
                {availableForPromotion
                  ? "🟢 Available"
                  : "🔴 Not Available"}
              </button>
            </div>
          </div>

          {/* PROFILE FORM */}
          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block font-semibold">
                Name *
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Creator Username *
              </label>

              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Platform
              </label>

              <select
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
              >
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="Facebook">Facebook</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Profile Link
              </label>

              <input
                value={profileLink}
                onChange={(event) => setProfileLink(event.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
                placeholder="https://instagram.com/username"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Followers
              </label>

              <input
                type="number"
                value={followers}
                onChange={(event) => setFollowers(event.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
                placeholder="10000"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Category *
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
              >
                <option value="">Select Category</option>
                <option value="Fashion">Fashion</option>
                <option value="Beauty">Beauty</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Technology">Technology</option>
                <option value="Fitness">Fitness</option>
                <option value="Gaming">Gaming</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                City *
              </label>

              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
                placeholder="Your city"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                About
              </label>

              <textarea
                value={about}
                onChange={(event) => setAbout(event.target.value)}
                rows={5}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
                placeholder="Tell businesses about yourself..."
              />
            </div>

            <button
              type="button"
              onClick={saveProfile}
              disabled={saving || uploading}
              className="w-full rounded-xl bg-purple-600 px-6 py-4 text-lg font-bold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : creatorId
                ? "Update Profile"
                : "Register Creator"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}