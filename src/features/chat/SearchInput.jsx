export default function SearchInput({
  value,
  onChange,
  placeholder,
  disabled,
}) {
  return (
    <div className="flex items-center gap-2 bg-[var(--color-gray-50)] border border-[var(--color-gray-200)] rounded-lg px-3 py-2">
      <svg
        className="w-4 h-4 text-[var(--color-gray-400)] flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="bg-transparent text-sm text-[var(--color-gray-700)] placeholder:text-[var(--color-gray-400)] outline-none flex-1 min-w-0 disabled:opacity-50"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)]"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
