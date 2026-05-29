"use client";

import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";

interface NavbarProps {
  activeSection?: string;
}

export default function Navbar({ activeSection = "home" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 font-mono select-none ${
      scrolled ? "bg-black/10 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <Cpu className="w-5 h-5 text-[#ff6b00] transition-transform group-hover:rotate-90 duration-300" />
          <span className="font-extrabold text-base tracking-widest text-white">
            INDUS<span className="text-[#ff6b00]">.</span>
          </span>
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-wider uppercase">
          <a 
            href="#" 
            className={`relative py-1 transition-all duration-300 ${activeSection === "home" ? "text-white" : "text-white/40 hover:text-white"}`}
          >
            HOME
            {activeSection === "home" && (
              <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-white rounded-full" />
            )}
          </a>
          <a 
            href="#about" 
            className={`relative py-1 transition-all duration-300 ${activeSection === "about" ? "text-white" : "text-white/40 hover:text-white"}`}
          >
            ABOUT
            {activeSection === "about" && (
              <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-white rounded-full" />
            )}
          </a>
          <a 
            href="#product" 
            className={`relative py-1 transition-all duration-300 ${activeSection === "product" ? "text-white" : "text-white/40 hover:text-white"}`}
          >
            PRODUCT
            {activeSection === "product" && (
              <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-white rounded-full" />
            )}
          </a>
          <a 
            href="#specs" 
            className={`relative py-1 transition-all duration-300 ${activeSection === "specs" ? "text-white" : "text-white/40 hover:text-white"}`}
          >
            SPECIFICATION
            {activeSection === "specs" && (
              <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-white rounded-full" />
            )}
          </a>
          <a 
            href="#services" 
            className={`relative py-1 transition-all duration-300 ${activeSection === "services" ? "text-white" : "text-white/40 hover:text-white"}`}
          >
            SERVICES
            {activeSection === "services" && (
              <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-white rounded-full" />
            )}
          </a>
        </div>

        {/* CONNECT CTA */}
        <div>
          <a
            href="#quote"
            className="inline-flex items-center justify-center px-5 py-2 text-[10px] uppercase font-bold tracking-widest text-white bg-[#ff6b00] border border-[#ff6b00] hover:bg-transparent hover:text-white transition-all duration-300 rounded-sm"
          >
            CONNECT
          </a>
        </div>
      </div>
    </nav>
  );
}
