import { useState, useEffect } from "react";
import { useUser } from "../authenication/useUser";
import { useDebounce } from "use-debounce";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Link } from "react-router-dom";

import { useFetchUserChats } from "./useFetchUserChats";
import { useSearchUser } from "../users/useSearchUser";
import { useLogout } from "../authenication/useLogout";
import { useUserGroups } from "../groups/useGroups";

import ChatListItem from "./ChatListItem";
import SearchInput from "./SearchInput";
import NewFriendSearch from "./NewFriendSearch";
import {
  ChatListSkeleton,
  EmptyChats,
  ErrorState,
  NoSearchResults,
} from "./ChatListStates";

export default function SidebarContainer({
  activeFriendId,
  onSelectConversation,
  onSelectGroup,
  onChatsLoaded,
  onCreateGroup,
}) {
  const [searchLocal, setSearchLocal] = useState("");
  const [searchNewFriend, setSearchNewFriend] = useState("");
  const [debouncedSearch] = useDebounce(searchNewFriend, 500);

  const { user: currentUser } = useUser();
  const { chats, isLoading, error } = useFetchUserChats(
    activeFriendId,
    currentUser?._id,
  );

  const { data: groups } = useUserGroups();

  const { logOut, isPending } = useLogout();
  const { user: searchedUsers, isLoading: isSearching } = useSearchUser(debouncedSearch);

  useEffect(() => {
    if (typeof onChatsLoaded === "function") onChatsLoaded(chats || []);
  }, [chats, onChatsLoaded]);


  const filtered = (chats || [])
    .filter((c) => c.user.name.toLowerCase().includes(searchLocal.toLowerCase()))
    .filter((c) => !groups?.some((g) => g._id === c.friendId)); // Remove groups from regular chats

  const filteredGroups = (groups || []).filter((g) =>
    g.name.toLowerCase().includes(searchLocal.toLowerCase())
  );

  function handleStartChat(friendId) {
    setSearchNewFriend("");
    onSelectConversation(friendId);
  }

  function renderList() {
    if (isLoading) return <ChatListSkeleton />;
    if (error) return <ErrorState />;
    if (chats.length === 0 && (!groups || groups.length === 0)) return <EmptyChats />;
    if (filtered.length === 0 && filteredGroups.length === 0) return <NoSearchResults query={searchLocal} />;

    return (
      <>
        {filteredGroups.map((group) => (
          <div
            key={group._id}
            onClick={() => onSelectGroup(group._id)}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[var(--color-gray-50)] transition-colors border-b border-[var(--color-gray-100)]"
          >
            {group.avatar ? (
              <img src={group.avatar} alt={group.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center justify-center uppercase">
                {group.name.slice(0, 2)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-gray-800)] truncate">
                {group.name}
              </p>
              <p className="text-xs text-[var(--color-gray-400)] truncate">
                {group.members?.length || 0} members
              </p>
            </div>
          </div>
        ))}
        {filtered.map((conversation) => (
          <ChatListItem
            key={conversation.friendId}
            conversation={conversation}
            isActive={conversation.friendId === activeFriendId}
            onClick={() =>
              onSelectConversation(conversation.friendId, conversation.user.name)
            }
          />
        ))}
      </>
    );
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full border-r border-[var(--color-gray-200)] bg-[var(--color-gray-0)]">
      {/* Top bar */}
      <div className="p-3 flex flex-col gap-3 border-b border-[var(--color-gray-200)]">
        {/* Current user profile */}
        {currentUser && (
          <div className="flex items-center gap-2.5 px-1">
            <div className="relative flex-shrink-0">
              {currentUser.avatarImage ? (
                <Link to={`/user/${currentUser.userName}`}>
                  <img
                    src={currentUser.avatarImage}
                    alt={currentUser.userName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </Link>
              ) : (
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center uppercase">
                  {currentUser.userName.slice(0, 2)}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[var(--color-gray-0)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-gray-800)] truncate">
                {currentUser.userName}
              </p>
              <p className="text-[11px] text-emerald-600">Active now</p>
            </div>
          </div>
        )}

        {/* Search existing conversations */}
        <SearchInput
          value={searchLocal}
          onChange={setSearchLocal}
          placeholder="Search conversations..."
          disabled={isLoading}
        />

        {/* Search new friend — with dropdown */}
        <div className="relative">
          <SearchInput
            value={searchNewFriend}
            onChange={setSearchNewFriend}
            placeholder="Find new friend..."
            disabled={false}
          />
          <NewFriendSearch
            users={searchedUsers}
            isSearching={isSearching}
            query={debouncedSearch}
            onStartChat={handleStartChat}
          />
        </div>

        {/* Create Group Button */}
        <button
          onClick={onCreateGroup}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <GroupAddIcon fontSize="small" />
          Create Group
        </button>
      </div>

      {/* Chat list */}
      <nav className="flex-1 overflow-y-auto flex flex-col">{renderList()}</nav>

      {/* Bottom bar */}
      <div className="flex items-center justify-between p-3 border-t border-[var(--color-gray-200)]">
        <Link to={`/user/${currentUser.userName}`}>
          {currentUser?.avatarImage ? (
            <img
              src={currentUser.avatarImage}
              alt={currentUser.userName}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center uppercase">
              {currentUser?.userName?.slice(0, 2)}
            </div>
          )}
        </Link>
        <button
          onClick={logOut}
          disabled={isPending}
          className="p-1.5 rounded-lg text-[var(--color-gray-400)] hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <LogoutIcon fontSize="small" />
        </button>
      </div>
    </aside>
  );
}
