import ProductCard from "./ProductCard";

export default function ProductGrid() {
  // 🧪 Dummy Data pehle UI check karne ke liye (Baad mein yahan database ka array aayega)
  const dummyProducts = [
    {
      id: "1",
      title: "Premium Mechanical Keyboard",
      price: 12500,
      category: "Electronics",
      stock: 12,
      image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=500",
    },
    {
      id: "2",
      title: "Wireless Ergonomic Mouse",
      price: 4500,
      category: "Electronics",
      stock: 3,
      image:
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=500",
    },
    {
      id: "3",
      title: "Minimalist Leather Wallet",
      price: 2800,
      category: "Accessories",
      stock: 0,
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=500",
    },
    {
      id: "4",
      title: "Ultra-Wide Gaming Monitor",
      price: 48000,
      category: "Electronics",
      stock: 8,
      image:
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=500",
    },
  ];

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Discover Our Products
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Explore the latest gear live powered by high-speed technology.
          </p>
        </div>
        <div className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-max">
          Showing {dummyProducts.length} items
        </div>
      </div>

      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dummyProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
