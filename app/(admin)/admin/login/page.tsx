"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "@/app/actions/adminAuthActions";
import { Lock, Disc3, ShieldAlert, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await loginAdmin(formData);

    setLoading(false);

    if (res.success) {
      router.push("/admin/dashboard");
    } else {
      setError(res.message || "Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-md bg-zinc-900 border border-red-900/40 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-950/80 border border-red-800/60 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">
            Admin Portal
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Red Monkey Entertainment Crew Auth
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-red-500" /> Admin Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@redmonkey.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-red-500" /> Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase text-xs rounded-xl transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <Disc3 className="w-4 h-4 animate-spin" />
            ) : (
              "Authenticate Access"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          First time here?{" "}
          <Link
            href="/admin/register"
            className="text-red-500 font-bold hover:underline"
          >
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
}
