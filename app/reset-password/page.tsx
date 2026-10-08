"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function setupResetSession() {
      try {
        const url = new URL(window.location.href);

        // 1. PKCE reset link
        const code = url.searchParams.get("code");

        if (code) {
          const { error } =
            await supabase.auth.exchangeCodeForSession(code);

          if (!error) {
            setValid(true);
            setLoading(false);
            return;
          }
        }

        // 2. Implicit reset link
        const hash = window.location.hash;

        if (hash) {
          const params = new URLSearchParams(
            hash.substring(1)
          );

          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

            if (!error) {
              setValid(true);
              setLoading(false);
              return;
            }
          }
        }

        // 3. Already existing session
        const { data } =
          await supabase.auth.getSession();

        if (data.session) {
          setValid(true);
        } else {
          setValid(false);
        }
      } catch (error) {
        console.error("Reset session error:", error);
        setValid(false);
      }

      setLoading(false);
    }

    setupResetSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          (event === "PASSWORD_RECOVERY" ||
            event === "SIGNED_IN") &&
          session
        ) {
          setValid(true);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleReset() {
    if (!password || !confirmPassword) {
      alert("Dono password bharo.");
      return;
    }

    if (password.length < 6) {
      alert("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Dono password same nahi hain.");
      return;
    }

    setSaving(true);

    const { error } =
      await supabase.auth.updateUser({
        password: password,
      });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setMessage("✅ Password successfully change ho gaya.");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Checking reset link...
          </h1>

          <p className="mt-2 text-gray-600">
            Please wait...
          </p>
        </div>
      </main>
    );
  }

  if (!valid) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600">
            ⚠️ Reset Link Invalid
          </h1>

          <p className="mt-3 text-gray-600">
            Reset link expire ho gayi hai ya valid session nahi mila.
          </p>

          <a
            href="/login"
            className="mt-6 block rounded-xl bg-purple-600 px-5 py-3 font-bold text-white"
          >
            Back to Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center">
          Reset Password
        </h1>

        <p className="mt-2 text-center text-gray-600">
          Apna naya password set karo.
        </p>

        <div className="mt-6">
          <label className="font-semibold">
            New Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="mt-2 w-full rounded-xl border px-4 py-3"
            placeholder="New password"
          />
        </div>

        <div className="mt-4">
          <label className="font-semibold">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="mt-2 w-full rounded-xl border px-4 py-3"
            placeholder="Confirm password"
          />
        </div>

        <button
          onClick={handleReset}
          disabled={saving}
          className="mt-6 w-full rounded-xl bg-purple-600 px-5 py-3 font-bold text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p className="mt-4 text-center font-semibold text-green-600">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}