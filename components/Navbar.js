"use client";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
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
  );
}