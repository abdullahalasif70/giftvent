"use client";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/auth/login");
  }, [user]);

  if (!user) return null;

  return (
    <main className="min-h-screen px-16 py-16" style={{background:"#0D0D0D"}}>
      <div className="mb-12">
        <p className="text-[#C6A962] text-xs tracking-[0.3em] uppercase mb-3 flex items-center gap-3">
          <span className="inline-block w-5 h-px bg-[#C6A962]"></span>My Account
        </p>
        <h1 className="text-4xl font-semibold" style={{fontFamily:"serif"}}>Welcome, <em className="text-[#C6A962] not-italic">{user.displayName || "Friend"}</em></h1>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-12">
        {[
          { icon: "🎁", label: "My Orders", desc: "Track your gift deliveries", href: "#" },
          { icon: "❤️", label: "My Moments", desc: "Manage saved special dates", href: "/moments" },
          { icon: "🎊", label: "My Events", desc: "View booked event services", href: "#" },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="border border-[#2a2a2a] p-8 hover:border-[#8A7340] transition-colors block" style={{background:"#1A1A1A"}}>
            <div className="text-3xl mb-4 opacity-60">{item.icon}</div>
            <h3 className="text-white text-sm mb-2" style={{fontFamily:"serif"}}>{item.label}</h3>
            <p className="text-[#888] text-xs">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="border border-[#2a2a2a] p-8" style={{background:"#1A1A1A"}}>
        <h2 className="text-white text-sm mb-6" style={{fontFamily:"serif"}}>Account Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[#888] text-xs tracking-widest uppercase mb-1">Name</div>
            <div className="text-white text-sm">{user.displayName || "—"}</div>
          </div>
          <div>
            <div className="text-[#888] text-xs tracking-widest uppercase mb-1">Email</div>
            <div className="text-white text-sm">{user.email}</div>
          </div>
        </div>
      </div>
    </main>
  );
}