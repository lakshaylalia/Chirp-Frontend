export default function NewFriendSearch({ users, isSearching, query, onStartChat }) {
  if (!query) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] rounded-lg shadow-lg z-50 overflow-hidden">
      {isSearching ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !users?.length ? (
        <div className="py-6 text-center text-xs text-[var(--color-gray-400)] bg-[#F5F5DC]">
          No users found for "{query}"
        </div>
      ) : (
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => onStartChat(user.userName)}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer bg-[#F5F5DC] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center justify-center uppercase flex-shrink-0">
                {user.userName.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-gray-800)] truncate">
                  {user.userName}
                </p>
                <p className="text-xs text-[var(--color-gray-400)] truncate">
                  {user.email}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}