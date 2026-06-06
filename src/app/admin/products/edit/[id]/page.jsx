"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams(); // URL se ID nikalne ke liye
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "other",
    stock: "",
    imageUrl: "",
    keywords: "",
    featured: false,
  });

  const showToast = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      4000,
    );
  };

  // 📥 1. Load Singular Product Data on Edit Page Load
  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        setLoading(true);
        // Is endpoint ko tum chaho toh generic `/api/products?_id=${id}` par hit karwa sakte ho jo pure database se ek laaye
        const res = await fetch(`/api/products?_id=${id}`, {
          method: "GET",
          cache: "no-store",
        });
        const data = await res.json();

        if (data.status && data.product) {
          const prod = data.product;
          setFormData({
            title: prod.title || "",
            description: prod.description || "",
            price: prod.price || "",
            category: prod.category || "other",
            stock: prod.stock || 0,
            imageUrl: prod.imageUrl || "",
            keywords: prod.keywords ? prod.keywords.join(", ") : "",
            featured: prod.featured || false,
          });
        } else {
          // Fallback array handling agar tumhara backend products array bhejta hai query par bhi
          const matchedProd = data.products?.find((p) => p._id === id);
          if (matchedProd) {
            setFormData({
              title: matchedProd.title || "",
              description: matchedProd.description || "",
              price: matchedProd.price || "",
              category: matchedProd.category || "other",
              stock: matchedProd.stock || 0,
              imageUrl: matchedProd.imageUrl || "",
              keywords: matchedProd.keywords
                ? matchedProd.keywords.join(", ")
                : "",
              featured: matchedProd.featured || false,
            });
          } else {
            showToast("Product data not found!", "error");
          }
        }
      } catch (err) {
        showToast("Error loading product information", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSingleProduct();
  }, [id]);

  // 📤 2. Form Submit handling (Hits PUT/PATCH endpoint safely)
  // 📤 2. Form Submit handling (Hits PATCH endpoint safely)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      return showToast("Title and Price are mandatory!", "error");
    }

    setActionLoading(true);

    // Deep copy taake original form state directly text fields me kharab na ho array-to-string convert hone par
    let submittedData = { ...formData };

    if (submittedData.keywords) {
      submittedData.keywords =
        typeof submittedData.keywords === "string"
          ? submittedData.keywords
              .split(",")
              .map((k) => k.trim())
              .filter((k) => k !== "")
          : submittedData.keywords;
    }

    try {
      const saveChanges = await fetch(`/api/admin/product?_id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submittedData),
      });

      // Agar server ne koi error status code (400, 404, 405, 500) bheja ho
      if (!saveChanges.ok) {
        showToast(`Server side error: Status ${saveChanges.status}`, "error");
        return;
      }

      // JSON ko sirf EK BAAR await kar ke variable me store karein
      const resData = await saveChanges.json();

      if (resData.status) {
        showToast(
          resData.message || "Product updated successfully!",
          "success",
        );

        // Update hone ke baad wapas items table par redirect karega
        setTimeout(() => {
          router.push("/admin/products");
          router.refresh();
        }, 1000);
      } else {
        showToast(resData.message || "Failed to save data!", "error");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      showToast("Something went wrong while saving changes!", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white gap-3">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="text-slate-400 text-sm">Loading product configs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex justify-center items-center">
      {notification.show && (
        <div
          className={`fixed bottom-5 left-5 z-50 px-5 py-3 rounded-xl shadow-xl backdrop-blur-md border border-white/10 transition-all duration-300 ${notification.type === "success" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"}`}
        >
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-3">
          <Link
            href="/admin/products"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-lg font-bold tracking-wide text-white">
            Edit Product Details
          </h2>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Product Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-xs focus:outline-none focus:border-emerald-500 text-slate-200"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-xs h-24 resize-none focus:outline-none focus:border-emerald-500 text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Price (Rs.) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-xs focus:outline-none focus:border-emerald-500 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-xs focus:outline-none focus:border-emerald-500 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Image URL
            </label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-xs focus:outline-none focus:border-emerald-500 text-slate-200"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Keywords
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) =>
                setFormData({ ...formData, keywords: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-xs focus:outline-none focus:border-emerald-500 text-slate-200"
              placeholder="gaming, mouse, electronics"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4 rounded accent-emerald-500"
            />
            <label
              htmlFor="featured"
              className="text-xs text-slate-300 select-none cursor-pointer"
            >
              Promote as Featured Product
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800 mt-4">
            <Link
              href="/admin/products"
              className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={actionLoading}
              className="bg-emerald-500 text-black px-5 py-2 rounded-lg text-xs font-semibold hover:bg-emerald-600 flex items-center gap-1.5 disabled:opacity-50 transition-all"
            >
              {actionLoading && <Loader2 className="animate-spin" size={12} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
