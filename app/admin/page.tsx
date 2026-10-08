"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [creators, setCreators] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      setLoading(false);
      setAllowed(false);
      return;
    }

    setAllowed(true);

    await loadAdminData();

    setLoading(false);
  }

  async function loadAdminData() {
    const { data: creatorData } = await supabase
      .from("creators")
      .select("*")
      .order("id", { ascending: false });

    const { data: businessData } = await supabase
      .from("businesses")
      .select("*")
      .order("id", { ascending: false });

    const { data: reportData } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: blockData } = await supabase
      .from("blocks")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*");

    setCreators(creatorData || []);
    setBusinesses(businessData || []);
    setReports(reportData || []);
    setBlocks(blockData || []);
    setProfiles(profileData || []);
  }

  function getProfile(userId: string) {
    return profiles.find((profile) => profile.id === userId);
  }

  async function changeUserStatus(
    userId: string,
    newStatus: "active" | "suspended"
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Admin login session nahi mili.");
      return;
    }

    if (user.id === userId && newStatus === "suspended") {
      alert("❌ Admin apne account ko suspend nahi kar sakta.");
      return;
    }

    const { data: targetProfile, error: targetError } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

    if (targetError) {
      alert(targetError.message);
      return;
    }

    if (
      targetProfile?.role === "admin" &&
      newStatus === "suspended"
    ) {
      alert("❌ Admin account ko suspend nahi kiya ja sakta.");
      return;
    }

    const message =
      newStatus === "suspended"
        ? "Kya aap is user ko suspend karna chahte ho?"
        : "Kya aap is user ko dobara activate karna chahte ho?";

    const confirmed = window.confirm(message);

    if (!confirmed) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        status: newStatus,
      })
      .eq("id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      newStatus === "suspended"
        ? "User suspended successfully."
        : "User activated successfully."
    );

    await loadAdminData();
  }

  async function resolveReport(reportId: number) {
    const confirmed = window.confirm(
      "Kya aap is report ko resolved mark karna chahte ho?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("reports")
      .update({
        status: "resolved",
      })
      .eq("id", reportId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Report resolved successfully.");

    await loadAdminData();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-bold">
          Loading Admin Panel...
        </div>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <div className="text-5xl mb-4">🚫</div>

          <h1 className="text-2xl font-bold text-red-600">
            Access Denied
          </h1>

          <p className="text-gray-600 mt-2">
            Sirf Admin is page ko access kar sakta hai.
          </p>

          <a
            href="/"
            className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-xl font-bold"
          >
            Go Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-black text-white rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="text-sm text-gray-300">
                Promzo Administration
              </p>

              <h1 className="text-3xl font-bold mt-1">
                Admin Panel 🛡️
              </h1>
            </div>

            <div className="flex gap-3">

              <a
                href="/dashboard"
                className="bg-white text-black px-5 py-3 rounded-xl font-bold"
              >
                Dashboard
              </a>

              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
                className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold"
              >
                Logout
              </button>

            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Creators
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {creators.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Businesses
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {businesses.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Reports
            </p>

            <h2 className="text-3xl font-bold mt-2 text-red-600">
              {reports.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Blocks
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {blocks.length}
            </h2>
          </div>

        </div>

        {/* Creators */}
        <section className="bg-white rounded-2xl shadow p-5 mb-8">

          <h2 className="text-2xl font-bold mb-5">
            👤 Creators
          </h2>

          {creators.length === 0 ? (
            <p className="text-gray-500">
              No creators found.
            </p>
          ) : (
            <div className="space-y-3">

              {creators.map((creator) => {
                const profile = getProfile(creator.user_id);
                const status = profile?.status || "active";
                const isAdmin = profile?.role === "admin";

                return (
                  <div
                    key={creator.id}
                    className="border rounded-xl p-4"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>
                        <h3 className="font-bold text-lg">
                          {creator.name || "No Name"}
                        </h3>

                        <p className="text-gray-600">
                          @{creator.creator_username || "username"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {creator.platform || "N/A"} •{" "}
                          {creator.category || "N/A"} •{" "}
                          {creator.city || "N/A"}
                        </p>

                        <div className="mt-2">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              status === "suspended"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {status === "suspended"
                              ? "Suspended"
                              : "Active"}
                          </span>

                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">

                        <a
                          href={"/creators/" + creator.id}
                          className="bg-black text-white px-4 py-2 rounded-lg font-bold"
                        >
                          View
                        </a>

                        {creator.user_id && !isAdmin && (
                          <button
                            onClick={() =>
                              changeUserStatus(
                                creator.user_id,
                                status === "suspended"
                                  ? "active"
                                  : "suspended"
                              )
                            }
                            className={`px-4 py-2 rounded-lg font-bold text-white ${
                              status === "suspended"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {status === "suspended"
                              ? "🟢 Activate"
                              : "🔴 Suspend"}
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* Businesses */}
        <section className="bg-white rounded-2xl shadow p-5 mb-8">

          <h2 className="text-2xl font-bold mb-5">
            🏢 Businesses
          </h2>

          {businesses.length === 0 ? (
            <p className="text-gray-500">
              No businesses found.
            </p>
          ) : (
            <div className="space-y-3">

              {businesses.map((business) => {
                const profile = getProfile(business.user_id);
                const status = profile?.status || "active";
                const isAdmin = profile?.role === "admin";

                return (
                  <div
                    key={business.id}
                    className="border rounded-xl p-4"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>
                        <h3 className="font-bold text-lg">
                          {business.business_name ||
                            "No Business Name"}
                        </h3>

                        <p className="text-gray-600">
                          Owner:{" "}
                          {business.owner_name || "N/A"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {business.category || "N/A"} •{" "}
                          {business.city || "N/A"}
                        </p>

                        <div className="mt-2">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              status === "suspended"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {status === "suspended"
                              ? "Suspended"
                              : "Active"}
                          </span>

                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">

                        <a
                          href={"/businesses/" + business.id}
                          className="bg-black text-white px-4 py-2 rounded-lg font-bold"
                        >
                          View
                        </a>

                        {business.user_id && !isAdmin && (
                          <button
                            onClick={() =>
                              changeUserStatus(
                                business.user_id,
                                status === "suspended"
                                  ? "active"
                                  : "suspended"
                              )
                            }
                            className={`px-4 py-2 rounded-lg font-bold text-white ${
                              status === "suspended"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {status === "suspended"
                              ? "🟢 Activate"
                              : "🔴 Suspend"}
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* Reports */}
        <section className="bg-white rounded-2xl shadow p-5 mb-8">

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-2xl font-bold">
              🚨 Reports
            </h2>

            <span className="text-sm text-gray-500">
              {reports.length} Total
            </span>

          </div>

          {reports.length === 0 ? (
            <p className="text-gray-500">
              No reports yet.
            </p>
          ) : (
            <div className="space-y-4">

              {reports.map((report) => {
                const resolved = report.status === "resolved";

                return (
                  <div
                    key={report.id}
                    className={`border rounded-xl p-4 ${
                      resolved
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >

                    <div className="flex flex-col md:flex-row md:justify-between gap-3">

                      <div>
                        <p className="font-bold">
                          Reason:{" "}
                          <span className="text-red-700">
                            {report.reason || "N/A"}
                          </span>
                        </p>

                        <p className="mt-2 text-gray-700">
                          Details:{" "}
                          {report.details || "No details"}
                        </p>
                      </div>

                      <span
                        className={`h-fit px-3 py-1 rounded-full text-sm font-bold ${
                          resolved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {resolved ? "Resolved" : "Pending"}
                      </span>

                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">

                      <p className="text-xs text-gray-500">
                        Report ID: {report.id}
                      </p>

                      <p className="text-xs text-gray-500">
                        {report.created_at
                          ? new Date(
                              report.created_at
                            ).toLocaleString()
                          : "N/A"}
                      </p>

                    </div>

                    {!resolved && (
                      <button
                        onClick={() => resolveReport(report.id)}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-bold"
                      >
                        ✅ Mark as Resolved
                      </button>
                    )}

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* Blocks */}
        <section className="bg-white rounded-2xl shadow p-5 mb-8">

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-2xl font-bold">
              🚫 Blocks
            </h2>

            <span className="text-sm text-gray-500">
              {blocks.length} Total
            </span>

          </div>

          {blocks.length === 0 ? (
            <p className="text-gray-500">
              No blocks found.
            </p>
          ) : (
            <div className="space-y-3">

              {blocks.map((block) => (
                <div
                  key={block.id}
                  className="border rounded-xl p-4"
                >

                  <p className="font-bold">
                    Block ID: {block.id}
                  </p>

                  <p className="text-sm text-gray-600 mt-1 break-all">
                    Blocker: {block.blocker_user_id}
                  </p>

                  <p className="text-sm text-gray-600 break-all">
                    Blocked: {block.blocked_user_id}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {block.created_at
                      ? new Date(
                          block.created_at
                        ).toLocaleString()
                      : "N/A"}
                  </p>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}