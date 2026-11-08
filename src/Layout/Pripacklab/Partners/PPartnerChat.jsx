import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { base_url } from "../../../config/config";
import { staffRequest } from "./partnerAdminApi";

const POLL_MS = 5000;
const formatTime = (t) => (t ? new Date(t).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "");
const TYPE_BADGE = { seller: "bg-cyan-100 text-cyan-700", supplier: "bg-violet-100 text-violet-700" };

const uploadFile = async (file) => {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(`${base_url}/schat/upload`, { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
};

// Admin side of the private seller/supplier chat. Opened from the sidebar, or
// with ?type=seller|supplier&id=<id> from a partner's Review panel.
const PPartnerChat = () => {
  const [params, setParams] = useSearchParams();
  const [threads, setThreads] = useState([]);
  const [filter, setFilter] = useState("");
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const type = params.get("type");
  const id = params.get("id");

  const loadThreads = useCallback(() => {
    staffRequest(`/admin/partnerchats${filter ? `?type=${filter}` : ""}`)
      .then((data) => setThreads(data.threads || []))
      .catch((err) => setError(err.message));
  }, [filter]);

  const loadThread = useCallback(async () => {
    if (!type || !id) return;
    try {
      const data = await staffRequest(`/admin/partnerchats/${type}/${id}`);
      setMessages(data.messages || []);
      setPartner(data.partner);
      if ((data.messages || []).some((m) => m.sender === "partner" && !m.readByAdmin)) {
        await staffRequest(`/admin/partnerchats/${type}/${id}/read`, { method: "POST", body: {} });
        loadThreads();
      }
    } catch (err) {
      setError(err.message);
    }
  }, [type, id, loadThreads]);

  useEffect(() => {
    loadThreads();
    loadThread();
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      loadThreads();
      loadThread();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [loadThreads, loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, id]);

  const send = async () => {
    if ((!text.trim() && !attachment) || busy || !type || !id) return;
    setBusy(true);
    try {
      const data = await staffRequest(`/admin/partnerchats/${type}/${id}`, {
        method: "POST",
        body: { text, ...(attachment ? { attachment } : {}) },
      });
      setMessages((prev) => [...prev, data.message]);
      setText("");
      setAttachment(null);
      loadThreads();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const pickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setAttachment(await uploadFile(file));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full">
      <div className="hdr">Partner Chat</div>

      <div className="px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="flex gap-1 p-2 border-b dark:border-slate-700">
            {[["", "All"], ["seller", "Sellers"], ["supplier", "Suppliers"]].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)} className={`btn btn-xs ${filter === v ? "btn-info text-white" : "btn-ghost"}`}>{l}</button>
            ))}
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {threads.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">No conversations yet. Open one from a seller or supplier&apos;s Review panel.</p>
            )}
            {threads.map((t) => {
              const active = t.partnerType === type && String(t.partnerId) === id;
              return (
                <button
                  key={`${t.partnerType}-${t.partnerId}`}
                  onClick={() => setParams({ type: t.partnerType, id: String(t.partnerId) })}
                  className={`w-full text-left px-3 py-2 border-b dark:border-slate-800 flex justify-between gap-2 ${active ? "bg-cyan-50 dark:bg-slate-800" : "hover:bg-gray-50 dark:hover:bg-slate-800"}`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold dark:text-slate-100 truncate">
                      {t.partnerName || "Unnamed"}
                      <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${TYPE_BADGE[t.partnerType]}`}>{t.partnerType}</span>
                    </p>
                    <p className="text-xs text-gray-400 truncate">{t.lastText}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-gray-400">{formatTime(t.lastTime)}</p>
                    {t.unread > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{t.unread}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl flex flex-col h-[650px]">
          {!type || !id ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Select a conversation.</div>
          ) : (
            <>
              <div className="px-4 py-3 border-b dark:border-slate-700">
                <p className="font-semibold dark:text-slate-100">
                  {partner?.shopName || partner?.name || "Partner"}
                  <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${TYPE_BADGE[type]}`}>{type}</span>
                </p>
                {partner?.phone && <p className="text-xs text-gray-400">{partner.phone}</p>}
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
                {messages.length === 0 && <p className="text-center text-sm text-gray-400 mt-10">No messages yet. Start the conversation.</p>}
                {messages.map((m) => {
                  const mine = m.sender === "admin";
                  return (
                    <div key={m._id} className={`max-w-[75%] flex flex-col ${mine ? "self-end items-end" : "self-start items-start"}`}>
                      <div className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${mine ? "bg-cyan-500 text-white" : "bg-gray-100 dark:bg-slate-800 dark:text-slate-200"}`}>
                        {m.text}
                        {m.attachment && (
                          <a href={`${base_url}${m.attachment.url}`} target="_blank" rel="noreferrer" className="block underline text-xs mt-1">
                            📎 {m.attachment.name}
                          </a>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5">
                        {mine ? m.staffEmail || "Admin" : partner?.shopName || partner?.name} · {formatTime(m.time)}{mine && m.readByPartner ? " · Seen" : ""}
                      </span>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {error && <p className="text-xs text-red-500 px-4">{error}</p>}
              {attachment && (
                <p className="text-xs px-4 py-1 dark:text-slate-300">
                  📎 {attachment.name} <button onClick={() => setAttachment(null)} className="text-red-500 ml-2">Remove</button>
                </p>
              )}

              <div className="flex items-center gap-2 border-t dark:border-slate-700 px-3 py-2">
                <label className="btn btn-sm btn-ghost">
                  📎
                  <input type="file" className="hidden" onChange={pickFile} />
                </label>
                <input
                  className="input input-bordered input-sm flex-1"
                  placeholder="Type a message"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                />
                <button onClick={send} disabled={busy || (!text.trim() && !attachment)} className="btn btn-sm btn-info text-white">Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PPartnerChat;
