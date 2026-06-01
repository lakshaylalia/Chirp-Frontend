import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../authenication/useUser";
import SidebarContainer from "./SidebarContainer";
import ChatWindow from "./ChatWindow";
import CreateGroupModal from "../groups/CreateGroupModal";
import GroupInfo from "../groups/GroupInfo";

export default function ChatDashboard() {
  const navigate = useNavigate();
  const { user: currentUser } = useUser();
  const { friendName, groupId } = useParams();

  const [chats, setChats] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const activeFriendId =
    chats.find((c) => c.user.name === friendName)?.friendId ?? null;

  function handleFriendChatClick(friendId, friendName) {
    navigate(`/chat/${friendName}`);
  }

  function handleGroupClick(groupId) {
    navigate(`/group/${groupId}`);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarContainer
        activeFriendId={activeFriendId}
        onSelectConversation={handleFriendChatClick}
        onSelectGroup={handleGroupClick}
        onChatsLoaded={(loaded) => {
          setChats(loaded || []);
        }}
        onCreateGroup={() => setShowCreateGroup(true)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {groupId ? (
          <div className="flex flex-col h-full">
            <GroupInfo />
            <ChatWindow
              groupId={groupId}
              currentUserId={currentUser?._id}
              isGroup
            />
          </div>
        ) : activeFriendId ? (
          <ChatWindow
            friendId={activeFriendId}
            currentUserId={currentUser?._id}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-300"
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

            <p className="text-sm font-medium text-[var(--color-gray-500)]">
              Select a conversation
            </p>

            <p className="text-xs text-[var(--color-gray-400)]">
              Choose from your existing chats or find a new friend
            </p>
          </div>
        )}
      </main>

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
    </div>
  );
}