// frontend/app/page.js
'use client';

import { useState, useEffect } from 'react';
import CompanyInfo from "../components/company/CompanyInfo";
import ChatbotWidget from "../components/chatbot/ChatbotWidget";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Blur overlay when chatbot is open */}
      {chatbotOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.08)' }} />
      )}
      <div className={chatbotOpen ? 'pointer-events-none select-none' : ''}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl animate-pulse"
              style={{
                left: mousePosition.x * 0.02 + '%',
                top: mousePosition.y * 0.02 + '%',
                transform: 'translate(-50%, -50%)'
              }}
            />
            <div
              className="absolute w-80 h-80 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full blur-3xl animate-pulse delay-1000"
              style={{
                right: (100 - mousePosition.x * 0.015) + '%',
                bottom: (100 - mousePosition.y * 0.015) + '%',
                transform: 'translate(50%, 50%)'
              }}
            />
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-6 pt-20 pb-12 text-center">
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-pulse">
                Welcome to the Future
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experience intelligent assistance powered by cutting-edge AI technology.
                Your journey to seamless interaction starts here.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
              {[
                { icon: "🚀", title: "Lightning Fast", desc: "Instant responses powered by advanced AI" },
                { icon: "🎯", title: "Precision Focused", desc: "Accurate answers tailored to your needs" },
                { icon: "🔒", title: "Secure & Private", desc: "Your data protected with enterprise security" }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20 ${isVisible ? 'animate-fade-in-up' : ''}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mb-16">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-xl mb-6 opacity-90">
                  Discover how our AI assistant can transform your experience
                </p>
                <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Explore Now ✨
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info with Enhanced Styling */}
        <div className={`relative z-10 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CompanyInfo />
        </div>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget open={chatbotOpen} setOpen={setChatbotOpen} />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}