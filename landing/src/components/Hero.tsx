import * as React from 'react';
import { MapPin, MessageCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="hero-section section-padding" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '80vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{
          position: 'absolute',
          top: '50%',
          right: '5%',
          transform: 'translateY(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(123,72,217,0.15) 0%, transparent 60%)',
          zIndex: -1
      }}></div>

      <div className="hero-content" style={{ flex: '1', paddingRight: '40px', zIndex: 10 }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.05, marginBottom: '25px', letterSpacing: '-0.03em' }}>
          The market is <br/>now in your <span className="gradient-text">pocket.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#4A5568', marginBottom: '40px', maxWidth: '500px', lineHeight: 1.7 }}>
          Discover products near you, chat directly with local sellers, and get it delivered. All in one app.
        </p>
        <div className="hero-buttons" style={{ display: 'flex', gap: '20px' }}>
          <button className="btn-primary">Download App</button>
          <button className="btn-secondary">Start Selling</button>
        </div>
      </div>

      <div className="hero-visual" style={{ position: 'relative', flex: '1.2', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Phone Mockup - 60% Visual Dominance */}
        <div className="phone-mockup floating-slow" style={{
          width: '320px',
          height: '650px',
          background: '#fff',
          borderRadius: '45px',
          boxShadow: '0 40px 80px -20px rgba(123, 72, 217, 0.3)',
          border: '14px solid #1E2B3A',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 5
        }}>
           <div style={{ padding: '20px' }}>
             <div style={{ width: '100%', height: '220px', background: '#F8F9FA', borderRadius: '16px', marginBottom: '15px' }}>
                 <img src="/src/assets/logo.png" alt="YouShop logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', opacity: 0.1 }} />
             </div>
             <div style={{ width: '100%', height: '90px', background: '#F8F9FA', borderRadius: '16px', marginBottom: '15px' }}></div>
             <div style={{ width: '100%', height: '150px', background: '#F8F9FA', borderRadius: '16px' }}></div>
           </div>
        </div>

        {/* Support Character - Pointing/Interacting */}
        <img src="/src/assets/characher single.jpeg" alt="Youshop Character" className="hero-character floating" style={{
          position: 'absolute',
          bottom: '-30px',
          right: '-10px',
          width: '280px',
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          zIndex: 10
        }} />

        {/* Floating UI Elements */}
        {/* UI 1: Location Badge */}
        <div className="floating stagger-1" style={{
            position: 'absolute',
            top: '15%',
            left: '-20px',
            background: '#fff',
            padding: '12px 20px',
            borderRadius: '20px',
            boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 6
        }}>
            <MapPin size={18} color="var(--color-teal)" /> 500m away
        </div>

        {/* UI 2: Product Card */}
        <div className="floating-fast stagger-2" style={{
            position: 'absolute',
            bottom: '25%',
            left: '-40px',
            background: '#fff',
            padding: '16px',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            zIndex: 6,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&h=100&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Fresh Sneakers</div>
                <div style={{ color: 'var(--color-teal)', fontWeight: 800 }}>₦25,000</div>
            </div>
        </div>

        {/* UI 3: Chat Bubble */}
        <div className="floating stagger-3" style={{
            position: 'absolute',
            top: '40%',
            right: '-10px',
            background: '#fff',
            padding: '12px 20px',
            borderRadius: '20px 20px 4px 20px',
            boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
            fontWeight: 600,
            color: 'var(--color-dark-blue)',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
           <MessageCircle size={18} color="var(--color-teal)" /> Still available!
        </div>

      </div>
    </section>
  );
};

export default Hero;
