function MessageBubble({ msg, currentUserId, isGroup }) {
  const senderId = msg.sender?._id || msg.sender;
  const isSent = senderId === currentUserId;

  return (
    <div className={`flex items-end gap-2 ${isSent ? "flex-row-reverse" : ""}`}>
      {/* Avatar — only for received */}
      {!isSent && (
        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 text-[10px] font-medium flex items-center justify-center flex-shrink-0">
          {msg.senderName?.slice(0, 2).toUpperCase() || "?"}
        </div>
      )}

      <div
        className={`flex flex-col gap-1 max-w-[65%] ${isSent ? "items-end" : "items-start"}`}
      >
        {/* Sender name for group chats */}
        {isGroup && !isSent && (
          <span className="text-xs text-indigo-600 font-medium px-1">
            {msg.senderName || "Unknown"}
          </span>
        )}
        <div
          className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
            isSent
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-blue-400 text-gray-800 rounded-bl-sm"
          }`}
        >
          {msg.message}
        </div>

        <span className="text-[11px] text-[var(--color-gray-400)] px-1">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {isSent && (
            <span
              className={`ml-1 ${msg.seen ? "text-indigo-500" : "text-[var(--color-gray-300)]"}`}
            >
              ✓✓
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;