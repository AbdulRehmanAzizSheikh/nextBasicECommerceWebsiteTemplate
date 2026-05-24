"use client";
import { useEffect, useState } from "react";
import {
  ShoppingBag,
  DollarSign,
  Users,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Yahan tum dashboard stats fetch karne ki API call lagaoge baad me
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch("/api/products"); // Temporary use kar rahe hain count ke liye
        const data = await res.json();
        if (data.status) {
          setStats({
            totalProducts: data.count,
            totalSales: 154200, // Dummy for now
            totalOrders: 48, // Dummy for now
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="text-slate-400 text-sm mt-2">
          Loading Dashboard Overview...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 w-full max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Welcome back, Admin
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Here is what's happening with your store today.
        </p>
      </div>

      {/* 📊 QUICK STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {/* Card 1: Sales */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Revenue
            </span>
            <h3 className="text-2xl font-bold font-mono text-emerald-400">
              Rs. {stats.totalSales.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <DollarSign size={22} />
          </div>
        </div>

        {/* Card 2: Products */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Active Inventory
            </span>
            <h3 className="text-2xl font-bold font-mono text-slate-100">
              {stats.totalProducts} Items
            </h3>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
            <ShoppingBag size={22} />
          </div>
        </div>

        {/* Card 3: Orders */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Orders
            </span>
            <h3 className="text-2xl font-bold font-mono text-amber-400">
              {stats.totalOrders} Recieved
            </h3>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* 🔗 QUICK ACTIONS PANEL */}
      <div className="bg-slate-900/20 border border-slate-800/60 p-6 rounded-2xl backdrop-blur-md">
        <h2 className="text-lg font-bold tracking-wide mb-4">
          Quick Navigation
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-5 py-3 rounded-xl text-sm font-medium transition-all group"
          >
            Manage Products
            <ArrowUpRight
              size={16}
              className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </Link>
          {/* Kal ko orders page banaoge to uska link */}
          <button className="flex items-center gap-2 bg-slate-900/50 cursor-not-allowed border border-slate-800/40 px-5 py-3 rounded-xl text-sm font-medium text-slate-500">
            View Orders (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
