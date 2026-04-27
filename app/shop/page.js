"use client";
import Link from "next/link";

export default function Home() {
  const categories = [
    { icon:"🌹", name:"Flowers", desc:"Fresh bouquets & arrangements" },
    { icon:"🍫", name:"Bundles", desc:"Curated luxury gift sets" },
    { icon:"⌚", name:"Electronics", desc:"Premium tech gifts" },
    { icon:"💎", name:"Luxury", desc:"High-end exclusive items" },
    { icon:"🎂", name:"Birthday", desc:"Birthday surprise setups" },
    { icon:"💍", name:"Wedding", desc:"Wedding & engagement gifts" },
    { icon:"🌙", name:"Anniversary", desc:"Romantic anniversary gifts" },
    { icon:"🎊", name:"Corporate", desc:"Corporate event packages" },
  ];

  const stats = [
    { num:"4,200+", label:"Gifts Delivered" },
    { num:"98%", label:"On-Time Rate" },
    { num:"850+", label:"Events Planned" },
    { num:"12,000+", label:"Happy Customers" },
  ];

  const actions = [
    { icon:"🎁", title:"Send a Gift", desc:"Flowers, luxury items & bundles delivered across Dhaka", href:"/shop" },
    { icon:"🎊", title:"Plan an Event", desc:"Birthdays, weddings, surprises — full setup by experts", href:"/events" },
    { icon:"❤️", title:"Save a Date", desc:"Never forget birthdays or anniversaries again", href:"/moments" },
    { icon:"✦", title:"Explore All", desc:"Browse our full catalog of premium experiences", href:"/shop" },
  ];

  return (
    <main>

      {/* HERO */}
      <section style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"92vh"}}>
        <div style={{padding:"6rem 5rem",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <p style={{color:"#C6A962",fontSize:"0.65rem",letterSpacing:"0.3em",textTransform:"uppercase",marginBottom:"1.5rem",fontFamily:"Arial,sans-serif"}}>
            Premium Gifting & Events · Dhaka
          </p>
          <h1 style={{fontSize:"3.5rem",lineHeight:1.15,fontWeight:700,marginBottom:"1.5rem",fontFamily:"Georgia,serif"}}>
            Never miss a<br/>moment that<br/>
            <em style={{color:"#C6A962",fontStyle:"italic"}}>matters.</em>
          </h1>
          <p style={{color:"#888",fontSize:"0.9rem",lineHeight:1.8,maxWidth:"420px",marginBottom:"2.5rem",fontFamily:"Arial,sans-serif"}}>
            Bangladesh's first luxury gifting & event platform. Bespoke gifts, curated celebrations — delivered with perfection.
          </p>
          <div style={{display:"flex",gap:"1rem"}}>
            <Link href="/shop" className="btn-gold">Shop Now</Link>
            <Link href="/events" className="btn-outline">Event Services</Link>
          </div>
        </div>
        <div style={{background:"#1A1A1A",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{background:"rgba(13,13,13,0.85)",border:"0.5px solid #2e2e2e",padding:"2.5rem",textAlign:"center",width:"260px"}}>
            <div style={{fontSize:"3.5rem",marginBottom:"1rem",opacity:0.5}}>🎁</div>
            <div style={{color:"#C6A962",fontFamily:"Georgia,serif",fontSize:"1rem",marginBottom:"0.5rem"}}>Curated Gifting</div>
            <div style={{color:"#888",fontSize:"0.75rem",lineHeight:1.6,fontFamily:"Arial,sans-serif"}}>Premium gifts, personalized with your message, delivered on time.</div>
          </div>
          <div style={{position:"absolute",top:"2rem",right:"2rem",background:"rgba(26,26,26,0.92)",border:"0.5px solid #2e2e2e",padding:"1rem 1.2rem",width:"170px"}}>
            <div style={{color:"#C6A962",fontSize:"0.58rem",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"0.4rem",fontFamily:"Arial,sans-serif"}}>Reminder</div>
            <div style={{fontSize:"1.2rem",fontFamily:"Georgia,serif"}}>3 days</div>
            <div style={{color:"#888",fontSize:"0.68rem",fontFamily:"Arial,sans-serif",marginTop:"0.2rem"}}>Ammu's Birthday</div>
            <div style={{display:"inline-block",background:"rgba(198,169,98,0.12)",color:"#C6A962",fontSize:"0.58rem",letterSpacing:"0.12em",textTransform:"uppercase",padding:"0.2rem 0.5rem",marginTop:"0.4rem",fontFamily:"Arial,sans-serif"}}>Send Gift Now</div>
          </div>
          <div style={{position:"absolute",bottom:"2rem",left:"2rem",background:"rgba(26,26,26,0.92)",border:"0.5px solid #2e2e2e",padding:"1rem 1.2rem",width:"180px"}}>
            <div style={{color:"#C6A962",fontSize:"0.58rem",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"0.4rem",fontFamily:"Arial,sans-serif"}}>Last Delivery</div>
            <div style={{fontSize:"1.2rem",fontFamily:"Georgia,serif"}}>✓ On Time</div>
            <div style={{color:"#888",fontSize:"0.68rem",fontFamily:"Arial,sans-serif",marginTop:"0.2rem"}}>Gulshan, Dhaka</div>
            <div style={{display:"inline-block",background:"rgba(198,169,98,0.12)",color:"#C6A962",fontSize:"0.58rem",letterSpacing:"0.12em",textTransform:"uppercase",padding:"0.2rem 0.5rem",marginTop:"0.4rem",fontFamily:"Arial,sans-serif"}}>Same-Day Available</div>
          </div>
        </div>
      </section>

      {/* GOLD BAR */}
      <div style={{height:"1px",background:"linear-gradient(90deg,transparent,#8A7340,#C6A962,#8A7340,transparent)"}}></div>

      {/* CATEGORIES */}
      <section style={{padding:"5rem 4rem",background:"#0D0D0D"}}>
        <p style={{color:"#C6A962",fontSize:"0.6rem",letterSpacing:"0.3em",textTransform:"uppercase",marginBottom:"0.8rem",fontFamily:"Arial,sans-serif"}}>Browse by Category</p>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:"2.2rem",fontWeight:700,marginBottom:"0.5rem"}}>
          What are you <em style={{color:"#C6A962",fontStyle:"italic"}}>looking for?</em>
        </h2>
        <p style={{color:"#888",fontSize:"0.85rem",marginBottom:"2.5rem",fontFamily:"Arial,sans-serif"}}>
          Gifts, events, surprises — find exactly what you need
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",background:"#1e1e1e"}}>
          {categories.map((cat, i) => (
            <Link key={i} href={`/shop?category=${cat.name}`} style={{textDecoration:"none",background:"#0D0D0D",padding:"2rem 1.5rem",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
              <div style={{width:"56px",height:"56px",borderRadius:"50%",background:"rgba(198,169,98,0.08)",border:"0.5px solid rgba(198,169,98,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",marginBottom:"1rem"}}>
                {cat.icon}
              </div>
              <div style={{fontFamily:"Georgia,serif",fontSize:"0.85rem",color:"#F5F5F5",marginBottom:"0.3rem"}}>{cat.name}</div>
              <div style={{fontSize:"0.68rem",color:"#888",fontFamily:"Arial,sans-serif",lineHeight:1.5}}>{cat.desc}</div>
            </Link>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:"2rem"}}>
          <Link href="/shop" className="btn-outline">View All Products & Services</Link>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
        {actions.map((item, i) => (
          <Link key={i} href={item.href} style={{textDecoration:"none",padding:"3rem 2rem",textAlign:"center",borderRight:"0.5px solid #1e1e1e",borderBottom:"0.5px solid #1e1e1e",display:"block",background:"#0D0D0D"}}>
            <div style={{fontSize:"2rem",marginBottom:"1rem",opacity:0.6}}>{item.icon}</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:"0.85rem",color:"#F5F5F5",marginBottom:"0.5rem"}}>{item.title}</div>
            <div style={{fontSize:"0.7rem",color:"#888",lineHeight:1.6,fontFamily:"Arial,sans-serif"}}>{item.desc}</div>
          </Link>
        ))}
      </section>

      {/* STATS */}
      <section style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderTop:"0.5px solid #1e1e1e",borderBottom:"0.5px solid #1e1e1e"}}>
        {stats.map((s, i) => (
          <div key={i} style={{padding:"3rem 2rem",textAlign:"center",borderRight:"0.5px solid #1e1e1e"}}>
            <div style={{fontSize:"2rem",color:"#C6A962",fontFamily:"Georgia,serif",marginBottom:"0.4rem"}}>{s.num}</div>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.15em",textTransform:"uppercase",color:"#888",fontFamily:"Arial,sans-serif"}}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* SPECIAL MOMENTS */}
      <section style={{padding:"5rem 4rem",background:"#111"}}>
        <p style={{color:"#C6A962",fontSize:"0.6rem",letterSpacing:"0.3em",textTransform:"uppercase",marginBottom:"0.8rem",fontFamily:"Arial,sans-serif"}}>Special Moments</p>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:"2.2rem",fontWeight:700,marginBottom:"0.5rem"}}>
          Save dates. <em style={{color:"#C6A962",fontStyle:"italic"}}>Never</em> forget again.
        </h2>
        <p style={{color:"#888",fontSize:"0.85rem",marginBottom:"2rem",maxWidth:"520px",fontFamily:"Arial,sans-serif",lineHeight:1.7}}>
          Add loved ones' birthdays & anniversaries. We remind you before it's too late.
        </p>
        <div style={{display:"flex",gap:"1rem"}}>
          <Link href="/moments" className="btn-gold">Save a Moment</Link>
          <Link href="/auth/signup" className="btn-outline">Create Free Account</Link>
        </div>
      </section>

      {/* REMINDER BANNER */}
      <div style={{background:"rgba(198,169,98,0.04)",borderTop:"0.5px solid #8A7340",borderBottom:"0.5px solid #8A7340",padding:"1.2rem 4rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <div style={{width:"8px",height:"8px",background:"#C6A962",borderRadius:"50%"}}></div>
          <div style={{color:"#888",fontSize:"0.78rem",fontFamily:"Arial,sans-serif"}}>
            <strong style={{color:"#F5F5F5"}}>Smart Reminders Active</strong> — SMS + Email 7 days, 2 days & same day before every saved moment
          </div>
        </div>
        <Link href="/moments" className="btn-outline" style={{fontSize:"0.65rem",padding:"0.5rem 1.2rem"}}>Save a Moment</Link>
      </div>

      {/* FOOTER */}
      <footer style={{padding:"4rem",borderTop:"0.5px solid #1e1e1e",background:"#0D0D0D"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"3rem",marginBottom:"3rem"}}>
          <div>
            <div style={{color:"#C6A962",fontFamily:"Georgia,serif",fontSize:"1rem",letterSpacing:"0.2em",marginBottom:"0.4rem"}}>GIFTVENT</div>
            <div style={{color:"#555",fontSize:"0.72rem",fontStyle:"italic",fontFamily:"Georgia,serif",marginBottom:"1rem"}}>"Never miss a moment that matters."</div>
            <p style={{color:"#555",fontSize:"0.72rem",lineHeight:1.7,fontFamily:"Arial,sans-serif"}}>Bangladesh's premium gifting & event platform. Based in Dhaka, delivering across the country.</p>
          </div>
          <div>
            <div style={{color:"#C6A962",fontSize:"0.62rem",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"1rem",fontFamily:"Arial,sans-serif"}}>Shop</div>
            {["Flowers","Luxury","Electronics","Bundles"].map(l => (
              <Link key={l} href={`/shop?category=${l}`} style={{display:"block",color:"#888",fontSize:"0.72rem",textDecoration:"none",marginBottom:"0.5rem",fontFamily:"Arial,sans-serif"}}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{color:"#C6A962",fontSize:"0.62rem",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"1rem",fontFamily:"Arial,sans-serif"}}>Events</div>
            {["Birthday","Wedding","Anniversary","Corporate"].map(l => (
              <Link key={l} href={`/shop?category=${l}`} style={{display:"block",color:"#888",fontSize:"0.72rem",textDecoration:"none",marginBottom:"0.5rem",fontFamily:"Arial,sans-serif"}}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{color:"#C6A962",fontSize:"0.62rem",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"1rem",fontFamily:"Arial,sans-serif"}}>Company</div>
            {[
              {label:"About Us",href:"#"},
              {label:"Blog",href:"/blog"},
              {label:"Special Moments",href:"/moments"},
              {label:"Track Order",href:"/dashboard"},
              {label:"Contact",href:"#"},
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