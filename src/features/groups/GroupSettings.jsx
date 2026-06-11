import { useState } from "react";
import { useSearchUser } from "../users/useSearchUser";
import {
    useAddMembers,
    useRemoveMember,
    useLeaveGroup,
} from "./useGroups";
import { useUser } from "../authenication/useUser";

export default function GroupSettings({ group, onClose }) {
    const { user: currentUser } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const { user: searchResults, isLoading: isSearching } = useSearchUser(searchQuery);

    const addMembers = useAddMembers();
    const removeMember = useRemoveMember();
    const leaveGroup = useLeaveGroup();

    // Handle different field names from API (participants vs members, admins could be IDs or objects)
    const members = group?.members || group?.participants || [];
    const admins = group?.admins || group?.adminIds || [];

    // Check if current user is admin (handle both ID and object format)
    const isAdmin = admins.some((admin) => {
        const adminId = admin._id || admin;
        return adminId === currentUser?._id;
    });

    // Check if current user is a member
    const isMember = members.some((member) => {
        const memberId = member._id || member;
        return memberId === currentUser?._id;
    });

    function handleAddMember(user) {
        // Add one member at a time
        addMembers.mutate({ groupId: group._id, memberIds: [user._id] });
        setSearchQuery("");
    }

    function handleRemoveMember(memberId) {
        if (confirm("Are you sure you want to remove this member?")) {
            removeMember.mutate({ groupId: group._id, memberIds: [memberId] });
        }
    }

    function handleLeave() {
        if (confirm("Are you sure you want to leave this group?")) {
            leaveGroup.mutate({ groupId: group._id });
            onClose();
        }
    }

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Group Settings</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {isAdmin && (
                <div>
                    <label className="block text-sm font-medium mb-1">Add Members</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            placeholder="Search users to add..."
                        />
                        {searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                                {isSearching ? (
                                    <div className="p-3 text-center text-sm text-gray-400">Searching...</div>
                                ) : !searchResults?.length ? (
                                    <div className="p-3 text-center text-sm text-gray-400">No users found</div>
                                ) : (
                                    <ul>
                                        {searchResults
                                            .filter((u) => {
                                                // Filter out users already in the group
                                                const memberIds = members.map(m => m._id || m);
                                                return !memberIds.includes(u._id);
                                            })
                                            .map((user) => (
                                                <li
                                                    key={user._id}
                                                    onClick={() => handleAddMember(user)}
                                                    className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center">
                                                        {user.userName.slice(0, 2)}
                                                    </div>
                                                    <span className="text-sm">{user.userName}</span>
                                                </li>
                                            ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div>
                <h4 className="text-sm font-medium mb-2">Members ({members.length || 0})</h4>
                <ul className="space-y-2">
                    {members.map((member) => {
                        const memberId = member._id || member;
                        const memberName = member.userName || member.name || "Unknown";
                        const isMemberAdmin = admins.some((a) => (a._id || a) === memberId);
                        const isCurrentUser = memberId === currentUser?._id;

                        return (
                            <li key={memberId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center">
                                        {memberName.slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {memberName}
                                            {isMemberAdmin && <span className="ml-1 text-xs text-indigo-600">(Admin)</span>}
                                            {isCurrentUser && <span className="ml-1 text-xs text-gray-500">(You)</span>}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {isAdmin && !isCurrentUser && (
                                        <button
                                            onClick={() => handleRemoveMember(memberId)}
                                            className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {isMember && !isAdmin && (
                <button
                    onClick={handleLeave}
                    className="w-full py-2 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50"
                >
                    Leave Group
                </button>
            )}
        </div>
    );
}
