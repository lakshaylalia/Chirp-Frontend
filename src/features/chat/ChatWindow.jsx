import {useParams} from "react-router-dom";


import MessageArea from "./MessageArea";
import { useFetchMessages } from "./useFetchMessages";

import ChatHeader from "./ChatHeader";
import MessageInputArea from "./MessageInputArea";
import Spinner from "../../components/Spinner"

export default function ChatWindow({ friendId, currentUserId, isGroup, groupId }) {
  const { groupId: paramGroupId } = useParams();
  const effectiveGroupId = groupId || (isGroup ? paramGroupId : null);

  const { messages, isLoading, handleSendMessage, isSending } =
    useFetchMessages(friendId, currentUserId, effectiveGroupId);

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-gray-400)]">
        <Spinner />
      </div>
    );

  const userImg = messages.length > 0 ? messages[0].receiver.avatarImage : null;

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
      <ChatHeader friendId={friendId} groupId={effectiveGroupId} isGroup={isGroup} userImg={userImg} />
      <MessageArea messages={messages} currentUserId={currentUserId} isGroup={isGroup} />
      <MessageInputArea
        onSendMessage={handleSendMessage}
        isSending={isSending}
        isGroup={isGroup}
      />
    </div>
  );
}
