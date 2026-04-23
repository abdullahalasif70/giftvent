"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

const categories = ["All", "Flowers", "Luxury", "Electronics", "Bundles"];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = activeCategory === "All" ? products : products.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen px-16 py-16" style={{background:"#0D0D0D"}}>
      <div className="mb-12">
        <p className="text-[#C6A962] text-xs tracking-[0.3em] uppercase mb-3 flex items-center gap-3">
          <span className="inline-block w-5 h-px bg-[#C6A962]"></span>Featured Collection
        </p>
        <h1 className="text-4xl font-semibold" style={{fontFamily:"serif"}}>Our <em className="text-[#C6A962] not-italic">Shop</em></h1>
      </div>

      {/* Filters */}
      <div className="flex gap-0 border-b border-[#2a2a2a] mb-10">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`text-xs tracking-widest uppercase px-6 py-3 border-b-2 transition-all ${activeCategory === cat ? "text-[#C6A962] border-[#C6A962]" : "text-[#888] border-transparent hover:text-white"}`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#888]">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 opacity-30">🎁</div>
          <p className="text-[#888] text-sm">No products yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filtered.map(product => (
            <div key={product.id} className="border border-[#2a2a2a] hover:border-[#8A7340] transition-colors" style={{background:"#1A1A1A"}}>
              <div className="h-48 flex items-center justify-center text-5xl opacity-40" style={{background:"#222"}}>
                {product.category === "Flowers" ? "🌹" : product.category === "Electronics" ? "⌚" : product.category === "Bundles" ? "🎀" : "🎁"}
              </div>
              <div className="p-5">
                <div className="text-[#C6A962] text-xs tracking-widest uppercase mb-1">{product.category}</div>
                <h3 className="text-white text-sm mb-2" style={{fontFamily:"serif"}}>{product.name}</h3>
                <p className="text-[#888] text-xs leading-relaxed mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-[#C6A962] text-lg" style={{fontFamily:"serif"}}>৳ {product.price?.toLocaleString()}</div>
                  <button className="btn-gold text-xs py-2 px-4">Send This</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}