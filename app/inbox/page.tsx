"use client";

import { useEffect, useState } from "react";
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
  is_read: boolean;
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("receiver_user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      alert(error.message);
      setLoading(false);
      return;
    }

    setMessages((data || []) as Message[]);
    setLoading(false);
  }

  async function markAsRead(messageId: number) {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", messageId);

    if (error) {
      console.log(error);
      return;
    }

    setMessages((oldMessages) =>
      oldMessages.map((item) =>
        item.id === messageId
          ? { ...item, is_read: true }
          : item
      )
    );
  }

  async function openReply(item: Message) {
    // Message ko read mark karo
    if (!item.is_read) {
      await markAsRead(item.id);
    }

    const senderType = item.sender_type.toLowerCase();

    if (senderType === "creator") {
      const { data, error } = await supabase
        .from("creators")
        .select("id")
        .eq("user_id", item.sender_user_id)
        .order("id", { ascending: false })
        .limit(1);

      if (error) {
        alert("Creator profile error: " + error.message);
        return;
      }

      if (!data || data.length === 0) {
        alert("Creator profile nahi mila.");
        return;
      }

      window.location.href =
        "/chat?creator=" + data[0].id;

      return;
    }

    if (senderType === "business") {
      const { data, error } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", item.sender_user_id)
        .order("id", { ascending: false })
        .limit(1);

      if (error) {
        alert("Business profile error: " + error.message);
        return;
      }

      if (!data || data.length === 0) {
        alert(
          "Business profile nahi mila. Is Business account ki profile database me check karni hogi."
        );
        return;
      }

      window.location.href =
        "/chat?business=" + data[0].id;

      return;
    }

    alert("Sender type identify nahi ho paya.");
  }

  const unreadCount = messages.filter(
    (item) => !item.is_read
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">

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

        {/* Title */}

        <div className="mt-8">

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-3xl font-extrabold text-gray-900">
              My Inbox
            </h1>

            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                {unreadCount} New
              </span>
            )}

          </div>

          <p className="mt-2 text-gray-600">
            Yahan aapko creators aur businesses ke messages milenge.
          </p>

        </div>

        {/* Messages */}

        {loading ? (

          <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">

            <p className="text-gray-500">
              Loading messages...
            </p>

          </div>

        ) : messages.length === 0 ? (

          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              📩
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No messages yet
            </h2>

            <p className="mt-2 text-gray-500">
              Jab koi creator ya business aapko message karega,
              woh yahan dikhai dega.
            </p>

          </div>

        ) : (

          <div className="mt-8 space-y-4">

            {messages.map((item) => (

              <div
                key={item.id}
                className={
                  "rounded-2xl p-5 shadow-sm transition " +
                  (item.is_read
                    ? "bg-white"
                    : "border-2 border-purple-200 bg-purple-50")
                }
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div>

                      <h2 className="font-bold text-gray-900">
                        {item.sender_name}
                      </h2>

                      <p className="mt-1 text-sm font-semibold capitalize text-purple-600">
                        {item.sender_type}
                      </p>

                    </div>

                    {!item.is_read && (
                      <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-extrabold text-white">
                        NEW
                      </span>
                    )}

                  </div>

                  <p className="text-right text-xs text-gray-400">
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </p>

                </div>

                <p
                  className={
                    "mt-4 rounded-xl p-4 " +
                    (item.is_read
                      ? "bg-gray-50 text-gray-700"
                      : "bg-white font-semibold text-gray-800")
                  }
                >
                  {item.message}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={() => openReply(item)}
                    className="rounded-xl bg-purple-600 px-5 py-3 font-bold text-white hover:bg-purple-700"
                  >
                    💬 Reply
                  </button>

                  {!item.is_read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      className="rounded-xl border border-purple-600 px-5 py-3 font-bold text-purple-600 hover:bg-purple-100"
                    >
                      ✓ Mark as Read
                    </button>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

        <a
          href="/dashboard"
          className="mt-6 block text-center font-semibold text-gray-500"
        >
          ← Back to Dashboard
        </a>

      </div>
    </main>
  );
}