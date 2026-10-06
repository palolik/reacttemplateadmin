/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import { TiArrowMinimise } from "react-icons/ti";
import { base_url,chat_url } from "../../../config/config";
import { AttachButton, PendingAttachment, MessageAttachment } from "./ChatAttachment";
const Schat = ({
  supportId,
  bId,
  bName,
  onClose,
  isVisible,
  onToggle,
}) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [attachError, setAttachError] = useState("");
  const scrollRef = useRef(null);
  // Follow new messages only while the admin is already at (or near) the bottom.
  const stickToBottom = useRef(true);
  const lastCount = useRef(0);

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
  };

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${base_url}/schat/${supportId}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching support chat:", err);
      }
    };

    if (supportId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 1000);
      return () => clearInterval(interval);
    }
  }, [supportId]);

  useEffect(() => {
    const ws = new WebSocket(`${chat_url}`);
    setSocket(ws);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.supportId === supportId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.close();
  }, [supportId]);

  // Customer messages that arrive while this chat is open (and the tab is in front) count as seen,
  // not just the ones present when the conversation was first clicked.
  const markingRead = useRef(false);
  const hasUnseen = messages.some((m) => m.sender === "user" && m.read === false);

  useEffect(() => {
    if (!isVisible || !hasUnseen || markingRead.current || document.visibilityState !== "visible") return;
    markingRead.current = true;
    fetch(`${base_url}/schat/mark-read/${encodeURIComponent(supportId)}`, { method: "POST" })
      .then(() => setMessages((prev) => prev.map((m) => (m.sender === "user" ? { ...m, read: true } : m))))
      .catch((err) => console.error("Error marking messages as read:", err))
      .finally(() => { markingRead.current = false; });
  }, [isVisible, hasUnseen, messages, supportId]);

  // The 1s poll replaces `messages` even when nothing changed, so only react to a real new message.
  useEffect(() => {
    if (messages.length > lastCount.current && stickToBottom.current) scrollToBottom();
    lastCount.current = messages.length;
  }, [messages]);

  // Opening/expanding the chat starts at the latest message.
  useEffect(() => {
    if (!isVisible) return;
    stickToBottom.current = true;
    lastCount.current = 0; // the next load counts as new, so it lands at the bottom
    scrollToBottom();
  }, [isVisible, supportId]);

  const handleSend = async () => {
    if ((!inputValue.trim() && !attachment) || isSending) return;

    const message = {
      supportId,
      bId,
      bName,
      sender: "manager",
      text: inputValue,
      ...(attachment ? { attachment } : {}),
      time: new Date().toISOString(),
    };

    setIsSending(true);
    try {
      await fetch(`${base_url}/addschat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      socket?.send(JSON.stringify(message));
      stickToBottom.current = true; // always show the admin's own message
      setMessages((prev) => [...prev, message]);
      setInputValue("");
      setAttachment(null);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col mx-2 border border-blue-300 bg-white dark:bg-slate-900 rounded-t-lg shadow-lg">
      <div className="flex items-center justify-between bg-blue-100 dark:bg-slate-800 p-2 rounded-t-lg">
        <p className="font-semibold text-sm text-gray-800 dark:text-slate-100">{bName || "Client Chat"}</p>
        <div className="flex gap-2">
          <TiArrowMinimise
            className="h-5 w-5 text-gray-600 dark:text-slate-300 hover:text-blue-500 cursor-pointer"
            onClick={onToggle}
          />
          <MdClose
            className="h-5 w-5 text-gray-600 dark:text-slate-300 hover:text-red-500 cursor-pointer"
            onClick={onClose}
          />
        </div>
      </div>

      {isVisible && (
        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-[400px] overflow-y-auto p-3 bg-gray-50 dark:bg-slate-900"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex mb-2 ${
                  msg.sender === "manager" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-xl max-w-xs ${
                    msg.sender === "manager"
                      ? "bg-blue-200 text-right"
                      : "bg-gray-200 dark:bg-slate-800 text-left"
                  }`}
                >
                  <MessageAttachment attachment={msg.attachment} />
                  {msg.text && <p className="text-sm text-gray-800 dark:text-slate-100">{msg.text}</p>}
                  <p className="text-[10px] text-gray-600 dark:text-slate-400">
                    {new Date(msg.time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <PendingAttachment attachment={attachment} error={attachError} onRemove={() => setAttachment(null)} />
          <div className="flex border-t dark:border-slate-700">
            <AttachButton onUploaded={setAttachment} onError={setAttachError} disabled={isSending} />
            <input
              type="text"
              className="flex-grow p-2 outline-none text-sm bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={(!inputValue.trim() && !attachment) || isSending}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 text-sm rounded-r"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Schat;