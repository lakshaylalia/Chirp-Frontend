import { Link } from "react-router-dom";

export default function ChatHeader({ user }) {
  if (!user) return null;

  return (
    <div className="flex items-center justify-between border-b border-[var(--color-grey-200)] bg-[var(--color-grey-0)] px-6 py-3 shadow-sm">
      {/* Clickable user profile details */}
      <Link
        to={`/profile/${user.id}`}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="relative">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          {/* Status Indicator Dot */}
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--color-grey-0)] ${
              user.status === "active" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div>
          <h3 className="font-semibold text-[var(--color-grey-800)]">
            {user.name}
          </h3>
          <p className="text-xs text-[var(--color-grey-500)]">
            {user.status === "active" ? "Online" : "Offline"}
          </p>
        </div>
      </Link>
    </div>
  );
}
