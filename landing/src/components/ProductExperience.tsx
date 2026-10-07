import * as React from 'react';
import { MapPin, Heart, MessageCircle, Compass, Smartphone, Sparkles } from 'lucide-react';

const ProductExperience: React.FC = () => {
  const feedItems = [
     { id: 1, name: "Tailored Ankara Dress", price: "₦15,000", seller: "Aisha Stitches", height: '220px', image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80", sellerImage: "https://ui-avatars.com/api/?name=Aisha&background=28C7B1&color=fff" },
     { id: 2, name: "Hot Awara & Sauce", price: "₦1,200", seller: "Hajiya's Kitchen", height: '200px', image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=600&q=80", sellerImage: "https://ui-avatars.com/api/?name=Hajiya&background=FF8A65&color=fff" },
     { id: 3, name: "Kano Leather Sneakers", price: "₦8,500", seller: "Aminu Leatherworks", height: '180px', image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80", sellerImage: "https://ui-avatars.com/api/?name=Aminu&background=7B48D9&color=fff" },
     { id: 4, name: "Fresh Kilishi (Spicy)", price: "₦3,500", seller: "Musa Meat Hub", height: '240px', image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80", sellerImage: "https://ui-avatars.com/api/?name=Musa&background=FF6874&color=fff" },
     { id: 5, name: "Basket of Tomatoes", price: "₦4,500", seller: "Mummy Kasua", height: '180px', image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80", sellerImage: "https://ui-avatars.com/api/?name=Mummy&background=4A5568&color=fff" }
  ];

  return (
    <section id="how-it-works" className="product-experience section-padding" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '80px', flexWrap: 'wrap-reverse' }}>
        
        {/* Left: The Phone Mockup Graphic */}
        <div style={{ flex: '1.2', display: 'flex', justifyContent: 'center', position: 'relative', minWidth: '340px' }}>
          
          {/* Ambient Glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '380px', height: '500px', background: 'radial-gradient(ellipse, rgba(123,72,217,0.15) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 1 }}></div>

          {/* Floating Badge */}
          <div className="floating stagger-2" style={{
             position: 'absolute', top: '5%', right: '5%',
             background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
             padding: '12px 20px', borderRadius: '50px',
             boxShadow: '0 20px 40px rgba(123,72,217,0.15)',
             display: 'flex', alignItems: 'center', gap: '10px', zIndex: 15,
             border: '1px solid rgba(123,72,217,0.2)'
          }}>
             <Sparkles size={18} color="var(--color-purple)" />
             <span style={{ fontWeight: 800, color: '#1E2B3A', fontSize: '0.9rem' }}>Live Local Feed</span>
          </div>

          {/* Mock App Feed */}
          <div style={{
            width: '360px',
            height: '700px',
            background: '#F8F9FA',
            borderRadius: '45px',
            boxShadow: '0 40px 80px rgba(0, 0, 0, 0.12)',
            border: '12px solid #1E2B3A',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 10
          }}>
            {/* Top Nav Bar inside phone */}
            <div style={{ position: 'absolute', top: 0, width: '100%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '18px 20px', zIndex: 20, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1E2B3A' }}>Discover</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, background: 'var(--color-teal)', color: 'white', padding: '6px 12px', borderRadius: '50px' }}>
                <MapPin size={14} color="white" /> 5km Radius
              </span>
            </div>

            <div style={{ height: '75px' }}></div> {/* Spacer */}

            {/* Simulate auto-scrolling feed content */}
            <div className="scroll-animation" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[...feedItems, ...feedItems].map((item, index) => (
                <div key={index} style={{
                  background: '#fff',
                  borderRadius: '24px',
                  padding: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  border: '1px solid #F1F5F9',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', background: '#EDF2F7', flexShrink: 0 }}>
                       <img src={item.sellerImage} alt={item.seller} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E2B3A' }}>{item.seller}</div>
                        <div style={{ color: '#718096', fontSize: '0.75rem', fontWeight: 600 }}>Just listed</div>
                    </div>
                  </div>
                  
                  <div style={{ width: '100%', height: item.height, borderRadius: '14px', overflow: 'hidden', background: '#F1F5F9', marginBottom: '16px', position: 'relative' }}>
                     <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                          <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1E2B3A', marginBottom: '4px' }}>{item.name}</div>
                          <div style={{ color: 'var(--color-purple)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '16px' }}>{item.price}</div>
                      </div>
                      <Heart size={20} color="#CBD5E0" style={{ marginTop: '4px' }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ flex: '1', background: '#F1F5F9', color: '#4A5568', padding: '10px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                        <MessageCircle size={16} /> Chat
                    </button>
                    <button style={{ flex: '1', background: '#1E2B3A', color: 'white', padding: '10px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700 }}>
                        Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: The Message & Guide */}
        <div style={{ flex: '1', minWidth: '340px', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'white', color: '#1E2B3A',
            padding: '6px 16px 6px 6px', borderRadius: '50px',
            fontWeight: 700, fontSize: '0.9rem',
            marginBottom: '24px', border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
          }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #7B48D9, #5629A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 2px 10px rgba(123,72,217,0.4)' }}>
               <Smartphone size={14} />
            </div>
            Dynamic Feed
          </div>

          <h2 style={{ fontSize: '3.8rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#1E2B3A' }}>
            Scroll your city like a <span style={{ color: 'var(--color-purple)' }}>timeline.</span>
          </h2>
          
          <p style={{ fontSize: '1.25rem', color: '#4A5568', lineHeight: 1.7, maxWidth: '480px', marginBottom: '40px' }}>
            We've reimagined local shopping. Swap the boring search bars for a gorgeous, personalized feed of products actively available just blocks away from you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             
             {/* Guide Step 1 */}
             <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#FFF0F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Compass size={22} color="var(--color-coral)" />
                 </div>
                 <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E2B3A', marginBottom: '6px' }}>Endless Discovery</h3>
                    <p style={{ color: '#718096', fontSize: '1rem', lineHeight: 1.6 }}>Swipe through fresh daily drops, exclusive deals, and unique finds from stores right in your area.</p>
                 </div>
             </div>

             {/* Guide Step 2 */}
             <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#F2EBFA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Heart size={22} color="var(--color-purple)" />
                 </div>
                 <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E2B3A', marginBottom: '6px' }}>Curate & Save</h3>
                    <p style={{ color: '#718096', fontSize: '1rem', lineHeight: 1.6 }}>Build a personalized wishlist of your favorite local items, ready for when you want to buy.</p>
                 </div>
             </div>

             {/* Guide Step 3 */}
             <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#E6F9F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageCircle size={22} color="var(--color-teal)" />
                 </div>
                 <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E2B3A', marginBottom: '6px' }}>Instant Connections</h3>
                    <p style={{ color: '#718096', fontSize: '1rem', lineHeight: 1.6 }}>See something you like? Message the seller directly from the feed to ask questions or negotiate.</p>
                 </div>
             </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductExperience;
