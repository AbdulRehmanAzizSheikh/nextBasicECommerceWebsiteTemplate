"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/?page=2");
        const data = await response.json();
        if (data.status) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    // 💡 Tight padding on sides, minimal spacing at top
    <section className="py-4 px-2 max-w-7xl mx-auto">
      {/* 🏁 Minimal Clean Section Header */}
      <div className="flex items-center justify-between mb-4 px-0.5">
        <h2 className="text-lg font-bold tracking-tight text-white">
          Just For You
        </h2>
        <div className="text-[10px] font-medium text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-sm">
          {products.length} Items
        </div>
      </div>

      {/* ⚡ Daraz Fixed 2-Column Mobile Grid (gap-2 ensures maximum screen utility) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
