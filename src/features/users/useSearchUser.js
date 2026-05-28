import {useQuery} from "@tanstack/react-query";
import {getUser} from "../../services/apiUser";

export function useSearchUser(userName) {
    const {data: user, isLoading, error} = useQuery({
        queryKey: ["user", userName],
        queryFn: () => getUser({userName}),
        enabled: !!userName,
        staleTime: 50000,
        gcTime: 1000 * 60,
    })


    return {user, isLoading, error};
}