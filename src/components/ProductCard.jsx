import { ShoppingCart, Eye } from "lucide-react";

export default function ProductCard({ product }) {
  const { title, price, category, stock, image } = product;

  return (
    <div className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1">
      {/* Product Image Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800/50 mb-4">
        {image ? (
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-xs text-slate-600">No Image Available</span>
        )}

        {/* Stock Badge */}
        {stock <= 0 ? (
          <span className="absolute top-2.5 right-2.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md">
            Out of Stock
          </span>
        ) : stock <= 5 ? (
          <span className="absolute top-2.5 right-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md">
            Only {stock} Left
          </span>
        ) : null}
      </div>

      {/* Product Details */}
      <div className="space-y-1.5 mb-4">
        <span className="text-[11px] text-emerald-400 uppercase tracking-widest font-semibold">
          {category || "General"}
        </span>
        <h3 className="font-semibold text-slate-100 text-base line-clamp-1 group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-slate-100">
            Rs. {price?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          disabled={stock <= 0}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-500/5 active:scale-95"
        >
          <ShoppingCart size={14} />
          Add to Cart
        </button>

        <button className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700 transition-all active:scale-95">
          <Eye size={14} />
        </button>
      </div>
    </div>
  );
}
