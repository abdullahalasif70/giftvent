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
          <button onClick={() => setCartOpen(true)} className="cart-btn">
            <span>🛒</span>
            {count > 0 && <span className="cart-count">{count}</span>}
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