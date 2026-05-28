"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Mail,
  Trash2,
  CheckCheck,
  Clock,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { FullPageSpinner } from "@/components/ui/Spinner";
import toast from "react-hot-toast";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  unread:  "bg-amber-100 text-amber-700 border border-amber-200",
  read:    "bg-blue-100 text-blue-700 border border-blue-200",
  replied: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

const STATUS_LABELS: Record<string, string> = {
  unread:  "Unread",
  read:    "Read",
  replied: "Replied",
};

export default function AdminMessagesPage() {
  const [messages, setMessages]       = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected]       = useState<ContactMessage | null>(null);
  const [updating, setUpdating]       = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? `?status=${statusFilter}` : "";
      const res = await api.get(`${API_ENDPOINTS.ADMIN_CONTACTS}${params}`);
      setMessages(res.data.data?.contacts || []);
      setUnreadCount(res.data.data?.unreadCount || 0);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdating(id);
      await api.patch(API_ENDPOINTS.ADMIN_CONTACT_STATUS(id), { status });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: status as any } : m))
      );
      if (selected?._id === id) setSelected((s) => s ? { ...s, status: status as any } : s);
      if (status !== "unread") setUnreadCount((c) => Math.max(0, c - 1));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    try {
      await api.delete(API_ENDPOINTS.ADMIN_CONTACT_DELETE(id));
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const openMessage = (msg: ContactMessage) => {
    setSelected(msg);
    if (msg.status === "unread") updateStatus(msg._id, "read");
  };

  if (loading) return <FullPageSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal">
              Messages
            </h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-brand-charcoal-light mt-0.5">
            Contact form submissions from customers
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium text-brand-charcoal-medium hover:bg-white/60 transition-colors"
          style={{ borderColor: "rgba(255,255,255,0.50)" }}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "All", value: "" },
          { label: "Unread", value: "unread" },
          { label: "Read", value: "read" },
          { label: "Replied", value: "replied" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              statusFilter === f.value
                ? "bg-brand-emerald text-white shadow-sm"
                : "text-brand-charcoal-medium hover:bg-white/50 border"
            }`}
            style={statusFilter !== f.value ? { borderColor: "rgba(255,255,255,0.50)" } : undefined}
          >
            {f.label}
          </button>
        ))}
      </div>

      {messages.length === 0 ? (
        <div
          className="rounded-xl border p-16 text-center"
          style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.50)" }}
        >
          <MessageSquare className="w-10 h-10 text-brand-charcoal-light mx-auto mb-3" />
          <p className="text-sm font-semibold text-brand-charcoal mb-1">No messages yet</p>
          <p className="text-xs text-brand-charcoal-light">
            {statusFilter ? `No ${statusFilter} messages` : "Customer contact messages will appear here"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5 items-start">

          {/* Message list */}
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => openMessage(msg)}
                className={`rounded-xl border p-5 cursor-pointer transition-all duration-200 ${
                  selected?._id === msg._id ? "ring-2 ring-brand-emerald/40" : "hover:shadow-md"
                } ${msg.status === "unread" ? "border-l-4 border-l-brand-emerald" : ""}`}
                style={{
                  background: selected?._id === msg._id
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderColor: selected?._id === msg._id
                    ? "rgba(255,255,255,0.70)"
                    : "rgba(255,255,255,0.50)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-brand-emerald">
                        {msg.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold text-brand-charcoal ${msg.status === "unread" ? "font-bold" : ""}`}>
                          {msg.name}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[msg.status]}`}>
                          {STATUS_LABELS[msg.status]}
                        </span>
                      </div>
                      <p className="text-xs text-brand-charcoal-light mt-0.5 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {msg.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] text-brand-charcoal-light whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-brand-charcoal-medium mt-3 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected ? (
            <div
              className="rounded-xl border p-6 sticky top-20"
              style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.60)", boxShadow: "0 4px 24px 0 rgba(10,61,46,0.08)" }}
            >
              {/* Detail header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-brand-emerald text-white flex items-center justify-center font-bold text-base">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-charcoal">{selected.name}</p>
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-xs text-brand-emerald hover:underline"
                    >
                      {selected.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-brand-charcoal-light"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-brand-charcoal-light mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(selected.createdAt)}
              </p>

              <div className="mt-4 mb-5 p-4 rounded-lg bg-brand-cream/60 border border-[#e0d8cc]">
                <p className="text-sm text-brand-charcoal leading-[1.85] whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              {/* Status + actions */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-brand-charcoal-light uppercase tracking-wider mb-2">
                  Mark as
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["unread", "read", "replied"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected._id, s)}
                      disabled={selected.status === s || updating === selected._id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        selected.status === s
                          ? STATUS_STYLES[s] + " cursor-default"
                          : "border text-brand-charcoal-medium hover:bg-white/70"
                      }`}
                      style={selected.status !== s ? { borderColor: "rgba(255,255,255,0.50)" } : undefined}
                    >
                      {s === "replied" && <CheckCheck className="w-3.5 h-3.5" />}
                      {s === "read" && <Eye className="w-3.5 h-3.5" />}
                      {s === "unread" && <MessageSquare className="w-3.5 h-3.5" />}
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t mt-3 space-y-2" style={{ borderColor: "rgba(255,255,255,0.40)" }}>
                  {/* Reply via Email */}
                  <a
                    href={`mailto:${selected.email}?subject=Re: Your message to Graha Pravesh&body=Hi ${encodeURIComponent(selected.name)},%0A%0A`}
                    onClick={() => updateStatus(selected._id, "replied")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                    style={{ background: "rgba(10,61,46,0.90)", boxShadow: "0 2px 12px rgba(10,61,46,0.25)" }}
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>

                  {/* Reply via WhatsApp */}
                  <a
                    href={`https://wa.me/918762625888?text=${encodeURIComponent(`Hi, I'm responding to your message on Graha Pravesh:\n\n"${selected.message.slice(0, 100)}${selected.message.length > 100 ? '...' : ''}"\n\n- Graha Pravesh Team`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => updateStatus(selected._id, "replied")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                    style={{ background: "rgba(37,211,102,0.90)", boxShadow: "0 2px 12px rgba(37,211,102,0.25)" }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Reply via WhatsApp
                  </a>

                  <button
                    onClick={() => deleteMessage(selected._id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Message
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl border p-12 text-center"
              style={{ background: "rgba(255,255,255,0.50)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.45)" }}
            >
              <MessageSquare className="w-8 h-8 text-brand-charcoal-light mx-auto mb-2" />
              <p className="text-sm text-brand-charcoal-light">
                Select a message to view details
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
