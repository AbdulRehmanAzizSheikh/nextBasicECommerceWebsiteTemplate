"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function SendOtpPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  async function handleSendOtp() {
    if (!email.trim()) {
      toast.error("Please enter your email!");
      return;
    }
    localStorage.setItem("emailForVerifyOtp", email);
    localStorage.setItem("otpExpiry", (Date.now() + 10 * 60 * 1000).toString());
    localStorage.setItem("otpSent", "true");
    try {
      const res = await fetch("/api/auth/verify/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        router.push("/verify-email/verify-otp");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }
  return (
    <div>
      <div>
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 px-4 py-2 rounded-md"
          />
          <button
            onClick={handleSendOtp}
            className="bg-blue-500 text-white px-8 py-2 rounded-md"
          >
            Send Otp
          </button>
        </div>
      </div>
    </div>
  );
}