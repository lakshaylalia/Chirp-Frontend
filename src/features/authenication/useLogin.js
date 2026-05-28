import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {login as loginApi} from "../../services/apiAuth.js";
import {toast} from "react-hot-toast";

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {mutate: login, isPending} = useMutation({
        mutationFn: ({email, password}) => loginApi({email, password}),
        onSuccess: (data) => {
            queryClient.setQueryData(["user"], data.user);
            toast.success("Login Successfull");
            navigate("/", {replace: true});
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message);
        }
    });

    return {login, isPending};
}