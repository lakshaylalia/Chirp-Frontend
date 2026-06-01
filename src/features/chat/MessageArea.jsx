import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble"

function DateDivider({ date }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-[var(--color-gray-200)]" />
      <span className="text-[11px] text-[var(--color-gray-400)] whitespace-nowrap">
        {date}
      </span>
      <div className="flex-1 h-px bg-[var(--color-gray-200)]" />
    </div>
  );
}

export default function MessageArea({ messages = [], currentUserId, isGroup }) {
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
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-gray-400)]">
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
              key={msg._id}
              msg={msg}
              currentUserId={currentUserId}
              isGroup={isGroup}
            />
          ))}
        </div>
      ))}
      {/* Anchor for auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
}
