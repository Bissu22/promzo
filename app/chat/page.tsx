"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";

type Person = {
  id: number;
  name: string | null;
  user_id: string;
  type: "creator" | "business";
};

type Message = {
  id: number;
  sender_name: string | null;
  sender_type: string | null;
  receiver_id: number;
  sender_user_id: string;
  receiver_user_id: string;
  message: string;
  created_at: string;
};

function ChatContent() {
  const searchParams = useSearchParams();
  const creatorId = searchParams.get("creator");
  const businessId = searchParams.get("business");

  const [person, setPerson] = useState<Person | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const loadChat = useCallback(async () => {
    setLoading(true);

    if ((!creatorId && !businessId) || (creatorId && businessId)) {
      setPerson(null);
      setMessages([]);
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      window.location.href = "/login";
      return;
    }

    setUserId(user.id);

    let receiver: Person | null = null;

    if (creatorId) {
      const { data, error } = await supabase
        .from("creators")
        .select("id, name, user_id")
        .eq("id", Number(creatorId))
        .single();

      if (error || !data) {
        console.error("Creator load error:", error);
        setLoading(false);
        return;
      }

      receiver = {
        id: data.id,
        name: data.name,
        user_id: data.user_id,
        type: "creator",
      };
    }

    if (businessId) {
      const { data, error } = await supabase
        .from("businesses")
        .select("id, business_name, user_id")
        .eq("id", Number(businessId))
        .single();

      if (error || !data) {
        console.error("Business load error:", error);
        setLoading(false);
        return;
      }

      receiver = {
        id: data.id,
        name: data.business_name,
        user_id: data.user_id,
        type: "business",
      };
    }

    if (!receiver || receiver.user_id === user.id) {
      setPerson(null);
      setLoading(false);
      return;
    }

    setPerson(receiver);

    const { data: blockData, error: blockError } = await supabase
      .from("blocks")
      .select("id")
      .eq("blocker_user_id", user.id)
      .eq("blocked_user_id", receiver.user_id)
      .maybeSingle();

    if (blockError) console.error("Block status error:", blockError);

    setBlocked(Boolean(blockData));

    const { data: myMessages, error: myError } = await supabase
      .from("messages")
      .select("*")
      .eq("sender_user_id", user.id)
      .eq("receiver_user_id", receiver.user_id)
      .order("created_at", { ascending: true });

    const { data: theirMessages, error: theirError } = await supabase
      .from("messages")
      .select("*")
      .eq("sender_user_id", receiver.user_id)
      .eq("receiver_user_id", user.id)
      .order("created_at", { ascending: true });

    if (myError) console.error("Your messages error:", myError);
    if (theirError) console.error("Received messages error:", theirError);

    const combined = [...(myMessages || []), ...(theirMessages || [])];

    const unique = Array.from(
      new Map(combined.map((item) => [item.id, item])).values()
    );

    unique.sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
    );

    setMessages(unique as Message[]);
    setLoading(false);
  }, [creatorId, businessId]);

  useEffect(() => {
    void loadChat();
  }, [loadChat]);

  async function blockUser() {
    if (!person || blocking) return;
    if (!window.confirm("Kya aap is user ko block karna chahte hain?")) return;

    setBlocking(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      alert("Pehle login karein.");
      setBlocking(false);
      return;
    }

    const { error } = await supabase.from("blocks").insert({
      blocker_user_id: user.id,
      blocked_user_id: person.user_id,
    });

    if (error && error.code !== "23505") {
      alert(error.message);
      setBlocking(false);
      return;
    }

    setBlocked(true);
    setMessage("");
    alert("User block ho gaya.");
    setBlocking(false);
  }

  async function unblockUser() {
    if (!person || blocking) return;
    if (!window.confirm("Kya aap is user ko unblock karna chahte hain?")) return;

    setBlocking(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      alert("Pehle login karein.");
      setBlocking(false);
      return;
    }

    const { error } = await supabase
      .from("blocks")
      .delete()
      .eq("blocker_user_id", user.id)
      .eq("blocked_user_id", person.user_id);

    if (error) {
      alert(error.message);
      setBlocking(false);
      return;
    }

    setBlocked(false);
    alert("User unblock ho gaya.");
    setBlocking(false);
  }

  async function reportUser() {
    if (!person || reporting) return;

    const reason = window.prompt(
      "Report ka reason likhein: Fake profile, Scam, Abuse, Spam ya Other"
    );

    if (!reason?.trim()) return;

    const details =
      window.prompt("Report ki details likhein (optional).") || "";

    setReporting(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      alert("Pehle login karein.");
      setReporting(false);
      return;
    }

    const { error } = await supabase.from("reports").insert({
      reporter_user_id: user.id,
      reported_user_id: person.user_id,
      reason: reason.trim(),
      details: details.trim(),
      status: "pending",
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Report submit ho gayi.");
    }

    setReporting(false);
  }

  async function sendMessage() {
    const text = message.trim();

    if (!text || !person || sending || blocked) return;

    setSending(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      alert("Pehle login karein.");
      setSending(false);
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_name: user.user_metadata?.full_name || "User",
        sender_type: person.type === "creator" ? "business" : "creator",
        sender_user_id: user.id,
        receiver_id: person.id,
        receiver_user_id: person.user_id,
        message: text,
      })
      .select("*")
      .single();

    if (error) {
      alert(error.message);
      setSending(false);
      return;
    }

    if (data) setMessages((previous) => [...previous, data as Message]);

    setMessage("");
    setSending(false);
  }

  if (!creatorId && !businessId) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Chat not found</h1>
        <p className="mt-3 text-gray-500">
          Pehle kisi creator ya business ko select karein.
        </p>
        <a
          href="/dashboard"
          className="mt-6 inline-block rounded-xl bg-purple-600 px-5 py-3 font-bold text-white"
        >
          Go to Dashboard
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <header className="flex items-center justify-between">
          <a href="/" className="text-2xl font-extrabold text-purple-700">
            Promzo
          </a>
          <a
            href="/dashboard"
            className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white"
          >
            Dashboard
          </a>
        </header>

        <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="bg-purple-600 p-6 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">
                  Chat with {person?.name || "User"}
                </h1>
                <p className="mt-1 text-purple-100">
                  Yahan message bhejkar baat karein.
                </p>
              </div>

              {person && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={blocked ? unblockUser : blockUser}
                    disabled={blocking || reporting}
                    className={`rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-50 ${
                      blocked ? "bg-green-600" : "bg-red-500"
                    }`}
                  >
                    {blocking
                      ? "Please wait..."
                      : blocked
                        ? "🔓 Unblock"
                        : "🚫 Block"}
                  </button>

                  <button
                    type="button"
                    onClick={reportUser}
                    disabled={reporting || blocking}
                    className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {reporting ? "Reporting..." : "🚨 Report"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {blocked && (
            <div className="border-b border-red-200 bg-red-50 p-4 text-center">
              <p className="font-bold text-red-700">🚫 User Blocked</p>
              <p className="mt-1 text-sm text-red-600">
                Is user ko message nahi bhej sakte.
              </p>
            </div>
          )}

          <div className="h-[400px] overflow-y-auto p-5">
            {loading ? (
              <p className="text-center text-gray-500">
                Messages load ho rahe hain...
              </p>
            ) : !person ? (
              <p className="text-center text-gray-500">
                User nahi mila. Dashboard se dobara kholein.
              </p>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <div className="text-5xl">💬</div>
                  <p className="mt-4 font-semibold text-gray-700">
                    Abhi koi message nahi hai
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Neeche se pehla message bhejein.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((item) => {
                  const isMine = item.sender_user_id === userId;

                  return (
                    <div
                      key={item.id}
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] break-words rounded-2xl px-4 py-3 ${
                          isMine
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{item.message}</p>
                        <p className="mt-1 text-right text-xs opacity-70">
                          {new Date(item.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {!blocked && person && (
            <div className="border-t p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder="Write your message..."
                  className="min-w-0 flex-1 rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
                />
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={sending || !message.trim()}
                  className="rounded-xl bg-purple-600 px-6 py-3 font-bold text-white disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          )}
        </section>

        <a
          href={person?.type === "business" ? "/businesses" : "/creators"}
          className="mt-5 block text-center font-semibold text-gray-500"
        >
          ← Back
        </a>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 p-10 text-center">
          <p className="text-gray-600">Chat load ho raha hai...</p>
        </main>
      }
    >
      <ChatContent />
    </Suspense>
  );
}