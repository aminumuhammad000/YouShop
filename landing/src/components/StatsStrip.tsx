import * as React from 'react';

const stats = [
  { number: '12,000+', label: 'Active Sellers', color: 'var(--color-teal)' },
  { number: '50,000+', label: 'Happy Buyers', color: 'var(--color-purple)' },
  { number: '120+',    label: 'Cities Covered', color: 'var(--color-coral)' },
  { number: '₦500M+', label: 'Transactions Made', color: 'var(--color-orange)' },
];

const StatsStrip: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      background: 'var(--color-dark-blue)',
      padding: '60px 5%',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '40px',
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            textAlign: 'center',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
          }}>
            <div style={{
              fontSize: '3rem', fontWeight: 900, color: stat.color,
              letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '8px',
            }}>
              {stat.number}
            </div>
            <div style={{
              color: '#A0AEC0', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsStrip;
