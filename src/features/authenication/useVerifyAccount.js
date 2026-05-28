import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { verifyAccount } from "../../services/apiAuth";

export function useVerifyAccount() {
    
    const { mutate: verify, isPending: isVerifying } = useMutation({
        mutationFn: ({ email, code }) => verifyAccount({ email, code }),
        onSuccess: () => {
        toast.success("Email verified successfully");
        },
        onError: (err) => {
        toast.error(err.message || "Invalid or expired OTP");
        },
    });

    return { verify, isVerifying };
}
