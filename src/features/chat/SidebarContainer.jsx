import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchUser } from "../users/useSearchUser";
import { useFetchUserChats } from "./useFetchUserChats";
import { useDebounce } from "use-debounce";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLogout } from "../authenication/useLogout";

function ChatListItem({ conversation, isActive, onClick }) {
  const { user, lastMessage, unreadCount, isOnline } = conversation;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors border-l-2 ${
        isActive
          ? "bg-[var(--color-grey-100)] border-indigo-500"
          : "hover:bg-[var(--color-grey-50)] border-transparent"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center justify-center uppercase">
          {user.name.slice(0, 2)}
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[var(--color-grey-0)]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-[var(--color-grey-800)] truncate">
            {user.name}
          </span>
          {lastMessage?.createdAt && (
            <span className="text-[11px] text-[var(--color-grey-400)] flex-shrink-0">
              {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="text-xs text-[var(--color-grey-500)] truncate">
            {lastMessage?.text ?? "No messages yet"}
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

function ChatListSkeleton() {
  return (
    <div className="flex flex-col gap-1 p-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-2 py-3 animate-pulse"
        >
          <div className="w-10 h-10 rounded-full bg-[var(--color-grey-200)] flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3 bg-[var(--color-grey-200)] rounded w-2/3" />
            <div className="h-2.5 bg-[var(--color-grey-100)] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyChats() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-6 py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-[var(--color-grey-100)] flex items-center justify-center">
        <svg
          className="w-7 h-7 text-[var(--color-grey-400)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--color-grey-600)]">
          No conversations yet
        </p>
        <p className="text-xs text-[var(--color-grey-400)] mt-1">
          Start a new chat to get going
        </p>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-6 py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <svg
          className="w-7 h-7 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--color-grey-600)]">
          Failed to load chats
        </p>
        <p className="text-xs text-[var(--color-grey-400)] mt-1">
          Please refresh the page
        </p>
      </div>
    </div>
  );
}

function NoSearchResults({ query }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <svg
        className="w-8 h-8 text-[var(--color-grey-300)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      <p className="text-xs text-[var(--color-grey-400)]">
        No results for{" "}
        <span className="font-medium text-[var(--color-grey-600)]">
          "{query}"
        </span>
      </p>
    </div>
  );
}

export default function SidebarContainer({
  activeRoomId,
  onSelectConversation,
  currentUser,
}) {
  const [searchLocal, setSearchLocal] = useState("");
  const [searchNewFriend, setSearchNewFriend] = useState("");
  const { chats, isLoading, error } = useFetchUserChats(activeRoomId);
  const [debouncedSearch] = useDebounce(searchNewFriend, 1000);
  const { data: user } = useQuery({ queryKey: ["user"] });
  const { user: searchedUsers, isLoading: isSearching } =
    useSearchUser(debouncedSearch);
  const { logOut, isPending } = useLogout();

  const filtered = chats.filter((c) =>
    c.user.name.toLowerCase().includes(searchLocal.toLowerCase()),
  );

  function renderList() {
    if (isLoading) return <ChatListSkeleton />;
    if (error) return <ErrorState />;
    if (chats.length === 0) return <EmptyChats />;
    if (filtered.length === 0) return <NoSearchResults query={searchLocal} />;

    return filtered.map((conversation) => (
      <ChatListItem
        key={conversation.roomId}
        conversation={conversation}
        isActive={conversation.roomId === activeRoomId}
        onClick={() => onSelectConversation(conversation.roomId)}
      />
    ));
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full border-r border-[var(--color-grey-200)] bg-[var(--color-grey-0)]">
      {/* Top bar */}
      <div className="p-3 flex flex-col gap-3 border-b border-[var(--color-grey-200)]">
        {/* Current user */}
        {currentUser && (
          <div className="flex items-center gap-2.5 px-1">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center uppercase">
                {currentUser.name.slice(0, 2)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[var(--color-grey-0)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-grey-800)] truncate">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-emerald-600">Active now</p>
            </div>
            <button
              className="p-1.5 rounded-lg text-[var(--color-grey-400)] hover:text-[var(--color-grey-700)] hover:bg-[var(--color-grey-100)] transition-colors"
              aria-label="View profile"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Search Locally */}
        <div className="flex items-center gap-2 bg-[var(--color-grey-50)] border border-[var(--color-grey-200)] rounded-lg px-3 py-2">
          <svg
            className="w-4 h-4 text-[var(--color-grey-400)] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            value={searchLocal}
            onChange={(e) => setSearchLocal(e.target.value)}
            disabled={isLoading}
            placeholder="Search conversations..."
            className="bg-transparent text-sm text-[var(--color-grey-700)] placeholder:text-[var(--color-grey-400)] outline-none flex-1 min-w-0 disabled:opacity-50"
          />
          {searchLocal && (
            <button
              onClick={() => setSearchLocal("")}
              className="text-[var(--color-grey-400)] hover:text-[var(--color-grey-600)]"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Add new friend */}
        <div className="flex items-center gap-2 bg-[var(--color-grey-50)] border border-[var(--color-grey-200)] rounded-lg px-3 py-2">
          <svg
            className="w-4 h-4 text-[var(--color-grey-400)] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            value={searchNewFriend}
            onChange={(e) => setSearchNewFriend(e.target.value)}
            disabled={isLoading}
            placeholder="Add new friend..."
            className="bg-transparent text-sm text-[var(--color-grey-700)] placeholder:text-[var(--color-grey-400)] outline-none flex-1 min-w-0 disabled:opacity-50"
          />
          {searchNewFriend && (
            <button
              onClick={() => setSearchNewFriend("")}
              className="text-[var(--color-grey-400)] hover:text-[var(--color-grey-600)]"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Chat list */}
      <nav className="flex-1 overflow-y-auto flex flex-col">{renderList()}</nav>

      <div className="flex items-center justify-between p-3">
        <div>
          <img
            src={user.avatarImage}
            alt={user.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        <button onClick={logOut} disabled={isPending} className="cursor-pointer">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}
