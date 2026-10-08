"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

type Creator = {
  id: number;
  user_id: string;
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

type Review = {
  id: number;
  reviewer_user_id: string;
  reviewed_user_id: string;
  rating: number;
  review: string;
  created_at: string;
};

export default function CreatorProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCreator() {
      const { id } = await params;

      const { data: userData } = await supabase.auth.getUser();

      if (userData.user) {
        setUserId(userData.user.id);
      }

      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      setCreator(data as Creator);

      const { data: reviewData, error: reviewError } =
        await supabase
          .from("reviews")
          .select("*")
          .eq("reviewed_user_id", data.user_id)
          .order("created_at", { ascending: false });

      if (reviewError) {
        console.log(reviewError);
      } else {
        setReviews(reviewData || []);
      }

      setLoading(false);
    }

    loadCreator();
  }, [params]);

  async function submitReview() {
    if (!creator || !userId) {
      alert("Please login first.");
      return;
    }

    if (userId === creator.user_id) {
      alert("Aap apne khud ke profile ko review nahi de sakte.");
      return;
    }

    if (!reviewText.trim()) {
      alert("Please review likho.");
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        reviewer_user_id: userId,
        reviewed_user_id: creator.user_id,
        rating: rating,
        review: reviewText.trim(),
      })
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      setReviews((prev) => [data, ...prev]);
    }

    setReviewText("");
    setRating(5);

    alert("Review successfully submit ho gaya!");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-center">
        Loading profile...
      </main>
    );
  }

  if (!creator) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-center">
        <h1 className="text-2xl font-bold">
          Creator not found
        </h1>

        <a
          href="/creators"
          className="mt-5 inline-block rounded-xl bg-purple-600 px-6 py-3 font-bold text-white"
        >
          Back to Creators
        </a>
      </main>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, item) => sum + item.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">

        <div className="flex items-center justify-between">
          <a
            href="/"
            className="text-2xl font-extrabold text-purple-700"
          >
            Promzo
          </a>

          <a
            href="/creators"
            className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white"
          >
            Creators
          </a>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-xl sm:p-8">

          {/* PROFILE HEADER */}

          <div className="text-center">

            <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-purple-100 bg-purple-50">

              {creator.avatar_url ? (
                <img
                  src={creator.avatar_url}
                  alt={creator.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-5xl">
                  👤
                </span>
              )}

            </div>

            <h1 className="mt-5 text-3xl font-extrabold text-gray-900">
              {creator.name}
            </h1>

            <p className="mt-1 text-purple-600">
              {creator.creator_username}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">

              <span className="rounded-full bg-purple-100 px-4 py-2 font-semibold text-purple-700">
                {creator.platform}
              </span>

              {creator.available_for_promotion ? (
                <span className="rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">
                  🟢 Available for Promotion
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-4 py-2 font-bold text-gray-600">
                  🔴 Not Available
                </span>
              )}

            </div>

          </div>

          {/* BASIC INFO */}

          <div className="mt-8 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl bg-gray-50 p-5 text-center">
              <p className="text-sm text-gray-500">
                Followers
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {creator.followers?.toLocaleString() || "0"}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5 text-center">
              <p className="text-sm text-gray-500">
                Category
              </p>

              <p className="mt-1 font-bold text-gray-900">
                {creator.category}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5 text-center">
              <p className="text-sm text-gray-500">
                City
              </p>

              <p className="mt-1 font-bold text-gray-900">
                {creator.city}
              </p>
            </div>

          </div>

          {/* ABOUT */}

          <div className="mt-8 rounded-2xl bg-gray-50 p-6">

            <h2 className="text-xl font-bold text-gray-900">
              About Creator
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {creator.about || "No information added yet."}
            </p>

          </div>

          {/* RATING SUMMARY */}

          <div className="mt-8 rounded-2xl bg-purple-50 p-6 text-center">

            <h2 className="text-xl font-bold text-gray-900">
              ⭐ Creator Rating
            </h2>

            <p className="mt-2 text-4xl font-extrabold text-purple-700">
              {averageRating}
            </p>

            <p className="mt-1 text-xl text-yellow-500">
              {"★".repeat(Math.round(Number(averageRating)))}
              {"☆".repeat(
                5 - Math.round(Number(averageRating))
              )}
            </p>

            <p className="mt-1 text-gray-600">
              {reviews.length} review
              {reviews.length !== 1 ? "s" : ""}
            </p>

          </div>

          {/* BUTTONS */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">

            {creator.profile_link ? (
              <a
                href={creator.profile_link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-purple-600 px-6 py-4 text-center font-bold text-purple-600 hover:bg-purple-50"
              >
                📱 View Social Profile
              </a>
            ) : (
              <div className="rounded-xl border-2 border-gray-200 px-6 py-4 text-center font-bold text-gray-400">
                Social Profile Not Added
              </div>
            )}

            <a
              href={"/chat?creator=" + creator.id}
              className="rounded-xl bg-purple-600 px-6 py-4 text-center font-bold text-white hover:bg-purple-700"
            >
              💬 Contact Creator
            </a>

          </div>

          {/* GIVE REVIEW */}

          <div className="mt-10 rounded-2xl border p-6">

            <h2 className="text-xl font-bold">
              ⭐ Give a Review
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Apna experience share karein.
            </p>

            <div className="mt-5">

              <p className="mb-2 font-semibold">
                Your Rating
              </p>

              <div className="flex gap-2 text-3xl">

                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={
                      star <= rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </button>
                ))}

              </div>

            </div>

            <textarea
              value={reviewText}
              onChange={(e) =>
                setReviewText(e.target.value)
              }
              placeholder="Write your review..."
              rows={4}
              className="mt-5 w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
            />

            <button
              type="button"
              onClick={submitReview}
              disabled={submitting}
              className="mt-4 w-full rounded-xl bg-purple-600 px-5 py-3 font-bold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Review"}
            </button>

          </div>

          {/* REVIEWS */}

          <div className="mt-10">

            <h2 className="text-xl font-bold">
              Reviews
            </h2>

            {reviews.length === 0 ? (
              <div className="mt-4 rounded-xl bg-gray-50 p-5 text-center text-gray-500">
                Abhi koi review nahi hai.
              </div>
            ) : (
              <div className="mt-4 space-y-4">

                {reviews.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-gray-50 p-5"
                  >

                    <div className="flex items-center justify-between">

                      <div className="text-lg text-yellow-500">
                        {"★".repeat(item.rating)}
                        {"☆".repeat(5 - item.rating)}
                      </div>

                      <span className="text-xs text-gray-400">
                        {new Date(
                          item.created_at
                        ).toLocaleDateString()}
                      </span>

                    </div>

                    <p className="mt-3 text-gray-700">
                      {item.review}
                    </p>

                  </div>
                ))}

              </div>
            )}

          </div>

          <a
            href="/creators"
            className="mt-8 block text-center font-semibold text-gray-500"
          >
            ← Back to Creators
          </a>

        </div>
      </div>
    </main>
  );
}