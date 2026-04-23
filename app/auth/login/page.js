"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      router.push("/");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gv-auth">
      <div className="gv-auth-box">
        <div className="gv-auth-logo">
          <h1>GIFTVENT</h1>
          <p>Welcome Back</p>
        </div>
        <div className="gv-auth-card">
          <h2>Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className="gv-form-row">
              <label className="gv-form-label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
            <div className="gv-form-row">
              <label className="gv-form-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-gold" style={{width:"100%",marginTop:"0.5rem"}}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p style={{color:"#888",fontSize:"0.75rem",textAlign:"center",marginTop:"1.5rem",fontFamily:"Arial,sans-serif"}}>
            Don't have an account?{" "}
            <Link href="/auth/signup" style={{color:"#C6A962"}}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}