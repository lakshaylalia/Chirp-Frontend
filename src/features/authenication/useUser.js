import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
    const {
        isLoading,
        data: user,
        error,
        isError,
    } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    return {
        isLoading,
        user,
        error,
        isError,
    };
}