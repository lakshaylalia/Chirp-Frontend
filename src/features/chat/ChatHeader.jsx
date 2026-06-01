import { Link, useParams } from "react-router-dom";

import {useSocket} from "../../context/SocketContext";
import { useGetGroup } from "../groups/useGroups";

export default function ChatHeader({ friendId, userImg, groupId, isGroup }) {
  const { friendName } = useParams();
  const {onlineUsers} = useSocket();

  const { data: group } = useGetGroup({ groupId });

  if (!friendId && !groupId) return null;

  if (isGroup && groupId) {
    return (
      <div className="flex items-center justify-between border-b border-[var(--color-grey-200)] bg-[var(--color-grey-0)] px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            {group?.avatar ? (
              <img
                src={group.avatar}
                alt={group.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
                {group?.name?.slice(0, 2).toUpperCase() || "GR"}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-gray-800)]">
              {group?.name || "Group"}
            </h3>
            <p className="text-xs text-[var(--color-gray-500)]">
              {group?.members?.length || 0} members
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isOnline = onlineUsers.includes(friendId);

  return (
    <div className="flex items-center justify-between border-b border-[var(--color-grey-200)] bg-[var(--color-grey-0)] px-6 py-3 shadow-sm">
      {/* Clickable friendId profile details */}
      <Link
        to={`/user/${friendName}`}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="relative">
          <img
            src={userImg || "/defaultUserImage.webp"}
            alt={friendId.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          {/* Status Indicator Dot */}
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--color-gray-0)] ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div>
          <h3 className="font-semibold text-[var(--color-gray-800)]">
            {friendName}
          </h3>
          <p className="text-xs text-[var(--color-gray-500)]">
            {isOnline? "Online" : "Offline"}
          </p>
        </div>
      </Link>
    </div>
  );
}
