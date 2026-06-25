import React from 'react';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import ProblemSolution from '../components/landing/ProblemSolution';
import Features from '../components/landing/Features';
import Pricing from '../components/landing/Pricing';
import SocialProof from '../components/landing/SocialProof';
import ContactForm from '../components/landing/ContactForm';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#040508] text-[#F8FAFC] font-sans overflow-x-hidden noise-overlay">
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
};

export default LandingPage;
