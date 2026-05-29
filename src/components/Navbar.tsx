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
      scrolled ? "bg-[#050505]/40 backdrop-blur-md border-b border-white/5" : "bg-transparent"
    } py-6`}>
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
            className={`group relative py-1 transition-all duration-300 ${activeSection === "home" ? "text-white" : "text-white/40 hover:text-white"}`}
          >
            HOME
            <span className={`absolute -bottom-1 left-0 w-full h-[1.5px] rounded-full transition-transform duration-300 origin-left ${
              activeSection === "home" 
                ? "bg-white scale-x-100" 
                : "bg-[#ff6b00] scale-x-0 group-hover:scale-x-100"
            }`} />
          </a>
          <a 
            href="#about" 
            className={`group relative py-1 transition-all duration-300 ${activeSection === "about" ? "text-white" : "text-white/40 hover:text-white"}`}
          >
            ABOUT
            <span className={`absolute -bottom-1 left-0 w-full h-[1.5px] rounded-full transition-transform duration-300 origin-left ${
              activeSection === "about" 
                ? "bg-white scale-x-100" 
                : "bg-[#ff6b00] scale-x-0 group-hover:scale-x-100"
            }`} />
          </a>
          <a 
            href="#product" 
            className={`group relative py-1 transition-all duration-300 ${activeSection === "product" ? "text-white" : "text-white/40 hover:text-white"}`}
          >
            PRODUCT
            <span className={`absolute -bottom-1 left-0 w-full h-[1.5px] rounded-full transition-transform duration-300 origin-left ${
              activeSection === "product" 
                ? "bg-white scale-x-100" 
                : "bg-[#ff6b00] scale-x-0 group-hover:scale-x-100"
            }`} />
          </a>
          <a 
            href="#specs" 
            className={`group relative py-1 transition-all duration-300 ${activeSection === "specs" ? "text-white" : "text-white/40 hover:text-white"}`}
          >
            SPECIFICATION
            <span className={`absolute -bottom-1 left-0 w-full h-[1.5px] rounded-full transition-transform duration-300 origin-left ${
              activeSection === "specs" 
                ? "bg-white scale-x-100" 
                : "bg-[#ff6b00] scale-x-0 group-hover:scale-x-100"
            }`} />
          </a>
          <a 
            href="#services" 
            className={`group relative py-1 transition-all duration-300 ${activeSection === "services" ? "text-white" : "text-white/40 hover:text-white"}`}
          >
            SERVICES
            <span className={`absolute -bottom-1 left-0 w-full h-[1.5px] rounded-full transition-transform duration-300 origin-left ${
              activeSection === "services" 
                ? "bg-white scale-x-100" 
                : "bg-[#ff6b00] scale-x-0 group-hover:scale-x-100"
            }`} />
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
