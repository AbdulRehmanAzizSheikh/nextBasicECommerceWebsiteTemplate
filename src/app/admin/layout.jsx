"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 📍 Icon Position State (Initial position top-left margin ke mutabiq)
  const [iconPos, setIconPos] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);

  const iconRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const clickTimestamp = useRef(0);

  // 📝 Saare Sidebar ke Routes
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: ClipboardList },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // 💾 1. Load Position from LocalStorage on Mount
  useEffect(() => {
    const savedPos = localStorage.getItem("admin-menu-pos");
    if (savedPos) {
      try {
        const parsed = JSON.parse(savedPos);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          setIconPos(parsed);
        }
      } catch (e) {
        console.error("Error parsing localStorage position", e);
      }
    }
  }, []);

  // 🖱️ Mouse / Touch Down: Dragging Start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    clickTimestamp.current = Date.now();
    dragStart.current = {
      x: e.clientX - iconPos.x,
      y: e.clientY - iconPos.y,
    };
  };

  // 🔄 Mouse Move: Coordinate tracking with boundary containment
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      let newX = e.clientX - dragStart.current.x;
      let newY = e.clientY - dragStart.current.y;

      // Safe screen margins taake icon bilkul gayab na ho sake
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;

      newX = Math.max(10, Math.min(newX, maxX));
      newY = Math.max(10, Math.min(newY, maxY));

      setIconPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // 💾 Save position to localStorage when drag ends
        localStorage.setItem("admin-menu-pos", JSON.stringify(iconPos));
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, iconPos]);

  // 🎯 Click Handler: Open panel if it was a quick click, not a drag movement
  const handleIconClick = () => {
    const clickDuration = Date.now() - clickTimestamp.current;
    if (clickDuration < 200) {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans antialiased relative selection:bg-emerald-500 selection:text-black">
      {/* 📱💻 DRAGGABLE FLOATING TOGGLE ICON BUTTON */}
      {/* Yeh icon ab standard layout block se bahar nikal kar fixed float karega */}
      <div
        ref={iconRef}
        onMouseDown={handleMouseDown}
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
        title="Pakad kar kahin bhi move karo!"
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
      {/* ⚡ Yahan se pt-16 ko hatakar normal layout responsive kar diya hai taake top area fuzool space na le */}
      <main className="flex-1 min-w-0 overflow-y-auto max-h-screen">
        <div className="transition-all duration-300">{children}</div>
      </main>
    </div>
  );
}
