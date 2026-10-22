"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Email aur password dono bharo.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      setLoading(false);
      alert("User details nahi milin. Dobara login karo.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    setLoading(false);

    if (profileError) {
      alert("Profile check nahi ho paya: " + profileError.message);
      return;
    }

    if (profile?.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/";
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      alert("Pehle apna email address bharo.");
      return;
    }

    setResetting(true);

    const redirectUrl = window.location.origin + "/reset-password";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    setResetting(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password reset link aapke Gmail par bhej diya gaya hai.");
  }

  function goToSignup() {
    window.location.assign("/signup");
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
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-600">
            Login to your Promzo account.
          </p>

          <div className="mt-8 space-y-5">
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
                placeholder="Enter your password"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-xl bg-purple-600 px-5 py-3 font-bold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetting}
              className="w-full text-center font-semibold text-purple-600 hover:underline"
            >
              {resetting
                ? "Sending reset link..."
                : "Forgot Password?"}
            </button>
          </div>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={goToSignup}
              className="font-bold text-purple-600 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}