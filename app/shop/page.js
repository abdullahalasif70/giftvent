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
    <main className="gv-page">
      <div className="gv-page-header">
        <div className="gv-section-label">Featured Collection</div>
        <h1 className="gv-section-title">Our <em>Shop</em></h1>
      </div>

      <div className="gv-tabs" style={{marginBottom:"2.5rem"}}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`gv-tab ${activeCategory === cat ? "active" : ""}`}>{cat}</button>
        ))}
      </div>

      {loading ? (
        <div style={{textAlign:"center",padding:"5rem 0",color:"#888"}}>Loading products...</div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:"center",padding:"5rem 0"}}>
          <div style={{fontSize:"4rem",marginBottom:"1rem",opacity:0.3}}>🎁</div>
          <p style={{color:"#888",fontSize:"0.85rem",fontFamily:"Arial,sans-serif"}}>No products yet. Check back soon!</p>
        </div>
      ) : (
        <div className="gv-grid-3">
          {filtered.map(product => (
            <Link key={product.id} href={`/shop/${product.id}`} style={{textDecoration:"none"}} className="gv-card">
              <div className="gv-card-img">
                {product.category === "Flowers" ? "🌹" : product.category === "Electronics" ? "⌚" : product.category === "Bundles" ? "🎀" : "🎁"}
              </div>
              <div className="gv-card-body">
                <div className="gv-card-category">{product.category}</div>
                <div className="gv-card-name">{product.name}</div>
                <div className="gv-card-desc">{product.description}</div>
                <div className="gv-card-footer">
                  <div className="gv-price">৳ {product.price?.toLocaleString()} <span>BDT</span></div>
                  <span className="btn-gold" style={{fontSize:"0.65rem",padding:"0.4rem 1rem"}}>View</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}