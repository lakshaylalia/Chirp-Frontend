import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSignUp } from "./useSignUp";
import { useSendOtp } from "./useSendOtp";
import { useVerifyAccount } from "./useVerifyAccount";
import { googleAuth } from "../../services/apiAuth";

const STEP = {
  EMAIL: "email", // just email field + Send OTP
  OTP: "otp", // OTP input, email locked
  VERIFIED: "verified", // full form unlocked
};

const RESEND_COOLDOWN = 30;

function SignupForm() {
  const { register, formState, handleSubmit, getValues, trigger, reset } =
    useForm();
  const { errors } = formState;

  const { signUp, isPending } = useSignUp();
  const { sendOtp, isSendingOtp } = useSendOtp();
  const { verify, isVerifying } = useVerifyAccount();

  const [step, setStep] = useState(STEP.EMAIL);
  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // OTP input refs for 6 individual boxes
  const otpRefs = useRef([]);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Focus first OTP box when step changes to OTP
  useEffect(() => {
    if (step === STEP.OTP) {
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  async function handleSendOtp() {
    const valid = await trigger("email");
    if (!valid) return;

    const email = getValues("email");
    sendOtp(
      { email },
      {
        onSuccess: () => {
          setStep(STEP.OTP);
          setOtpValues(["", "", "", "", "", ""]);
          setOtpError("");
          setCooldown(RESEND_COOLDOWN);
        },
      },
    );
  }

  async function handleResendOtp() {
    if (cooldown > 0) return;
    const email = getValues("email");
    sendOtp(
      { email },
      {
        onSuccess: () => {
          setOtpValues(["", "", "", "", "", ""]);
          setOtpError("");
          setCooldown(RESEND_COOLDOWN);
          setTimeout(() => otpRefs.current[0]?.focus(), 50);
        },
      },
    );
  }

  function handleOtpChange(index, value) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otpValues];
    next[index] = value.slice(-1);
    setOtpValues(next);
    setOtpError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits filled
    if (next.every((v) => v !== "") && value) {
      handleVerifyOtp(next.join(""));
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = [...otpValues];
    pasted.split("").forEach((char, i) => {
      if (i < 6) next[i] = char;
    });
    setOtpValues(next);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();

    if (next.every((v) => v !== "")) {
      handleVerifyOtp(next.join(""));
    }
  }

  function handleVerifyOtp(code) {
    const email = getValues("email");
    setOtpError("");
    verify(
      { email, code },
      {
        onSuccess: () => {
          setStep(STEP.VERIFIED);
        },
        onError: (err) => {
          setOtpError(err.message || "Invalid or expired OTP");
          setOtpValues(["", "", "", "", "", ""]);
          setTimeout(() => otpRefs.current[0]?.focus(), 50);
        },
      },
    );
  }

  function onSubmit({ email, userName, password }) {
    signUp({ email, userName, password }, { onSuccess: () => reset() });
  }

  function handleGoogleSignup() {
    googleAuth();
  }

  const isOtpComplete = otpValues.every((v) => v !== "");
  const anyLoading = isPending || isSendingOtp || isVerifying;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-xl font-semibold text-slate-800">
            Create an account
          </h1>
          <p className="text-sm text-slate-500 mt-1">Sign up to get started</p>
        </div>

        {/* Google Sign-Up */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={anyLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-slate-300
            bg-white hover:bg-slate-50 active:scale-[0.98] transition-all text-sm font-medium text-slate-700
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.5 0 10.5-2.1 14.2-5.6l-6.6-5.4C29.7 34.9 27 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.3 35.5 16.1 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.6 5.4C42 35.8 44 30.3 44 24c0-1.2-.1-2.4-.4-3.5z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">or sign up with email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* Email field — always visible, locked after OTP sent */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled={
                  anyLoading || step === STEP.OTP || step === STEP.VERIFIED
                }
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400
                  bg-white outline-none transition
                  focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                  disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
                  ${
                    step === STEP.VERIFIED
                      ? "border-green-400 bg-green-50 pr-9"
                      : errors.email
                        ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                        : "border-slate-300 hover:border-slate-400"
                  }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {/* Green checkmark when verified */}
              {step === STEP.VERIFIED && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7.5" stroke="#22c55e" />
                    <path
                      d="M4.5 8l2.5 2.5 4.5-4.5"
                      stroke="#22c55e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>
            {errors.email && step === STEP.EMAIL && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
            {step === STEP.VERIFIED && (
              <p className="text-xs text-green-600 font-medium">
                Email verified
              </p>
            )}
          </div>

          {/* Send OTP button — only on EMAIL step */}
          {step === STEP.EMAIL && (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="w-full py-2.5 rounded-lg border border-blue-400 text-blue-500 text-sm font-medium
                hover:bg-blue-50 active:scale-[0.98] transition-all
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSendingOtp ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                "Send verification code"
              )}
            </button>
          )}

          {/* OTP input — only on OTP step */}
          {step === STEP.OTP && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Verification code
                </label>
                <p className="text-xs text-slate-400">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {/* 6 OTP boxes */}
              <div
                className="flex gap-2 justify-between"
                onPaste={handleOtpPaste}
              >
                {otpValues.map((val, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    disabled={isVerifying}
                    className={`w-10 h-11 text-center text-base font-semibold rounded-lg border outline-none transition
                      focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        otpError
                          ? "border-red-400 bg-red-50 text-red-600"
                          : val
                            ? "border-blue-400 bg-blue-50 text-slate-800"
                            : "border-slate-300 bg-white text-slate-800"
                      }`}
                  />
                ))}
              </div>

              {/* OTP error */}
              {otpError && <p className="text-xs text-red-500">{otpError}</p>}

              {/* Verify button + resend */}
              <button
                type="button"
                onClick={() => handleVerifyOtp(otpValues.join(""))}
                disabled={!isOtpComplete || isVerifying}
                className="w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 active:scale-[0.98]
                  text-white text-sm font-medium transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Verify email"
                )}
              </button>

              {/* Resend */}
              <p className="text-center text-xs text-slate-500">
                Didn&apos;t receive a code?{" "}
                {cooldown > 0 ? (
                  <span className="text-slate-400">Resend in {cooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isSendingOtp}
                    className="text-blue-500 hover:text-blue-600 font-medium transition-colors disabled:opacity-50"
                  >
                    {isSendingOtp ? "Sending..." : "Resend code"}
                  </button>
                )}
              </p>
            </div>
          )}

          {/* Rest of form — only unlocked after email verified */}
          {step === STEP.VERIFIED && (
            <>
              {/* Username */}
              <div className="space-y-1.5">
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-slate-700"
                >
                  Username
                </label>
                <input
                  id="userName"
                  type="text"
                  placeholder="johndoe"
                  disabled={isPending}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400
                    bg-white outline-none transition
                    focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                    disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
                    ${errors.userName ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-slate-300 hover:border-slate-400"}`}
                  {...register("userName", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Only letters, numbers, and underscores allowed",
                    },
                  })}
                />
                {errors.userName && (
                  <p className="text-xs text-red-500">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isPending}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400
                    bg-white outline-none transition
                    focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                    disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
                    ${errors.password ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-slate-300 hover:border-slate-400"}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  disabled={isPending}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400
                    bg-white outline-none transition
                    focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                    disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
                    ${errors.confirmPassword ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-slate-300 hover:border-slate-400"}`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-1 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 active:scale-[0.98]
                  text-white text-sm font-medium transition-all
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </button>
            </>
          )}
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupForm;
