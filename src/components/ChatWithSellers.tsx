import * as React from 'react';
import { Smile } from 'lucide-react';

const TypingIndicator: React.FC<{ img: string }> = ({ img }) => (
  <div className="notification-pop" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
     <img src={img} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
     <div style={{ background: '#E2E8F0', padding: '10px 15px', borderRadius: '20px', display: 'flex', gap: '4px' }}>
        <div className="floating-fast" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A0AEC0' }}></div>
        <div className="floating" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A0AEC0' }}></div>
        <div className="floating-slow" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A0AEC0' }}></div>
     </div>
  </div>
);

const ChatWithSellers: React.FC = () => {
  const [msgCount, setMsgCount] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setMsgCount(0);
        // Start sequence
        setTimeout(() => setMsgCount(1), 1000);
        setTimeout(() => setMsgCount(1.5), 2000);
        setTimeout(() => setMsgCount(2), 3500);
        setTimeout(() => setMsgCount(3), 5000);
        setTimeout(() => setMsgCount(3.5), 6000);
        setTimeout(() => setMsgCount(4), 7500);
        // Loop again after 15 seconds
        const interval = setInterval(() => {
          setMsgCount(0);
          setTimeout(() => setMsgCount(1), 1000);
          setTimeout(() => setMsgCount(1.5), 2000);
          setTimeout(() => setMsgCount(2), 3500);
          setTimeout(() => setMsgCount(3), 5000);
          setTimeout(() => setMsgCount(3.5), 6000);
          setTimeout(() => setMsgCount(4), 7500);
        }, 15000);
        
        return () => clearInterval(interval);
      }
    }, { threshold: 0.5 });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="chat-sellers section-padding" ref={containerRef}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse', gap: '40px' }}>
        <div style={{ flex: '1', paddingLeft: '40px' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Talk to sellers <br/><span className="gradient-text">directly.</span></h2>
          <p style={{ fontSize: '1.25rem', color: '#4A5568', marginBottom: '40px', lineHeight: 1.6 }}>
            No middlemen. Negotiate, ask questions, and build real relationships with local businesses before you buy.
          </p>
        </div>
        <div style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
          {/* Chat Interface Mockup */}
           <div className="floating-slow" style={{
            width: '100%',
            maxWidth: '380px',
            background: '#F8F9FA',
            borderRadius: '30px',
            padding: '25px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.06)',
            border: '8px solid #fff'
          }}>
             {/* Chat Header */}
             <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px', marginBottom: '25px' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden', flexShrink: 0 }}>
                 <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop" alt="Sani" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
               <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1E2B3A' }}>Sani's Store</div>
                  <div style={{ color: 'var(--color-teal)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-teal)' }}></div> Online
                  </div>
               </div>
             </div>
             
             {/* Chat Bubbles */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontWeight: 500, minHeight: '320px' }}>
               
               {/* 1. Buyer (Right) */}
               {msgCount >= 1 && (
                 <div className="notification-pop" style={{ alignSelf: 'flex-end', background: 'var(--color-purple)', color: 'white', padding: '14px 18px', borderRadius: '20px 20px 4px 20px', maxWidth: '85%', lineHeight: 1.4, boxShadow: '0 8px 20px rgba(123,72,217,0.15)' }}>
                    How much is this vintage jacket?
                 </div>
               )}
               
               {/* 2. Typing Indicator or Seller (Left) */}
               {msgCount === 1.5 && <TypingIndicator img="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=32&h=32&fit=crop" />}
               {msgCount >= 2 && (
                 <div className="notification-pop" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'flex-end', gap: '8px', maxWidth: '90%' }}>
                    <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=32&h=32&fit=crop" alt="Sani" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ background: '#E2E8F0', color: '#1E2B3A', padding: '14px 18px', borderRadius: '20px 20px 20px 4px', lineHeight: 1.4 }}>
                      ₦5,000 for you my friend.
                    </div>
                 </div>
               )}
               
               {/* 3. Buyer (Right) */}
               {msgCount >= 3 && (
                 <div className="notification-pop" style={{ alignSelf: 'flex-end', background: 'var(--color-purple)', color: 'white', padding: '14px 18px', borderRadius: '20px 20px 4px 20px', maxWidth: '85%', lineHeight: 1.4, boxShadow: '0 8px 20px rgba(123,72,217,0.15)' }}>
                    Can you do ₦4,500? I'm coming to Zoo Road now.
                 </div>
               )}
               
               {/* 4. Typing Indicator or Seller (Left) */}
               {msgCount === 3.5 && <TypingIndicator img="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=32&h=32&fit=crop" />}
               {msgCount >= 4 && (
                 <div className="notification-pop" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'flex-end', gap: '8px', maxWidth: '90%' }}>
                    <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=32&h=32&fit=crop" alt="Sani" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ background: '#E2E8F0', color: '#1E2B3A', padding: '14px 18px', borderRadius: '20px 20px 20px 4px', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Okay! Come pick it up today <Smile size={18} color="#718096" />
                    </div>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatWithSellers;
