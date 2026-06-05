export default function ProductCard({ product }) {
  const { title, price, stock, imageUrl } = product;

  return (
    // 🎯 Daraz Layout: White bg, very thin borders, zero heavy shadows, clickable surface
    <div className="group relative bg-slate-900 border border-slate-800 rounded-md p-1.5 flex flex-col justify-between transition-all cursor-pointer hover:border-slate-750">
      <div>
        {/* 📸 Square Image Container (Zero margin wastage) */}
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

          {/* 🏷️ Minimal Daraz Stock / Badge style */}
          {stock <= 0 && (
            <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-rose-400 text-[10px] font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          )}
        </div>

        {/* 📊 Content Area: Text tightly packed beneath image */}
        <div className="mt-1.5 space-y-0.5 px-0.5">
          {/* Title: 2 lines clamp like Daraz (for long titles) */}
          <h3 className="text-slate-200 text-[12px] font-normal leading-tight line-clamp-2 min-h-[32px]">
            {title}
          </h3>

          {/* Price: Dominant and sharp */}
          <div className="text-emerald-400 font-bold text-[14px] leading-none mt-1">
            Rs. {price?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 📉 Stock Indicator text (Very tiny at the bottom if needed) */}
      {stock > 0 && stock <= 5 && (
        <div className="text-[9px] text-amber-500 font-medium px-0.5 mt-1">
          Only {stock} left
        </div>
      )}
    </div>
  );
}
