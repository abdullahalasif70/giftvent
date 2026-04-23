"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/authContext";
import toast from "react-hot-toast";

function CheckoutForm() {
  const params = useSearchParams();
  const { user } = useAuth();
  const router = useRouter();

  const productName = params.get("productName") || "";
  const price = params.get("price") || 0;
  const recipientName = params.get("recipientName") || "";
  const message = params.get("message") || "";
  const deliveryDate = params.get("deliveryDate") || "";
  const productId = params.get("productId") || "";
  const type = params.get("type") || "product";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("Gulshan");
  const [payMethod, setPayMethod] = useState("bkash");
  const [txnId, setTxnId] = useState("");

  const handleOrder = async () => {
    if (!txnId) { toast.error("Please enter transaction ID"); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        productId, productName, type,
        recipientName, message, deliveryDate,
        deliveryName: name, phone, address, area,
        payMethod, txnId,
        price: Number(price),
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      toast.success("Order placed successfully!");
      router.push("/dashboard");
    } catch { toast.error("Failed to place order"); }
    setLoading(false);
  };

  return (
    <main style={{minHeight:"100vh",background:"#0D0D0D",padding:"4rem"}}>
      <div style={{maxWidth:"800px",margin:"0 auto"}}>
        <div className="gv-section-label" style={{marginBottom:"0.8rem"}}>Checkout</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"2rem",marginBottom:"3rem"}}>Complete Your <em style={{color:"#C6A962",fontStyle:"italic"}}>Order</em></h1>

        {/* Steps */}
        <div style={{display:"flex",gap:"0",marginBottom:"3rem",borderBottom:"0.5px solid #2a2a2a"}}>
          {["Delivery Info","Payment","Confirmation"].map((s, i) => (
            <div key={i} style={{padding:"0.8rem 2rem",fontSize:"0.7rem",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"Arial,sans-serif",borderBottom:`2px solid ${step === i+1 ? "#C6A962" : "transparent"}`,color:step === i+1 ? "#C6A962" : "#888",marginBottom:"-0.5px"}}>
              {i+1}. {s}
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{background:"#1A1A1A",border:"0.5px solid #2a2a2a",padding:"1.5rem",marginBottom:"2rem"}}>
          <div style={{color:"#888",fontSize:"0.65rem",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"1rem",fontFamily:"Arial,sans-serif"}}>Order Summary</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"Georgia,serif",fontSize:"1rem",marginBottom:"0.3rem"}}>{productName}</div>
              {recipientName && <div style={{color:"#888",fontSize:"0.72rem",fontFamily:"Arial,sans-serif"}}>For: {recipientName}</div>}
              {deliveryDate && <div style={{color:"#888",fontSize:"0.72rem",fontFamily:"Arial,sans-serif"}}>Delivery: {deliveryDate}</div>}
            </div>
            <div style={{color:"#C6A962",fontSize:"1.5rem",fontFamily:"Georgia,serif"}}>৳ {Number(price).toLocaleString()}</div>
          </div>
        </div>

        {/* Step 1 - Delivery */}
        {step === 1 && (
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
            <button onClick={() => { if(!name||!phone||!address){toast.error("Please fill all fields");return;} setStep(2); }} className="btn-gold" style={{width:"100%",marginTop:"0.5rem"}}>
              Continue to Payment →
            </button>
          </div>
        )}

        {/* Step 2 - Payment */}
        {step === 2 && (
          <div className="gv-form-box">
            <div className="gv-form-title">Payment</div>
            <div style={{marginBottom:"1.5rem"}}>
              <label className="gv-form-label" style={{marginBottom:"1rem",display:"block"}}>Payment Method</label>
              <div style={{display:"flex",gap:"1rem"}}>
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
                Send <strong style={{color:"#F5F5F5"}}>৳ {Number(price).toLocaleString()}</strong> to our {payMethod.toUpperCase()} number:<br/>
                <strong style={{color:"#C6A962",fontSize:"1rem"}}>01XXXXXXXXX</strong><br/>
                Use reference: <strong style={{color:"#F5F5F5"}}>GIFTVENT</strong>
              </p>
            </div>
            <div className="gv-form-row">
              <label className="gv-form-label">Transaction ID</label>
              <input value={txnId} onChange={e => setTxnId(e.target.value)} placeholder="Enter your transaction ID" required />
            </div>
            <div style={{display:"flex",gap:"1rem",marginTop:"0.5rem"}}>
              <button onClick={() => setStep(1)} className="btn-outline" style={{flex:1}}>← Back</button>
              <button onClick={handleOrder} disabled={loading} className="btn-gold" style={{flex:2}}>
                {loading ? "Placing Order..." : "Confirm Order →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Checkout() {
  return <Suspense fallback={<div style={{minHeight:"100vh",background:"#0D0D0D",display:"flex",alignItems:"center",justifyContent:"center",color:"#888"}}>Loading...</div>}><CheckoutForm /></Suspense>;
}