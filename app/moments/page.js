"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Moments() {
  const { user } = useAuth();
  const router = useRouter();
  const [moments, setMoments] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { router.push("/auth/login"); return; }
    loadMoments();
  }, [user]);

  const loadMoments = async () => {
    const q = query(collection(db, "moments"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => getDaysLeft(a.date) - getDaysLeft(b.date));
    setMoments(data);
  };

  const getDaysLeft = (dateStr) => {
    const today = new Date();
    const next = new Date(dateStr);
    next.setFullYear(today.getFullYear());
    if (next < today) next.setFullYear(today.getFullYear() + 1);
    return Math.ceil((next - today) / (1000 * 60 * 60 * 24));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "moments"), {
        userId: user.uid, name, date, relation, phone,
        createdAt: new Date().toISOString()
      });
      toast.success("Moment saved!");
      setName(""); setDate(""); setRelation(""); setPhone("");
      loadMoments();
    } catch { toast.error("Failed to save"); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "moments", id));
    toast.success("Moment removed");
    loadMoments();
  };

  return (
    <main className="min-h-screen px-16 py-16" style={{background:"#0D0D0D"}}>
      <div className="mb-12">
        <p className="text-[#C6A962] text-xs tracking-[0.3em] uppercase mb-3 flex items-center gap-3">
          <span className="inline-block w-5 h-px bg-[#C6A962]"></span>Special Moments
        </p>
        <h1 className="text-4xl font-semibold" style={{fontFamily:"serif"}}>Save dates. <em className="text-[#C6A962] not-italic">Never</em> forget again.</h1>
      </div>

      <div className="grid grid-cols-2 gap-12">
        {/* Form */}
        <div className="border border-[#2a2a2a] p-8" style={{background:"#1A1A1A"}}>
          <h2 className="text-[#C6A962] text-sm tracking-widest mb-6" style={{fontFamily:"serif"}}>+ Add a Special Moment</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div>
              <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ammu, Bhai, Riya..." required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div>
                <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Relation</label>
                <input value={relation} onChange={e => setRelation(e.target.value)} placeholder="Mother, Friend..." required />
              </div>
            </div>
            <div>
              <label className="text-[#888] text-xs tracking-widest uppercase block mb-2">Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+880 1X XXX XXXXX" />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full mt-2">
              {loading ? "Saving..." : "Save This Moment"}
            </button>
          </form>
        </div>

        {/* Moments List */}
        <div>
          <h2 className="text-[#888] text-xs tracking-widest uppercase mb-6">Upcoming Moments</h2>
          {moments.length === 0 ? (
            <div className="text-center py-16 border border-[#2a2a2a]" style={{background:"#1A1A1A"}}>
              <div className="text-4xl mb-3 opacity-30">❤️</div>
              <p className="text-[#888] text-xs">No moments saved yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {moments.map(m => {
                const days = getDaysLeft(m.date);
                return (
                  <div key={m.id}>
                    <div className="border border-[#2a2a2a] p-4 flex items-center gap-4 hover:border-[#8A7340] transition-colors" style={{background:"#1A1A1A"}}>
                      <div className="w-10 h-10 border border-[#8A7340] flex items-center justify-center text-[#C6A962] text-sm font-semibold flex-shrink-0">
                        {m.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm">{m.name}</div>
                        <div className="text-[#888] text-xs">{m.relation} · {m.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#C6A962] text-xl" style={{fontFamily:"serif"}}>{days}</div>
                        <div className="text-[#888] text-xs uppercase tracking-widest">days left</div>
                      </div>
                      <button onClick={() => handleDelete(m.id)} className="text-[#555] hover:text-red-400 text-xs ml-2 transition-colors">✕</button>
                    </div>
                    {days <= 7 && (
                      <div className="border border-[#8A7340] border-t-0 px-4 py-2 flex items-center justify-between" style={{background:"rgba(198,169,98,0.05)"}}>
                        <span className="text-[#C6A962] text-xs">{m.name}'s {m.relation} is in {days} days — Send a surprise?</span>
                        <button className="btn-gold text-xs py-1 px-3">Send Gift</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}