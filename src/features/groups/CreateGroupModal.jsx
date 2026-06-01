import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useSearchUser } from "../users/useSearchUser";
import { useCreateGroup } from "./useGroups";

export default function CreateGroupModal({ onClose }) {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [debouncedSearch] = useDebounce(searchQuery, 500);
    const { user: searchResults, isLoading: isSearching } = useSearchUser(debouncedSearch);
    const createGroup = useCreateGroup();

    function toggleMember(user) {
        setSelectedMembers((prev) => {
            const exists = prev.find((m) => m._id === user._id);
            if (exists) {
                return prev.filter((m) => m._id !== user._id);
            }
            return [...prev, user];
        });
    }

    function onSubmit({ name, avatar }) {
        if (selectedMembers.length === 0) {
            toast.error("Please select at least one member");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("memberIds", JSON.stringify(selectedMembers.map((m) => m._id)));
        if (avatar?.[0]) {
            formData.append("avatar", avatar[0]);
        }

        createGroup.mutate(formData, {
            onSuccess: (group) => {
                onClose();
                navigate(`/group/${group._id}`);
            },
        });
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Create Group</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
                    <div>
                        <label className="block text-sm font-medium mb-1">Group Name</label>
                        <input
                            {...register("name", { required: "Group name is required" })}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            placeholder="Enter group name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Avatar (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("avatar")}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Add Members</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder="Search users..."
                            />
                            {searchQuery && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-3 text-center text-sm text-gray-400">Searching...</div>
                                    ) : !searchResults?.length ? (
                                        <div className="p-3 text-center text-sm text-gray-400">No users found</div>
                                    ) : (
                                        <ul>
                                            {searchResults.map((user) => (
                                                <li
                                                    key={user._id}
                                                    onClick={() => toggleMember(user)}
                                                    className={`px-3 py-2 cursor-pointer flex items-center gap-2 ${
                                                        selectedMembers.find((m) => m._id === user._id)
                                                            ? "bg-indigo-50"
                                                            : "hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center">
                                                        {user.userName.slice(0, 2)}
                                                    </div>
                                                    <span className="text-sm">{user.userName}</span>
                                                    {selectedMembers.find((m) => m._id === user._id) && (
                                                        <svg className="w-4 h-4 text-indigo-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedMembers.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2">Selected Members ({selectedMembers.length})</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedMembers.map((member) => (
                                    <span
                                        key={member._id}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                                    >
                                        {member.userName}
                                        <button
                                            type="button"
                                            onClick={() => toggleMember(member)}
                                            className="hover:text-indigo-900"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={createGroup.isPending}
                            className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {createGroup.isPending ? "Creating..." : "Create Group"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
