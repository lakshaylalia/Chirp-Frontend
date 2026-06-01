import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


import { socket } from "../../services/socket";
import { logout } from "../../services/apiAuth";

export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate: logOut, isPending } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
        socket.disconnect();
        toast.success("Logged out successfully");
        queryClient.removeQueries();
        navigate("/login", { replace: true });
        },
        onError: () => {
        toast.error("Something went wrong");
        },
    });

    return { logOut, isPending };
}
