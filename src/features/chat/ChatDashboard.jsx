import { useState } from "react";
import SidebarContainer from "./SidebarContainer";
import ChatWindow from "./ChatWindow";

// ChatDashboard.jsx
export default function ChatDashboard({ currentUser }) {
  const [activeFriendId, setActiveFriendId] = useState(null);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarContainer
        activeFriendId={activeFriendId}
        onSelectChat={setActiveFriendId}
        currentUser={currentUser}
      />
      {activeFriendId ? (
        <ChatWindow friendId={activeFriendId} currentUserId={currentUser._id} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-grey-400)]">
          Select a conversation
        </div>
      )}
    </div>
  );
}
