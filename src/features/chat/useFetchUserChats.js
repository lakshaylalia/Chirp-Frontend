import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserChats } from "../../services/apiChat";
import { useSocket } from "../../context/SocketContext";

export function useFetchUserChats(activeFriendId = null, currentUserId) {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    const activeFriendIdRef = useRef(activeFriendId);
    useEffect(() => {
        activeFriendIdRef.current = activeFriendId;
    }, [activeFriendId]);

    const {
        data: chats = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["userChats"],
        enabled: !!currentUserId,
        queryFn: async () => {
            const conversations = await getUserChats();

            return conversations.map((conv) => {
                const friend = conv.participants.find(
                    (p) => (p._id || p).toString() !== currentUserId.toString(),
                );

                return {
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
            });
        },
    });

    // Reset unread when chat is opened
    useEffect(() => {
        if (!activeFriendId) return;

        queryClient.setQueryData(["userChats"], (oldChats) => {
            if (!oldChats) return [];
            return oldChats.map((chat) =>
                chat.friendId === activeFriendId ? { ...chat, unreadCount: 0 } : chat,
            );
        });
    }, [activeFriendId, queryClient]);

    useEffect(() => {
        if (!socket) return;

        function handleIncomingMessage(newMessage) {
            queryClient.setQueryData(["userChats"], (oldChats) => {
                if (!oldChats) return [];

                const senderId = (
                    newMessage.sender?._id || newMessage.sender
                ).toString();

                const updated = oldChats.map((chat) => {
                    if (chat.friendId !== senderId) return chat;

                    const isBackground = activeFriendIdRef.current !== senderId;

                    return {
                        ...chat,
                        lastMessage: newMessage,
                        unreadCount: isBackground ? (chat.unreadCount || 0) + 1 : 0,
                    };
                });

                return updated.sort((a, b) => {
                    const timeA = a.lastMessage?.createdAt
                        ? new Date(a.lastMessage.createdAt)
                        : 0;
                    const timeB = b.lastMessage?.createdAt
                        ? new Date(b.lastMessage.createdAt)
                        : 0;
                    return timeB - timeA;
                });
            });
        }

        socket.on("newMessage", handleIncomingMessage);
        return () => socket.off("newMessage", handleIncomingMessage);
    }, [socket, queryClient]);

    return { chats, isLoading, error };
}