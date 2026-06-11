import { useState } from "react";
import { formatMessageTime } from "../../utils/timeUtils";

function MessageBubble({ msg, currentUserId, isGroup, onDelete }) {
  const senderId = msg.sender?._id || msg.sender;
  const isSent = senderId === currentUserId;
  const [showMenu, setShowMenu] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this message?")) {
      onDelete(msg._id);
    }
    setShowMenu(false);
  };

  const hasImage = msg.image;
  const hasText = msg.message && msg.message.trim().length > 0;

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

        <div className="relative">
          {/* Image message */}
          {hasImage && (
            <div
              className={`rounded-2xl overflow-hidden cursor-pointer ${
                isSent ? "rounded-br-sm" : "rounded-bl-sm"
              }`}
              onClick={() => setImageExpanded(true)}
            >
              <img
                src={msg.image}
                alt="Shared image"
                className="max-w-[250px] max-h-[300px] object-cover"
              />
            </div>
          )}

          {/* Text message */}
          {hasText && (
            <div
              className={`px-3 py-2 rounded-2xl text-sm leading-relaxed cursor-pointer ${
                isSent
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-blue-400 text-gray-800 rounded-bl-sm"
              }`}
              onClick={() => isSent && setShowMenu(!showMenu)}
              onContextMenu={(e) => {
                e.preventDefault();
                if (isSent) setShowMenu(!showMenu);
              }}
            >
              {msg.message}
            </div>
          )}

          {/* Delete menu for sent messages */}
          {showMenu && isSent && (
            <div className="absolute top-0 right-0 translate-y-[-100%] bg-white rounded-lg shadow-lg border py-1 z-10">
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <span className="text-[11px] text-[var(--color-gray-400)] px-1">
          {formatMessageTime(msg.createdAt)}
          {isSent && (
            <span
              className={`ml-1 ${msg.seen ? "text-indigo-500" : "text-[var(--color-gray-300)]"}`}
            >
              ✓✓
            </span>
          )}
        </span>
      </div>

      {/* Image lightbox */}
      {imageExpanded && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setImageExpanded(false)}
        >
          <img
            src={msg.image}
            alt="Expanded"
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            onClick={() => setImageExpanded(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
