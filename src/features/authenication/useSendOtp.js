import { useMutation } from "@tanstack/react-query";
import { sendOTP } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSendOtp() {
  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationFn: ({ email }) => sendOTP({ email }),
    onSuccess: () => {
      toast.success("OTP sent to your email");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send OTP");
    },
  });

  return { sendOtp, isSendingOtp };
}
