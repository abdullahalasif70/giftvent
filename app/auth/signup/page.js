import Link from "next/link";

export default function Home() {
  return (
    <main>

      {/* HERO */}
      <section className="gv-hero">
        <div className="gv-hero-left">
          <div className="gv-hero-tag">Premium Gifting & Events · Dhaka</div>
          <h1 className="gv-hero-title">
            Never miss a<br/>moment that<br/>
            <em>matters.</em>
          </h1>
          <p className="gv-hero-sub">
            Bangladesh's first luxury gifting & event platform. Bespoke gifts, curated celebrations — delivered with perfection.
          </p>
          <div className="gv-hero-btns">
            <Link href="/shop" className="btn-gold">Browse Gifts</Link>
            <Link href="/events" className="btn-outline">View Events</Link>
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

      {/* QUICK ACTIONS */}
      <section className="gv-actions">
        {[
          { icon: "🎁", title: "Send a Gift", desc: "Flowers, luxury items & bundles delivered across Dhaka", href: "/shop" },
          { icon: "🎊", title: "Plan an Event", desc: "Birthdays, weddings, surprises — full setup by experts", href: "/events" },
          { icon: "❤️", title: "Save a Date", desc: "Never forget birthdays or anniversaries again", href: "/moments" },
          { icon: "✦", title: "Explore All", desc: "Browse our full catalog of premium experiences", href: "/shop" },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="gv-action-card">
            <div className="gv-action-icon">{item.icon}</div>
            <div className="gv-action-title">{item.title}</div>
            <div className="gv-action-text">{item.desc}</div>
          </Link>
        ))}
      </section>

      {/* FEATURED GIFTS */}
      <section className="gv-section" style={{background:"#0D0D0D"}}>
        <div className="gv-section-label">Featured Collection</div>
        <h2 className="gv-section-title">Gifts that <em>speak</em> louder than words</h2>
        <p style={{color:"#888",fontSize:"0.85rem",marginTop:"0.5rem",marginBottom:"2.5rem",fontFamily:"Arial,sans-serif"}}>
          Handpicked premium gifts for every occasion — delivered across Dhaka
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5rem"}}>
          {[
            { icon: "🌹", tag: "Bestseller", name: "Royal Rose Arrangement", desc: "100 premium red roses, elegantly arranged with a custom message card.", price: "3,500", cat: "Flowers" },
            { icon: "🍫", tag: "New", name: "Anniversary Bundle", desc: "Belgian chocolates, roses & handwritten note in a luxury gift box.", price: "5,200", cat: "Bundles" },
            { icon: "⌚", tag: "Premium", name: "Luxury Gift Experience", desc: "Curated electronics & accessories in premium packaging.", price: "12,000", cat: "Luxury" },
          ].map((p, i) => (
            <div key={i} className="gv-card">
              <div className="gv-card-img">
                {p.icon}
                <div className="gv-card-tag">{p.tag}</div>
              </div>
              <div className="gv-card-body">
                <div className="gv-card-category">{p.cat}</div>
                <div className="gv-card-name">{p.name}</div>
                <div className="gv-card-desc">{p.desc}</div>
                <div className="gv-card-footer">
                  <div className="gv-price">৳ {p.price} <span>BDT</span></div>
                  <Link href="/shop" className="btn-gold" style={{fontSize:"0.65rem",padding:"0.4rem 1rem"}}>Send This</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:"2.5rem"}}>
          <Link href="/shop" className="btn-outline">View All Gifts</Link>
        </div>
      </section>

      {/* EVENT SERVICES */}
      <section className="gv-section" style={{background:"#111"}}>
        <div className="gv-section-label">Event Services</div>
        <h2 className="gv-section-title">Celebrations, <em>crafted</em> to perfection</h2>
        <p style={{color:"#888",fontSize:"0.85rem",marginTop:"0.5rem",marginBottom:"2.5rem",fontFamily:"Arial,sans-serif"}}>
          Full event management — from concept to execution across Dhaka
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5rem"}}>
          {[
            { icon: "🎂", badge: "Most Booked", name: "Birthday Surprise", desc: "Full balloon décor, cake, photography & guest coordination.", price: "8,000", type: "Birthday" },
            { icon: "💍", badge: "Premium", name: "Wedding Package", desc: "Full venue decoration, floral arrangements & event management.", price: "75,000", type: "Wedding" },
            { icon: "🌙", badge: "Romantic", name: "Anniversary Evening", desc: "Intimate dinner setup, candle décor & personalized experience.", price: "15,000", type: "Anniversary" },
          ].map((ev, i) => (
            <div key={i} className="gv-card">
              <div className="gv-card-img" style={{position:"relative"}}>
                {ev.icon}
                <div className="gv-card-tag">{ev.badge}</div>
              </div>
              <div className="gv-card-body">
                <div className="gv-card-category">{ev.type}</div>
                <div className="gv-card-name">{ev.name}</div>
                <div className="gv-card-desc">{ev.desc}</div>
                <div className="gv-card-footer">
                  <div className="gv-price">From ৳ {ev.price} <span>BDT</span></div>
                  <Link href="/events" className="btn-gold" style={{fontSize:"0.65rem",padding:"0.4rem 1rem"}}>Book Now</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:"2.5rem"}}>
          <Link href="/events" className="btn-outline">View All Events</Link>
        </div>
      </section>

      {/* SPECIAL MOMENTS */}
      <section className="gv-section" style={{background:"#0D0D0D"}}>
        <div className="gv-section-label">Special Moments</div>
        <h2 className="gv-section-title">Save dates. <em>Never</em> forget again.</h2>
        <p style={{color:"#888",fontSize:"0.85rem",marginTop:"0.5rem",marginBottom:"2.5rem",maxWidth:"520px",fontFamily:"Arial,sans-serif",lineHeight:"1.7"}}>
          Add your loved ones' birthdays and anniversaries. We remind you before it's too late — and suggest the perfect gift.
        </p>
        <div style={{display:"flex",gap:"1rem"}}>
          <Link href="/moments" className="btn-gold">Save a Moment</Link>
          <Link href="/auth/signup" className="btn-outline">Create Free Account</Link>
        </div>
      </section>

      {/* STATS */}
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

      {/* REMINDER BANNER */}
      <div className="gv-reminder">
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <div className="gv-reminder-dot"></div>
          <div className="gv-reminder-text">
            <strong>Smart Reminders Active</strong> — Get SMS + Email 7 days, 2 days & same day before every saved moment
          </div>
        </div>
        <Link href="/moments" className="btn-outline" style={{fontSize:"0.65rem",padding:"0.5rem 1.2rem"}}>Save a Moment</Link>
      </div>

      {/* FOOTER */}
      <footer style={{padding:"4rem",borderTop:"0.5px solid #1e1e1e",background:"#0D0D0D"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"3rem",marginBottom:"3rem"}}>
          <div>
            <div className="gv-footer-brand">GIFTVENT</div>
            <div className="gv-footer-tagline" style={{marginBottom:"1rem"}}>"Never miss a moment that matters."</div>
            <p style={{color:"#555",fontSize:"0.72rem",lineHeight:"1.7",fontFamily:"Arial,sans-serif"}}>Bangladesh's premium gifting & event platform. Based in Dhaka, delivering across the country.</p>
          </div>
          <div>
            <div style={{color:"#C6A962",fontSize:"0.62rem",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"1rem",fontFamily:"Arial,sans-serif"}}>Shop</div>
            {["Flowers","Luxury Gifts","Electronics","Gift Bundles"].map(l => (
              <Link key={l} href="/shop" style={{display:"block",color:"#888",fontSize:"0.72rem",textDecoration:"none",marginBottom:"0.5rem",fontFamily:"Arial,sans-serif"}}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{color:"#C6A962",fontSize:"0.62rem",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"1rem",fontFamily:"Arial,sans-serif"}}>Events</div>
            {["Birthday Setup","Wedding","Anniversary","Corporate"].map(l => (
              <Link key={l} href="/events" style={{display:"block",color:"#888",fontSize:"0.72rem",textDecoration:"none",marginBottom:"0.5rem",fontFamily:"Arial,sans-serif"}}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{color:"#C6A962",fontSize:"0.62rem",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"1rem",fontFamily:"Arial,sans-serif"}}>Company</div>
            {[
              { label: "About Us", href: "#" },
              { label: "Blog", href: "/blog" },
              { label: "Special Moments", href: "/moments" },
              { label: "Track Order", href: "/dashboard" },
              { label: "Contact", href: "#" },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{display:"block",color:"#888",fontSize:"0.72rem",textDecoration:"none",marginBottom:"0.5rem",fontFamily:"Arial,sans-serif"}}>{l.label}</Link>
            ))}
          </div>
        </div>
        <div style={{borderTop:"0.5px solid #1e1e1e",paddingTop:"1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{color:"#444",fontSize:"0.65rem",fontFamily:"Arial,sans-serif"}}>© 2025 GiftVent. All rights reserved.</div>
          <div style={{color:"#C6A962",fontSize:"0.65rem",fontFamily:"Arial,sans-serif"}}>Made with care for Bangladesh 🇧🇩</div>
        </div>
      </footer>

    </main>
  );
}