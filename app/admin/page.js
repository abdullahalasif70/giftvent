"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Product form
  const [pName, setPName] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState("Flowers");

  // Event form
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
    const [pSnap, eSnap, uSnap, mSnap] = await Promise.all([
      getDocs(collection(db, "products")),
      getDocs(collection(db, "events")),
      getDocs(collection(db, "users")),
      getDocs(collection(db, "moments")),
    ]);
    setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setEvents(eSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setMoments(mSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name: pName, description: pDesc,
        price: Number(pPrice), category: pCategory,
        createdAt: new Date().toISOString()
      });
      toast.success("Product added!");
      setPName(""); setPDesc(""); setPPrice(""); setPCategory("Flowers");
      loadAll();
    } catch { toast.error("Failed to add product"); }
    setLoading(false);
  };

  const addEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        name: eName, description: eDesc,
        price: Number(ePrice), type: eType, badge: eBadge,
        createdAt: new Date().toISOString()
      });
      toast.success("Event service added!");
      setEName(""); setEDesc(""); setEPrice(""); setEType("Birthday"); setEBadge("");
      loadAll();
    } catch { toast.error("Failed to add event"); }
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    toast.success("Product deleted");
    loadAll();
  };

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    toast.success("Event deleted");
    loadAll();
  };

  if (!user || !isAdmin) return null;

  const tabs = ["products", "events", "users", "moments"];

  return (
    <main className="min-h-screen px-16 py-16" style={{background:"#0D0D0D"}}>
      {/* Header */}
      <div className="mb-10">
        <p className="text-[#C6A962] text-xs tracking-[0.3em] uppercase mb-3 flex items-center gap-3">
          <span className="inline-block w-5 h-px bg-[#C6A962]"></span>Admin Panel
        </p>
        <h1 className="text-4xl font-semibold" style={{fontFamily:"serif"}}>
          GiftVent <em className="text-[#C6A962] not-italic">Control Center</em>
        </h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-px mb-10" style={{background:"#1e1e1e"}}>
        {[
          { label: "Products", val: products.length, icon: "🎁" },
          { label: "Event Services", val: events.length, icon: "🎊" },
          { label: "Users", val: users.length, icon: "👤" },
          { label: "Moments Saved", val: moments.length, icon: "❤️" },
        ].map((s, i) => (
          <div key={i} className="p-6 text-center" style={{background:"#0D0D0D"}}>
            <div className="text-2xl mb-2 opacity-50">{s.icon}</div>
            <div className="text-2xl text-[#C6A962] mb-1" style={{fontFamily:"serif"}}>{s.val}</div>
            <div className="text-[#888] text-xs tracking-widest uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#2a2a2a] mb-10">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-xs tracking-widest uppercase px-6 py-3 border-b-2 transition-all ${tab === t ? "text-[#C6A962] border-[#C6A962]" : "text-[#888] border-transparent hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === "products" && (
        <div className="grid grid-cols-2 gap-12">
          <div className="border border-[#2a2a2a] p-8" style={{background:"#1A1A1A"}}>
            <h2 className="text-[#C6A962] text-sm tracking-widest mb-6" style={{fontFamily:"serif"}}>+ Add New Product</h2>
            <form onSubmit={addProduct} className="flex flex-col gap-4">
              <div>
                <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Product Name</label>
                <input value={pName} onChange={e => setPName(e.target.value)} placeholder="e.g. Royal Rose Arrangement" required />
              </div>
              <div>
                <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Description</label>
                <textarea value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Product description..." rows={3} required style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",resize:"vertical"}} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Price (BDT)</label>
                  <input type="number" value={pPrice} onChange={e => setPPrice(e.target.value)} placeholder="3500" required />
                </div>
                <div>
                  <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Category</label>
                  <select value={pCategory} onChange={e => setPCategory(e.target.value)} style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none"}}>
                    <option>Flowers</option>
                    <option>Luxury</option>
                    <option>Electronics</option>
                    <option>Bundles</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full mt-2">
                {loading ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-[#888] text-xs tracking-widest uppercase mb-6">All Products ({products.length})</h2>
            {products.length === 0 ? (
              <div className="text-center py-16 border border-[#2a2a2a]" style={{background:"#1A1A1A"}}>
                <p className="text-[#888] text-xs">No products yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {products.map(p => (
                  <div key={p.id} className="border border-[#2a2a2a] p-4 flex items-center gap-4" style={{background:"#1A1A1A"}}>
                    <div className="flex-1">
                      <div className="text-white text-sm mb-1">{p.name}</div>
                      <div className="text-[#888] text-xs">{p.category} · ৳ {p.price?.toLocaleString()}</div>
                    </div>
                    <button onClick={() => deleteProduct(p.id)} className="text-xs text-red-400 hover:text-red-300 border border-red-900 px-3 py-1 transition-colors">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {tab === "events" && (
        <div className="grid grid-cols-2 gap-12">
          <div className="border border-[#2a2a2a] p-8" style={{background:"#1A1A1A"}}>
            <h2 className="text-[#C6A962] text-sm tracking-widest mb-6" style={{fontFamily:"serif"}}>+ Add Event Service</h2>
            <form onSubmit={addEvent} className="flex flex-col gap-4">
              <div>
                <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Event Name</label>
                <input value={eName} onChange={e => setEName(e.target.value)} placeholder="e.g. Birthday Surprise Setup" required />
              </div>
              <div>
                <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Description</label>
                <textarea value={eDesc} onChange={e => setEDesc(e.target.value)} placeholder="Event description..." rows={3} required style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",resize:"vertical"}} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Starting Price (BDT)</label>
                  <input type="number" value={ePrice} onChange={e => setEPrice(e.target.value)} placeholder="8000" required />
                </div>
                <div>
                  <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Type</label>
                  <select value={eType} onChange={e => setEType(e.target.value)} style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none"}}>
                    <option>Birthday</option>
                    <option>Wedding</option>
                    <option>Anniversary</option>
                    <option>Corporate</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Badge (optional)</label>
                <input value={eBadge} onChange={e => setEBadge(e.target.value)} placeholder="e.g. Most Booked, Premium..." />
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full mt-2">
                {loading ? "Adding..." : "Add Event Service"}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-[#888] text-xs tracking-widest uppercase mb-6">All Event Services ({events.length})</h2>
            {events.length === 0 ? (
              <div className="text-center py-16 border border-[#2a2a2a]" style={{background:"#1A1A1A"}}>
                <p className="text-[#888] text-xs">No event services yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {events.map(ev => (
                  <div key={ev.id} className="border border-[#2a2a2a] p-4 flex items-center gap-4" style={{background:"#1A1A1A"}}>
                    <div className="flex-1">
                      <div className="text-white text-sm mb-1">{ev.name}</div>
                      <div className="text-[#888] text-xs">{ev.type} · From ৳ {ev.price?.toLocaleString()}</div>
                    </div>
                    <button onClick={() => deleteEvent(ev.id)} className="text-xs text-red-400 hover:text-red-300 border border-red-900 px-3 py-1 transition-colors">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div>
          <h2 className="text-[#888] text-xs tracking-widest uppercase mb-6">All Users ({users.length})</h2>
          {users.length === 0 ? (
            <div className="text-center py-16 border border-[#2a2a2a]" style={{background:"#1A1A1A"}}>
              <p className="text-[#888] text-xs">No users yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {users.map(u => (
                <div key={u.id} className="border border-[#2a2a2a] p-5 flex items-center gap-4" style={{background:"#1A1A1A"}}>
                  <div className="w-10 h-10 border border-[#8A7340] flex items-center justify-center text-[#C6A962] text-sm font-semibold flex-shrink-0">
                    {u.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm">{u.name}</div>
                    <div className="text-[#888] text-xs">{u.email}</div>
                  </div>
                  <div className="text-[#888] text-xs">Joined {u.createdAt?.slice(0, 10)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Moments Tab */}
      {tab === "moments" && (
        <div>
          <h2 className="text-[#888] text-xs tracking-widest uppercase mb-6">All Saved Moments ({moments.length})</h2>
          {moments.length === 0 ? (
            <div className="text-center py-16 border border-[#2a2a2a]" style={{background:"#1A1A1A"}}>
              <p className="text-[#888] text-xs">No moments saved yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {moments.map(m => (
                <div key={m.id} className="border border-[#2a2a2a] p-5 flex items-center gap-4" style={{background:"#1A1A1A"}}>
                  <div className="w-10 h-10 border border-[#8A7340] flex items-center justify-center text-[#C6A962] text-sm font-semibold flex-shrink-0">
                    {m.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm">{m.name}</div>
                    <div className="text-[#888] text-xs">{m.relation} · {m.date}</div>
                    {m.phone && <div className="text-[#555] text-xs mt-1">{m.phone}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}