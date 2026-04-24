"use client";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { useCart } from "@/lib/cartContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const { count } = useCart();
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <>
      <nav className="gv-nav">
        <Link href="/" className="gv-nav-logo">
          GIFTVENT
          <span>DHAKA · BANGLADESH</span>
        </Link>
        <ul className="gv-nav-links">
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/events">Events</Link></li>
          <li><Link href="/moments">Moments</Link></li>
          {user && <li><Link href="/dashboard">Dashboard</Link></li>}
          {isAdmin && <li><Link href="/admin" className="admin-link">Admin</Link></li>}
        </ul>
        <div className="gv-nav-btns">
          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            style={{background:"transparent",border:"0.5px solid #2a2a2a",color:"#888",padding:"0.5rem 0.9rem",cursor:"pointer",position:"relative",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"0.5rem"}}
            onMouseEnter={e => {e.currentTarget.style.borderColor="#C6A962";e.currentTarget.style.color="#C6A962"}}
            onMouseLeave={e => {e.currentTarget.style.borderColor="#2a2a2a";e.currentTarget.style.color="#888"}}
          >
            <span style={{fontSize:"1rem"}}>🛒</span>
            {count > 0 && (
              <span style={{background:"#C6A962",color:"#0D0D0D",fontSize:"0.6rem",fontWeight:"700",width:"18px",height:"18px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",position:"absolute",top:"-6px",right:"-6px",fontFamily:"Arial,sans-serif"}}>
                {count}
              </span>
            )}
          </button>

          {user ? (
            <button onClick={handleLogout} className="btn-outline" style={{fontSize:"0.65rem",padding:"0.5rem 1.2rem"}}>Logout</button>
          ) : (
            <>
              <Link href="/auth/login" className="btn-outline" style={{fontSize:"0.65rem",padding:"0.5rem 1.2rem"}}>Login</Link>
              <Link href="/auth/signup" className="btn-gold" style={{fontSize:"0.65rem",padding:"0.5rem 1.2rem"}}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}