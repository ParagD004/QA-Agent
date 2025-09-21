'use client';

import { useState } from 'react';
import HeroSection from "../components/home/HeroSection";
import CompanyInfo from "../components/company/CompanyInfo";
import ChatbotWidget from "../components/chatbot/ChatbotWidget";

export default function Home() {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* Blur overlay when chatbot is open */}
      {chatbotOpen && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 50, 
          backdropFilter: 'blur(6px)', 
          background: 'rgba(0,0,0,0.08)' 
        }} />
      )}
      
      <div className={chatbotOpen ? 'pointer-events-none select-none' : ''}>
        {/* Hero Section */}
        <HeroSection />

        {/* Company Info Section */}
        <div className="relative z-10">
          <CompanyInfo />
        </div>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget open={chatbotOpen} setOpen={setChatbotOpen} />
    </div>
  );
}