'use client';

import { useState, useEffect } from 'react';

export default function About() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const teamMembers = [
        {
            name: 'Alex Johnson',
            role: 'CEO & Founder',
            image: '👨‍💼',
            bio: 'Visionary leader with 15+ years in AI and machine learning.'
        },
        {
            name: 'Sarah Chen',
            role: 'CTO',
            image: '👩‍💻',
            bio: 'Technical expert specializing in natural language processing.'
        },
        {
            name: 'Michael Rodriguez',
            role: 'Head of AI Research',
            image: '👨‍🔬',
            bio: 'PhD in Computer Science, published researcher in AI ethics.'
        },
        {
            name: 'Emily Davis',
            role: 'UX Director',
            image: '👩‍🎨',
            bio: 'Design thinking expert focused on human-AI interaction.'
        }
    ];

    const values = [
        {
            icon: '🎯',
            title: 'Innovation First',
            description: 'We push the boundaries of what\'s possible with AI technology.'
        },
        {
            icon: '🤝',
            title: 'Human-Centered',
            description: 'Our AI is designed to augment human capabilities, not replace them.'
        },
        {
            icon: '🔒',
            title: 'Privacy & Security',
            description: 'Your data security and privacy are our top priorities.'
        },
        {
            icon: '🌍',
            title: 'Global Impact',
            description: 'Building technology that makes a positive difference worldwide.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Hero Section */}
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6">
                    <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                            About Our Mission
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            We're building the future of AI assistance, creating technology that understands,
                            adapts, and empowers people to achieve more than they ever thought possible.
                        </p>
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <div className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
                            <div className="prose prose-lg max-w-none text-gray-600">
                                <p className="mb-6">
                                    Founded in 2023, our journey began with a simple yet ambitious vision: to create AI that truly understands
                                    and serves humanity. We saw the potential for artificial intelligence to not just process information,
                                    but to genuinely assist people in meaningful ways.
                                </p>
                                <p className="mb-6">
                                    Our team of researchers, engineers, and designers came together from leading tech companies and universities,
                                    united by the belief that AI should be accessible, ethical, and genuinely helpful. We've spent countless
                                    hours refining our technology to ensure it's not just smart, but wise.
                                </p>
                                <p>
                                    Today, we're proud to offer an AI assistant that doesn't just answer questions—it understands context,
                                    learns from interactions, and adapts to help you achieve your goals more effectively than ever before.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-16">
                <div className="container mx-auto px-6">
                    <div className={`text-center mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20 text-center ${isVisible ? 'animate-fade-in-up' : ''}`}
                                style={{ animationDelay: `${400 + index * 100}ms` }}
                            >
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-16">
                <div className="container mx-auto px-6">
                    <div className={`text-center mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The brilliant minds behind our AI assistant
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20 text-center ${isVisible ? 'animate-fade-in-up' : ''}`}
                                style={{ animationDelay: `${600 + index * 100}ms` }}
                            >
                                <div className="text-6xl mb-4">{member.image}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16">
                <div className="container mx-auto px-6">
                    <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl p-12 shadow-2xl">
                            <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
                            <p className="text-xl mb-8 opacity-90">
                                Be part of the AI revolution. Experience the future of intelligent assistance today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                                    Try Our AI Assistant
                                </button>
                                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
      `}</style>
        </div>
    );
}