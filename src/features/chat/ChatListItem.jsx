export default function ChatListItem({ conversation, isActive, onClick }) {
  const { user, lastMessage, unreadCount, isOnline, type, members } = conversation;

  const isGroup = type === "group";

  // Get last message preview
  const getLastMessagePreview = () => {
    if (!lastMessage) return "No messages yet";

    // Check if it's an image message
    if (lastMessage.image) return "📷 Photo";

    return lastMessage.message || "No messages yet";
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors border-l-2 ${
        isActive
          ? "bg-slate-300 border-indigo-500"
          : "hover:bg-gray-100 border-transparent"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center justify-center uppercase">
            {user.avatarImage ? (
              <img
                src={user.avatarImage}
                alt="user Image"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user?.name?.slice(0, 2)
            )}
        </div>
        {/* Online indicator - only for direct messages */}
        {!isGroup && isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[var(--color-gray-0)]" />
        )}
        {/* Group indicator */}
        {isGroup && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-[var(--color-gray-800)] truncate">
            {user.name}
          </span>
          {lastMessage?.createdAt && (
            <span className="text-[11px] text-[var(--color-gray-400)] flex-shrink-0">
              {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="text-xs text-[var(--color-gray-500)] truncate">
            {isGroup ? `${members || 0} members` : getLastMessagePreview()}
          </span>
          {unreadCount > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-medium rounded-full px-1.5 py-0.5 flex-shrink-0 min-w-[18px] text-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
