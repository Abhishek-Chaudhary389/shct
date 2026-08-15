 import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Asset folder se teeno photos import kar rahe hain
import heroImg1 from '../../assets/ngo1.jpg';
import heroImg2 from '../../assets/ngo2.jpg';
import heroImg3 from '../../assets/ngo3.jpg';

const Hero = () => {
  // Images ka array bana liya hai slider ke liye
  const images = [heroImg1, heroImg2, heroImg3];
  
  // Current image ka index track karne ke liye state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect (Har 5 second mein image change hogi)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 5000ms = 5 seconds
    return () => clearInterval(timer); // Cleanup function
  }, [images.length]);

  // Peeche wali image par jaane ka function
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Aage wali image par jaane ka function
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <section className="w-full flex flex-col lg:flex-row min-h-[600px] lg:h-[calc(100vh-120px)] relative overflow-hidden font-sans">
      
      {/* ================= LEFT SIDE: Logo's Teal Background ================= */}
      <div className="relative w-full lg:w-1/2 flex flex-col justify-center px-10 lg:px-24 py-16 lg:py-0 bg-[#087889]">
        
        {/* Faint Background Doodles/Pattern (Optional) */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none bg-no-repeat bg-bottom bg-cover"
          style={{ backgroundImage: "url('/path-to-your-doodle-pattern.png')" }}
        ></div>

        {/* Left Slider Arrows (Ab ye buttons kaam karenge) */}
        <div className="hidden lg:flex flex-col absolute left-6 top-1/2 -translate-y-1/2 space-y-4 z-10">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-[#f08519] hover:border-[#f08519] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-[#f08519] hover:border-[#f08519] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        {/* Text Content */}
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-[46px] font-bold text-white leading-[1.3] mb-1">
            साइलेंट हेल्प चैरिटेबल
          </h1>
          <h1 className="text-4xl lg:text-[46px] font-bold text-white leading-[1.3] mb-5">
            ट्रस्ट <span className="text-[#f08519]">(SHCT)</span> उत्तर प्रदेश
          </h1>
          
          {/* Tagline */}
          <h2 className="text-3xl lg:text-[40px] font-bold text-white mb-10 drop-shadow-md">
            Help For Helpless
          </h2>
          
          <p className="text-teal-50 text-sm md:text-base font-medium mb-8">
            साइलेंट हेल्प चैरिटेबल ट्रस्ट, रजि0न0 ( 57/2026 )
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="px-8 py-3 rounded-full font-bold text-white shadow-lg transition-transform hover:scale-105 bg-[#f08519] hover:bg-orange-600 inline-block text-center">
              REGISTER NOW
            </Link>
            <Link to="/login" className="px-10 py-3 rounded-full font-bold text-white shadow-lg transition-transform hover:scale-105 bg-[#f08519] hover:bg-orange-600 inline-block text-center">
              LOGIN
            </Link>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: Image Carousel Section ================= */}
      <div className="w-full lg:w-1/2 h-[400px] lg:h-full relative bg-gray-200 overflow-hidden">
        {images.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt={`Team Gathering ${index + 1}`} 
            className={`absolute top-0 left-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        
        {/* Optional: Carousel Dots (Agar aapko neeche dots dikhane hain) */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-[#f08519] scale-125" : "bg-white/50 hover:bg-white"
              }`}
            ></button>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Hero;