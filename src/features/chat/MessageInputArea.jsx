import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";

export default function MessageInputArea({ onSendMessage, isSending, friendId, groupId, isGroup }) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSendingImage, setIsSendingImage] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { emitTyping, emitGroupTyping, isUserTyping } = useSocket();

  const isTyping = groupId ? isUserTyping(groupId) : friendId ? isUserTyping(friendId) : false;

  const handleTyping = (value) => {
    setText(value);

    // Emit typing status
    if (isGroup && groupId) {
      emitGroupTyping(groupId, true);
    } else if (friendId) {
      emitTyping(friendId, true);
    }

    // Clear typing after 1 second of no typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (isGroup && groupId) {
        emitGroupTyping(groupId, false);
      } else if (friendId) {
        emitTyping(friendId, false);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Stop typing indicator
    if (isGroup && groupId) {
      emitGroupTyping(groupId, false);
    } else if (friendId) {
      emitTyping(friendId, false);
    }

    if (imagePreview) {
      // Get the actual file from input
      const file = imageInputRef.current?.files?.[0];
      if (file) {
        setIsSendingImage(true);
        // Call with image file
        onSendMessage(text, file);
        setIsSendingImage(false);
      }
      removeImage();
    } else if (text.trim()) {
      onSendMessage(text);
    }

    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      {/* Typing indicator */}
      {isTyping && (
        <div className="px-4 py-1 text-xs text-gray-500 animate-pulse">
          Typing...
        </div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-32 rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t border-[var(--color-gray-200)] bg-[var(--color-gray-0)] p-4 flex items-center gap-3"
      >
        {/* Image attachment button */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={isSending || isSendingImage}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        <input
          type="text"
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isSending || isSendingImage}
          className="flex-1 rounded-lg border border-[var(--color-gray-300)] bg-[var(--color-gray-50)] px-4 py-2 text-sm text-[var(--color-gray-800)] focus:border-indigo-500 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSending || isSendingImage || (!text.trim() && !imagePreview)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending || isSendingImage ? "Sending..." : "Send"}
        </button>
      </form>
    </>
  );
}
