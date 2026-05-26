import ProductGrid from "../components/ProductGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-black">
      {/* Tumhara purana Header/Navbar yahan aa sakta hai */}

      <main>
        {/* 🔥 Here is your Product System */}
        <ProductGrid />
      </main>

      {/* Footer code yahan aa jayega */}
    </div>
  );
}
