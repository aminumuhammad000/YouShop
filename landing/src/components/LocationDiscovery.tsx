import * as React from 'react';
import { Navigation, MapPin } from 'lucide-react';

const products = [
  { id: 1, pos: { top: '15%', left: '8%' }, name: 'Hot Awara', price: '₦1,200', away: '20m', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&h=100&fit=crop', color: 'var(--color-teal)' },
  { id: 2, pos: { bottom: '25%', right: '15%' }, name: 'Ankara Fabric', price: '₦25,000', away: '150m', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100&h=100&fit=crop', color: 'var(--color-purple)' },
  { id: 3, pos: { top: '35%', right: '12%' }, name: 'Leather Slippers', price: '₦8,500', away: '300m', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&h=100&fit=crop', color: '#FF6874' },
  { id: 4, pos: { bottom: '10%', left: '20%' }, name: 'Spicy Kilishi', price: '₦3,500', away: '80m', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=100&h=100&fit=crop', color: '#FFC864' },
  { id: 5, pos: { top: '25%', left: '40%' }, name: 'Cold Soft Drink', price: '₦500', away: '45m', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&h=100&fit=crop', color: 'var(--color-teal)' },
  { id: 6, pos: { bottom: '40%', right: '35%' }, name: 'Custom Cap', price: '₦4,500', away: '200m', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=100&h=100&fit=crop', color: 'var(--color-purple)' },
  { id: 7, pos: { top: '55%', left: '5%' }, name: 'Bama Mayonnaise', price: '₦2,800', away: '120m', img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=100&h=100&fit=crop', color: '#FF6874' },
  { id: 8, pos: { bottom: '50%', right: '5%' }, name: 'Scented Candle', price: '₦6,500', away: '90m', img: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=100&h=100&fit=crop', color: '#FFC864' },
];

const LocationDiscovery: React.FC = () => {
  const [activeIds, setActiveIds] = React.useState<number[]>([1, 4, 6]);

  React.useEffect(() => {
    // Stage 1: Add new shops every 1.5 seconds (randomly)
    const addInterval = setInterval(() => {
      setActiveIds(prev => {
        const inactive = products.filter(p => !prev.includes(p.id));
        if (inactive.length === 0) return prev;
        const next = inactive[Math.floor(Math.random() * inactive.length)];
        return [...prev, next.id].slice(-5); // Keep at most 5 active
      });
    }, 1500);

    // Stage 2: Remove old shops every 2.2 seconds
    const removeInterval = setInterval(() => {
      setActiveIds(prev => prev.length > 2 ? prev.slice(1) : prev);
    }, 2200);

    return () => {
      clearInterval(addInterval);
      clearInterval(removeInterval);
    };
  }, []);

  return (
    <section id="features" className="location-discovery section-padding" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '80px', flexWrap: 'wrap' }}>

        {/* Left: Premium Text */}
        <div style={{ flex: '1', minWidth: '340px', zIndex: 10 }}>
           {/* ... existing tag ... */}
           <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'white', color: '#1E2B3A',
            padding: '6px 16px 6px 6px', borderRadius: '50px',
            fontWeight: 700, fontSize: '0.9rem',
            marginBottom: '24px', border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
          }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 2px 8px rgba(40,199,177,0.4)' }}>
               <Navigation size={14} />
            </div>
            Live Radar 
            <span style={{ color: 'var(--color-teal)', opacity: activeIds.length % 2 === 0 ? 1 : 0.4, marginLeft: '5px' }}>• Scanning Area...</span>
          </div>

          <h2 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.05, color: '#1E2B3A' }}>
            The city is your <span style={{ color: 'var(--color-teal)' }}>storefront.</span>
          </h2>
          
          <p style={{ fontSize: '1.25rem', color: '#718096', lineHeight: 1.7, maxWidth: '480px', marginBottom: '40px' }}>
            Browse local streets digitally. Spot live products steps away from you and pick them up instantly.
          </p>

          <div style={{ display: 'flex', gap: '15px' }}>
              <button style={{ background: 'var(--color-teal)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 20px rgba(40,199,177,0.3)', transition: 'transform 0.2s ease' }}>
                  Explore Nearby
              </button>
          </div>
        </div>

        {/* Right: Moving Radar Canvas */}
        <div style={{ flex: '1.2', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '340px' }}>

          {/* Radar Circles Container */}
          <div className="map-move radar-canvas" style={{
            width: '100%', maxWidth: '560px', height: '560px', borderRadius: '40px',
            backgroundColor: '#F8F9FA', 
            backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')`,
            backgroundSize: '300%', backgroundPosition: 'center',
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.08)', border: '8px solid white',
            position: 'relative', zIndex: 2,
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(230, 240, 245, 0.7)', backdropFilter: 'blur(5px)' }}></div>
            
            {/* Pulsing rings around user */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '250px', height: '250px', borderRadius: '50%', border: '2px solid rgba(40,199,177,0.2)' }}></div>
            
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              zIndex: 100, width: '70px', height: '70px', borderRadius: '50%',
              background: 'white', padding: '5px',
              boxShadow: '0 10px 40px rgba(40,199,177,0.4)',
            }}>
              <img src="https://ui-avatars.com/api/?name=Me&background=1E2B3A&color=fff" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} alt="You" />
              <div className="pulse-dot" style={{ position: 'absolute', bottom: 0, right: 0, width: '15px', height: '15px' }}></div>
            </div>

            {products.map((p) => {
               const isVisible = activeIds.includes(p.id);
               return (
                 <div key={p.id} className={isVisible ? "notification-pop" : ""} style={{
                    position: 'absolute',
                    ...p.pos,
                    opacity: isVisible ? 1 : 0,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    background: 'white', padding: '10px', borderRadius: '18px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10,
                    transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                 }}>
                    <img src={p.img} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div style={{ paddingRight: '8px' }}>
                       <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E2B3A' }}>{p.name}</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', color: p.color, fontWeight: 700, fontSize: '0.8rem' }}>
                          <MapPin size={12} /> {p.away} away
                       </div>
                    </div>
                 </div>
               );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationDiscovery;
