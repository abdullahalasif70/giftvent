"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCart } from "@/lib/cartContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [activeMedia, setActiveMedia] = useState("image");

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, { recipientName, message, deliveryDate });
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!deliveryDate) { toast.error("Please select a delivery date"); return; }
    addToCart(product, { recipientName, message, deliveryDate });
    router.push("/cart/checkout");
  };

  const icon = !product ? "🎁" : product.category === "Flowers" ? "🌹" : product.category === "Electronics" ? "⌚" : product.category === "Bundles" ? "🎀" : "💎";

  if (loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0D0D0D",color:"#888"}}>Loading...</div>;
  if (!product) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0D0D0D",color:"#888"}}>Product not found</div>;

  return (
    <main style={{minHeight:"100vh",background:"#0D0D0D",padding:"4rem"}}>
      <Link href="/shop" style={{color:"#888",fontSize:"0.72rem",letterSpacing:"0.15em",textTransform:"uppercase",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"0.5rem",marginBottom:"3rem",fontFamily:"Arial,sans-serif"}}>
        ← Back to Shop
      </Link>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"start"}}>
        {/* Media Section */}
        <div>
          {/* Media Tabs if YouTube exists */}
          {product.youtubeId && (
            <div style={{display:"flex",gap:"0",marginBottom:"1rem",borderBottom:"0.5px solid #2a2a2a"}}>
              <button onClick={() => setActiveMedia("image")} style={{padding:"0.6rem 1.2rem",background:"transparent",border:"none",borderBottom:`2px solid ${activeMedia==="image"?"#C6A962":"transparent"}`,color:activeMedia==="image"?"#C6A962":"#888",fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",fontFamily:"Arial,sans-serif",marginBottom:"-0.5px"}}>
                Photos
              </button>
              <button onClick={() => setActiveMedia("video")} style={{padding:"0.6rem 1.2rem",background:"transparent",border:"none",borderBottom:`2px solid ${activeMedia==="video"?"#C6A962":"transparent"}`,color:activeMedia==="video"?"#C6A962":"#888",fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",fontFamily:"Arial,sans-serif",marginBottom:"-0.5px"}}>
                ▶ Video
              </button>
            </div>
          )}

          {/* Main Media */}
          <div style={{height:"420px",background:"#1A1A1A",border:"0.5px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1rem",overflow:"hidden"}}>
            {activeMedia === "video" && product.youtubeId ? (
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${product.youtubeId}`}
                title={product.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{display:"block"}}
              />
            ) : product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
            ) : (
              <span style={{fontSize:"8rem",opacity:0.3}}>{icon}</span>
            )}
          </div>

          {/* Thumbnails */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.75rem"}}>
            <div style={{height:"90px",background:"#1A1A1A",border:`0.5px solid ${activeMedia==="image"?"#C6A962":"#2a2a2a"}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden"}} onClick={() => setActiveMedia("image")}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.7}} />
              ) : (
                <span style={{fontSize:"2rem",opacity:0.3}}>{icon}</span>
              )}
            </div>
            {product.youtubeId && (
              <div style={{height:"90px",background:"#1A1A1A",border:`0.5px solid ${activeMedia==="video"?"#C6A962":"#2a2a2a"}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}} onClick={() => setActiveMedia("video")}>
                <img src={`https://img.youtube.com/vi/${product.youtubeId}/mqdefault.jpg`} alt="video" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.7}} />
                <span style={{position:"absolute",fontSize:"1.5rem",opacity:0.9}}>▶️</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div style={{color:"#C6A962",fontSize:"0.6rem",letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:"0.8rem",fontFamily:"Arial,sans-serif"}}>{product.category}</div>
          <h1 style={{fontSize:"2.2rem",fontFamily:"Georgia,serif",marginBottom:"1rem",lineHeight:"1.2"}}>{product.name}</h1>
          <div style={{fontSize:"2rem",color:"#C6A962",fontFamily:"Georgia,serif",marginBottom:"1.5rem"}}>
            ৳ {product.price?.toLocaleString()} <span style={{fontSize:"0.7rem",color:"#888",fontFamily:"Arial,sans-serif"}}>BDT</span>
          </div>
          <p style={{color:"#888",fontSize:"0.85rem",lineHeight:"1.8",marginBottom:"2rem",fontFamily:"Arial,sans-serif"}}>{product.description}</p>

          {/* Personalize */}
          <div style={{borderTop:"0.5px solid #2a2a2a",paddingTop:"2rem",marginBottom:"2rem"}}>
            <h3 style={{fontSize:"0.85rem",fontFamily:"Georgia,serif",marginBottom:"1.5rem",color:"#C6A962",letterSpacing:"0.08em"}}>Personalize Your Gift</h3>
            <div className="gv-form-row">
              <label className="gv-form-label">Recipient Name</label>
              <input value={recipientName} onChange={e=>setRecipientName(e.target.value)} placeholder="Who is this gift for?" style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",fontFamily:"Arial,sans-serif"}} />
            </div>
            <div className="gv-form-row">
              <label className="gv-form-label">Personal Message</label>
              <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write a heartfelt message..." rows={3} style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",resize:"vertical",fontFamily:"Arial,sans-serif"}} />
            </div>
            <div className="gv-form-row">
              <label className="gv-form-label">Delivery Date</label>
              <input type="date" value={deliveryDate} onChange={e=>setDeliveryDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",fontFamily:"Arial,sans-serif"}} />
            </div>
          </div>

          <div style={{display:"flex",gap:"1rem",marginBottom:"1rem"}}>
            <button onClick={handleAddToCart} className="btn-outline" style={{flex:1,padding:"1rem"}}>🛒 Add to Cart</button>
            <button onClick={handleBuyNow} className="btn-gold" style={{flex:1,padding:"1rem"}}>Send This Gift →</button>
          </div>

          <div style={{padding:"1rem 1.2rem",background:"rgba(198,169,98,0.05)",border:"0.5px solid rgba(198,169,98,0.2)"}}>
            <p style={{color:"#888",fontSize:"0.72rem",fontFamily:"Arial,sans-serif",lineHeight:"1.6"}}>
              ✓ Same-day delivery in Dhaka &nbsp;·&nbsp; ✓ Premium packaging &nbsp;·&nbsp; ✓ 100% quality guaranteed
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}