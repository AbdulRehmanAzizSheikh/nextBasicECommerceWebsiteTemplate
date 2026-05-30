"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "../../../../components/loader";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    if (!email || !password) {
      toast.warn("Please fill in all fields! ⚠️");
      return;
    }

    setLoading(true);
    try {
      console.log("Logging in:", email, password);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Login Successfully!");
        // router.push("/");
      } else {
        toast.error(data.message || "Email or password is incorrect!");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loader />;
  }
  return (
    // 🌌 Aesthetic Mesh Gradient Background
    <div className="flex items-center justify-center min-h-screen bg-gray-950 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-gray-950 to-purple-950 p-4">
      {/* 🔮 Background Abstract Glow Shapes */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      {/* 💳 Water Transparent / Glassmorphism Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8 sm:p-10 transition-all duration-300 hover:border-white/[0.15]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Login to your account to continue
          </p>
        </div>

        {/* Form Container (Ab bilkul sahi band ho raha hai) */}
        <div className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-1"
            >
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="name@example.com"
              className="bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white/[0.08] focus:ring-2 focus:ring-blue-500/20 transition-all text-sm w-full"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-1"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="••••••••"
              className="bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white/[0.08] focus:ring-2 focus:ring-blue-500/20 transition-all text-sm w-full"
            />
          </div>

          {/* ✨ Premium Interactive Button */}
          <button
            onClick={login}
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            type="button"
          >
            Login
          </button>
        </div>

        {/* Footer Redirect Link */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium hover:underline transition-all"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
