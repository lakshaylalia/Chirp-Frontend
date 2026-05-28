// MessageArea.jsx
import { useEffect, useRef } from "react";

function MessageBubble({ message, currentUserId }) {
  const isSent = message.senderId === currentUserId;

  return (
    <div className={`flex items-end gap-2 ${isSent ? "flex-row-reverse" : ""}`}>
      {/* Avatar — only for received */}
      {!isSent && (
        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 text-[10px] font-medium flex items-center justify-center flex-shrink-0">
          {message.senderName?.slice(0, 2).toUpperCase()}
        </div>
      )}

      <div
        className={`flex flex-col gap-1 max-w-[65%] ${isSent ? "items-end" : "items-start"}`}
      >
        <div
          className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
            isSent
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-[var(--color-grey-100)] text-[var(--color-grey-800)] rounded-bl-sm"
          }`}
        >
          {message.text}
        </div>

        <span className="text-[11px] text-[var(--color-grey-400)] px-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {isSent && (
            <span
              className={`ml-1 ${message.seen ? "text-indigo-500" : "text-[var(--color-grey-300)]"}`}
            >
              ✓✓
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

function DateDivider({ date }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-[var(--color-grey-200)]" />
      <span className="text-[11px] text-[var(--color-grey-400)] whitespace-nowrap">
        {date}
      </span>
      <div className="flex-1 h-px bg-[var(--color-grey-200)]" />
    </div>
  );
}

export default function MessageArea({ messages = [], currentUserId }) {
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const grouped = messages.reduce((acc, msg) => {
    const day = new Date(msg.createdAt).toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(msg);
    return acc;
  }, {});

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-grey-400)]">
        No messages yet. Say hi!
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
      {Object.entries(grouped).map(([date, msgs]) => (
        <div key={date} className="flex flex-col gap-3">
          <DateDivider date={date} />
          {msgs.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ))}
      {/* Anchor for auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
}
