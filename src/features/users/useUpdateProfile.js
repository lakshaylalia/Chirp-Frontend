import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useParams} from "react-router-dom"
import toast from "react-hot-toast";

import {updateUser as updateUserApi} from "../../services/apiUser";

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { userName } = useParams();

    const {mutate: updateUser, isPending, error} = useMutation({
        mutationFn: updateUserApi,
        onSuccess: (data) => {
            queryClient.setQueryData(["profile", userName], data);
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success("Profile updated successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update profile");
        },
    });

    return {updateUser, isPending , error}
}