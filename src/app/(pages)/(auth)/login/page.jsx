"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      toast.success(data.message);
      console.log(document.cookie);
    } else {
      toast.error(data.message);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-5 p-5 border border-gray-300 shadow-2xl rounded-md max-w-lg w-80">
        <h1 className="font-bold text-4xl text-blue-500 text-center">Login</h1>
        <form className="flex flex-col gap-4">
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
            type="email"
            id="email"
          />
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
            type="password"
            id="password"
          />
          <button
            onClick={login}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md transition-all active:scale-95"
            type="button"
          >
            Login
          </button>
          <p className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link
              className="text-blue-500 hover:underline cursor-pointer"
              href="/register"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
