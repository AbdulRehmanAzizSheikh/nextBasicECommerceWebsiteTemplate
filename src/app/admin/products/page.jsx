"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Star,
  Loader2,
  MoreVertical,
} from "lucide-react";

export default function AdminProductsPage() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showToast = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      4000,
    );
  };

  // 📥 Live Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();
      if (data.status) {
        setProducts(data.products || []);
      } else {
        showToast("Failed to load products", "error");
      }
    } catch (err) {
      showToast("Server error while fetching products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const closeMenus = () => setActiveMenuId(null);
    window.addEventListener("click", closeMenus);
    return () => window.removeEventListener("click", closeMenus);
  }, []);

  // 🎛️ Live Toggle Status Handler
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/product?_id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: currentStatus }),
      });
      const data = await res.json();
      if (data.status) {
        setProducts(
          products.map((p) =>
            p._id === id ? { ...p, isEnabled: currentStatus } : p,
          ),
        );
        showToast(`Product status updated!`, "success");
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Toggle update failed", "error");
    }
  };

  // 🗑️ Delete Product Logic
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const res = await fetch(`/api/admin/product?_id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status) {
        showToast("Product deleted successfully!", "success");
        fetchProducts();
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Could not delete product", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white relative selection:bg-emerald-500 selection:text-black">
      {notification.show && (
        <div
          className={`fixed bottom-5 left-5 z-50 px-5 py-3 rounded-xl shadow-xl backdrop-blur-md border border-white/10 transition-all duration-300 ${notification.type === "success" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"}`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex-1 p-3 md:p-6 w-full max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide text-slate-100">
              Product Management
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Compact Live Grid View Panel ({products.length} Items)
            </p>
          </div>
          {/* Custom Route link par bhejne ke liye */}
          <Link
            href="/admin/products/add"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg font-semibold text-black text-sm transition-all shadow-md active:scale-95"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Loader2 className="animate-spin text-emerald-500" size={28} />
            <p className="text-slate-400 text-xs">Syncing with database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {products.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 text-sm">
                No products found.
              </div>
            ) : (
              products.map((prod) => (
                <div
                  key={prod._id}
                  className="group relative bg-slate-900 border border-slate-800 rounded-md p-1.5 flex flex-col justify-between transition-all hover:border-slate-700"
                >
                  <div>
                    <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800/30">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-700">
                          No Image
                        </span>
                      )}

                      <div
                        className="absolute top-1 right-1 z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === prod._id ? null : prod._id,
                            )
                          }
                          className="p-1 rounded bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white backdrop-blur-sm"
                        >
                          <MoreVertical size={12} />
                        </button>

                        {activeMenuId === prod._id && (
                          <div className="absolute right-0 mt-1 w-24 bg-slate-950 border border-slate-800 rounded shadow-xl py-0.5 text-[10px] z-20">
                            {/* Redirecting to dynamic edit page */}
                            <Link
                              href={`/admin/products/edit/${prod._id}`}
                              className="w-full flex items-center gap-1.5 px-2 py-1 text-slate-300 hover:bg-slate-900 hover:text-white text-left"
                            >
                              <Edit2 size={10} /> Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(prod._id)}
                              className="w-full flex items-center gap-1.5 px-2 py-1 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 text-left"
                            >
                              <Trash2 size={10} /> Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {prod.featured && (
                        <div className="absolute top-1 left-1 bg-amber-500/90 text-black p-0.5 rounded shadow">
                          <Star size={10} fill="currentColor" />
                        </div>
                      )}

                      {prod.isEnabled === false && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="bg-slate-800 text-slate-400 text-[8px] font-bold px-1 py-0.5 rounded border border-slate-700 uppercase">
                            Disabled
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className="mt-1.5 space-y-0.5 px-0.5 cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(prod);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <h3 className="text-slate-200 text-[11px] font-normal leading-tight line-clamp-2 min-h-[28px] hover:text-white">
                        {prod.title}
                      </h3>
                      <div className="text-emerald-400 font-bold text-[13px] leading-none mt-0.5">
                        Rs. {prod.price?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-between px-0.5">
                    <span className="text-[9px] text-slate-500 font-medium">
                      Stock:{" "}
                      <span
                        className={
                          prod.stock <= 0 ? "text-rose-400" : "text-slate-300"
                        }
                      >
                        {prod.stock}
                      </span>
                    </span>

                    <button
                      onClick={() =>
                        handleToggleStatus(
                          prod._id,
                          prod.isEnabled !== false ? false : true,
                        )
                      }
                      className={`relative inline-flex h-3.5 w-7 items-center rounded-full transition-colors ${prod.isEnabled !== false ? "bg-emerald-500" : "bg-slate-700"}`}
                    >
                      <span
                        className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${prod.isEnabled !== false ? "translate-x-4" : "translate-x-1"}`}
                      />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 👁️ PRODUCT DETAILS POP-UP MODAL */}
        {isDetailsOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-3">
                <h2 className="text-sm font-bold text-white">
                  Product Full Details
                </h2>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3 items-center bg-slate-950/50 p-2 rounded-lg border border-slate-800/40">
                  <img
                    src={selectedProduct.imageUrl}
                    alt=""
                    className="w-12 h-12 object-cover rounded-lg border border-slate-700 bg-slate-900"
                  />
                  <div>
                    <h3 className="font-bold text-white text-xs">
                      {selectedProduct.title}
                    </h3>
                    <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                      Category: {selectedProduct.category}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                    Description
                  </h4>
                  <p className="text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60 whitespace-pre-line leading-relaxed">
                    {selectedProduct.description || "No description provided."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    <span className="text-[9px] text-slate-400 block uppercase">
                      Price
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      Rs. {selectedProduct.price?.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    <span className="text-[9px] text-slate-400 block uppercase">
                      Stock
                    </span>
                    <span className="text-xs font-bold text-slate-200 font-mono">
                      {selectedProduct.stock} items
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProduct.keywords &&
                    selectedProduct.keywords.length > 0 ? (
                      selectedProduct.keywords.map((word, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded border border-slate-700/50"
                        >
                          #{word}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-[10px]">
                        No keywords.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
