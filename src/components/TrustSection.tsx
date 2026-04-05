import * as React from 'react';
import { MapPin, Bell, MessageCircle, Heart, Sparkles, ShieldCheck, BadgeCheck } from 'lucide-react';

const SmartMatchCycle: React.FC = () => {
  const [index, setIndex] = React.useState(0);
  const pairs = [
    { a: '👟', b: '🧦', label: 'Sneakers → Socks' },
    { a: '👕', b: '🧢', label: 'T-Shirt → Cap' },
    { a: '👖', b: '🧶', label: 'Jeans → Belt' },
  ];

  React.useEffect(() => {
    const timer = setInterval(() => setIndex(prev => (prev + 1) % pairs.length), 3000);
    return () => clearInterval(timer);
  }, [pairs.length]);

  const p = pairs[index];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', height: '80px', position: 'relative' }}>
        <div key={`a-${index}`} className="floating stagger-1" style={{ 
          width: '60px', height: '60px', borderRadius: '16px', 
          background: '#F1F5F9', border: '2px solid #E2E8F0', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeInSlideLeft 0.5s ease-out'
        }}>
            <span style={{ fontSize: '1.5rem' }}>{p.a}</span>
        </div>
        <div style={{ display: 'flex', gap: '5px', color: 'var(--color-purple)', opacity: 0.6 }}>
            <Sparkles size={18} className="floating-fast" />
            <div style={{ width: '40px', height: '2px', background: 'var(--color-purple)', marginTop: '8px' }}></div>
        </div>
        <div key={`b-${index}`} className="floating stagger-3" style={{ 
          width: '60px', height: '60px', borderRadius: '16px', 
          background: '#F2EBFA', border: '2px solid var(--color-purple)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          boxShadow: '0 10px 20px rgba(123,72,217,0.2)',
          animation: 'fadeInSlideRight 0.5s ease-out'
        }}>
            <span style={{ fontSize: '1.5rem' }}>{p.b}</span>
        </div>
    </div>
  );
};

const TrustSection: React.FC = () => {
  return (
    <section className="section-padding">
      
      {/* Inline styles for responsive bento grid */}
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .bento-span-2 { grid-column: span 2; }
        .bento-card {
          background: #fff;
          border-radius: 32px;
          padding: 40px;
          position: relative;
          overflow: hidden;
          min-height: 380px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .bento-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
        }
        .bento-text {
          position: relative;
          z-index: 10;
        }
        .bento-graphic {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 5;
          margin-top: 30px;
        }
        @media (max-width: 900px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr); }
          .bento-span-2 { grid-column: span 2; }
        }
        @media (max-width: 600px) {
          .bento-grid { grid-template-columns: 1fr; }
          .bento-span-2 { grid-column: span 1; }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em', color: '#1E2B3A' }}>
          Smart. Safe. <span style={{ color: 'var(--color-teal)' }}>Seamless.</span>
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#718096', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
          Everything you need to shop local. Engineered to be effortless.
        </p>
      </div>

      <div className="bento-grid">
        
        {/* Card 1: Location Discovery (Span 2) */}
        <div className="bento-card bento-span-2">
           <div className="bento-text">
             <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E2B3A', marginBottom: '8px' }}>Location-Based Discovery</h3>
             <p style={{ color: '#718096', fontSize: '1.05rem' }}>Find nearby sellers instantly with interactive GPS maps.</p>
           </div>
           <div className="bento-graphic">
               {/* Ambient map glow */}
               <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '250px', height: '250px', background: 'radial-gradient(ellipse, rgba(40,199,177,0.15) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
               
               {/* Map UI Element */}
               <div className="floating-slow" style={{ width: '280px', height: '160px', borderRadius: '24px', background: '#E6F9F6', border: '4px solid white', boxShadow: '0 20px 40px rgba(40,199,177,0.15)', position: 'relative', overflow: 'hidden' }}>
                  {/* Grid lines to fake a map */}
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#28C7B122 1px, transparent 1px), linear-gradient(90deg, #28C7B122 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  {/* Center "You" marker with pulse */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-teal)', border: '3px solid white', boxShadow: '0 0 0 10px rgba(40,199,177,0.2)', zIndex: 10 }}></div>
                
                  {/* Radar Sweep Line */}
                  <div className="radar-sweep" style={{ position: 'absolute', top: '50%', left: '50%', width: '150%', height: '1px', background: 'linear-gradient(90deg, rgba(40,199,177,0.5), transparent)', transformOrigin: 'left center', zIndex: 8 }}></div>
                
                  {/* Staggered dynamic markers */}
                  <div className="floating stagger-2" style={{ position: 'absolute', top: '15px', right: '30px', background: 'white', padding: '6px 12px', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.08)', display: 'flex', gap: '6px', alignItems: 'center', zIndex: 11 }}>
                     <MapPin size={12} color="var(--color-purple)" />
                     <div style={{ fontWeight: 800, fontSize: '0.75rem' }}>₦4.5k</div>
                  </div>

                  <div className="floating-fast stagger-1" style={{ position: 'absolute', bottom: '20px', left: '40px', background: 'white', padding: '6px 12px', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.08)', display: 'flex', gap: '6px', alignItems: 'center', zIndex: 11 }}>
                     <MapPin size={12} color="var(--color-coral)" />
                     <div style={{ fontWeight: 800, fontSize: '0.75rem' }}>₦12k</div>
                  </div>

                  <div className="floating-slow stagger-3" style={{ position: 'absolute', top: '60px', left: '15px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-teal)', boxShadow: '0 0 10px var(--color-teal)', zIndex: 11 }}></div>
               </div>
           </div>
        </div>

        {/* Card 2: Notifications (Span 1) */}
        <div className="bento-card">
           <div className="bento-text">
             <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E2B3A', marginBottom: '8px' }}>Seller Tools</h3>
             <p style={{ color: '#718096', fontSize: '1.05rem' }}>Instant alerts keep you moving fast.</p>
           </div>
           <div className="bento-graphic">
               <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                   
                   {/* Notification 1 */}
                   <div className="floating stagger-1" style={{ background: '#1E2B3A', color: 'white', padding: '16px', borderRadius: '20px', width: '85%', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 15px 30px rgba(30,43,58,0.2)' }}>
                      <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}><Bell size={18} color="#FFC864" /></div>
                      <div>
                         <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>New Order!</div>
                         <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>₦15,000 via Wallet</div>
                      </div>
                   </div>

                   {/* Notification 2 */}
                   <div className="floating-fast stagger-2" style={{ background: 'white', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '20px', width: '85%', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', marginLeft: '20px' }}>
                      <div style={{ padding: '8px', background: '#F2EBFA', borderRadius: '12px' }}><MessageCircle size={18} color="var(--color-purple)" /></div>
                      <div>
                         <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E2B3A' }}>New Message</div>
                         <div style={{ fontSize: '0.75rem', color: '#718096' }}>"Is it available?"</div>
                      </div>
                   </div>

               </div>
           </div>
        </div>

        {/* Card 3: Social Feed (Span 1) */}
        <div className="bento-card">
           <div className="bento-text">
             <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E2B3A', marginBottom: '8px' }}>Interactive Feed</h3>
             <p style={{ color: '#718096', fontSize: '1.05rem' }}>Swipe, save, and chat.</p>
           </div>
           <div className="bento-graphic">
               <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                   {/* Stacked Cards */}
                   <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '140px', background: 'white', borderRadius: '20px', border: '1px solid #E2E8F0', transform: 'scale(0.9) translateY(-15px)', opacity: 0.5, zIndex: 1 }}></div>
                   <div style={{ position: 'absolute', top: '10px', left: '5%', right: '5%', height: '140px', background: 'white', borderRadius: '20px', border: '1px solid #E2E8F0', transform: 'scale(0.95) translateY(-5px)', opacity: 0.8, zIndex: 2 }}></div>
                   
                   {/* Main front card with swipe animation */}
                   <div className="card-swipe" style={{ position: 'absolute', top: '25px', left: 0, right: 0, height: '150px', background: 'white', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', zIndex: 3, padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                       <div style={{ width: '100%', height: '70px', borderRadius: '10px', background: '#F1F5F9', overflow: 'hidden' }}>
                          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div style={{ width: '60%', height: '12px', borderRadius: '20px', background: '#E2E8F0' }}></div>
                           <Heart size={18} color="var(--color-coral)" fill="var(--color-coral)" />
                       </div>
                   </div>
               </div>
           </div>
        </div>

        {/* Card 4: Personalization (Span 1) */}
        <div className="bento-card">
           <div className="bento-text">
             <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E2B3A', marginBottom: '8px' }}>Smart Match</h3>
             <p style={{ color: '#718096', fontSize: '1.05rem' }}>AI algorithms learn your exact taste.</p>
           </div>
           <div className="bento-graphic">
               <SmartMatchCycle />
           </div>
        </div>

        {/* Card 5: Trust (Span 1) */}
        <div className="bento-card">
           <div className="bento-text">
             <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E2B3A', marginBottom: '8px' }}>Verified Trust</h3>
             <p style={{ color: '#718096', fontSize: '1.05rem' }}>We physically vet every single seller.</p>
           </div>
            <div className="bento-graphic">
                <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: 'var(--color-dark-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(30,43,58,0.2)', position: 'relative', overflow: 'hidden' }}>
                    <ShieldCheck size={50} color="white" />
                    
                    {/* Active Verification Laser Scan */}
                    <div className="security-scan"></div>
                    
                    <div style={{ position: 'absolute', bottom: 0, right: '0', background: 'var(--color-teal)', padding: '6px', borderRadius: '50%', border: '4px solid white', zIndex: 12 }}>
                       <BadgeCheck size={18} color="white" />
                    </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default TrustSection;
