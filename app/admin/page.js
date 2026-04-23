"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("orders");
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [moments, setMoments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortMoments, setSortMoments] = useState("days");

  const [pName, setPName] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState("Flowers");

  const [eName, setEName] = useState("");
  const [eDesc, setEDesc] = useState("");
  const [ePrice, setEPrice] = useState("");
  const [eType, setEType] = useState("Birthday");
  const [eBadge, setEBadge] = useState("");

  useEffect(() => {
    if (!user) { router.push("/auth/login"); return; }
    if (user && !isAdmin) { router.push("/"); return; }
    loadAll();
  }, [user, isAdmin]);

  const loadAll = async () => {
    const [pSnap, eSnap, uSnap, mSnap, oSnap] = await Promise.all([
      getDocs(collection(db, "products")),
      getDocs(collection(db, "events")),
      getDocs(collection(db, "users")),
      getDocs(collection(db, "moments")),
      getDocs(collection(db, "orders")),
    ]);
    setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setEvents(eSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setMoments(mSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setOrders(oSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const getDaysLeft = (dateStr) => {
    const today = new Date();
    const next = new Date(dateStr);
    next.setFullYear(today.getFullYear());
    if (next < today) next.setFullYear(today.getFullYear() + 1);
    return Math.ceil((next - today) / (1000 * 60 * 60 * 24));
  };

  const sortedMoments = [...moments].sort((a, b) => {
    if (sortMoments === "days") return getDaysLeft(a.date) - getDaysLeft(b.date);
    if (sortMoments === "name") return a.name.localeCompare(b.name);
    if (sortMoments === "relation") return a.relation.localeCompare(b.relation);
    return 0;
  });

  const addProduct = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await addDoc(collection(db, "products"), { name: pName, description: pDesc, price: Number(pPrice), category: pCategory, createdAt: new Date().toISOString() });
      toast.success("Product added!");
      setPName(""); setPDesc(""); setPPrice(""); setPCategory("Flowers");
      loadAll();
    } catch { toast.error("Failed"); }
    setLoading(false);
  };

  const addEvent = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await addDoc(collection(db, "events"), { name: eName, description: eDesc, price: Number(ePrice), type: eType, badge: eBadge, createdAt: new Date().toISOString() });
      toast.success("Event added!");
      setEName(""); setEDesc(""); setEPrice(""); setEType("Birthday"); setEBadge("");
      loadAll();
    } catch { toast.error("Failed"); }
    setLoading(false);
  };

  const deleteItem = async (col, id, label) => {
    if (!confirm(`Delete this ${label}?`)) return;
    await deleteDoc(doc(db, col, id));
    toast.success(`${label} deleted`);
    loadAll();
  };

  const updateOrderStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    toast.success(`Order marked as ${status}`);
    loadAll();
  };

  const statusColor = (s) => s === "pending" ? "#F59E0B" : s === "confirmed" ? "#3B82F6" : s === "delivered" ? "#10B981" : s === "cancelled" ? "#EF4444" : "#888";

  if (!user || !isAdmin) return null;

  return (
    <main className="gv-page">
      <div className="gv-page-header">
        <div className="gv-section-label">Admin Panel</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"2.2rem",fontWeight:700}}>
          GiftVent <em style={{color:"#C6A962",fontStyle:"italic"}}>Control Center</em>
        </h1>
      </div>

      {/* Stats */}
      <div className="gv-admin-stats">
        {[
          { label: "Total Orders", val: orders.length, icon: "📦" },
          { label: "Products", val: products.length, icon: "🎁" },
          { label: "Event Services", val: events.length, icon: "🎊" },
          { label: "Users", val: users.length, icon: "👤" },
          { label: "Moments Saved", val: moments.length, icon: "❤️" },
        ].map((s, i) => (
          <div key={i} className="gv-admin-stat" style={{background:"#0D0D0D"}}>
            <div className="gv-admin-stat-icon">{s.icon}</div>
            <div className="gv-admin-stat-num">{s.val}</div>
            <div className="gv-admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="gv-tabs">
        {["orders","products","events","users","moments"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`gv-tab ${tab===t?"active":""}`}>{t}</button>
        ))}
      </div>

      {/* ORDERS */}
      {tab === "orders" && (
        <div>
          <h2 style={{color:"#888",fontSize:"0.72rem",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"1.5rem",fontFamily:"Arial,sans-serif"}}>All Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <div style={{textAlign:"center",padding:"4rem",background:"#1A1A1A",border:"0.5px solid #2a2a2a"}}>
              <p style={{color:"#888",fontSize:"0.85rem"}}>No orders yet</p>
            </div>
          ) : orders.map(o => (
            <div key={o.id} style={{background:"#1A1A1A",border:"0.5px solid #2a2a2a",padding:"1.5rem",marginBottom:"1rem"}}>
              <div style={{display:"flex",alignItems:"start",justifyContent:"space-between",marginBottom:"1rem"}}>
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:"1rem",marginBottom:"0.3rem"}}>{o.productName}</div>
                  <div style={{color:"#888",fontSize:"0.72rem",fontFamily:"Arial,sans-serif"}}>
                    By: {o.userName} ({o.userEmail}) · {o.createdAt?.slice(0,10)}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
                  <div style={{color:"#C6A962",fontFamily:"Georgia,serif",fontSize:"1.2rem"}}>৳ {o.price?.toLocaleString()}</div>
                  <span style={{fontSize:"0.65rem",letterSpacing:"0.1em",textTransform:"uppercase",padding:"0.25rem 0.7rem",border:`0.5px solid ${statusColor(o.status)}`,color:statusColor(o.status),fontFamily:"Arial,sans-serif"}}>
                    {o.status}
                  </span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",padding:"1rem",background:"#111",marginBottom:"1rem"}}>
                {o.recipientName && <div><div style={{color:"#555",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.15em",fontFamily:"Arial,sans-serif",marginBottom:"0.3rem"}}>Recipient</div><div style={{color:"#F5F5F5",fontSize:"0.78rem",fontFamily:"Arial,sans-serif"}}>{o.recipientName}</div></div>}
                <div><div style={{color:"#555",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.15em",fontFamily:"Arial,sans-serif",marginBottom:"0.3rem"}}>Phone</div><div style={{color:"#F5F5F5",fontSize:"0.78rem",fontFamily:"Arial,sans-serif"}}>{o.phone}</div></div>
                <div><div style={{color:"#555",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.15em",fontFamily:"Arial,sans-serif",marginBottom:"0.3rem"}}>Area</div><div style={{color:"#F5F5F5",fontSize:"0.78rem",fontFamily:"Arial,sans-serif"}}>{o.area}</div></div>
                <div><div style={{color:"#555",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.15em",fontFamily:"Arial,sans-serif",marginBottom:"0.3rem"}}>Delivery Date</div><div style={{color:"#F5F5F5",fontSize:"0.78rem",fontFamily:"Arial,sans-serif"}}>{o.deliveryDate}</div></div>
                <div><div style={{color:"#555",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.15em",fontFamily:"Arial,sans-serif",marginBottom:"0.3rem"}}>Payment</div><div style={{color:"#F5F5F5",fontSize:"0.78rem",fontFamily:"Arial,sans-serif",textTransform:"uppercase"}}>{o.payMethod} · {o.txnId}</div></div>
                {o.address && <div style={{gridColumn:"span 2"}}><div style={{color:"#555",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.15em",fontFamily:"Arial,sans-serif",marginBottom:"0.3rem"}}>Address</div><div style={{color:"#F5F5F5",fontSize:"0.78rem",fontFamily:"Arial,sans-serif"}}>{o.address}</div></div>}
                {o.message && <div style={{gridColumn:"span 4"}}><div style={{color:"#555",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.15em",fontFamily:"Arial,sans-serif",marginBottom:"0.3rem"}}>Message</div><div style={{color:"#888",fontSize:"0.78rem",fontFamily:"Georgia,serif",fontStyle:"italic"}}>"{o.message}"</div></div>}
              </div>
              <div style={{display:"flex",gap:"0.5rem"}}>
                {["pending","confirmed","delivered","cancelled"].map(s => (
                  <button key={s} onClick={() => updateOrderStatus(o.id, s)} style={{padding:"0.3rem 0.8rem",fontSize:"0.62rem",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"Arial,sans-serif",cursor:"pointer",transition:"all 0.2s",background:o.status===s?"rgba(198,169,98,0.15)":"transparent",border:`0.5px solid ${o.status===s?"#C6A962":"#333"}`,color:o.status===s?"#C6A962":"#666"}}>
                    {s}
                  </button>
                ))}
                <button onClick={() => deleteItem("orders", o.id, "order")} className="gv-delete-btn" style={{marginLeft:"auto"}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS */}
      {tab === "products" && (
        <div className="gv-grid-2">
          <div className="gv-form-box">
            <div className="gv-form-title">+ Add New Product</div>
            <form onSubmit={addProduct}>
              <div className="gv-form-row">
                <label className="gv-form-label">Product Name</label>
                <input value={pName} onChange={e => setPName(e.target.value)} placeholder="e.g. Royal Rose Arrangement" required />
              </div>
              <div className="gv-form-row">
                <label className="gv-form-label">Description</label>
                <textarea value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Product description..." rows={3} required style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",resize:"vertical"}} />
              </div>
              <div className="gv-form-row-2">
                <div>
                  <label className="gv-form-label">Price (BDT)</label>
                  <input type="number" value={pPrice} onChange={e => setPPrice(e.target.value)} placeholder="3500" required />
                </div>
                <div>
                  <label className="gv-form-label">Category</label>
                  <select value={pCategory} onChange={e => setPCategory(e.target.value)} style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none"}}>
                    <option>Flowers</option><option>Luxury</option><option>Electronics</option><option>Bundles</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-gold" style={{width:"100%",marginTop:"0.5rem"}}>{loading ? "Adding..." : "Add Product"}</button>
            </form>
          </div>
          <div>
            <h2 style={{color:"#888",fontSize:"0.72rem",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"1.5rem",fontFamily:"Arial,sans-serif"}}>All Products ({products.length})</h2>
            {products.map(p => (
              <div key={p.id} className="gv-list-item">
                <div style={{flex:1}}>
                  <div style={{color:"#F5F5F5",fontSize:"0.85rem",fontFamily:"Georgia,serif",marginBottom:"0.2rem"}}>{p.name}</div>
                  <div style={{color:"#888",fontSize:"0.7rem",fontFamily:"Arial,sans-serif"}}>{p.category} · ৳ {p.price?.toLocaleString()}</div>
                </div>
                <button onClick={() => deleteItem("products", p.id, "product")} className="gv-delete-btn">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EVENTS */}
      {tab === "events" && (
        <div className="gv-grid-2">
          <div className="gv-form-box">
            <div className="gv-form-title">+ Add Event Service</div>
            <form onSubmit={addEvent}>
              <div className="gv-form-row">
                <label className="gv-form-label">Event Name</label>
                <input value={eName} onChange={e => setEName(e.target.value)} placeholder="e.g. Birthday Surprise Setup" required />
              </div>
              <div className="gv-form-row">
                <label className="gv-form-label">Description</label>
                <textarea value={eDesc} onChange={e => setEDesc(e.target.value)} placeholder="Event description..." rows={3} required style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",resize:"vertical"}} />
              </div>
              <div className="gv-form-row-2">
                <div>
                  <label className="gv-form-label">Starting Price (BDT)</label>
                  <input type="number" value={ePrice} onChange={e => setEPrice(e.target.value)} placeholder="8000" required />
                </div>
                <div>
                  <label className="gv-form-label">Type</label>
                  <select value={eType} onChange={e => setEType(e.target.value)} style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none"}}>
                    <option>Birthday</option><option>Wedding</option><option>Anniversary</option><option>Corporate</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="gv-form-row">
                <label className="gv-form-label">Badge (optional)</label>
                <input value={eBadge} onChange={e => setEBadge(e.target.value)} placeholder="e.g. Most Booked, Premium..." />
              </div>
              <button type="submit" disabled={loading} className="btn-gold" style={{width:"100%",marginTop:"0.5rem"}}>{loading ? "Adding..." : "Add Event Service"}</button>
            </form>
          </div>
          <div>
            <h2 style={{color:"#888",fontSize:"0.72rem",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"1.5rem",fontFamily:"Arial,sans-serif"}}>All Events ({events.length})</h2>
            {events.map(ev => (
              <div key={ev.id} className="gv-list-item">
                <div style={{flex:1}}>
                  <div style={{color:"#F5F5F5",fontSize:"0.85rem",fontFamily:"Georgia,serif",marginBottom:"0.2rem"}}>{ev.name}</div>
                  <div style={{color:"#888",fontSize:"0.7rem",fontFamily:"Arial,sans-serif"}}>{ev.type} · From ৳ {ev.price?.toLocaleString()}</div>
                </div>
                <button onClick={() => deleteItem("events", ev.id, "event")} className="gv-delete-btn">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS */}
      {tab === "users" && (
        <div>
          <h2 style={{color:"#888",fontSize:"0.72rem",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"1.5rem",fontFamily:"Arial,sans-serif"}}>All Users ({users.length})</h2>
          {users.map(u => (
            <div key={u.id} className="gv-list-item">
              <div className="gv-avatar">{u.name?.[0]?.toUpperCase() || "?"}</div>
              <div style={{flex:1}}>
                <div style={{color:"#F5F5F5",fontSize:"0.85rem",fontFamily:"Georgia,serif"}}>{u.name}</div>
                <div style={{color:"#888",fontSize:"0.7rem",fontFamily:"Arial,sans-serif"}}>{u.email}</div>
              </div>
              <div style={{color:"#555",fontSize:"0.68rem",fontFamily:"Arial,sans-serif"}}>Joined {u.createdAt?.slice(0,10)}</div>
            </div>
          ))}
        </div>
      )}

      {/* MOMENTS */}
      {tab === "moments" && (
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
            <h2 style={{color:"#888",fontSize:"0.72rem",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"Arial,sans-serif"}}>All Moments ({moments.length})</h2>
            <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
              <span style={{color:"#555",fontSize:"0.65rem",fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:"0.1em"}}>Sort by:</span>
              {["days","name","relation"].map(s => (
                <button key={s} onClick={() => setSortMoments(s)} style={{padding:"0.3rem 0.8rem",fontSize:"0.62rem",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"Arial,sans-serif",cursor:"pointer",transition:"all 0.2s",background:sortMoments===s?"rgba(198,169,98,0.15)":"transparent",border:`0.5px solid ${sortMoments===s?"#C6A962":"#333"}`,color:sortMoments===s?"#C6A962":"#666"}}>
                  {s === "days" ? "Days Left" : s}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.75rem"}}>
            {sortedMoments.map(m => {
              const days = getDaysLeft(m.date);
              return (
                <div key={m.id} className="gv-list-item" style={{flexDirection:"column",alignItems:"stretch",gap:"0.75rem"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
                    <div className="gv-avatar">{m.name?.[0]?.toUpperCase()}</div>
                    <div style={{flex:1}}>
                      <div style={{color:"#F5F5F5",fontSize:"0.85rem",fontFamily:"Georgia,serif"}}>{m.name}</div>
                      <div style={{color:"#888",fontSize:"0.7rem",fontFamily:"Arial,sans-serif"}}>{m.relation} · {m.date}</div>
                      {m.phone && <div style={{color:"#555",fontSize:"0.68rem",fontFamily:"Arial,sans-serif"}}>{m.phone}</div>}
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{color: days <= 7 ? "#C6A962" : "#888",fontSize:"1.3rem",fontFamily:"Georgia,serif",lineHeight:1}}>{days}</div>
                      <div style={{color:"#555",fontSize:"0.58rem",textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"Arial,sans-serif"}}>days left</div>
                    </div>
                  </div>
                  {days <= 7 && (
                    <div style={{background:"rgba(198,169,98,0.08)",border:"0.5px solid rgba(198,169,98,0.2)",padding:"0.5rem 0.8rem",fontSize:"0.68rem",color:"#C6A962",fontFamily:"Arial,sans-serif"}}>
                      ⚡ {m.name}'s {m.relation} is in {days} day{days !== 1 ? "s" : ""} — Consider sending a reminder!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}