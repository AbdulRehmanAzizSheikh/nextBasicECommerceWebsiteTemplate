import { useState } from "react";
import { MoreVertical, Edit2, Trash2, Eye } from "lucide-react";

export default function AdminProductCard({
  product,
  onToggle,
  onDelete,
  onEdit,
  onView,
}) {
  const { _id, title, price, stock, imageUrl, isEnabled = true } = product;
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-md p-1.5 flex flex-col justify-between transition-all hover:border-slate-700">
      <div>
        {/* 📸 Image Container */}
        <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800/30">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-[10px] text-slate-700">No Image</span>
          )}

          {/* ⚙️ Admin Action Menu (Three Dots) */}
          <div className="absolute top-1 right-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white backdrop-blur-sm"
            >
              <MoreVertical size={14} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-1 w-28 bg-slate-950 border border-slate-800 rounded shadow-xl py-1 text-[11px] z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(product);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-white"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(_id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>

          {/* Status Overlay Indicator (Agar disabled ho to card par halka sa andhera) */}
          {!isEnabled && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-700 uppercase tracking-wider">
                Disabled
              </span>
            </div>
          )}
        </div>

        {/* 📊 Product Info (Clicking here opens popup) */}
        <div
          className="mt-1.5 space-y-0.5 px-0.5 cursor-pointer"
          onClick={() => onView(product)}
        >
          <h3 className="text-slate-200 text-[12px] font-normal leading-tight line-clamp-2 min-h-[32px]">
            {title}
          </h3>
          <div className="text-emerald-400 font-bold text-[14px] leading-none mt-1">
            Rs. {price?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 🎛️ On/Off Toggle Switch Button at the very bottom */}
      <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between px-0.5">
        <span className="text-[10px] text-slate-500 font-medium">
          Stock:{" "}
          <span className={stock <= 0 ? "text-rose-400" : "text-slate-300"}>
            {stock}
          </span>
        </span>

        {/* Toggle Switch */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(_id, !isEnabled);
          }}
          className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors duration-200 ${
            isEnabled ? "bg-emerald-500" : "bg-slate-700"
          }`}
        >
          <span
            className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform duration-200 ${
              isEnabled ? "translate-x-4.5" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
