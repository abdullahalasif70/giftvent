"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/authContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleOrder = () => {
    if (!user) { router.push("/auth/login"); return; }
    if (!deliveryDate) { toast.error("Please select delivery date"); return; }
    const params = new URLSearchParams({
      productId: id,
      productName: product.name,
      price: product.price,
      recipientName, message, deliveryDate,
      type: "product"
    });
    router.push(`/checkout?${params.toString()}`);
  };

  if (loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0D0D0D",color:"#888"}}>Loading...</div>;
  if (!product) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0D0D0D",color:"#888"}}>Product not found</div>;

  const icon = product.category === "Flowers" ? "🌹" : product.category === "Electronics" ? "⌚" : product.category === "Bundles" ? "🎀" : "🎁";

  return (
    <main style={{minHeight:"100vh",background:"#0D0D0D",padding:"4rem"}}>
      <Link href="/shop" style={{color:"#888",fontSize:"0.72rem",letterSpacing:"0.15em",textTransform:"uppercase",textDecoration:"none",display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"3rem",fontFamily:"Arial,sans-serif"}}>
        ← Back to Shop
      </Link>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"start"}}>
        {/* Product Image */}
        <div>
          <div style={{height:"420px",background:"#1A1A1A",border:"0.5px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8rem",opacity:0.4,marginBottom:"1.5rem"}}>
            {icon}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.75rem"}}>
            {[1,2,3].map(i => (
              <div key={i} style={{height:"90px",background:"#1A1A1A",border:"0.5px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",opacity:0.25}}>{icon}</div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div style={{color:"#C6A962",fontSize:"0.6rem",letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:"0.8rem",fontFamily:"Arial,sans-serif"}}>{product.category}</div>
          <h1 style={{fontSize:"2.2rem",fontFamily:"Georgia,serif",marginBottom:"1rem",lineHeight:"1.2"}}>{product.name}</h1>
          <div style={{fontSize:"2rem",color:"#C6A962",fontFamily:"Georgia,serif",marginBottom:"1.5rem"}}>৳ {product.price?.toLocaleString()} <span style={{fontSize:"0.7rem",color:"#888",fontFamily:"Arial,sans-serif"}}>BDT</span></div>
          <p style={{color:"#888",fontSize:"0.85rem",lineHeight:"1.8",marginBottom:"2rem",fontFamily:"Arial,sans-serif"}}>{product.description}</p>

          <div style={{borderTop:"0.5px solid #2a2a2a",paddingTop:"2rem",marginBottom:"2rem"}}>
            <h3 style={{fontSize:"0.85rem",fontFamily:"Georgia,serif",marginBottom:"1.5rem",color:"#C6A962",letterSpacing:"0.08em"}}>Personalize Your Gift</h3>
            <div className="gv-form-row">
              <label className="gv-form-label">Recipient Name</label>
              <input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Who is this gift for?" />
            </div>
            <div className="gv-form-row">
              <label className="gv-form-label">Personal Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write a heartfelt message..." rows={3} style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",resize:"vertical",fontFamily:"Georgia,serif"}} />
            </div>
            <div className="gv-form-row">
              <label className="gv-form-label">Delivery Date</label>
              <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} min={new Date().toISOString().split("T")[0]} required />
            </div>
          </div>

          <div style={{display:"flex",gap:"1rem"}}>
            <button onClick={handleOrder} className="btn-gold" style={{flex:1,padding:"1rem"}}>Send as Gift</button>
            <Link href="/shop" className="btn-outline" style={{padding:"1rem 1.5rem"}}>← Back</Link>
          </div>

          <div style={{marginTop:"1.5rem",padding:"1rem 1.2rem",background:"rgba(198,169,98,0.05)",border:"0.5px solid rgba(198,169,98,0.2)"}}>
            <p style={{color:"#888",fontSize:"0.72rem",fontFamily:"Arial,sans-serif",lineHeight:"1.6"}}>
              ✓ Same-day delivery available in Dhaka &nbsp;·&nbsp; ✓ Premium packaging &nbsp;·&nbsp; ✓ 100% quality guaranteed
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}