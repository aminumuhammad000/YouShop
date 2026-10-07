import * as React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductExperience from './components/ProductExperience';
import LocationDiscovery from './components/LocationDiscovery';
import ChatWithSellers from './components/ChatWithSellers';
import SellerSection from './components/SellerSection';
import TrustSection from './components/TrustSection';
import SocialProof from './components/SocialProof';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import AmbientBackground from './components/AmbientBackground';

const App: React.FC = () => {
  return (
    <div style={{ position: 'relative' }}>
      <AmbientBackground />
      <Navbar />
      <main>
        <Hero />
        <ProductExperience />
        <LocationDiscovery />
        <ChatWithSellers />
        <SellerSection />
        <TrustSection />
        <SocialProof />
      </main>
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default App;
