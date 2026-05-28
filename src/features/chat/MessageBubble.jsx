export default function MessageBubble({ message, currentUserId }) {
  const isMe = message.senderId === currentUserId;

  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
          isMe
            ? "bg-indigo-600 text-white rounded-tr-none" // Sent message styling
            : "bg-[var(--color-grey-100)] text-[var(--color-grey-800)] rounded-tl-none" // Received message styling
        }`}
      >
        <p>{message.text}</p>
        <span 
          className={`block text-[10px] mt-1 text-right ${
            isMe ? "text-indigo-200" : "text-[var(--color-grey-500)]"
          }`}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}