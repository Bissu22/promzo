"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<"creator" | "business">("creator");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedRole = params.get("role");

    if (selectedRole === "business") {
      setRole("business");
    } else {
      setRole("creator");
    }
  }, []);

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password) {
      alert("Name, email aur password tino bharo.");
      return;
    }

    if (password.length < 6) {
      alert("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          full_name: name.trim(),
          role: role,
        },
      },
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    if (!data.user) {
      setLoading(false);
      alert("Account create nahi ho paya.");
      return;
    }

    setLoading(false);

    alert(
      role === "creator"
        ? "Creator account successfully create ho gaya!"
        : "Business account successfully create ho gaya!"
    );

    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-6 py-10">
      <div className="mx-auto max-w-md">
        <a
          href="/"
          className="text-2xl font-extrabold text-purple-700"
        >
          Promzo
        </a>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-extrabold">
            Join Promzo as{" "}
            {role === "creator" ? "Creator" : "Business"}
          </h1>

          <p className="mt-2 text-gray-600">
            Create your Promzo account.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block font-semibold">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <button
              type="button"
              onClick={handleSignup}
              disabled={loading}
              className="w-full rounded-xl bg-purple-600 px-5 py-3 font-bold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-bold text-purple-600 hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}