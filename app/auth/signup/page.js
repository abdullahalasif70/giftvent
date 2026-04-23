"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await setDoc(doc(db, "users", result.user.uid), {
        name, email,
        createdAt: new Date().toISOString(),
        role: "user",
      });
      toast.success("Account created!");
      router.push("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gv-auth">
      <div className="gv-auth-box">
        <div className="gv-auth-logo">
          <h1>GIFTVENT</h1>
          <p>Create Your Account</p>
        </div>
        <div className="gv-auth-card">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="gv-form-row">
              <label className="gv-form-label">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
            </div>
            <div className="gv-form-row">
              <label className="gv-form-label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
            <div className="gv-form-row">
              <label className="gv-form-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
            </div>
            <button type="submit" disabled={loading} className="btn-gold" style={{width:"100%",marginTop:"0.5rem"}}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <p style={{color:"#888",fontSize:"0.75rem",textAlign:"center",marginTop:"1.5rem",fontFamily:"Arial,sans-serif"}}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{color:"#C6A962"}}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}