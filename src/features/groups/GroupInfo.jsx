import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGroup } from "../../services/apiGroup";
import GroupSettings from "./GroupSettings";
import Spinner from "../../components/Spinner";

export default function GroupInfo() {
    const { groupId } = useParams();
    const [showSettings, setShowSettings] = useState(false);

    const { data: group, isLoading, error } = useQuery({
        queryKey: ["group", groupId],
        queryFn: () => getGroup({ groupId }),
        enabled: !!groupId,
    });

    if (isLoading) return <Spinner />;
    if (error) return <div className="p-4 text-red-500">Failed to load group info</div>;

    // Handle different field names from API (participants vs members)
    const members = group?.members || group?.participants || [];
    const admins = group?.admins || group?.adminIds || [];

    return (
        <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
                {group.groupIcon || group.avatar ? (
                    <img src={group.groupIcon || group.avatar} alt={group.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-medium">
                        {group.name?.slice(0, 2).toUpperCase()}
                    </div>
                )}
                <div>
                    <h2 className="font-semibold">{group.name}</h2>
                    <p className="text-sm text-gray-500">{members.length} members</p>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="ml-auto p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>

            {showSettings && <GroupSettings group={group} onClose={() => setShowSettings(false)} />}
        </div>
    );
}
