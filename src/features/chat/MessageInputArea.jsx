import { useState } from "react";

export default function MessageInputArea({ onSendMessage, isSending }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSendMessage(text);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-[var(--color-gray-200)] bg-[var(--color-gray-0)] p-4 flex items-center gap-3"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        disabled={isSending}
        className="flex-1 rounded-lg border border-[var(--color-gray-300)] bg-[var(--color-gray-50)] px-4 py-2 text-sm text-[var(--color-gray-800)] focus:border-indigo-500 focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isSending || !text.trim()}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
