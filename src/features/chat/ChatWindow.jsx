import MessageArea from "./MessageArea";
import { useFetchMessages } from "./useFetchMessages";
import ChatHeader from "./ChatHeader";
import MessageInputArea from "./MessageInputArea";

export default function ChatWindow({ roomId, currentUserId }) {
  const { messages, isLoading, handleSendMessage } = useFetchMessages(roomId);

  if (isLoading) return <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-grey-400)]">Loading...</div>;

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
      <ChatHeader />
      <MessageArea messages={messages} currentUserId={currentUserId} />
      <MessageInputArea onSendMessage={handleSendMessage} />
    </div>
  );
}