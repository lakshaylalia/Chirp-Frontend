import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserChats } from "../../services/apiChat";
import { useSocket } from "../../context/SocketContext";

export function useFetchUserChats(activeFriendId = null) {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    const activeFriendIdRef = useRef(activeFriendId);
    useEffect(() => {
        activeFriendIdRef.current = activeFriendId;
    }, [activeFriendId]);

    const { data: chats = [], isLoading, error } = useQuery({
        queryKey: ["userChats"],
        queryFn: getUserChats,
    });

    // Reset unread count when user opens a chat
    useEffect(() => {
        if (!activeFriendId) return;

        queryClient.setQueryData(["userChats"], (oldChats) => {
        if (!oldChats) return [];
        return oldChats.map((chat) => {
            const isActiveChat = chat.participants?.some(
            (p) => (p._id || p).toString() === activeFriendId
            );
            return isActiveChat ? { ...chat, unreadCount: 0 } : chat;
        });
        });
    }, [activeFriendId, queryClient]);

    useEffect(() => {
        if (!socket) return;

        function handleIncomingMessage(newMessage) {
        queryClient.setQueryData(["userChats"], (oldChats) => {
            if (!oldChats) return [];

            const updated = oldChats.map((chat) => {
            // match conversation by checking participants contains the sender
            const isThisChat = chat.participants?.some(
                (p) => (p._id || p).toString() === (newMessage.sender?._id || newMessage.sender).toString()
            );

            if (!isThisChat) return chat;

            // check against sender's _id not chatId
            const isBackground =
                activeFriendIdRef.current !==
                (newMessage.sender?._id || newMessage.sender).toString();

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