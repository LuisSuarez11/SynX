import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProblemSolution from './components/ProblemSolution';
import Features from './components/Features';
import Pricing from './components/Pricing';
import SocialProof from './components/SocialProof';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden noise-overlay">
      <Header />
      <main>
        <HeroSection />
        <ProblemSolution />
        <Features />
        <Pricing />
        <SocialProof />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
