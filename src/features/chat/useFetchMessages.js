import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../../services/apiMessages";
import { useSocket } from "../../context/SocketContext";

export function useFetchMessages(friendId) {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    const { data: messages = [], isLoading, error } = useQuery({
        queryKey: ["messages", friendId],
        queryFn: () => getMessages(friendId),
        enabled: !!friendId,
    });

    const { mutate: handleSendMessage, isPending: isSending } = useMutation({
        mutationFn: (text) => sendMessage({ receiverId: friendId, message: text }),

        onMutate: async (text) => {
        const tempMessage = {
            id: `temp_${Date.now()}`,
            message: text,     
            sender: "me",
            createdAt: new Date().toISOString(),
            pending: true,
        };
        queryClient.setQueryData(["messages", friendId], (old = []) => [
            ...old,
            tempMessage,
        ]);
        return { tempMessage };
        },

        onSuccess: (savedMessage, _, context) => {
        // Replace temp with real message
        queryClient.setQueryData(["messages", friendId], (old = []) =>
            old.map((m) => (m.id === context.tempMessage.id ? savedMessage : m))
        );
        // Update sidebar last message
        queryClient.setQueryData(["userChats"], (oldChats = []) =>
            oldChats.map((chat) =>
            chat._id === friendId ? { ...chat, lastMessage: savedMessage } : chat
            )
        );
        },

        onError: (_, __, context) => {
        queryClient.setQueryData(["messages", friendId], (old = []) =>
            old.filter((m) => m.id !== context.tempMessage.id)
        );
        },
    });

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
        if (
            newMessage.sender._id === friendId ||
            newMessage.sender === friendId
        ) {
            queryClient.setQueryData(["messages", friendId], (old = []) => {
            const exists = old.some((m) => m._id === newMessage._id);
            if (exists) return old;
            return [...old, newMessage];
            });
        }

        // Always update sidebar
        queryClient.setQueryData(["userChats"], (oldChats = []) => {
            if (!oldChats) return [];
            const updated = oldChats.map((chat) => {
            const isThisChat = chat.participants?.some(
                (p) => p._id === newMessage.sender._id || p === newMessage.sender
            );
            if (!isThisChat) return chat;
            return { ...chat, lastMessage: newMessage };
            });
            return updated.sort(
            (a, b) =>
                new Date(b.lastMessage?.createdAt) -
                new Date(a.lastMessage?.createdAt)
            );
        });
        };

        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [socket, friendId, queryClient]);

    return { messages, isLoading, error, handleSendMessage, isSending };
}