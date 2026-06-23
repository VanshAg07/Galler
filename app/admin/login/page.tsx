"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { API_URL } from "@/app/lib/apiUrl";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!API_URL) {
        setError(
          "API URL is not configured. Set NEXT_PUBLIC_API_URL on Vercel to your Render backend URL."
        );
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      localStorage.setItem("galler_admin_token", data.token);
      localStorage.setItem("galler_admin_user", JSON.stringify(data.user));
      router.push("/admin");
    } catch {
      setError("Unable to connect to server. Make sure the backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a1a1a]">
              <span className="text-xl font-bold text-white">G</span>
            </div>
            <span className="text-2xl font-bold text-[#1a1a1a]">Galler</span>
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-[#1a1a1a]">
            Admin Portal
          </h1>
          <p className="mb-8 text-sm text-gray-500">
            Sign in to manage your website content
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@galler.com"
                required
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[var(--primary-orange)] focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[var(--primary-orange)] focus:bg-white"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-[var(--primary-orange)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b8451a] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-amber-50 p-4">
            <p className="text-xs font-medium text-amber-800">
              Development credentials
            </p>
            <p className="mt-1 text-xs text-amber-600">
              Email: admin@galler.com
              <br />
              Password: admin123
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          <Link href="/" className="hover:text-[var(--primary-orange)]">
            &larr; Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
