import { useState } from "react";

export default function MessageInputArea({ onSendMessage }) {
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
      className="border-t border-[var(--color-grey-200)] bg-[var(--color-grey-0)] p-4 flex items-center gap-3"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-lg border border-[var(--color-grey-300)] bg-[var(--color-grey-50)] px-4 py-2 text-sm text-[var(--color-grey-800)] focus:border-indigo-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        Send
      </button>
    </form>
  );
}
