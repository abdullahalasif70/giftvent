"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/authContext";
import { useCart } from "@/lib/cartContext";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CartCheckout() {
  const { user } = useAuth();
  const { cart, total, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("Gulshan");
  const [payMethod, setPayMethod] = useState("bkash");
  const [txnId, setTxnId] = useState("");

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  if (cart.length === 0) {
    return (
      <main style={{minHeight:"100vh",background:"#0D0D0D",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1.5rem"}}>
        <div style={{fontSize:"4rem",opacity:0.2}}>🛒</div>
        <p style={{color:"#888",fontFamily:"Arial,sans-serif"}}>Your cart is empty</p>
        <Link href="/shop" className="btn-gold">Browse Gifts</Link>
      </main>
    );
  }

  const handleOrder = async () => {
    if (!txnId) { toast.error("Please enter transaction ID"); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        items: cart.map(i => ({
          productId: i.id,
          productName: i.name,
          price: i.price,
          quantity: i.quantity,
          recipientName: i.recipientName || "",
          message: i.message || "",
          deliveryDate: i.deliveryDate || "",
        })),
        productName: cart.length === 1 ? cart[0].name : `${cart.length} items`,
        type: "cart",
        deliveryName: name,
        phone, address, area,
        payMethod, txnId,
        price: total,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      clearCart();
      toast.success("Order placed successfully!");
      router.push("/dashboard");
    } catch { toast.error("Failed to place order"); }
    setLoading(false);
  };

  return (
    <main style={{minHeight:"100vh",background:"#0D0D0D",padding:"4rem"}}>
      <div style={{maxWidth:"900px",margin:"0 auto"}}>
        <div className="gv-section-label" style={{marginBottom:"0.8rem"}}>Checkout</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"2rem",marginBottom:"3rem"}}>
          Complete Your <em style={{color:"#C6A962",fontStyle:"italic"}}>Order</em>
        </h1>

        {/* Steps */}
        <div style={{display:"flex",borderBottom:"0.5px solid #2a2a2a",marginBottom:"3rem"}}>
          {["Cart Review","Delivery Info","Payment"].map((s, i) => (
            <div key={i} style={{padding:"0.8rem 2rem",fontSize:"0.7rem",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"Arial,sans-serif",borderBottom:`2px solid ${step===i+1?"#C6A962":"transparent"}`,color:step===i+1?"#C6A962":"#888",marginBottom:"-0.5px",cursor:"pointer"}} onClick={() => { if(i+1 < step) setStep(i+1); }}>
              {i+1}. {s}
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:"3rem",alignItems:"start"}}>
          {/* Left - Steps */}
          <div>
            {/* Step 1 - Cart Review */}
            {step === 1 && (
              <div className="gv-form-box">
                <div className="gv-form-title">Review Your Cart</div>
                {cart.map(item => (
                  <div key={item.id} style={{borderBottom:"0.5px solid #2a2a2a",paddingBottom:"1rem",marginBottom:"1rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                      <div>
                        <div style={{fontFamily:"Georgia,serif",fontSize:"0.9rem",marginBottom:"0.2rem"}}>{item.name}</div>
                        <div style={{color:"#888",fontSize:"0.7rem",fontFamily:"Arial,sans-serif"}}>Qty: {item.quantity} · {item.category}</div>
                        {item.recipientName && <div style={{color:"#C6A962",fontSize:"0.68rem",fontFamily:"Arial,sans-serif",marginTop:"0.2rem"}}>For: {item.recipientName}</div>}
                        {item.deliveryDate && <div style={{color:"#888",fontSize:"0.68rem",fontFamily:"Arial,sans-serif"}}>Delivery: {item.deliveryDate}</div>}
                      </div>
                      <div style={{color:"#C6A962",fontFamily:"Georgia,serif",fontSize:"1rem"}}>৳ {(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setStep(2)} className="btn-gold" style={{width:"100%",marginTop:"0.5rem"}}>Continue to Delivery →</button>
              </div>
            )}

            {/* Step 2 - Delivery */}
            {step === 2 && (
              <div className="gv-form-box">
                <div className="gv-form-title">Delivery Information</div>
                <div className="gv-form-row">
                  <label className="gv-form-label">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
                </div>
                <div className="gv-form-row">
                  <label className="gv-form-label">Phone Number</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+880 1X XXX XXXXX" required />
                </div>
                <div className="gv-form-row">
                  <label className="gv-form-label">Delivery Address</label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="House/Road/Block details..." rows={3} style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",resize:"vertical",fontFamily:"Arial,sans-serif"}} required />
                </div>
                <div className="gv-form-row">
                  <label className="gv-form-label">Area</label>
                  <select value={area} onChange={e => setArea(e.target.value)} style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none"}}>
                    {["Gulshan","Banani","Dhanmondi","Uttara","Mirpur","Mohammadpur","Motijheel","Old Dhaka","Bashundhara","Other"].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div style={{display:"flex",gap:"1rem",marginTop:"0.5rem"}}>
                  <button onClick={() => setStep(1)} className="btn-outline" style={{flex:1}}>← Back</button>
                  <button onClick={() => { if(!name||!phone||!address){toast.error("Fill all fields");return;} setStep(3); }} className="btn-gold" style={{flex:2}}>Continue to Payment →</button>
                </div>
              </div>
            )}

            {/* Step 3 - Payment */}
            {step === 3 && (
              <div className="gv-form-box">
                <div className="gv-form-title">Payment</div>
                <div style={{marginBottom:"1.5rem"}}>
                  <label className="gv-form-label" style={{marginBottom:"1rem",display:"block"}}>Payment Method</label>
                  <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
                    {["bkash","nagad","rocket","bank"].map(m => (
                      <button key={m} onClick={() => setPayMethod(m)} style={{padding:"0.6rem 1.2rem",background:payMethod===m?"rgba(198,169,98,0.15)":"#222",border:`0.5px solid ${payMethod===m?"#C6A962":"#333"}`,color:payMethod===m?"#C6A962":"#888",fontSize:"0.72rem",letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontFamily:"Arial,sans-serif",transition:"all 0.2s"}}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{background:"rgba(198,169,98,0.05)",border:"0.5px solid rgba(198,169,98,0.2)",padding:"1.2rem",marginBottom:"1.5rem"}}>
                  <div style={{color:"#C6A962",fontSize:"0.72rem",fontFamily:"Arial,sans-serif",marginBottom:"0.5rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>Payment Instructions</div>
                  <p style={{color:"#888",fontSize:"0.78rem",fontFamily:"Arial,sans-serif",lineHeight:"1.7"}}>
                    Send <strong style={{color:"#F5F5F5"}}>৳ {total.toLocaleString()}</strong> to our {payMethod.toUpperCase()} number:<br/>
                    <strong style={{color:"#C6A962",fontSize:"1rem"}}>01XXXXXXXXX</strong><br/>
                    Reference: <strong style={{color:"#F5F5F5"}}>GIFTVENT</strong>
                  </p>
                </div>
                <div className="gv-form-row">
                  <label className="gv-form-label">Transaction ID</label>
                  <input value={txnId} onChange={e => setTxnId(e.target.value)} placeholder="Enter your transaction ID" required />
                </div>
                <div style={{display:"flex",gap:"1rem",marginTop:"0.5rem"}}>
                  <button onClick={() => setStep(2)} className="btn-outline" style={{flex:1}}>← Back</button>
                  <button onClick={handleOrder} disabled={loading} className="btn-gold" style={{flex:2}}>
                    {loading ? "Placing Order..." : "Confirm Order ✓"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right - Order Summary */}
          <div style={{background:"#1A1A1A",border:"0.5px solid #2a2a2a",padding:"1.5rem",position:"sticky",top:"6rem"}}>
            <div style={{color:"#888",fontSize:"0.65rem",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"1.2rem",fontFamily:"Arial,sans-serif"}}>Order Summary</div>
            {cart.map(item => (
              <div key={item.id} style={{display:"flex",justifyContent:"space-between",marginBottom:"0.75rem",paddingBottom:"0.75rem",borderBottom:"0.5px solid #2a2a2a"}}>
                <div style={{fontSize:"0.78rem",fontFamily:"Georgia,serif",color:"#F5F5F5"}}>{item.name} <span style={{color:"#555",fontFamily:"Arial,sans-serif"}}>×{item.quantity}</span></div>
                <div style={{color:"#C6A962",fontSize:"0.78rem",fontFamily:"Georgia,serif"}}>৳ {(item.price*item.quantity).toLocaleString()}</div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"0.75rem"}}>
              <span style={{color:"#888",fontSize:"0.72rem",fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:"0.1em"}}>Total</span>
              <span style={{color:"#C6A962",fontFamily:"Georgia,serif",fontSize:"1.5rem"}}>৳ {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}