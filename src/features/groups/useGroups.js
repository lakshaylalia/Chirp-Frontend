import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createGroup,
    getGroup,
    getUserGroups,
    deleteGroup,
    updateGroup,
    addMembers,
    removeMember,
    leaveGroup,
    getGroupMessages,
    sendGroupMessage,
    deleteGroupMessage,
} from "../../services/apiGroup";
import toast from "react-hot-toast";

export function useCreateGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGroup,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["userGroups"] });
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            toast.success("Group created successfully");
            return data;
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create group");
        },
    });
}

export function useGetGroup({ groupId }) {
    return useQuery({
        queryKey: ["group", groupId],
        queryFn: () => getGroup({ groupId }),
        enabled: !!groupId,
        staleTime: 1000 * 60 * 5,
    });
}

export function useUserGroups() {
    return useQuery({
        queryKey: ["userGroups"],
        queryFn: getUserGroups,
        staleTime: 1000 * 60 * 5,
    });
}

export function useDeleteGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userGroups"] });
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            toast.success("Group deleted successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete group");
        },
    });
}

export function useUpdateGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateGroup,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["group", variables.groupId] });
            toast.success("Group updated successfully");
            return data;
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update group");
        },
    });
}

export function useAddMembers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addMembers,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["group", variables.groupId] });
            toast.success("Members added successfully");
            return data;
        },
        onError: (error) => {
            toast.error(error.message || "Failed to add members");
        },
    });
}

export function useRemoveMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeMember,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["group", variables.groupId] });
            toast.success("Member removed successfully");
            return data;
        },
        onError: (error) => {
            toast.error(error.message || "Failed to remove member");
        },
    });
}

export function useLeaveGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: leaveGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userGroups"] });
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            toast.success("Left group successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to leave group");
        },
    });
}

export function useGetGroupMessages({ groupId }) {
    return useQuery({
        queryKey: ["groupMessages", groupId],
        queryFn: () => getGroupMessages({ groupId }),
        enabled: !!groupId,
        staleTime: 1000 * 60 * 5,
    });
}

export function useSendGroupMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sendGroupMessage,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["groupMessages", variables.groupId] });
            return data;
        },
        onError: (error) => {
            toast.error(error.message || "Failed to send message");
        },
    });
}

export function useDeleteGroupMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteGroupMessage,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["groupMessages", variables.groupId] });
            toast.success("Message deleted");
            return data;
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete message");
        },
    });
}
