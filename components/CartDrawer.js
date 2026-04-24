"use client";
import { useCart } from "@/lib/cartContext";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, updateQuantity, total, count, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) { router.push("/auth/login"); onClose(); return; }
    router.push("/cart/checkout");
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,backdropFilter:"blur(4px)"}}
      />

      {/* Drawer */}
      <div style={{
        position:"fixed",top:0,right:0,bottom:0,width:"420px",
        background:"#111",borderLeft:"0.5px solid #2a2a2a",
        zIndex:201,display:"flex",flexDirection:"column",
        animation:"slideIn 0.25s ease"
      }}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div style={{padding:"1.5rem 2rem",borderBottom:"0.5px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:"#C6A962",fontFamily:"Georgia,serif",fontSize:"1rem",letterSpacing:"0.08em"}}>Your Cart</div>
            <div style={{color:"#888",fontSize:"0.68rem",fontFamily:"Arial,sans-serif",marginTop:"0.2rem"}}>{count} item{count !== 1 ? "s" : ""}</div>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#888",fontSize:"1.2rem",cursor:"pointer",padding:"0.3rem"}}>✕</button>
        </div>

        {/* Items */}
        <div style={{flex:1,overflowY:"auto",padding:"1.5rem 2rem"}}>
          {cart.length === 0 ? (
            <div style={{textAlign:"center",padding:"4rem 0"}}>
              <div style={{fontSize:"3.5rem",marginBottom:"1rem",opacity:0.2}}>🛒</div>
              <p style={{color:"#888",fontSize:"0.8rem",fontFamily:"Arial,sans-serif",marginBottom:"1.5rem"}}>Your cart is empty</p>
              <button onClick={onClose} className="btn-outline" style={{fontSize:"0.65rem",padding:"0.5rem 1.2rem"}}>Browse Gifts</button>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              {cart.map(item => (
                <div key={item.id} style={{background:"#1A1A1A",border:"0.5px solid #2a2a2a",padding:"1.2rem"}}>
                  <div style={{display:"flex",gap:"1rem",alignItems:"start"}}>
                    <div style={{width:"52px",height:"52px",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",opacity:0.5,flexShrink:0}}>
                      {item.category === "Flowers" ? "🌹" : item.category === "Electronics" ? "⌚" : item.category === "Bundles" ? "🎀" : "🎁"}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{color:"#F5F5F5",fontSize:"0.82rem",fontFamily:"Georgia,serif",marginBottom:"0.2rem"}}>{item.name}</div>
                      <div style={{color:"#888",fontSize:"0.68rem",fontFamily:"Arial,sans-serif",marginBottom:"0.5rem"}}>{item.category}</div>
                      {item.recipientName && <div style={{color:"#C6A962",fontSize:"0.65rem",fontFamily:"Arial,sans-serif"}}>For: {item.recipientName}</div>}
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{background:"transparent",border:"none",color:"#555",cursor:"pointer",fontSize:"0.9rem",padding:"0.2rem"}}>✕</button>
                  </div>

                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"1rem",paddingTop:"0.8rem",borderTop:"0.5px solid #2a2a2a"}}>
                    {/* Quantity */}
                    <div style={{display:"flex",alignItems:"center",gap:"0",border:"0.5px solid #333"}}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",padding:"0.3rem 0.7rem",fontSize:"1rem"}}>−</button>
                      <span style={{color:"#F5F5F5",fontSize:"0.8rem",padding:"0.3rem 0.8rem",borderLeft:"0.5px solid #333",borderRight:"0.5px solid #333",fontFamily:"Arial,sans-serif"}}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",padding:"0.3rem 0.7rem",fontSize:"1rem"}}>+</button>
                    </div>
                    <div style={{color:"#C6A962",fontFamily:"Georgia,serif",fontSize:"1rem"}}>
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{padding:"1.5rem 2rem",borderTop:"0.5px solid #2a2a2a",background:"#0D0D0D"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
              <span style={{color:"#888",fontSize:"0.75rem",fontFamily:"Arial,sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>Total</span>
              <span style={{color:"#C6A962",fontFamily:"Georgia,serif",fontSize:"1.5rem"}}>৳ {total.toLocaleString()}</span>
            </div>
            <button onClick={handleCheckout} className="btn-gold" style={{width:"100%",padding:"1rem",fontSize:"0.75rem"}}>
              Proceed to Checkout →
            </button>
            <button onClick={clearCart} style={{width:"100%",marginTop:"0.75rem",background:"transparent",border:"none",color:"#555",fontSize:"0.65rem",cursor:"pointer",fontFamily:"Arial,sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}