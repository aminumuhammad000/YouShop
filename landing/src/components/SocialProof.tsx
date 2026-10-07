import * as React from 'react';
import { Package, MessageCircle, TrendingUp, MapPin } from 'lucide-react';

const stories = [
  {
    image: '/src/assets/youshop_family_delivery.png',
    notification: [
      { icon: <Package size={18} color="#28C7B1" />, title: 'Order Update 🚀', body: 'Your package is out for delivery! • Rider', time: '5 min ago' },
      { icon: <Package size={18} color="#28C7B1" />, title: 'Your order just arrived! 🚀', body: '"I\'m outside your gate with the package." • Rider', time: 'Just now' },
      { icon: <Package size={18} color="#FFC864" />, title: 'Transaction Successful! 🎉', body: 'Payment of ₦15,000 confirmed for your sofa set.', time: 'Just now' },
    ],
    tag: 'Home Delivery',
    tagColor: '#28C7B1',
    heading: 'Family night made easier.',
    description: 'The Adeyemi family ordered a new sofa set on YouShop during lunch. The rider arrived the same evening. No stress, no traffic.',
    imageLeft: true,
  },
  {
    image: '/src/assets/youshop_friends_cafe.png',
    notification: [
      { icon: <MessageCircle size={18} color="#7B48D9" />, title: 'New message from Seller', body: '"I just restocked, come and grab yours!"', time: '2 min ago' },
      { icon: <Package size={18} color="#7B48D9" />, title: 'Group Order Started! 👟', body: 'Emeka and 2 others started a collective order.', time: '1 min ago' },
      { icon: <Package size={18} color="#28C7B1" />, title: 'Congratulations! 🎉', body: 'All items picked up by the crew.', time: 'Just now' },
    ],
    tag: 'Shopping with Friends',
    tagColor: '#7B48D9',
    heading: 'The best deals hit different with your crew.',
    description: 'Emeka, Tunde, and Adaeze spotted a sneakers drop on YouShop at their favorite Lagos café and split the shipping fee between them.',
    imageLeft: false,
  },
  {
    image: '/src/assets/youshop_professional_office.png',
    notification: [
      { icon: <TrendingUp size={18} color="#FF6874" />, title: 'Deal near you: act fast!', body: '"MacBook Sleeve at ₦3,500 • only 200m away!"', time: '5 min ago' },
      { icon: <MessageCircle size={18} color="#FF6874" />, title: 'Seller is responding...', body: '"I\'m at the lobby now, let\'s meet up!"', time: '2 min ago' },
      { icon: <Package size={18} color="#28C7B1" />, title: 'Item Received! 🎉', body: 'You just picked up your sleeve near the office.', time: 'Just now' },
    ],
    tag: 'At the Office',
    tagColor: '#FF6874',
    heading: 'Shop locally, even from your desk.',
    description: 'Chukwuemeka needed a MacBook sleeve before his 3pm pitch. He found one 200m from his office on YouShop and had it in 10 minutes.',
    imageLeft: true,
  },
  {
    image: '/src/assets/youshop_seller_market.png',
    notification: [
      { icon: <MapPin size={18} color="#FFC864" />, title: 'New message from buyer', body: '"I\'m outside your street, drop the price small!"', time: '1 min ago' },
      { icon: <Package size={18} color="#FFC864" />, title: 'Cash Out Initiated! 💰', body: '₦45,000 withdrawn to your bank account.', time: '5 min ago' },
      { icon: <Package size={18} color="#28C7B1" />, title: 'Congratulations! 🎉', body: 'You hit your daily sales target!', time: 'Just now' },
    ],
    tag: 'Selling on YouShop',
    tagColor: '#FFC864',
    heading: 'Your shop is open, always.',
    description: 'Halima runs her boutique stall in Abuja. Since joining YouShop, buyers message her before even arriving. She\'s always ready.',
    imageLeft: false,
  },
];

const StoryRow: React.FC<{ story: typeof stories[0]; index: number }> = ({ story, index }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [msgIndex, setMsgIndex] = React.useState(0);

  React.useEffect(() => {
    if (!visible) return;
    // Length + 1 creates an 'all-hidden' stage at the end of the narrative cycle
    const interval = setInterval(() => setMsgIndex(prev => (prev + 1) % (story.notification.length + 1)), 3500);
    return () => clearInterval(interval);
  }, [visible, story.notification.length]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { setVisible(entry.isIntersecting); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const imageContent = (
    <div style={{ flex: '1.1', position: 'relative', borderRadius: '28px', overflow: 'hidden', aspectRatio: '4/3' }}>
      <img
        src={story.image}
        alt={story.tag}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: story.imageLeft
          ? 'linear-gradient(to right, rgba(0,0,0,0.2), transparent)'
          : 'linear-gradient(to left, rgba(0,0,0,0.2), transparent)',
      }} />

      {/* Stacking Notification Narrative */}
      {msgIndex < story.notification.length && story.notification.slice(0, msgIndex + 1).map((notif, i) => (
        <div 
          key={`pop-${i}`}
          className={visible ? 'notification-pop' : ''}
          style={{
          position: 'absolute',
          bottom: (24 + i * 100) + 'px',
          right: story.imageLeft ? 'unset' : '24px',
          left: story.imageLeft ? '24px' : 'unset',
          background: i === 2 ? story.tagColor + 'f0' : 'rgba(255,255,255,0.97)',
          color: i === 2 ? 'white' : 'inherit',
          backdropFilter: 'blur(16px)',
          padding: '14px 16px',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
          maxWidth: '240px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          opacity: visible ? 1 : 0,
          zIndex: 20 + i,
          animationDelay: i === msgIndex ? '0.2s' : '0s',
          transition: 'bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: i === 2 ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #28C7B1, #7B48D9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {notif.icon}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '2px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.72rem', color: i === 2 ? 'white' : '#1E2B3A' }}>YouShop</span>
              <span style={{ fontSize: '0.68rem', color: i === 2 ? 'rgba(255,255,255,0.7)' : '#A0AEC0' }}>{notif.time}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.78rem', color: i === 2 ? 'white' : '#1E2B3A', marginBottom: '3px' }}>{notif.title}</div>
            <div style={{ fontSize: '0.72rem', color: i === 2 ? 'rgba(255,255,255,0.9)' : '#4A5568', lineHeight: 1.5 }}>{notif.body}</div>
          </div>
        </div>
      ))}
      

    </div>
  );

  const textContent = (
    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: story.imageLeft ? '0 0 0 60px' : '0 60px 0 0' }}>
      {/* Tag */}
      <div style={{
        display: 'inline-block',
        background: `${story.tagColor}18`,
        color: story.tagColor,
        padding: '6px 16px',
        borderRadius: '50px',
        fontWeight: 700,
        fontSize: '0.85rem',
        marginBottom: '20px',
        alignSelf: 'flex-start',
        border: `1.5px solid ${story.tagColor}30`,
      }}>
        {story.tag}
      </div>

      {/* Counter */}
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#CBD5E0', marginBottom: '12px', letterSpacing: '0.1em' }}>
        {String(index + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}
      </div>

      <h3 style={{
        fontSize: '2.8rem', fontWeight: 800, color: '#1E2B3A',
        lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '24px',
      }}>
        {story.heading}
      </h3>

      <p style={{
        fontSize: '1.15rem', color: '#718096', lineHeight: 1.8,
        maxWidth: '440px', borderLeft: `3px solid ${story.tagColor}`,
        paddingLeft: '20px',
      }}>
        {story.description}
      </p>
    </div>
  );

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: story.imageLeft ? 'row' : 'row-reverse',
        alignItems: 'center',
        gap: '0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(60px)',
        transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`,
        marginBottom: index < stories.length - 1 ? '120px' : '0',
      }}
    >
      {imageContent}
      {textContent}
    </div>
  );
};

const SocialProof: React.FC = () => {
  return (
    <section id="stories" className="social-proof section-padding">
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '100px' }}>
        <h2 style={{
          fontSize: '3.8rem', fontWeight: 800, letterSpacing: '-0.03em',
          lineHeight: 1.05, marginBottom: '20px',
        }}>
          Real people. <span className="gradient-text">Real stories.</span>
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#718096', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
          From families getting deliveries to entrepreneurs running shops. YouShop is already part of everyday Nigerian life.
        </p>
      </div>

      {/* Alternating editorial rows */}
      <div>
        {stories.map((story, i) => (
          <StoryRow key={i} story={story} index={i} />
        ))}
      </div>
    </section>
  );
};

export default SocialProof;
