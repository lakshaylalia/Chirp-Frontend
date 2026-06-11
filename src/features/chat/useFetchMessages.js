import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getMessages, sendMessage, sendGroupMessage, deleteMessage } from "../../services/apiMessages";
import { deleteGroupMessage } from "../../services/apiGroup";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";

export function useFetchMessages(friendId, currentUserId, groupId = null) {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    const isGroupChat = !!groupId;

    // Join group room when entering a group chat
    useEffect(() => {
        if (!socket || !isGroupChat || !groupId || !currentUserId) return;

        // Join the group room
        socket.emit("joinGroup", { groupId, userId: currentUserId });
        console.log(`Joining group room: group_${groupId}`);

        // Leave the group room when unmounting
        return () => {
            socket.emit("leaveGroup", { groupId, userId: currentUserId });
            console.log(`Leaving group room: group_${groupId}`);
        };
    }, [socket, isGroupChat, groupId, currentUserId]);

    const { data: messages = [], isLoading, error } = useQuery({
        queryKey: isGroupChat ? ["groupMessages", groupId] : ["messages", friendId],
        queryFn: () => isGroupChat ? getMessages(groupId, true) : getMessages(friendId),
        enabled: !!friendId || !!groupId,
        staleTime: 1000 * 60 * 5
    });

    const { mutate: handleSendMessage, isPending: isSending } = useMutation({
        // Accept either (text) for text messages or ({ text, imageFile }) for image messages
        mutationFn: (data) => {
            // Handle both string (text only) and object (text + image) inputs
            const text = typeof data === 'string' ? data : data.text;
            const imageFile = typeof data === 'object' ? data.imageFile : undefined;

            if (isGroupChat) {
                return sendGroupMessage({ groupId, message: text });
            } else {
                return sendMessage({ receiverId: friendId, message: text, imageFile });
            }
        },

        onMutate: async (data) => {
            const text = typeof data === 'string' ? data : data.text;
            const imageFile = typeof data === 'object' ? data.imageFile : undefined;

            const queryKey = isGroupChat ? ["groupMessages", groupId] : ["messages", friendId];
            const tempMessage = {
                _id: `temp_${Date.now()}`,
                message: text || "",
                image: imageFile ? URL.createObjectURL(imageFile) : null,
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

        onSuccess: (savedMessage, variables, context) => {
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

    const { mutate: handleDeleteMessage } = useMutation({
        mutationFn: (messageId) => isGroupChat
            ? deleteGroupMessage({ groupId, messageId })
            : deleteMessage({ messageId }),
        onMutate: async (messageId) => {
            const queryKey = isGroupChat ? ["groupMessages", groupId] : ["messages", friendId];
            await queryClient.cancelQueries({ queryKey });

            const previousMessages = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old = []) =>
                old.filter((m) => m._id !== messageId)
            );

            return { previousMessages, queryKey };
        },
        onError: (error, _, context) => {
            toast.error(error.message || "Failed to delete message");
            queryClient.setQueryData(context.queryKey, context.previousMessages);
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

        const handleNewGroupMessage = (data) => {
            if (isGroupChat && data.groupId === groupId) {
                // The message is in data.message (from controller emit)
                const newMessage = data.message;
                queryClient.setQueryData(["groupMessages", groupId], (old = []) => {
                    const exists = old.some((m) => m._id === newMessage._id);
                    if (exists) return old;
                    return [...old, newMessage];
                });
            }
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("newGroupMessage", handleNewGroupMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("newGroupMessage", handleNewGroupMessage);
        };
    }, [socket, friendId, groupId, queryClient, isGroupChat]);

    return { messages, isLoading, error, handleSendMessage, isSending, handleDeleteMessage };
}
