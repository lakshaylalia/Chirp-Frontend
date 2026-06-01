export function ChatListSkeleton() {
  return (
    <div className="flex flex-col gap-1 p-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 px-2 py-3 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-[var(--color-gray-200)] flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3 bg-[var(--color-gray-200)] rounded w-2/3" />
            <div className="h-2.5 bg-[var(--color-gray-100)] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyChats() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-6 py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-[var(--color-gray-100)] flex items-center justify-center">
        <svg className="w-7 h-7 text-[var(--color-gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--color-gray-600)]">No conversations yet</p>
        <p className="text-xs text-[var(--color-gray-400)] mt-1">Start a new chat to get going</p>
      </div>
    </div>
  );
}

export function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-6 py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--color-gray-600)]">Failed to load chats</p>
        <p className="text-xs text-[var(--color-gray-400)] mt-1">Please refresh the page</p>
      </div>
    </div>
  );
}

export function NoSearchResults({ query }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center bg-[#F5F5DC]">
      <svg className="w-8 h-8 text-[var(--color-gray-300)] bg-[#F5F5DC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <p className="text-xs text-[var(--color-gray-400)]">
        No results for{" "}
        <span className="font-medium text-[var(--color-gray-600)]">"{query}"</span>
      </p>
    </div>
  );
}