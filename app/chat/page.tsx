"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";

type Message = {
  id: number;
  sender_name: string;
  sender_type: string;
  receiver_id: number;
  sender_user_id: string;
  receiver_user_id: string;
  message: string;
  created_at: string;
};

type Person = {
  id: number;
  name: string | null;
  user_id: string;
  type: "creator" | "business";
};

export default function ChatPage() {
  const searchParams = useSearchParams();

  const creatorId = searchParams.get("creator");
  const businessId = searchParams.get("business");

  const [person, setPerson] = useState<Person | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    loadChat();
  }, [creatorId, businessId]);

  async function loadChat() {
    if (!creatorId && !businessId) {
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
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
        console.log(error);
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
        console.log(error);
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

    if (!receiver) {
      setLoading(false);
      return;
    }

    setPerson(receiver);

    // Check block status

    const { data: blockData, error: blockError } = await supabase
      .from("blocks")
      .select("id")
      .eq("blocker_user_id", user.id)
      .eq("blocked_user_id", receiver.user_id)
      .maybeSingle();

    if (blockError) {
      console.log(blockError);
    }

    setBlocked(!!blockData);

    // Load my messages

    const { data: myMessages, error: myError } = await supabase
      .from("messages")
      .select("*")
      .eq("sender_user_id", user.id)
      .eq("receiver_user_id", receiver.user_id)
      .order("created_at", { ascending: true });

    // Load their messages

    const { data: theirMessages, error: theirError } = await supabase
      .from("messages")
      .select("*")
      .eq("sender_user_id", receiver.user_id)
      .eq("receiver_user_id", user.id)
      .order("created_at", { ascending: true });

    if (myError) {
      console.log(myError);
    }

    if (theirError) {
      console.log(theirError);
    }

    const allMessages = [
      ...(myMessages || []),
      ...(theirMessages || []),
    ];

    const uniqueMessages = Array.from(
      new Map(
        allMessages.map((item) => [item.id, item])
      ).values()
    );

    uniqueMessages.sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
    );

    setMessages(uniqueMessages);
    setLoading(false);
  }

  // Block user

  async function blockUser() {
    if (!person || blocking) {
      return;
    }

    const confirmBlock = window.confirm(
      "Are you sure you want to block this user?"
    );

    if (!confirmBlock) {
      return;
    }

    setBlocking(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setBlocking(false);
      return;
    }

    const { error } = await supabase
      .from("blocks")
      .insert({
        blocker_user_id: user.id,
        blocked_user_id: person.user_id,
      });

    if (error) {
      if (error.code === "23505") {
        setBlocked(true);
        alert("This user is already blocked.");
      } else {
        alert(error.message);
      }

      setBlocking(false);
      return;
    }

    setBlocked(true);
    setMessage("");

    alert("User blocked successfully.");

    setBlocking(false);
  }

  // Unblock user

  async function unblockUser() {
    if (!person || blocking) {
      return;
    }

    const confirmUnblock = window.confirm(
      "Are you sure you want to unblock this user?"
    );

    if (!confirmUnblock) {
      return;
    }

    setBlocking(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
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

    alert("User unblocked successfully.");

    setBlocking(false);
  }

  // Report user

  async function reportUser() {
    if (!person || reporting) {
      return;
    }

    const reason = window.prompt(
      "Why do you want to report this user?\n\nExamples: Fake profile, Scam, Abuse, Spam, Other"
    );

    if (!reason || !reason.trim()) {
      return;
    }

    const details = window.prompt(
      "Please provide some details about the report. You can leave this blank."
    );

    setReporting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setReporting(false);
      return;
    }

    const { error } = await supabase
      .from("reports")
      .insert({
        reporter_user_id: user.id,
        reported_user_id: person.user_id,
        reason: reason.trim(),
        details: details?.trim() || "",
        status: "pending",
      });

    if (error) {
      alert(error.message);
      setReporting(false);
      return;
    }

    alert("Report submitted successfully.");

    setReporting(false);
  }

  // Send message

  async function sendMessage() {
    if (!message.trim() || !person || sending || blocked) {
      return;
    }

    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setSending(false);
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_name:
          user.user_metadata?.full_name || "User",

        sender_type:
          person.type === "creator"
            ? "business"
            : "creator",

        sender_user_id: user.id,

        receiver_id: person.id,

        receiver_user_id: person.user_id,

        message: message.trim(),
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      setSending(false);
      return;
    }

    if (data) {
      setMessages((oldMessages) => [
        ...oldMessages,
        data,
      ]);
    }

    setMessage("");
    setSending(false);
  }

  // Chat not found

  if (!creatorId && !businessId) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-center">

        <h1 className="text-3xl font-bold text-gray-900">
          Chat not found
        </h1>

        <p className="mt-3 text-gray-500">
          Please select a creator or business first.
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

        {/* Header */}

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

        {/* Chat */}

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">

          {/* Chat Header */}

          <div className="bg-purple-600 p-6 text-white">

            <div className="flex items-center justify-between gap-4">

              <div>

                <h1 className="text-2xl font-bold">
                  Chat with {person?.name || "User"}
                </h1>

                <p className="mt-1 text-purple-100">
                  Send a message and start the conversation.
                </p>

              </div>

              {person && (
                <div className="flex flex-wrap justify-end gap-2">

                  {!blocked ? (
                    <button
                      type="button"
                      onClick={blockUser}
                      disabled={blocking || reporting}
                      className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {blocking ? "Blocking..." : "🚫 Block"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={unblockUser}
                      disabled={blocking || reporting}
                      className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-50"
                    >
                      {blocking ? "Unblocking..." : "🔓 Unblock"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={reportUser}
                    disabled={reporting || blocking}
                    className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                  >
                    {reporting ? "Reporting..." : "🚨 Report"}
                  </button>

                </div>
              )}

            </div>

          </div>

          {/* Blocked Message */}

          {blocked && (
            <div className="border-b border-red-200 bg-red-50 p-4 text-center">

              <p className="font-bold text-red-700">
                🚫 User Blocked
              </p>

              <p className="mt-1 text-sm text-red-600">
                You cannot send messages to this user.
              </p>

            </div>
          )}

          {/* Messages */}

          <div className="h-[400px] overflow-y-auto p-5">

            {loading ? (

              <p className="text-center text-gray-500">
                Loading messages...
              </p>

            ) : messages.length === 0 ? (

              <div className="flex h-full items-center justify-center text-center">

                <div>

                  <div className="text-5xl">
                    💬
                  </div>

                  <p className="mt-4 font-semibold text-gray-700">
                    No messages yet
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Start the conversation below.
                  </p>

                </div>

              </div>

            ) : (

              <div className="space-y-4">

                {messages.map((item) => {

                  const isMine =
                    item.sender_user_id === userId;

                  return (
                    <div
                      key={
                        item.id +
                        "-" +
                        item.sender_user_id
                      }
                      className={
                        "flex " +
                        (isMine
                          ? "justify-end"
                          : "justify-start")
                      }
                    >

                      <div
                        className={
                          "max-w-[80%] rounded-2xl px-4 py-3 " +
                          (isMine
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-800")
                        }
                      >

                        <p>
                          {item.message}
                        </p>

                        <p className="mt-1 text-right text-xs opacity-60">
                          {new Date(
                            item.created_at
                          ).toLocaleTimeString([], {
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

          {/* Message Input */}

          {!blocked && (
            <div className="border-t p-4">

              <div className="flex gap-3">

                <input
                  type="text"
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  placeholder="Write your message..."
                  className="flex-1 rounded-xl border px-4 py-3 outline-none focus:border-purple-600"
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={sending}
                  className="rounded-xl bg-purple-600 px-6 py-3 font-bold text-white disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send"}
                </button>

              </div>

            </div>
          )}

        </div>

        {/* Back */}

        <a
          href={
            person?.type === "business"
              ? "/businesses"
              : "/creators"
          }
          className="mt-5 block text-center font-semibold text-gray-500"
        >
          ← Back
        </a>

      </div>

    </main>
  );
}