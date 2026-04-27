"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/authContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { collection, addDoc } from "firebase/firestore";

export default function EventPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "events", id));
      if (snap.exists()) setEvent({ id: snap.id, ...snap.data() });
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { router.push("/auth/login"); return; }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        productId: id,
        productName: event.name,
        type: "event",
        phone, deliveryDate: date,
        address: location,
        area: location,
        notes, budget,
        deliveryName: name,
        payMethod: "tbd",
        txnId: "pending",
        price: event.price,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      toast.success("Booking request sent! We'll contact you soon.");
      router.push("/dashboard");
    } catch { toast.error("Failed to submit booking"); }
    setSubmitting(false);
  };

  const getEventIcon = (type) => type==="Birthday"?"🎂":type==="Wedding"?"💍":type==="Anniversary"?"🌙":type==="Corporate"?"💼":"🎊";

  if (loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0D0D0D",color:"#888"}}>Loading...</div>;
  if (!event) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0D0D0D",color:"#888"}}>Event not found</div>;

  return (
    <main style={{minHeight:"100vh",background:"#0D0D0D",padding:"4rem"}}>
      <Link href="/shop" style={{color:"#888",fontSize:"0.72rem",letterSpacing:"0.15em",textTransform:"uppercase",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"0.5rem",marginBottom:"3rem",fontFamily:"Arial,sans-serif"}}>
        ← Back to Events
      </Link>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"start"}}>
        {/* Event Info */}
        <div>
          <div style={{height:"380px",background:"#1A1A1A",border:"0.5px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"2rem",overflow:"hidden"}}>
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
            ) : (
              <span style={{fontSize:"6rem",opacity:0.3}}>{getEventIcon(event.type)}</span>
            )}
          </div>
          <div style={{color:"#C6A962",fontSize:"0.6rem",letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:"0.8rem",fontFamily:"Arial,sans-serif"}}>{event.type} Service</div>
          <h1 style={{fontSize:"2rem",fontFamily:"Georgia,serif",marginBottom:"1rem",lineHeight:"1.2"}}>{event.name}</h1>
          {event.badge && (
            <div style={{display:"inline-block",background:"rgba(198,169,98,0.1)",border:"0.5px solid #8A7340",color:"#C6A962",fontSize:"0.65rem",letterSpacing:"0.15em",textTransform:"uppercase",padding:"0.3rem 0.8rem",marginBottom:"1rem",fontFamily:"Arial,sans-serif"}}>{event.badge}</div>
          )}
          <div style={{fontSize:"1.8rem",color:"#C6A962",fontFamily:"Georgia,serif",marginBottom:"1.5rem"}}>
            From ৳ {event.price?.toLocaleString()} <span style={{fontSize:"0.7rem",color:"#888",fontFamily:"Arial,sans-serif"}}>BDT</span>
          </div>
          <p style={{color:"#888",fontSize:"0.85rem",lineHeight:"1.8",fontFamily:"Arial,sans-serif"}}>{event.description}</p>

          <div style={{marginTop:"2rem",padding:"1.2rem",background:"rgba(198,169,98,0.05)",border:"0.5px solid rgba(198,169,98,0.2)"}}>
            <p style={{color:"#888",fontSize:"0.75rem",fontFamily:"Arial,sans-serif",lineHeight:"1.7"}}>
              ✓ Full event management &nbsp;·&nbsp; ✓ Professional team &nbsp;·&nbsp; ✓ Custom packages available<br/>
              ✓ Dhaka-wide service &nbsp;·&nbsp; ✓ 24/7 support during event
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="gv-form-box">
          <div className="gv-form-title">Book This Service</div>
          <p style={{color:"#888",fontSize:"0.75rem",fontFamily:"Arial,sans-serif",marginBottom:"1.5rem",lineHeight:"1.6"}}>
            Fill in your details and we'll contact you within 24 hours to confirm your booking.
          </p>
          <form onSubmit={handleBook}>
            <div className="gv-form-row">
              <label className="gv-form-label">Your Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" required style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",fontFamily:"Arial,sans-serif"}} />
            </div>
            <div className="gv-form-row">
              <label className="gv-form-label">Phone Number</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+880 1X XXX XXXXX" required style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",fontFamily:"Arial,sans-serif"}} />
            </div>
            <div className="gv-form-row-2">
              <div>
                <label className="gv-form-label">Event Date</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} required style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",fontFamily:"Arial,sans-serif"}} />
              </div>
              <div>
                <label className="gv-form-label">Budget (BDT)</label>
                <input value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Your budget..." style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",fontFamily:"Arial,sans-serif"}} />
              </div>
            </div>
            <div className="gv-form-row">
              <label className="gv-form-label">Event Location</label>
              <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Venue / Area in Dhaka" required style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",fontFamily:"Arial,sans-serif"}} />
            </div>
            <div className="gv-form-row">
              <label className="gv-form-label">Additional Notes</label>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any special requirements or details..." rows={3} style={{background:"#222",border:"0.5px solid #333",color:"#F5F5F5",padding:"0.65rem 0.9rem",width:"100%",outline:"none",resize:"vertical",fontFamily:"Arial,sans-serif"}} />
            </div>
            <button type="submit" disabled={submitting} className="btn-gold" style={{width:"100%",marginTop:"0.5rem",padding:"1rem"}}>
              {submitting ? "Submitting..." : "Get This Service →"}
            </button>
          </form>
          {!user && (
            <p style={{color:"#888",fontSize:"0.72rem",textAlign:"center",marginTop:"1rem",fontFamily:"Arial,sans-serif"}}>
              <Link href="/auth/login" style={{color:"#C6A962"}}>Login</Link> or <Link href="/auth/signup" style={{color:"#C6A962"}}>Sign up</Link> to book
            </p>
          )}
        </div>
      </div>
    </main>
  );
}