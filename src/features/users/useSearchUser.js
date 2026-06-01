import {useQuery} from "@tanstack/react-query";
import {searchUser} from "../../services/apiUser";

export function useSearchUser(userName) {
    const {data: user, isLoading, error} = useQuery({
        queryKey: ["user", userName],
        queryFn: () => searchUser({userName}),
        enabled: !!userName,
        staleTime: 50000,
        gcTime: 1000 * 60,
    })


    return {user, isLoading, error};
}