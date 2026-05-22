"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/loader";

export default function SendOtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSendOtp() {
    setLoading(true);
    if (!email.trim()) {
      toast.error("Please enter your email!");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/verify-account/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.status) {
        setLoading(false);
        toast.success(data.message);
      } else {
        setLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
    setLoading(false);
  }

  async function handleVerifyOtp() {
    setLoading(true);
    if (!otp.trim()) {
      toast.error("Please enter the OTP!");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/verify-account/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.status) {
        setLoading(false);
        toast.success(data.message);
      } else {
        setLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
    setLoading(false);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    // 🌌 Aesthetic Mesh Gradient Background (Same as Login/Register)
    <div className="flex items-center justify-center min-h-screen bg-gray-950 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-gray-950 to-purple-950 p-4">
      {/* 🔮 Background Abstract Glow Shapes */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      {/* 💳 Water Transparent / Glassmorphism Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8 sm:p-10 transition-all duration-300 hover:border-white/[0.15]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Verify Account
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            We will send a one-time password to your email
          </p>
        </div>

        {/* Inputs Container */}
        <div className="flex flex-col gap-6">
          {/* Email / Send OTP Block */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-1">
              Email Address
            </label>
            <div className="flex bg-white/[0.05] border border-white/[0.1] rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent text-white placeholder-gray-500 p-3 text-sm focus:outline-none"
              />
              <button
                onClick={handleSendOtp}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm px-4 whitespace-nowrap transition-all duration-200 active:scale-95"
              >
                Send OTP
              </button>
            </div>
          </div>

          {/* OTP / Verify Block */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-1">
              Verification Code
            </label>
            <div className="flex bg-white/[0.05] border border-white/[0.1] rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full bg-transparent text-white placeholder-gray-500 p-3 text-sm focus:outline-none"
              />
              <button
                onClick={handleVerifyOtp}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm px-6 whitespace-nowrap transition-all duration-200 active:scale-95"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
