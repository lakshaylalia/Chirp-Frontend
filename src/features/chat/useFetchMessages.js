import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getMessages, sendMessage, sendGroupMessage } from "../../services/apiMessages";
import { useSocket } from "../../context/SocketContext";

export function useFetchMessages(friendId, currentUserId, groupId = null) {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    const isGroupChat = !!groupId;

    const { data: messages = [], isLoading, error } = useQuery({
        queryKey: isGroupChat ? ["groupMessages", groupId] : ["messages", friendId],
        queryFn: () => isGroupChat ? getMessages(groupId, true) : getMessages(friendId),
        enabled: !!friendId || !!groupId,
        staleTime: 1000 * 60 * 5
    });

    const { mutate: handleSendMessage, isPending: isSending } = useMutation({
        mutationFn: (text) => isGroupChat
            ? sendGroupMessage({ groupId, message: text })
            : sendMessage({ receiverId: friendId, message: text }),

        onMutate: async (text) => {
            const queryKey = isGroupChat ? ["groupMessages", groupId] : ["messages", friendId];
            const tempMessage = {
                _id: `temp_${Date.now()}`,
                message: text,
                sender: currentUserId,
                createdAt: new Date().toISOString(),
                pending: true,
                ...(isGroupChat && { isGroupMessage: true }),
            };
            queryClient.setQueryData(queryKey, (old = []) => [
                ...old,
                tempMessage,
            ]);
            return { tempMessage, queryKey };
        },

        onSuccess: (savedMessage, _, context) => {
            queryClient.setQueryData(context.queryKey, (old = []) =>
                old.map((m) => (m._id === context.tempMessage._id ? savedMessage : m))
            );
        },

        onError: (_, __, context) => {
            queryClient.setQueryData(context.queryKey, (old = []) =>
                old.filter((m) => m._id !== context.tempMessage._id)
            );
        },
    });

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            if (isGroupChat) {
                if (newMessage.groupId === groupId) {
                    queryClient.setQueryData(["groupMessages", groupId], (old = []) => {
                        const exists = old.some((m) => m._id === newMessage._id);
                        if (exists) return old;
                        return [...old, newMessage];
                    });
                }
            } else {
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
            }
        };

        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [socket, friendId, groupId, queryClient, isGroupChat]);

    return { messages, isLoading, error, handleSendMessage, isSending };
}