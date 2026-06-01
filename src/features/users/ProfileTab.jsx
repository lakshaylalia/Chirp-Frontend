import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {useUpdateProfile} from "./useUpdateProfile";
import { getUser } from "../../services/apiUser";
import { useUser } from "../authenication/useUser";

export default function ProfileTab() {
    const { userName } = useParams();
    const { user: currentUser } = useUser();
    const {updateUser, isPending} = useUpdateProfile();

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ["profile", userName],
        queryFn: () => getUser({ userName }),
        enabled: !!userName,
        staleTime: 1000 * 60 * 5,
    });

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState({ displayName: "", avatarImage: "", bio: "" });


    if (isLoading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">Failed to load profile.</div>;

    const isOwn = currentUser && profile && currentUser.userName === profile.userName;
    console.log("Current User:" ,currentUser);
    console.log("Profile:" ,profile);

    function startEdit() {
        setDraft({
            displayName: profile.displayName || profile.userName || "",
            avatarImage: profile.avatarImage || "",
            bio: profile.bio || ""
        });
        setEditing(true);
    }

    function saveEdit() {
        updateUser(
            {
                displayName: draft.displayName,
                avatarImage: draft.avatarImage,
                bio: draft.bio,
            },
            {
                onSuccess: () => {
                    setEditing(false);
                },
            }
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-6">
                {profile.avatarImage ? (
                    <img src={profile.avatarImage} alt={profile.displayName || profile.userName} className="w-28 h-28 rounded-full object-cover" />
                ) : (
                    <div className="w-28 h-28 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl">
                        {(profile.displayName || profile.userName)?.slice(0, 2).toUpperCase()}
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-semibold">{profile.displayName || profile.userName}</h2>
                    {profile.userName && (
                        <p className="text-sm text-gray-500">@{profile.userName}</p>
                    )}
                    {profile.createdAt && (
                        <p className="text-sm text-gray-500">Joined {new Date(profile.createdAt).toLocaleDateString()}</p>
                    )}
                </div>

                <div className="ml-auto">
                    {isOwn && !editing && (
                        <button onClick={startEdit} className="px-3 py-1 rounded bg-indigo-600 text-white">Edit Profile</button>
                    )}
                </div>
            </div>

            {editing && (
                <div className="mt-6 p-4 border rounded">
                    <label className="block mb-2 text-sm">Display name</label>
                    <input
                        className="w-full p-2 border rounded mb-3"
                        value={draft.displayName}
                        onChange={(e) => setDraft((d) => ({ ...d, displayName: e.target.value }))}
                    />

                    <label className="block mb-2 text-sm">Avatar URL</label>
                    <input
                        className="w-full p-2 border rounded mb-3"
                        value={draft.avatarImage}
                        onChange={(e) => setDraft((d) => ({ ...d, avatarImage: e.target.value }))}
                    />

                    <label className="block mb-2 text-sm">Bio</label>
                    <textarea
                        className="w-full p-2 border rounded mb-3"
                        rows={3}
                        value={draft.bio}
                        onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={saveEdit}
                            disabled={isPending}
                            className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
                        >
                            {isPending ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            disabled={isPending}
                            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Additional profile fields */}
            <div className="mt-6">
                <h3 className="font-medium">About</h3>
                <p className="text-sm text-gray-600 mt-2">{profile.bio || "No bio provided."}</p>
            </div>
        </div>
    );
}