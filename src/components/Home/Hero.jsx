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

  // Typewriter effect state and lifecycle
  const fullTagline = "बेहतर भविष्य के लिए समर्पित";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer;
    const handleType = () => {
      setDisplayText((prev) => {
        if (!isDeleting) {
          const nextText = fullTagline.slice(0, prev.length + 1);
          if (nextText === fullTagline) {
            setTypingSpeed(3000); // full text typed, wait 3 seconds
            setIsDeleting(true);
          } else {
            setTypingSpeed(120); // normal typing speed
          }
          return nextText;
        } else {
          const nextText = fullTagline.slice(0, prev.length - 1);
          if (nextText === "") {
            setTypingSpeed(600); // completely erased, pause for 0.6 seconds before typing again
            setIsDeleting(false);
          } else {
            setTypingSpeed(50); // erase faster
          }
          return nextText;
        }
      });
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, typingSpeed]);

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
          className="absolute inset-0 opacity-[0.04] pointer-events-none bg-repeat"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cg transform='translate(20, 20) scale(1.3)'%3E%3Cpath d='M12 5c-1.66 0-3 1.34-3 3 0 2 2.5 4.5 3 5 .5-.5 3-3 3-5 0-1.66-1.34-3-3-3zm-9 11c0-1.1.9-2 2-2h4v-1.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V14h3c1.1 0 2 .9 2 2v2H3v-2z' fill='none' stroke='white' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cg transform='translate(80, 20) scale(1.3)'%3E%3Ccircle cx='12' cy='5' r='3' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M12 3.5v3M10.5 5h3' stroke='white' stroke-width='1'/%3E%3Cpath d='M3 14c4 0 5-3 9-3h7c1 0 2 1 2 2v1c0 1-1 2-2 2H5' fill='none' stroke='white' stroke-width='1.2' stroke-linecap='round'/%3E%3C/g%3E%3Cg transform='translate(140, 20) scale(1.3)'%3E%3Cpath d='M6 18c2-4 6-10 6-13a3 3 0 0 1 6 0c0 3-4 9-6 13' fill='none' stroke='white' stroke-width='1.2' stroke-linecap='round'/%3E%3Cpath d='M18 18c-2-4-6-10-6-13' fill='none' stroke='white' stroke-width='1.2' stroke-linecap='round'/%3E%3C/g%3E%3Cg transform='translate(200, 20) scale(1.3)'%3E%3Ccircle cx='12' cy='12' r='8' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M12 4v16M4 12h16' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M12 12c2 0 4-2 4-8s-2-8-4-8c-2 0-4 2-4 8s2 8 4 8z' fill='none' stroke='white' stroke-width='1.2'/%3E%3C/g%3E%3Cg transform='translate(20, 80) scale(1.3)'%3E%3Cpath d='M19 8c-2-1-4-2-6-2-3 0-6 2-7 5-1 2-1 4 0 6 1 2 3 3 5 3 3 0 6-2 7-5 1-2 1-5 1-7z' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M6 13c-2 0-4-2-4-4s2-2 4-2' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M10 6C9 4 7 3 5 3' fill='none' stroke='white' stroke-width='1.2'/%3E%3C/g%3E%3Cg transform='translate(80, 80) scale(1.3)'%3E%3Cpath d='M3 10l9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M12 11c-0.8 0-1.5 0.7-1.5 1.5 0 1 1.2 2.2 1.5 2.5 0.3-0.3 1.5-1.5 1.5-2.5 0-0.8-0.7-1.5-1.5-1.5z' fill='none' stroke='white' stroke-width='1.2'/%3E%3C/g%3E%3Cg transform='translate(140, 80) scale(1.3)'%3E%3Cpath d='M12 4c0 3-2 5-5 5s-5-2-5-5a5 5 0 0 1 5-5c3 0 5 2 5 5z' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M12 9c0 2 2 4 4 4s4-2 4-4a4 4 0 0 0-4-4' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M12 9v7m-4-2h8' stroke='white' stroke-width='1.2'/%3E%3C/g%3E%3Cg transform='translate(200, 80) scale(1.3)'%3E%3Crect x='7' y='4' width='10' height='13' rx='2' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M12 2v2M12 17v3c0 1-1 2-2 2' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M10 9h4M12 7v4' stroke='white' stroke-width='1.2'/%3E%3C/g%3E%3Cg transform='translate(20, 140) scale(1.3)'%3E%3Ccircle cx='8' cy='6' r='2.5' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M3 15c0-2.5 2-4.5 5-4.5s5 2 5 4.5' fill='none' stroke='white' stroke-width='1.2'/%3E%3Ccircle cx='16' cy='7' r='2' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M12 15c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5' fill='none' stroke='white' stroke-width='1.2'/%3E%3C/g%3E%3Cg transform='translate(80, 140) scale(1.3)'%3E%3Cpath d='M12 3c0 0 7 6 7 11a7 7 0 0 1-14 0c0-5 7-11 7-11z' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M10 14h4M12 12v4' fill='none' stroke='white' stroke-width='1'/%3E%3C/g%3E%3Cg transform='translate(140, 140) scale(1.3)'%3E%3Cpath d='M6 5L3 8l3 3v8h12v-8l3-3-3-3h-4a3 3 0 0 1-6 0H6z' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M12 10c-0.5 0-1 0.5-1 1 0 0.8 1 1.5 1.2 1.7 0.2-0.2 1.2-0.9 1.2-1.7 0-0.5-0.5-1-1-1z' fill='none' stroke='white' stroke-width='1'/%3E%3C/g%3E%3Cg transform='translate(200, 140) scale(1.3)'%3E%3Crect x='4' y='9' width='16' height='11' rx='1.5' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M7 9V5h10v4' fill='none' stroke='white' stroke-width='1.2'/%3E%3Ccircle cx='12' cy='14' r='2.5' fill='none' stroke='white' stroke-width='1.2'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '360px 360px'
          }}
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
            ट्रस्ट <span className="text-[#f08519]">(SHCT)</span>
          </h1>

          {/* Tagline */}
          <h2 className="text-3xl lg:text-[40px] font-bold text-white mb-10 drop-shadow-md min-h-[50px]">
            {displayText}
            <span className="text-[#f08519] ml-1 animate-pulse">|</span>
          </h2>

          <p className="text-teal-50 text-sm md:text-base font-medium mb-8">
            रजि0न0 ( 57/2026 )
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
            className={`absolute top-0 left-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}

        {/* Optional: Carousel Dots (Agar aapko neeche dots dikhane hain) */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-[#f08519] scale-125" : "bg-white/50 hover:bg-white"
                }`}
            ></button>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Hero;