"use client";
import { useState, useEffect } from "react";
import { Plus, Eye, Edit2, Trash2, X, Star, Loader2 } from "lucide-react";

export default function AdminProductsPage() {
  // Modals & States
  const [isFormOpen, setIsFormOpen] = useState(false); // Add/Edit Modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // View Modal
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Data States
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Initial Form State
  const initialFormState = {
    title: "",
    description: "",
    price: "",
    category: "other",
    stock: "",
    imageUrl: "",
    keywords: "",
    featuredProduct: false,
  };
  const [formData, setFormData] = useState(initialFormState);

  // 🔔 Toast Notification Trigger
  const showToast = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      4000,
    );
  };

  // 📥 1. Live Fetch Products from Database
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
  }, []);

  // 📤 2. Form Submit logic (Handles both Add & Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      return showToast("Title and Price are mandatory!", "error");
    }

    setActionLoading(true);
    // Dynamic payload object ready karna jesa tumne socha tha
    const payload = {
      title: formData.title.trim(),
      price: Number(formData.price),
      category: formData.category,
      stock: Number(formData.stock) || 0,
      featuredProduct: Boolean(formData.featuredProduct),
    };

    if (formData.description) payload.description = formData.description.trim();
    if (formData.imageUrl && formData.imageUrl.trim() !== "")
      payload.imageUrl = formData.imageUrl.trim();
    if (formData.keywords) {
      payload.keywords =
        typeof formData.keywords === "string"
          ? formData.keywords.split(",").map((k) => k.trim())
          : formData.keywords;
    }

    try {
      const url = isEditMode
        ? `/api/admin/product/${selectedProduct._id}`
        : "/api/admin/add-product";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status) {
        showToast(data.message, "success");
        setIsFormOpen(false);
        setFormData(initialFormState);
        fetchProducts(); // Refresh list live!
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Something went wrong!", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ✏️ Edit Mode Opener
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setFormData({
      title: product.title,
      description: product.description || "",
      price: product.price,
      category: product.category || "other",
      stock: product.stock || 0,
      imageUrl: product.imageUrl || "",
      keywords: product.keywords ? product.keywords.join(", ") : "",
      featuredProduct: product.featuredProduct || false,
    });
    setIsFormOpen(true);
  };

  // 🗑️ Delete Product logic
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const res = await fetch(`/api/admin/product/${id}`, { method: "DELETE" });
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
      {/* 🔔 FLOATING TOAST NOTIFICATION */}
      {notification.show && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-xl backdrop-blur-md border border-white/10 transition-all duration-300 ${notification.type === "success" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"}`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Product Management
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Full live CRUD panel powered by MongoDB
            </p>
          </div>
          <button
            onClick={() => {
              setIsEditMode(false);
              setFormData(initialFormState);
              setIsFormOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 rounded-xl font-semibold text-black transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* 📊 LIVE LOADER OR TABLE CONTAINER */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
            <p className="text-slate-400 text-sm">Syncing with database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md w-full shadow-xl">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-sm font-semibold tracking-wider">
                  <th className="p-4 w-20">Image</th>
                  <th className="p-4 max-w-xs">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-center w-36">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500">
                      No products found in database.
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr
                      key={prod._id}
                      className="border-b border-slate-800/40 hover:bg-slate-800/10 transition-all group"
                    >
                      <td className="p-4">
                        <img
                          src={prod.imageUrl}
                          alt=""
                          className="w-10 h-10 object-cover rounded-lg border border-slate-800 bg-slate-950"
                        />
                      </td>
                      <td className="p-4 font-medium max-w-xs">
                        <p
                          className="truncate text-slate-200 group-hover:text-white"
                          title={prod.title}
                        >
                          {prod.title}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-xs border border-slate-700/40 text-slate-300">
                          {prod.category}
                        </span>
                      </td>
                      <td className="p-4 text-emerald-400 font-semibold">
                        ${prod.price}
                      </td>
                      <td className="p-4 text-slate-300 font-mono">
                        {prod.stock}
                      </td>
                      <td className="p-4">
                        {prod.featuredProduct ? (
                          <span className="text-amber-400 text-xs flex items-center gap-1">
                            <Star size={12} fill="currentColor" /> Yes
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">No</span>
                        )}
                      </td>

                      {/* 🔥 Action Buttons with Professional Lucide Icons */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(prod);
                              setIsDetailsOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleEditClick(prod)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border border-transparent hover:border-amber-500/30 transition-all"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(prod._id)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 🛸 3. DYNAMIC FORM MODAL (ADD / EDIT COMPONENT) */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 border border-slate-800/80 p-6 rounded-2xl w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5 border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold tracking-wide text-white">
                  {isEditMode ? "Edit Product Details" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1.5 text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-200"
                    placeholder="e.g. Razer Mouse"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1.5 text-sm h-20 resize-none focus:outline-none focus:border-emerald-500 transition-all text-slate-200"
                    placeholder="Product specs..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1.5 text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-200"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1.5 text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-200"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                    Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1.5 text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-200"
                    placeholder="https://link-to-image.png"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                    Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) =>
                      setFormData({ ...formData, keywords: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1.5 text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-200"
                    placeholder="gaming, mouse, wired"
                  />
                </div>
                <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featuredProduct}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featuredProduct: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded accent-emerald-500 bg-slate-950 border-slate-800"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium text-slate-300 select-none cursor-pointer"
                  >
                    Promote as Featured Product
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-emerald-500 text-black px-5 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {actionLoading && (
                      <Loader2 className="animate-spin" size={14} />
                    )}
                    {isEditMode ? "Save Changes" : "Publish Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 👁️ 4. PRODUCT DETAILS POP-UP MODAL */}
        {isDetailsOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 border border-slate-800 p-6 rounded-2xl w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
                <h2 className="text-xl font-bold text-white">
                  Product Full Details
                </h2>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800/40">
                  <img
                    src={selectedProduct.imageUrl}
                    alt=""
                    className="w-16 h-16 object-cover rounded-xl border border-slate-700 bg-slate-900"
                  />
                  <div>
                    <h3 className="font-bold text-white text-md">
                      {selectedProduct.title}
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                      Category: {selectedProduct.category}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">
                    Description
                  </h4>
                  <p className="text-sm text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 whitespace-pre-line">
                    {selectedProduct.description || "No description provided."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                    <span className="text-xs text-slate-400 block uppercase">
                      Price
                    </span>
                    <span className="text-md font-bold text-emerald-400">
                      ${selectedProduct.price}
                    </span>
                  </div>
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                    <span className="text-xs text-slate-400 block uppercase">
                      Stock Available
                    </span>
                    <span className="text-md font-bold text-slate-200 font-mono">
                      {selectedProduct.stock} items
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5">
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProduct.keywords &&
                    selectedProduct.keywords.length > 0 ? (
                      selectedProduct.keywords.map((word, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded border border-slate-700/50"
                        >
                          #{word}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs">
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
