"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  RotateCcw,
  SlidersHorizontal, // Pop-up ke head ke liye icon
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false); // Quick Settings modal state

  // 📍 Draggable Menu Icon Position State
  const [iconPos, setIconPos] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);

  const iconRef = useRef(null);
  const quickSettingsRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const clickTimestamp = useRef(0);

  // 📝 Saare Sidebar ke Routes
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: ClipboardList },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // Outside click se quick settings close karne ke liye
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        quickSettingsRef.current &&
        !quickSettingsRef.current.contains(event.target)
      ) {
        setIsQuickSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 💾 Load Position from LocalStorage on Mount
  useEffect(() => {
    const savedPos = localStorage.getItem("admin-menu-pos");
    if (savedPos) {
      try {
        const parsed = JSON.parse(savedPos);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          const isOutOfBounds =
            parsed.x > window.innerWidth || parsed.y > window.innerHeight;
          if (isOutOfBounds) {
            setIconPos({ x: 16, y: 16 });
          } else {
            setIconPos(parsed);
          }
        }
      } catch (e) {
        console.error("Error parsing localStorage position", e);
      }
    }
  }, []);

  // 🖱️ Mouse Down (Desktop Drag)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    clickTimestamp.current = Date.now();
    dragStart.current = {
      x: e.clientX - iconPos.x,
      y: e.clientY - iconPos.y,
    };
  };

  // 📱 Touch Start (Mobile Drag)
  const handleTouchStart = (e) => {
    setIsDragging(true);
    clickTimestamp.current = Date.now();
    const touch = e.touches[0];
    dragStart.current = {
      x: touch.clientX - iconPos.x,
      y: touch.clientY - iconPos.y,
    };
  };

  // 🔄 Combined Drag Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    const updatePosition = (clientX, clientY) => {
      let newX = clientX - dragStart.current.x;
      let newY = clientY - dragStart.current.y;

      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;

      newX = Math.max(10, Math.min(newX, maxX));
      newY = Math.max(10, Math.min(newY, maxY));

      setIconPos({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        localStorage.setItem("admin-menu-pos", JSON.stringify(iconPos));
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, iconPos]);

  // 🎯 Hamburger Click Logic
  const handleIconClick = () => {
    const clickDuration = Date.now() - clickTimestamp.current;
    if (clickDuration < 200) {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  // ⚡ Reset Position Core Execution
  const handleResetPosition = () => {
    const defaultPos = { x: 16, y: 16 };
    setIconPos(defaultPos);
    localStorage.setItem("admin-menu-pos", JSON.stringify(defaultPos));
    setIsQuickSettingsOpen(false); // Reset ke baad panel close
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans antialiased relative selection:bg-emerald-500 selection:text-black">
      {/* 📱💻 DRAGGABLE FLOATING TOGGLE ICON BUTTON */}
      <div
        ref={iconRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleIconClick}
        style={{
          position: "fixed",
          left: `${iconPos.x}px`,
          top: `${iconPos.y}px`,
          zIndex: 100,
        }}
        className={`fixed z-50 lg:hidden p-3 rounded-xl bg-slate-900 border text-slate-200 hover:text-white shadow-2xl backdrop-blur-md select-none transition-transform duration-100 ${
          isDragging
            ? "cursor-grabbing border-emerald-500 scale-110 bg-slate-900/90 shadow-emerald-500/10"
            : "cursor-grab border-slate-800 hover:border-slate-700 active:scale-95"
        }`}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </div>

      {/* 🚀 LEFT SIDEBAR COMPONENT */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/80 p-6 flex flex-col justify-between transition-transform duration-300 transform lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static`}
      >
        <div className="space-y-8">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-black text-sm shadow-lg shadow-emerald-500/20">
              A
            </div>
            <div>
              <h2 className="font-bold tracking-wide text-md text-slate-100">
                Admin Panel
              </h2>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase block">
                VVIP Control
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-colors ${
                      isActive
                        ? "text-emerald-400"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Logout Row */}
        <div className="border-t border-slate-800/60 pt-4">
          <button
            onClick={() => alert("Logging out...")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent transition-all group"
          >
            <LogOut
              size={18}
              className="text-rose-400 group-hover:text-rose-300"
            />
            Logout Account
          </button>
        </div>
      </aside>

      {/* 📱 OVERLAY FOR MOBILE CLOSING */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* 📬 RIGHT SIDE DYNAMIC CONTENT CONTAINER */}
      <main className="flex-1 min-w-0 overflow-y-auto max-h-screen">
        <div className="transition-all duration-300">{children}</div>
      </main>

      {/* ⚙️ 👑 FLOATING FIXED SETTINGS SYSTEM (BOTTOM-RIGHT CORNER) */}
      <div
        ref={quickSettingsRef}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      >
        {/* 🛸 GLASSMORPHIC QUICK SETTINGS POP-UP */}
        {isQuickSettingsOpen && (
          <div className="w-64 bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl shadow-2xl backdrop-blur-xl text-white animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
              <SlidersHorizontal size={14} className="text-emerald-400" />
              <h3 className="text-xs font-bold tracking-wide text-slate-200">
                Quick Layout Controls
              </h3>
            </div>

            {/* Choti-moti settings section */}
            <div className="space-y-2">
              <button
                onClick={handleResetPosition}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-all group"
              >
                <RotateCcw
                  size={14}
                  className="text-slate-400 group-hover:text-emerald-400"
                />
                Reset Hamburger Icon
              </button>

              {/* Add more quick actions here if needed in future */}
            </div>

            {/* 🛠️ More Settings Router Redirect Button */}
            <div className="border-t border-slate-800/80 mt-3 pt-2">
              <button
                onClick={() => {
                  setIsQuickSettingsOpen(false);
                  router.push("/admin/settings"); // Direct settings page par phek dega
                }}
                className="w-full text-center text-xs font-semibold py-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/10 transition-all block"
              >
                More Settings
              </button>
            </div>
          </div>
        )}

        {/* 🔘 FIXED SETTINGS FLOATING TOGGLE ICON */}
        <button
          onClick={() => setIsQuickSettingsOpen(!isQuickSettingsOpen)}
          className={`p-3.5 rounded-full bg-slate-900 border text-slate-300 hover:text-emerald-400 shadow-2xl transition-all duration-300 ${
            isQuickSettingsOpen
              ? "border-emerald-500 rotate-90 text-emerald-400 bg-slate-900/90 scale-105"
              : "border-slate-800 hover:border-slate-700 active:scale-90 hover:scale-105"
          }`}
          title="Quick Setup Panel"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}
