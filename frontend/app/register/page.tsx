"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5EFE6] px-6 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight text-[#1C1917]"
          >
            TaskHub
          </Link>

          <p className="mt-2 text-sm text-[#795548]">
            Create your account
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border border-[#D8CBB8] bg-[#F8F3EC] p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-[#1C1917]">
            Create an account
          </h1>

          <p className="mt-2 text-sm text-[#62584F]">
            Start managing your projects and tasks with TaskHub.
          </p>

          {error && (
            <div className="mt-5 rounded-lg border border-[#D8AFA3] bg-[#F3DDD7] px-4 py-3 text-sm text-[#7A2E21]">
              {error}
            </div>
          )}

          <form
            onSubmit={handleRegister}
            className="mt-6 space-y-5"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[#1C1917]"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-[#C9B9A5] bg-[#FFFDF9] px-4 py-3 text-[#1C1917] outline-none transition placeholder:text-[#9A8C7D] focus:border-[#795548]"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#1C1917]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-[#C9B9A5] bg-[#FFFDF9] px-4 py-3 text-[#1C1917] outline-none transition placeholder:text-[#9A8C7D] focus:border-[#795548]"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#1C1917]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                required
                className="w-full rounded-lg border border-[#C9B9A5] bg-[#FFFDF9] px-4 py-3 text-[#1C1917] outline-none transition placeholder:text-[#9A8C7D] focus:border-[#795548]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1C1917] px-4 py-3 font-semibold text-white transition hover:bg-[#332C27] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-[#62584F]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#1C1917] underline underline-offset-4 hover:text-[#795548]"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Back Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[#795548] hover:text-[#1C1917]"
          >
            ← Back to TaskHub
          </Link>
        </div>
      </div>
    </main>
  );
}

