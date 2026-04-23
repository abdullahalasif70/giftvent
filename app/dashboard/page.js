"use client";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [moments, setMoments] = useState([]);
  const [tab, setTab] = useState("orders");

  useEffect(() => {
    if (!user) { router.push("/auth/login"); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    const [oSnap, mSnap] = await Promise.all([
      getDocs(query(collection(db, "orders"), where("userId", "==", user.uid))),
      getDocs(query(collection(db, "moments"), where("userId", "==", user.uid))),
    ]);
    setOrders(oSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setMoments(mSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const statusColor = (s) => s === "pending" ? "#F59E0B" : s === "confirmed" ? "#3B82F6" : s === "delivered" ? "#10B981" : s === "cancelled" ? "#EF4444" : "#888";

  const getDaysLeft = (dateStr) => {
    const today = new Date();
    const next = new Date(dateStr);
    next.setFullYear(today.getFullYear());
    if (next < today) next.setFullYear(today.getFullYear() + 1);
    return Math.ceil((next - today) / (1000 * 60 * 60 * 24));
  };

  if (!user) return null;

  return (
    <main className="gv-page">
      <div className="gv-page-header">
        <div className="gv-section-label">My Account</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"2.2rem",fontWeight:700}}>
          Welcome, <em style={{color:"#C6A962",fontStyle:"italic"}}>{user.displayName || "Friend"}</em>
        </h1>
      </div>

      {/* Summary Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5rem",marginBottom:"3rem"}}>
        {[
          { icon: "📦", label: "Total Orders", val: orders.length },
          { icon: "⏳", label: "Pending Orders", val: orders.filter(o => o.status === "pending").length },
          { icon: "❤️", label: "Saved Moments", val: moments.length },
        ].map((s, i) => (
          <div key={i} style={{background:"#1A1A1A",border:"0.5px solid #2a2a2a",padding:"2rem",textAlign:"center"}}>
            <div style={{fontSize:"2rem",marginBottom:"0.5rem",opacity:0.5}}>{s.icon}</div>
            <div style={{fontSize:"2rem",color:"#C6A962",fontFamily:"Georgia,serif",marginBottom:"0.3rem"}}>{s.val}</div>
            <div style={{fontSize:"0.65rem",color:"#888",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"Arial,sans-serif"}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="gv-tabs">
        <button onClick={() => setTab("orders")} className={`gv-tab ${tab==="orders"?"active":""}`}>My Orders</button>
        <button onClick={() => setTab("moments")} className={`gv-tab ${tab==="moments"?"active":""}`}>My Moments</button>
        <button onClick={() => setTab("account")} className={`gv-tab ${tab==="account"?"active":""}`}>Account</button>
      </div>

      {/* Orders */}
      {tab === "orders" && (
        <div>
          {orders.length === 0 ? (
            <div style={{textAlign:"center",padding:"4rem",background:"#1A1A1A",border:"0.5px solid #2a2a2a"}}>
              <div style={{fontSize:"3rem",marginBottom:"1rem",opacity:0.3}}>📦</div>
              <p style={{color:"#888",fontSize:"0.85rem",fontFamily:"Arial,sans-serif",marginBottom:"1.5rem"}}>No orders yet</p>
              <Link href="/shop" className="btn-gold">Browse Gifts</Link>
            </div>
          ) : orders.map(o => (
            <div key={o.id} style={{background:"#1A1A1A",border:"0.5px solid #2a2a2a",padding:"1.5rem",marginBottom:"1rem"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.8rem"}}>
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:"1rem",marginBottom:"0.2rem"}}>{o.productName}</div>
                  <div style={{color:"#888",fontSize:"0.7rem",fontFamily:"Arial,sans-serif"}}>{o.createdAt?.slice(0,10)} · {o.area}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
                  <div style={{color:"#C6A962",fontFamily:"Georgia,serif",fontSize:"1.2rem"}}>৳ {o.price?.toLocaleString()}</div>
                  <span style={{fontSize:"0.62rem",letterSpacing:"0.1em",textTransform:"uppercase",padding:"0.25rem 0.7rem",border:`0.5px solid ${statusColor(o.status)}`,color:statusColor(o.status),fontFamily:"Arial,sans-serif"}}>
                    {o.status}
                  </span>
                </div>
              </div>
              {o.recipientName && <div style={{color:"#555",fontSize:"0.72rem",fontFamily:"Arial,sans-serif"}}>For: {o.recipientName} · Delivery: {o.deliveryDate}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Moments */}
      {tab === "moments" && (
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:"1rem"}}>
            <Link href="/moments" className="btn-gold" style={{fontSize:"0.65rem",padding:"0.5rem 1.2rem"}}>+ Add Moment</Link>
          </div>
          {moments.length === 0 ? (
            <div style={{textAlign:"center",padding:"4rem",background:"#1A1A1A",border:"0.5px solid #2a2a2a"}}>
              <div style={{fontSize:"3rem",marginBottom:"1rem",opacity:0.3}}>❤️</div>
              <p style={{color:"#888",fontSize:"0.85rem",fontFamily:"Arial,sans-serif",marginBottom:"1.5rem"}}>No moments saved</p>
              <Link href="/moments" className="btn-gold">Save a Moment</Link>
            </div>
          ) : moments.map(m => {
            const days = getDaysLeft(m.date);
            return (
              <div key={m.id} style={{background:"#1A1A1A",border:`0.5px solid ${days<=7?"#8A7340":"#2a2a2a"}`,padding:"1.2rem 1.5rem",marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"1rem"}}>
                <div className="gv-avatar">{m.name?.[0]?.toUpperCase()}</div>
                <div style={{flex:1}}>
                  <div style={{color:"#F5F5F5",fontSize:"0.85rem",fontFamily:"Georgia,serif"}}>{m.name}</div>
                  <div style={{color:"#888",fontSize:"0.7rem",fontFamily:"Arial,sans-serif"}}>{m.relation} · {m.date}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:days<=7?"#C6A962":"#888",fontSize:"1.3rem",fontFamily:"Georgia,serif"}}>{days}</div>
                  <div style={{color:"#555",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"Arial,sans-serif"}}>days</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Account */}
      {tab === "account" && (
        <div style={{background:"#1A1A1A",border:"0.5px solid #2a2a2a",padding:"2.5rem",maxWidth:"500px"}}>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:"1rem",marginBottom:"2rem",color:"#C6A962"}}>Account Details</h2>
          <div style={{marginBottom:"1.5rem"}}>
            <div style={{color:"#555",fontSize:"0.62rem",textTransform:"uppercase",letterSpacing:"0.18em",fontFamily:"Arial,sans-serif",marginBottom:"0.4rem"}}>Full Name</div>
            <div style={{color:"#F5F5F5",fontSize:"0.9rem",fontFamily:"Georgia,serif"}}>{user.displayName || "—"}</div>
          </div>
          <div>
            <div style={{color:"#555",fontSize:"0.62rem",textTransform:"uppercase",letterSpacing:"0.18em",fontFamily:"Arial,sans-serif",marginBottom:"0.4rem"}}>Email</div>
            <div style={{color:"#F5F5F5",fontSize:"0.9rem",fontFamily:"Georgia,serif"}}>{user.email}</div>
          </div>
        </div>
      )}
    </main>
  );
}