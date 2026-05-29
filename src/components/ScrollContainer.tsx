"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Settings, Compass, Cpu, RefreshCw, ChevronRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollContainerProps {
  images: HTMLImageElement[];
  onSectionChange?: (section: "home" | "about" | "product" | "specs" | "services") => void;
}

const TOTAL_FRAMES = 960;

export default function ScrollContainer({ images, onSectionChange }: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);

  // Reference to keep track of active frame in animation loop
  const activeFrameRef = useRef(0);

  useGSAP(
    () => {
      if (images.length === 0 || !canvasRef.current || !containerRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Handle window resize for cover scaling
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(activeFrameRef.current);
      };

      // Helper to check if image is fully loaded and not broken
      const isValidImage = (img: HTMLImageElement) => {
        return img && img.complete && img.naturalWidth > 0;
      };

      // Draw active image frame centered with aspect ratio "cover"
      const renderFrame = (index: number) => {
        let img = images[index];
        if (!img) return;

        // Fallback: If current frame is not fully loaded or broken, 
        // search for the nearest valid frame in the array to avoid crash
        if (!isValidImage(img)) {
          let found = false;
          // Search backwards first
          for (let i = index - 1; i >= 0; i--) {
            if (isValidImage(images[i])) {
              img = images[i];
              found = true;
              break;
            }
          }
          // If still not found, search forwards
          if (!found) {
            for (let i = index + 1; i < images.length; i++) {
              if (isValidImage(images[i])) {
                img = images[i];
                found = true;
                break;
              }
            }
          }
          // If absolutely no valid images are available, return
          if (!found || !isValidImage(img)) return;
        }

        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        const imgWidth = img.naturalWidth || img.width || 1920;
        const imgHeight = img.naturalHeight || img.height || 1080;
        const imgRatio = imgWidth / imgHeight;
        const canvasRatio = width / height;

        let drawWidth, drawHeight, drawX, drawY;

        if (canvasRatio > imgRatio) {
          drawWidth = width;
          drawHeight = width / imgRatio;
          drawX = 0;
          drawY = (height - drawHeight) / 2;
        } else {
          drawWidth = height * imgRatio;
          drawHeight = height;
          drawX = (width - drawWidth) / 2;
          drawY = 0;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      };

      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      // GSAP ScrollTrigger to scrub frames
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8, // Fluid lag for slower, premium feel
          onUpdate: (self) => {
            // Calculate active frame index
            const progress = self.progress;
            const frameIndex = Math.min(
              Math.floor(progress * (TOTAL_FRAMES - 1)),
              TOTAL_FRAMES - 1
            );
            activeFrameRef.current = frameIndex;
            setActiveFrame(frameIndex);
            renderFrame(frameIndex);

            // Update active section based on scroll progress
            if (progress < 0.25) {
              onSectionChange?.("home");
            } else if (progress >= 0.25 && progress < 0.60) {
              onSectionChange?.("about");
            } else if (progress >= 0.60 && progress < 0.75) {
              onSectionChange?.("product");
            } else if (progress >= 0.75 && progress < 0.90) {
              onSectionChange?.("specs");
            } else {
              onSectionChange?.("services");
            }
          }
        }
      });

      // Stagger animate the Hero section content on load
      const heroWrapper = containerRef.current.querySelector(".hero-section-wrapper");
      const heroContent = containerRef.current.querySelector(".section-content");
      if (heroWrapper && heroContent) {
        const elements = heroContent.querySelectorAll(".animate-item");
        gsap.fromTo(
          elements,
          { opacity: 0, x: -80 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
          }
        );

        // Fade out the hero wrapper on scroll and slide it to the left (wave disappearance)
        gsap.to(heroWrapper, {
          opacity: 0,
          x: -150,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "top+=25% top",
            scrub: true,
          }
        });
      }

      // Animate heading's underline width scaling
      const underline = containerRef.current.querySelector(".heading-underline");
      if (underline) {
        gsap.fromTo(
          underline,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            delay: 0.8,
            ease: "power2.out",
            transformOrigin: "left center"
          }
        );
      }

      // Fade out the left gradient overlay on scroll so it doesn't cover the machine model as it transitions
      const leftOverlay = containerRef.current.querySelector(".left-gradient-overlay");
      if (leftOverlay) {
        gsap.to(leftOverlay, {
          opacity: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "top+=25% top",
            scrub: true,
          }
        });
      }

      // Section 2 (About) Scroll Animation
      const aboutWrapper = containerRef.current.querySelector(".about-section-wrapper");
      const aboutContent = containerRef.current.querySelector(".about-content");
      const rightOverlay = containerRef.current.querySelector(".right-gradient-overlay");

      if (aboutWrapper && aboutContent && rightOverlay) {
        const aboutElements = aboutContent.querySelectorAll(".about-animate");
        const aboutUnderline = aboutContent.querySelector(".about-underline");

        // Fade in Section 2 content & overlay (starts at 12.5% scroll, when Home is 50% faded out)
        gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top+=12.5% top",
            end: "top+=38% top",
            scrub: true,
          }
        })
        .to(aboutWrapper, { opacity: 1, ease: "sine.out" }, 0)
        .to(rightOverlay, { opacity: 1, ease: "sine.out" }, 0)
        .fromTo(
          aboutElements,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, stagger: 0.05, ease: "power1.out" },
          0.05
        )
        .fromTo(
          aboutUnderline,
          { scaleX: 0 },
          { scaleX: 1, ease: "sine.out", transformOrigin: "right center" },
          0.1
        );

        // Fade out Section 2 content & overlay (slide right exit)
        gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top+=55% top",
            end: "top+=65% top",
            scrub: true,
          }
        })
        .to(aboutWrapper, { opacity: 0, x: 150, ease: "sine.in" }, 0)
        .to(rightOverlay, { opacity: 0, ease: "sine.in" }, 0);
      }

      // Section 3 (Engineering Excellence) Scroll Animation
      const specsWrapper = containerRef.current.querySelector(".specs-section-wrapper");
      const specsContent = containerRef.current.querySelector(".specs-content");

      if (specsWrapper && specsContent && leftOverlay) {
        const specsElements = specsContent.querySelectorAll(".specs-animate");
        const specsUnderline = specsContent.querySelector(".specs-underline");

        // Fade in Section 3 content & overlay (starts at 66% scroll)
        gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top+=66% top",
            end: "top+=76% top",
            scrub: true,
          }
        })
        .to(specsWrapper, { opacity: 1, ease: "sine.out" }, 0)
        .to(leftOverlay, { opacity: 1, ease: "sine.out" }, 0)
        .fromTo(
          specsElements,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, stagger: 0.05, ease: "power1.out" },
          0.05
        )
        .fromTo(
          specsUnderline,
          { scaleX: 0 },
          { scaleX: 1, ease: "sine.out", transformOrigin: "left center" },
          0.1
        );

        // Fade out Section 3 content & overlay near the very end of scroll (slide left wave exit)
        gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top+=92% top",
            end: "top+=98% top",
            scrub: true,
          }
        })
        .to(specsWrapper, { opacity: 0, x: -150, ease: "sine.in" }, 0)
        .to(leftOverlay, { opacity: 0, ease: "sine.in" }, 0);
      }

      // Initial render once images are ready
      renderFrame(0);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    },
    { dependencies: [images] }
  );

  return (
    <div ref={containerRef} className="relative bg-[#050505] w-full min-h-[750vh]">
      {/* Canvas Viewport (Fixed Background) */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-0 pointer-events-none">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        
        {/* Split layout gradient overlay LEFT (Home section) */}
        <div className="left-gradient-overlay absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent w-full md:w-[50%] pointer-events-none" />

        {/* Split layout gradient overlay RIGHT (About section) */}
        <div className="right-gradient-overlay absolute inset-0 bg-gradient-to-l from-[#050505] via-[#050505]/95 to-transparent w-full md:w-[50%] right-0 left-auto pointer-events-none opacity-0" />
        
        {/* Subtle Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/30 via-transparent to-[#050505]/30 pointer-events-none" />
      </div>

      {/* Fixed Viewport Container for overlay sections */}
      <div className="fixed inset-0 w-full h-screen z-10 pointer-events-none select-none">
        {/* Section 1: Home (Left Aligned) */}
        <div className="hero-section-wrapper absolute inset-0 flex items-center px-6 md:px-24 pointer-events-auto">
          <div className="section-content max-w-[450px] space-y-8">
            {/* Heading */}
            <h1 className="animate-item text-6xl md:text-8xl font-bebas text-white leading-[0.85] tracking-tight flex flex-col font-normal">
              <span>NEXUS</span>
              <span>ENGINEERED</span>
              <span className="relative inline-block w-fit">
                SOLUTIONS
                <span className="heading-underline absolute -bottom-1 left-0 w-full h-[3px] bg-[#ff6b00] rounded-sm scale-x-0" />
              </span>
            </h1>

            {/* Description */}
            <p className="animate-item text-[#b5b5b5] text-sm md:text-base leading-relaxed font-sans font-medium">
              NEXUS delivers world-class Vertical Machining Centers built for industries that demand zero compromise — aerospace, automotive, defence, and heavy engineering.
            </p>

            {/* CTA Button */}
            <div className="animate-item pt-2">
              <a 
                href="#quote" 
                className="inline-flex items-center justify-center px-8 py-4 bg-[#ff6b00] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-md hover:bg-[#e05e00] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ff6b00]/25 active:translate-y-0 active:scale-[0.98] transition-all duration-300"
              >
                EXPLORE MACHINES
              </a>
            </div>

            {/* Stats Row */}
            <div className="animate-item grid grid-cols-3 gap-4 pt-8 border-t border-zinc-900/60">
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-bebas text-[#ff6b00] leading-none">500+</div>
                <div className="text-[9px] font-mono tracking-wider text-[#b5b5b5] uppercase">
                  Units Installed
                </div>
              </div>
              <div className="border-l border-zinc-900/80 pl-4 space-y-1">
                <div className="text-3xl md:text-4xl font-bebas text-[#ff6b00] leading-none">20+</div>
                <div className="text-[9px] font-mono tracking-wider text-[#b5b5b5] uppercase">
                  Years Exp
                </div>
              </div>
              <div className="border-l border-zinc-900/80 pl-4 space-y-1">
                <div className="text-3xl md:text-4xl font-bebas text-[#ff6b00] leading-none">50+</div>
                <div className="text-[9px] font-mono tracking-wider text-[#b5b5b5] uppercase">
                  Countries
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 font-mono text-[9px] tracking-widest text-[#b5b5b5] animate-bounce">
            <span>SCROLL TO OPERATE MACHINE</span>
            <span className="w-1 h-3 bg-zinc-800 rounded-full relative overflow-hidden">
              <span className="absolute top-0 left-0 w-full h-1 bg-[#ff6b00] rounded-full animate-pulse" />
            </span>
          </div>
        </div>

        {/* Section 2: About (Right Aligned) */}
        <div className="about-section-wrapper absolute inset-0 flex items-center justify-end px-6 md:px-24 pointer-events-auto opacity-0">
          <div className="about-content max-w-[500px] space-y-8 text-right flex flex-col items-end">
            {/* Label */}
            <div className="about-animate flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#ff6b00] uppercase font-bold">
                WHO WE ARE
              </span>
              <span className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-pulse" />
            </div>

            {/* Heading */}
            <h2 className="about-animate text-6xl md:text-8xl font-bebas text-white leading-[0.85] tracking-tight flex flex-col font-normal text-right">
              <span>BUILT FOR</span>
              <span className="relative inline-block w-fit self-end">
                PERFECTION
                <span className="about-underline absolute -bottom-1 right-0 w-full h-[3px] bg-[#ff6b00] rounded-sm scale-x-0" />
              </span>
            </h2>

            {/* Description */}
            <p className="about-animate text-[#b5b5b5] text-xs md:text-sm leading-relaxed font-sans font-medium text-right max-w-[450px]">
              NEXUS is a leading manufacturer of advanced Vertical Machining Centers engineered for industries where precision, reliability, and performance are critical. Combining modern CNC technology with world-class engineering standards, we deliver high-accuracy machining solutions that help aerospace, automotive, defence, and heavy engineering manufacturers achieve superior productivity, tighter tolerances, and consistent results in the most demanding production environments.
            </p>

            {/* Highlight Cards */}
            <div className="about-animate grid grid-cols-2 gap-4 w-full pt-4">
              {/* Card 01 */}
              <div className="border border-zinc-900/80 bg-[#070707]/30 backdrop-blur-sm p-4 rounded-sm text-left border-l-2 border-l-[#ff6b00] space-y-1">
                <div className="text-2xl md:text-3xl font-bebas text-[#ff6b00] leading-none">±0.002mm</div>
                <div className="text-[9px] font-mono tracking-wider text-[#b5b5b5] uppercase">
                  Machining Tolerance
                </div>
              </div>
              {/* Card 02 */}
              <div className="border border-zinc-900/80 bg-[#070707]/30 backdrop-blur-sm p-4 rounded-sm text-left border-l-2 border-l-[#ff6b00] space-y-1">
                <div className="text-2xl md:text-3xl font-bebas text-[#ff6b00] leading-none">12,000 RPM</div>
                <div className="text-[9px] font-mono tracking-wider text-[#b5b5b5] uppercase">
                  Spindle Speed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Engineering Excellence (Left Aligned) */}
        <div className="specs-section-wrapper absolute inset-0 flex items-center justify-start px-6 md:px-24 pointer-events-auto opacity-0">
          <div className="specs-content max-w-[600px] space-y-4 text-left flex flex-col items-start pt-16 md:pt-20">
            {/* Label */}
            <div className="specs-animate flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#ff6b00] uppercase font-bold">
                WHY NEXUS
              </span>
            </div>

            {/* Heading */}
            <h2 className="specs-animate text-6xl md:text-8xl font-bebas text-white leading-[0.85] tracking-tight flex flex-col font-normal text-left">
              <span>ENGINEERING</span>
              <span className="relative inline-block w-fit">
                EXCELLENCE
                <span className="specs-underline absolute -bottom-1 left-0 w-full h-[3px] bg-[#ff6b00] rounded-sm scale-x-0" />
              </span>
            </h2>

            {/* Description */}
            <p className="specs-animate text-[#b5b5b5] text-xs md:text-sm leading-relaxed font-sans font-medium text-left max-w-[500px]">
              Every NEXUS machine is engineered to maximize productivity, precision, and long-term reliability. From high-speed spindle systems to intelligent CNC controls, every component is optimized to deliver superior machining performance in demanding industrial environments.
            </p>

            {/* Feature Grid */}
            <div className="specs-animate grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full pt-1">
              {/* Card 01 */}
              <div className="border border-zinc-900/80 bg-[#070707]/30 backdrop-blur-sm p-3.5 rounded-sm text-left border-l-2 border-l-[#ff6b00] space-y-1 transition-all duration-300 hover:border-zinc-800">
                <div className="text-xl md:text-2xl font-bebas text-[#ff6b00] leading-none uppercase">High Speed Spindle</div>
                <p className="text-[9.5px] md:text-[10px] text-[#b5b5b5] leading-relaxed font-sans font-medium">
                  12,000 RPM with advanced auto-balancing technology for maximum cutting performance, reduced vibration, and superior surface finish.
                </p>
              </div>

              {/* Card 02 */}
              <div className="border border-zinc-900/80 bg-[#070707]/30 backdrop-blur-sm p-3.5 rounded-sm text-left border-l-2 border-l-[#ff6b00] space-y-1 transition-all duration-300 hover:border-zinc-800">
                <div className="text-xl md:text-2xl font-bebas text-[#ff6b00] leading-none uppercase">5-Axis Precision</div>
                <p className="text-[9.5px] md:text-[10px] text-[#b5b5b5] leading-relaxed font-sans font-medium">
                  Advanced multi-axis machining capability designed for complex geometries, intricate parts, and high-accuracy manufacturing applications.
                </p>
              </div>

              {/* Card 03 */}
              <div className="border border-zinc-900/80 bg-[#070707]/30 backdrop-blur-sm p-3.5 rounded-sm text-left border-l-2 border-l-[#ff6b00] space-y-1 transition-all duration-300 hover:border-zinc-800">
                <div className="text-xl md:text-2xl font-bebas text-[#ff6b00] leading-none uppercase">Smart CNC Control</div>
                <p className="text-[9.5px] md:text-[10px] text-[#b5b5b5] leading-relaxed font-sans font-medium">
                  Seamless FANUC and Siemens controller integration with intelligent monitoring, process optimization, and real-time machine feedback.
                </p>
              </div>

              {/* Card 04 */}
              <div className="border border-zinc-900/80 bg-[#070707]/30 backdrop-blur-sm p-3.5 rounded-sm text-left border-l-2 border-l-[#ff6b00] space-y-1 transition-all duration-300 hover:border-zinc-800">
                <div className="text-xl md:text-2xl font-bebas text-[#ff6b00] leading-none uppercase">Auto Tool Changer</div>
                <p className="text-[9.5px] md:text-[10px] text-[#b5b5b5] leading-relaxed font-sans font-medium">
                  24-tool magazine system with ultra-fast 1.2-second tool changes, minimizing downtime and maximizing production efficiency.
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="specs-animate pt-4 w-full flex justify-start">
              <a 
                href="#specs" 
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#ff6b00] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-sm border border-[#ff6b00] hover:bg-transparent hover:text-[#ff6b00] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ff6b00]/25 active:translate-y-0 active:scale-[0.98] transition-all duration-300"
              >
                <span>REQUEST SPECIFICATIONS</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
