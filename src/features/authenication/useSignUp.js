import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {signUp as signUpApi} from "../../services/apiAuth.js";
import {toast} from "react-hot-toast";


export function useSignUp() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {mutate: signUp, isPending} = useMutation({
        mutationFn: ({userName, email, password}) => signUpApi({userName, email, password}),
        onSuccess: (data) => {
            queryClient.setQueryData(["user"], data.user);
            toast.success("Account created successfully. Please verify new account from user's email address");
            navigate("/", {replace: true});
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message);
        }
    })
    
    return { signUp, isPending };
}