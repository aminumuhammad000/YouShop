import * as React from 'react';
import { ShoppingBag, ShoppingCart, Bike, Store, MessageCircle, Heart, Sparkles } from 'lucide-react';

const AmbientBackground: React.FC = () => {
    const [scrollY, setScrollY] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        // Use requestAnimationFrame for incredibly smooth 60fps tracking
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // A powerful, highly visible premium 3D Glass Bubble
    const GlassBubble = ({ children, size, color, top, left, right, speed, floatClass, blur = 0, opacity = 1 }: any) => {
        // Here is the math that makes it move exactly as fast as you scroll.
        // speed controls the multiplication. If speed is -1.5, it moves extremely fast upwards.
        const yOffset = scrollY * speed;
        
        return (
            <div className={floatClass} style={{
                position: 'fixed', // Fixed to viewport, moved exclusively by scroll velocity
                width: `${size}px`, height: `${size}px`,
                borderRadius: '50%',
                background: `linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)`,
                backdropFilter: blur > 0 ? `blur(${blur}px)` : 'blur(12px)',
                WebkitBackdropFilter: blur > 0 ? `blur(${blur}px)` : 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: `0 20px 40px rgba(0,0,0,0.05), inset 0 0 30px rgba(255,255,255,0.7), inset 0px -5px 20px ${color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                top, left, right,
                transform: `translateY(${yOffset}px)`, // Tied strictly to scroll speed
                zIndex: 0,
                pointerEvents: 'none',
                filter: blur > 0 ? `blur(${blur}px)` : 'blur(0.5px)', // Just barely fuzzy
                opacity: opacity * 0.9 
            }}>
                <div style={{ color: color, opacity: 0.7, filter: `drop-shadow(0 5px 10px ${color}44)` }}>
                    {children}
                </div>
            </div>
        );
    };

    // Soft colored orbs floating in the deepest back
    const GlowOrb = ({ size, color, top, left, right, speed }: any) => {
        const yOffset = scrollY * speed;
        return (
            <div style={{
                position: 'fixed',
                width: `${size}px`, height: `${size}px`,
                borderRadius: '50%',
                background: color,
                filter: 'blur(100px)',
                top, left, right,
                transform: `translateY(${yOffset}px)`,
                zIndex: -2,
                pointerEvents: 'none'
            }} />
        );
    };

    return (
        <div id="ambient-background" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -10, background: '#F4F7FB', overflow: 'hidden' }}>
            
            {/* Massive Deep Orbs slowly shifting */}
            <GlowOrb size={600} color="rgba(123,72,217,0.12)" top="10%" left="-10%" speed={-0.1} />
            <GlowOrb size={800} color="rgba(40,199,177,0.1)" top="40%" right="-20%" speed={-0.05} />
            <GlowOrb size={700} color="rgba(255,104,116,0.08)" top="70%" left="15%" speed={-0.15} />

            {/* Small crisp icons - VERY FAST scroll tracking */}
            <GlassBubble size={80} color="#28C7B1" top="20%" left="15%" speed={-0.8} floatClass="floating">
                <ShoppingCart size={35} strokeWidth={2} />
            </GlassBubble>

            <GlassBubble size={100} color="#7B48D9" top="40%" right="15%" speed={-1.2} floatClass="floating-slow">
                <Store size={45} strokeWidth={2} />
            </GlassBubble>

            <GlassBubble size={70} color="#FF6874" top="70%" left="20%" speed={-0.9} floatClass="floating-fast">
                <Bike size={30} strokeWidth={2} />
            </GlassBubble>

            {/* Slightly further icons - SLOW scroll tracking & blurred */}
            <GlassBubble size={110} color="#FFC864" top="50%" right="30%" speed={-0.3} blur={3} opacity={0.8} floatClass="floating-slow">
                <MessageCircle size={50} strokeWidth={1.5} />
            </GlassBubble>

             <GlassBubble size={90} color="#28C7B1" top="80%" left="35%" speed={-0.4} blur={2} opacity={0.7} floatClass="floating">
                <ShoppingBag size={40} strokeWidth={1.5} />
            </GlassBubble>

             <GlassBubble size={120} color="#FF6874" top="10%" right="25%" speed={0.6} blur={4} opacity={0.6} floatClass="floating-fast">
                <Heart size={55} strokeWidth={1.5} />
            </GlassBubble>
            
             <GlassBubble size={130} color="#7B48D9" top="85%" right="10%" speed={0.8} blur={5} opacity={0.5} floatClass="floating">
                <Sparkles size={60} strokeWidth={1.5} />
            </GlassBubble>

        </div>
    );
};

export default AmbientBackground;
