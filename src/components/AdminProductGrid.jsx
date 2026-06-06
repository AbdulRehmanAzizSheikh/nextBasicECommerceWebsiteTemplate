"use client";
import { useEffect, useState } from "react";
import AdminProductCard from "./AdminProductCard";

export default function AdminProductGrid() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Detail popup ke liye

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products"); // Admin API saare products layegi
        const data = await response.json();
        if (data.status) setProducts(data.products);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProducts();
  }, []);

  // ⚡ Handle Toggle Status (On/Off Switch)
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/products?_id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: currentStatus }),
      });
      const data = await response.json();
      if (data.status) {
        setProducts(
          products.map((p) =>
            p._id === id ? { ...p, isEnabled: currentStatus } : p,
          ),
        );
      }
    } catch (error) {
      console.error("Toggle failed:", error);
    }
  };

  // 🗑️ Handle Delete Product
  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await fetch(`/api/products?_id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.status) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEditRedirect = (product) => {
    console.log("Edit form open for:", product);
    // Yahan tumhara edit form ka logic ya modal/route khulega
  };

  return (
    <section className="py-4 px-2 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Product Management</h2>
        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          Total: {products.length}
        </span>
      </div>

      {/* Tight Daraz Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {products.map((product) => (
          <AdminProductCard
            key={product._id}
            product={product}
            onToggle={handleToggleStatus}
            onDelete={handleDeleteProduct}
            onEdit={handleEditRedirect}
            onView={(p) => setSelectedProduct(p)} // Popup trigger
          />
        ))}
      </div>

      {/* 🔍 Detail Popup (Quick View Modal) */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full relative space-y-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">
              {selectedProduct.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedProduct.description || "No description available."}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2 rounded border border-slate-800/50">
                <span className="text-slate-500 block">Price</span>
                <span className="text-emerald-400 font-bold text-sm">
                  Rs. {selectedProduct.price}
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800/50">
                <span className="text-slate-500 block">Available Stock</span>
                <span className="text-slate-200 font-bold text-sm">
                  {selectedProduct.stock} units
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold rounded-lg transition-all"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
