import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import MessageArea from "./MessageArea";
import { useFetchMessages } from "./useFetchMessages";
import { getUser } from "../../services/apiUser";

import ChatHeader from "./ChatHeader";
import MessageInputArea from "./MessageInputArea";
import Spinner from "../../components/Spinner"

export default function ChatWindow({ friendName, currentUserId }) {
  const { groupId } = useParams();
  const isGroup = !!groupId;

  // First get the user to get the friendId
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile", friendName],
    queryFn: () => getUser({ userName: friendName }),
    enabled: !!friendName && !isGroup,
    staleTime: 1000 * 60 * 5,
  });

  const friendId = userProfile?._id;

  const { messages, isLoading, handleSendMessage, isSending, handleDeleteMessage } =
    useFetchMessages(friendId, currentUserId, null);

  if (isLoading || isLoadingProfile)
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-gray-400)]">
        <Spinner />
      </div>
    );

  // Get user image from messages or user profile
  const userImg = messages.length > 0
    ? (messages[0].receiver?.avatarImage || messages[0].sender?.avatarImage)
    : (userProfile?.avatarImage || null);

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
      <ChatHeader
        friendId={friendId}
        friendName={friendName}
        groupId={null}
        isGroup={false}
        userImg={userImg}
      />
      <MessageArea
        messages={messages}
        currentUserId={currentUserId}
        isGroup={false}
        onDeleteMessage={handleDeleteMessage}
      />
      <MessageInputArea
        onSendMessage={handleSendMessage}
        isSending={isSending}
        isGroup={false}
        friendId={friendId}
        groupId={null}
      />
    </div>
  );
}
