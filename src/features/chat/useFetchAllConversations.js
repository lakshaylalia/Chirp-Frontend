import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserChats } from "../../services/apiChat";
import { getUserGroups } from "../../services/apiGroup";
import { useSocket } from "../../context/SocketContext";

export function useFetchAllConversations(activeConversationId = null, currentUserId) {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    const activeConversationIdRef = useRef(activeConversationId);
    useEffect(() => {
        activeConversationIdRef.current = activeConversationId;
    }, [activeConversationId]);

    // Fetch both direct messages and groups
    const { data: directChats = [], isLoading: isLoadingDirect } = useQuery({
        queryKey: ["userChats"],
        enabled: !!currentUserId,
        queryFn: async () => {
            const conversations = await getUserChats();
            return conversations
                .filter((conv) => conv.type === "direct")
                .map((conv) => {
                    const friend = conv.participants.find(
                        (p) => (p._id || p).toString() !== currentUserId.toString(),
                    );
                    if (!friend) return null;
                    return {
                        type: "direct",
                        conversationId: (friend._id || friend).toString(),
                        friendId: (friend._id || friend).toString(),
                        user: {
                            name: friend.userName,
                            avatarImage: friend.avatarImage ?? null,
                        },
                        lastMessage: conv.lastMessage ?? null,
                        unreadCount: 0,
                        isOnline: false,
                        _raw: conv,
                    };
                })
                .filter(Boolean);
        },
    });

    const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
        queryKey: ["userGroups"],
        enabled: !!currentUserId,
        queryFn: async () => {
            const userGroups = await getUserGroups();
            return userGroups.map((group) => ({
                type: "group",
                conversationId: group._id,
                groupId: group._id,
                user: {
                    name: group.name,
                    avatarImage: group.groupIcon ?? group.avatar ?? null,
                },
                lastMessage: group.lastMessage ?? null,
                unreadCount: 0,
                members: group.participants?.length || 0,
                _raw: group,
            }));
        },
    });

    // Combine and sort by last message time
    const allConversations = [...directChats, ...groups].sort((a, b) => {
        const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
        const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
        return timeB - timeA;
    });

    const isLoading = isLoadingDirect || isLoadingGroups;

    // Reset unread when conversation is opened
    useEffect(() => {
        if (!activeConversationId) return;

        // Update direct chat unread
        queryClient.setQueryData(["userChats"], (oldChats) => {
            if (!oldChats) return [];
            return oldChats.map((chat) =>
                chat.friendId === activeConversationId ? { ...chat, unreadCount: 0 } : chat,
            );
        });

        // Update group unread (could be implemented later)
    }, [activeConversationId, queryClient]);

    // Handle incoming direct messages
    useEffect(() => {
        if (!socket) return;

        function handleIncomingMessage(newMessage) {
            queryClient.setQueryData(["userChats"], (oldChats) => {
                if (!oldChats) return [];

                const senderId = (newMessage.sender?._id || newMessage.sender).toString();
                const isGroupMessage = !!newMessage.groupId;

                if (isGroupMessage) {
                    // Update group last message
                    queryClient.setQueryData(["userGroups"], (oldGroups) => {
                        if (!oldGroups) return [];
                        return oldGroups.map((group) => {
                            if (group._id === newMessage.groupId) {
                                const isBackground = activeConversationIdRef.current !== newMessage.groupId;
                                return {
                                    ...group,
                                    lastMessage: newMessage,
                                    unreadCount: isBackground ? (group.unreadCount || 0) + 1 : 0,
                                };
                            }
                            return group;
                        });
                    });
                    return oldChats;
                }

                // Direct message update
                const updated = oldChats.map((chat) => {
                    if (chat.friendId !== senderId) return chat;
                    const isBackground = activeConversationIdRef.current !== senderId;
                    return {
                        ...chat,
                        lastMessage: newMessage,
                        unreadCount: isBackground ? (chat.unreadCount || 0) + 1 : 0,
                    };
                });

                return updated.sort((a, b) => {
                    const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
                    const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
                    return timeB - timeA;
                });
            });
        }

        function handleNewGroupMessage(data) {
            // Update group when new group message arrives
            queryClient.setQueryData(["userGroups"], (oldGroups) => {
                if (!oldGroups) return [];
                if (data.groupId !== activeConversationIdRef.current) {
                    return oldGroups.map((group) => {
                        if (group._id === data.groupId) {
                            return {
                                ...group,
                                lastMessage: data.message,
                                unreadCount: (group.unreadCount || 0) + 1,
                            };
                        }
                        return group;
                    });
                }
                return oldGroups;
            });
        }

        socket.on("newMessage", handleIncomingMessage);
        socket.on("newGroupMessage", handleNewGroupMessage);

        return () => {
            socket.off("newMessage", handleIncomingMessage);
            socket.off("newGroupMessage", handleNewGroupMessage);
        };
    }, [socket, queryClient]);

    return { conversations: allConversations, isLoading };
}
