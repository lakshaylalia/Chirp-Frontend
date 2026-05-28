import {Link} from "react-router-dom"

import { useForm } from "react-hook-form";
import { useLogin } from "./useLogin";
import {googleAuth} from "../../services/apiAuth"

function LoginForm() {
  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const { login, isPending } = useLogin();

  function onSubmit({ email, password }) {
    if (!email || !password) return;
    login({ email, password }, { onSuccess: () => reset() });
  }

  function handleGoogleSignIn() {
    console.log("Google sign-in triggered");
    googleAuth();
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-xl font-semibold text-slate-800">Sign in</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, enter your details below
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-slate-300
            bg-white hover:bg-slate-50 active:scale-[0.98] transition-all text-sm font-medium text-slate-700
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {/* Google SVG icon */}
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
          <span className="text-xs text-slate-400">or continue with email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={isPending}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400
                bg-white outline-none transition
                focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
                ${errors.email ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-slate-300 hover:border-slate-400"}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
              >
                Forgot password?
              </a>
            </div>
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
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
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
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
