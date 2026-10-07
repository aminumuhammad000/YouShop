import * as React from 'react';
import { DollarSign, MessageCircle, ArrowRight, Store, Smartphone, TrendingUp } from 'lucide-react';

const SellerSection: React.FC = () => {
  const steps = [
    {
      icon: <Store size={20} color="#FFC864" />,
      title: 'Open your shop in minutes',
      desc: 'No paperwork. Just snap your products and set your location.'
    },
    {
      icon: <Smartphone size={20} color="#28C7B1" />,
      title: 'Get matched with local buyers',
      desc: 'Buyers in your area see your products in their local feed instantly.'
    },
    {
      icon: <TrendingUp size={20} color="#FF6874" />,
      title: 'Chat, sell, and earn',
      desc: 'Negotiate directly in the app and receive your cash without delay.'
    }
  ];

  return (
    <section id="sellers" className="seller-section section-padding" style={{ backgroundColor: '#1E2B3A', color: 'white', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '80px', flexWrap: 'wrap' }}>
        
        {/* Left: Text & CTA */}
        <div style={{ flex: '1', minWidth: '340px', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.05)', color: 'white',
            padding: '6px 16px 6px 6px', borderRadius: '50px',
            fontWeight: 700, fontSize: '0.9rem',
            marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFC864, #E5A93D)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E2B3A', boxShadow: '0 2px 10px rgba(255,200,100,0.3)' }}>
               <Store size={14} />
            </div>
            Seller Tools
          </div>
          
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Start selling <br/><span style={{ color: '#FFC864' }}>no shop needed.</span>
          </h2>
          
          <p style={{ fontSize: '1.2rem', color: '#A0AEC0', marginBottom: '40px', lineHeight: 1.6, maxWidth: '480px' }}>
            Zero overhead. Huge local reach. Turn your inventory into cash by broadcasting directly to buyers around you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '45px' }}>
             {steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                   <div style={{ 
                      width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      border: '1px solid rgba(255,255,255,0.08)'
                   }}>
                      {step.icon}
                   </div>
                   <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px', color: '#F8F9FA' }}>{step.title}</div>
                      <div style={{ color: '#A0AEC0', fontSize: '0.95rem', lineHeight: 1.5 }}>{step.desc}</div>
                   </div>
                </div>
             ))}
          </div>

          <button style={{
            background: '#FFC864',
            color: '#1E2B3A',
            padding: '16px 32px',
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '1.1rem',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 20px 40px rgba(255, 200, 100, 0.2)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 25px 50px rgba(255, 200, 100, 0.3)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(255, 200, 100, 0.2)'; }}
          >
             Become a Seller <ArrowRight size={20} />
          </button>
        </div>

        {/* Right: Graphics & Motion */}
        <div className="seller-graphic-wrapper" style={{ flex: '1.2', minWidth: '300px', display: 'flex', justifyContent: 'center', position: 'relative', marginTop: '20px' }}>
            
            {/* Background ambient glow */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(255, 200, 100, 0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 1 }}></div>

            {/* Simulated Dashboard Widget */}
            <div className="floating-slow seller-widget-sales" style={{ 
               position: 'absolute', top: '2%', right: '5%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
               padding: '18px 24px', borderRadius: '20px', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', zIndex: 10,
               minWidth: '220px', border: '1px solid rgba(255,255,255,0.2)'
            }}>
               <div style={{ fontSize: '0.85rem', color: '#4A5568', fontWeight: 700, marginBottom: '6px' }}>Today's Sales</div>
               <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E2B3A', marginBottom: '10px' }}>₦145,500</div>
               {/* Mini bar chart */}
               <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '30px' }}>
                  {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
                      <div key={i} style={{ width: '12px', height: `${h}%`, background: h === 100 ? '#FFC864' : '#E2E8F0', borderRadius: '4px' }}></div>
                  ))}
               </div>
            </div>

            {/* Notification 1 */}
            <div className="floating stagger-2 seller-widget-order" style={{ 
               position: 'absolute', bottom: '25%', left: '-5%', background: '#fff', color: '#1E2B3A', 
               padding: '16px 20px', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', zIndex: 15, 
               display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid var(--color-teal)'
            }}>
               <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#E6F9F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <DollarSign size={20} color="var(--color-teal)" />
               </div>
               <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '3px' }}>New Order!</div>
                  <div style={{ color: 'var(--color-teal)', fontWeight: 700, fontSize: '0.85rem' }}>₦25,000 pending pickup</div>
               </div>
            </div>

            {/* Notification 2 */}
            <div className="floating-fast stagger-3 seller-widget-msg" style={{ 
               position: 'absolute', bottom: '-5%', right: '10%', background: '#fff', color: '#1E2B3A', 
               padding: '16px 20px', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', zIndex: 15, 
               display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid var(--color-purple)'
            }}>
               <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#F2EBFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <MessageCircle size={20} color="var(--color-purple)" />
               </div>
               <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '3px' }}>Message from buyer</div>
                  <div style={{ color: 'var(--color-purple)', fontWeight: 700, fontSize: '0.85rem' }}>"I'm outside your street"</div>
               </div>
            </div>

            {/* Character Image */}
            <div style={{ position: 'relative', zIndex: 5 }}>
               <img src="/src/assets/characheters.jpeg" alt="Youshop Seller" style={{ 
                  width: '100%', maxWidth: '420px', borderRadius: '32px', display: 'block',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.5)', border: '6px solid rgba(255,255,255,0.08)',
                  objectFit: 'cover', aspectRatio: '4/5'
               }} />
            </div>
        </div>
      </div>
    </section>
  );
};

export default SellerSection;
