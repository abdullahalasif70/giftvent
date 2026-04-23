"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "events"));
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <main className="min-h-screen px-16 py-16" style={{background:"#0D0D0D"}}>
      <div className="mb-12">
        <p className="text-[#C6A962] text-xs tracking-[0.3em] uppercase mb-3 flex items-center gap-3">
          <span className="inline-block w-5 h-px bg-[#C6A962]"></span>Event Services
        </p>
        <h1 className="text-4xl font-semibold" style={{fontFamily:"serif"}}>Celebrations, <em className="text-[#C6A962] not-italic">crafted</em> to perfection</h1>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#888]">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 opacity-30">🎊</div>
          <p className="text-[#888] text-sm">No event services yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="border border-[#2a2a2a] hover:border-[#8A7340] transition-colors overflow-hidden" style={{background:"#1A1A1A"}}>
              <div className="h-28 flex items-center justify-center text-4xl opacity-40 relative" style={{background:"#222"}}>
                {event.type === "Birthday" ? "🎂" : event.type === "Wedding" ? "💍" : event.type === "Anniversary" ? "🌙" : "🎊"}
                {event.badge && <span className="absolute top-3 right-3 text-[#C6A962] border border-[#8A7340] text-xs px-2 py-1 tracking-widest" style={{background:"rgba(198,169,98,0.1)"}}>{event.badge}</span>}
              </div>
              <div className="p-5">
                <h3 className="text-white text-sm mb-2" style={{fontFamily:"serif"}}>{event.name}</h3>
                <p className="text-[#888] text-xs leading-relaxed mb-4">{event.description}</p>
                <div className="flex items-center justify-between border-t border-[#2a2a2a] pt-4">
                  <div className="text-xs text-[#888]">From <span className="text-[#C6A962] text-base" style={{fontFamily:"serif"}}>৳ {event.price?.toLocaleString()}</span></div>
                  <button className="btn-gold text-xs py-2 px-4">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}