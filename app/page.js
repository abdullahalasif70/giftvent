import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="gv-hero">
        <div className="gv-hero-left">
          <div className="gv-hero-tag">Premium Gifting · Dhaka</div>
          <h1 className="gv-hero-title">
            Never miss a<br/>moment that<br/>
            <em>matters.</em>
          </h1>
          <p className="gv-hero-sub">
            Bangladesh's first luxury gifting & event platform. From bespoke gifts to fully curated celebrations — we make every moment unforgettable.
          </p>
          <div className="gv-hero-btns">
            <Link href="/shop" className="btn-gold">Explore Gifts</Link>
            <Link href="/events" className="btn-outline">Plan an Event</Link>
          </div>
        </div>
        <div className="gv-hero-right">
          <div className="gv-hero-card">
            <div className="gv-hero-card-icon">🎁</div>
            <div className="gv-hero-card-title">Curated Gifting</div>
            <div className="gv-hero-card-text">Premium gifts, personalized with your message, delivered on time across Dhaka.</div>
          </div>
          <div className="gv-float-card top">
            <div className="gv-float-label">Reminder</div>
            <div className="gv-float-val">3 days</div>
            <div className="gv-float-sub">Ammu's Birthday</div>
            <div className="gv-float-badge">Send Gift Now</div>
          </div>
          <div className="gv-float-card bottom">
            <div className="gv-float-label">Last Delivery</div>
            <div className="gv-float-val">✓ On Time</div>
            <div className="gv-float-sub">Gulshan, Dhaka</div>
            <div className="gv-float-badge">Same-Day Available</div>
          </div>
        </div>
      </section>

      <div className="gv-gold-bar"></div>

      {/* Quick Actions */}
      <section className="gv-actions">
        {[
          { icon: "🎁", title: "Send a Gift", desc: "Flowers, luxury items & bundles delivered across Dhaka", href: "/shop" },
          { icon: "🎊", title: "Plan an Event", desc: "Birthdays, weddings, surprises — full setup by experts", href: "/events" },
          { icon: "❤️", title: "Save a Date", desc: "Never forget birthdays or anniversaries again", href: "/moments" },
          { icon: "✦", title: "Explore", desc: "Browse our full catalog of premium experiences", href: "/shop" },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="gv-action-card">
            <div className="gv-action-icon">{item.icon}</div>
            <div className="gv-action-title">{item.title}</div>
            <div className="gv-action-text">{item.desc}</div>
          </Link>
        ))}
      </section>

      {/* Stats */}
      <section className="gv-stats">
        {[
          { num: "4,200+", label: "Gifts Delivered" },
          { num: "98%", label: "On-Time Rate" },
          { num: "850+", label: "Events Planned" },
          { num: "12,000+", label: "Happy Customers" },
        ].map((s, i) => (
          <div key={i} className="gv-stat">
            <div className="gv-stat-num">{s.num}</div>
            <div className="gv-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Reminder Banner */}
      <div className="gv-reminder">
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <div className="gv-reminder-dot"></div>
          <div className="gv-reminder-text">
            <strong>Smart Reminders Active</strong> — Get SMS + Email 7 days, 2 days & same day before every saved moment
          </div>
        </div>
        <Link href="/moments" className="btn-outline" style={{fontSize:"0.65rem",padding:"0.5rem 1.2rem"}}>Save a Moment</Link>
      </div>

      {/* Footer */}
      <footer className="gv-footer">
        <div>
          <div className="gv-footer-brand">GIFTVENT</div>
          <div className="gv-footer-tagline">"Never miss a moment that matters."</div>
        </div>
        <div className="gv-footer-links">
          <Link href="/shop">Shop</Link>
          <Link href="/events">Events</Link>
          <Link href="/moments">Moments</Link>
          <Link href="/auth/login">Login</Link>
        </div>
        <div className="gv-footer-copy">© 2025 GiftVent · Made for Bangladesh 🇧🇩</div>
      </footer>
    </main>
  );
}