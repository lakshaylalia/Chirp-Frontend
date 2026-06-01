export default function ChatListItem({ conversation, isActive, onClick }) {
  const { user, lastMessage, unreadCount, isOnline } = conversation;

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
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[var(--color-gray-0)]" />
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
            {lastMessage?.message ?? "No messages yet"}
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
