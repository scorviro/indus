"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
// High-performance ChevronRight SVG component
const ChevronRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollContainerProps {
  images: HTMLImageElement[];
  loadingComplete: boolean;
  activeSection: "home" | "about" | "product" | "specs" | "services" | "quote";
  onSectionChange?: (section: "home" | "about" | "product" | "specs" | "services") => void;
}

const TOTAL_FRAMES = 960;

// High-performance debounce utility
const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export default function ScrollContainer({ images, loadingComplete, activeSection, onSectionChange }: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // References to keep track of frame values and active section
  const activeFrameRef = useRef(0);
  const renderedFrameRef = useRef(-1);
  const prevSectionRef = useRef<"home" | "about" | "product" | "specs" | "services">("home");
  const dimensionsRef = useRef<{
    drawWidth: number;
    drawHeight: number;
    drawX: number;
    drawY: number;
  }>({ drawWidth: 0, drawHeight: 0, drawX: 0, drawY: 0 });

  // Render frame 0 immediately once images are loaded so that
  // the user sees the machine model behind the preloader sliding doors.
  useEffect(() => {
    if (images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[0];
    if (!img) return;

    const renderInitialFrame = () => {
      if (!img.complete || img.naturalWidth === 0) {
        // Retry when fully loaded
        img.onload = renderInitialFrame;
        return;
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

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

    renderInitialFrame();
  }, [images]);

  // Keep prevSectionRef in sync with parent activeSection to prevent scroll direction mismatches
  useEffect(() => {
    if (activeSection === "home" || activeSection === "about" || activeSection === "product" || activeSection === "specs" || activeSection === "services") {
      prevSectionRef.current = activeSection;
    }
  }, [activeSection]);

  useGSAP(
    () => {
      if (!loadingComplete) return;
      if (images.length === 0 || !canvasRef.current || !containerRef.current || !canvasViewportRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Handle window resize for cover scaling
      const resizeCanvas = (width: number, height: number) => {
        canvas.width = width;
        canvas.height = height;

        const firstImg = images[0];
        if (firstImg) {
          const imgWidth = firstImg.naturalWidth || firstImg.width || 1920;
          const imgHeight = firstImg.naturalHeight || firstImg.height || 1080;
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

          dimensionsRef.current = { drawWidth, drawHeight, drawX, drawY };
        }

        renderFrame(activeFrameRef.current);
        renderedFrameRef.current = activeFrameRef.current;
      };

      // Draw active image frame centered with aspect ratio "cover"
      const renderFrame = (index: number) => {
        const img = images[index];
        if (!img || !ctx) return;

        const { drawWidth, drawHeight, drawX, drawY } = dimensionsRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      };

      let isFirstResize = true;
      const debouncedResize = debounce((width: number, height: number) => {
        resizeCanvas(width, height);
      }, 32);

      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          if (isFirstResize) {
            isFirstResize = false;
            resizeCanvas(width, height);
          } else {
            debouncedResize(width, height);
          }
        }
      });

      if (canvasViewportRef.current) {
        resizeObserver.observe(canvasViewportRef.current);
      }

      let isLoopActive = true;
      const tick = () => {
        if (!isLoopActive) return;
        
        // Perform draw operations only if the index state has scrolled to a new frame
        if (activeFrameRef.current !== renderedFrameRef.current) {
          renderFrame(activeFrameRef.current);
          renderedFrameRef.current = activeFrameRef.current;
        }
        
        requestAnimationFrame(tick);
      };

      // Trigger decoupled animation loop
      requestAnimationFrame(tick);

      // Configure ScrollTrigger to purely update mutable values
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          const frameIndex = Math.min(
            Math.floor(self.progress * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
          );
          activeFrameRef.current = frameIndex;
          
          // Deduplicated Section State Engine
          let currentSection: "home" | "about" | "product" | "specs" | "services" = "home";
          const p = self.progress;
          if (p >= 0.25) currentSection = "about";

          if (prevSectionRef.current !== currentSection) {
            prevSectionRef.current = currentSection;
            onSectionChange?.(currentSection);
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
      const specsLeftOverlay = containerRef.current.querySelector(".left-gradient-overlay");

      if (specsWrapper && specsContent && specsLeftOverlay) {
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
          .to(specsLeftOverlay, { opacity: 1, ease: "sine.out" }, 0)
          .fromTo(
            specsElements,
            { opacity: 0, x: -55 },
            { opacity: 1, x: 0, stagger: 0.05, ease: "power1.out" },
            0.05
          )
          .fromTo(
            specsUnderline,
            { scaleX: 0 },
            { scaleX: 1, ease: "sine.out", transformOrigin: "left center" },
            0.1
          );

        // Fade out Section 3 content & overlay near the very end of scroll (slide left exit)
        gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top+=92% top",
            end: "top+=98% top",
            scrub: true,
          }
        })
          .to(specsWrapper, { opacity: 0, x: -150, ease: "sine.in" }, 0)
          .to(specsLeftOverlay, { opacity: 0, ease: "sine.in" }, 0);
      }

      // Initial render once images are ready
      renderFrame(0);
      renderedFrameRef.current = 0;

      return () => {
        isLoopActive = false;
        resizeObserver.disconnect();
      };
    },
    { dependencies: [images, loadingComplete] }
  );

  return (
    <div ref={containerRef} className="relative bg-[#050505] w-full min-h-[750vh]">
      {/* Anchor Helpers for Navigation */}
      <div id="home" className="absolute top-0 left-0 w-px h-px pointer-events-none" />
      <div id="about" className="absolute top-[180vh] left-0 w-px h-px pointer-events-none" />

      {/* Canvas Viewport (Fixed Background) */}
      <div ref={canvasViewportRef} className="fixed top-0 left-0 w-full h-screen overflow-hidden z-0 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ willChange: "transform", transform: "translate3d(0, 0, 0)", imageRendering: "crisp-edges" }}
        />

        {/* Split layout gradient overlay LEFT (Home section) */}
        <div className="left-gradient-overlay absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent w-full md:w-[50%] pointer-events-none" />

        {/* Split layout gradient overlay RIGHT (About section & Specs section) */}
        <div className="right-gradient-overlay absolute inset-0 bg-gradient-to-l from-[#050505] via-[#050505]/95 to-transparent w-full md:w-[50%] right-0 left-auto pointer-events-none opacity-0" />

        {/* Subtle Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/30 via-transparent to-[#050505]/30 pointer-events-none" />
      </div>

      {/* Fixed Viewport Container for overlay sections */}
      <div className="fixed inset-0 w-full h-screen z-10 pointer-events-none select-none">
        {/* Section 1: Home (Left Aligned) */}
        <div className="hero-section-wrapper absolute inset-0 flex items-center px-6 md:px-24 pointer-events-auto">
          <div className="section-content max-w-[450px] space-y-5">
            {/* Heading */}
            <h1 className="animate-item text-[54px] md:text-[80px] font-bebas text-white leading-[0.95] tracking-tight flex flex-col font-normal">
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
                href="#product"
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
          <div className="about-content max-w-[500px] space-y-5 text-right flex flex-col items-end">
            {/* Label */}
            <div className="about-animate flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#ff6b00] uppercase font-bold">
                WHO WE ARE
              </span>
              <span className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-pulse" />
            </div>

            {/* Heading */}
            <h2 className="about-animate text-[54px] md:text-[80px] font-bebas text-white leading-[0.95] tracking-tight flex flex-col font-normal text-right">
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

        {/* Section 3: Engineering Excellence (Left Aligned, 66% -> 100% Scroll Progress) */}
        <div className="specs-section-wrapper absolute inset-0 flex items-center justify-start px-6 md:px-24 pointer-events-auto opacity-0">
          <div className="specs-content max-w-[420px] space-y-3 text-left flex flex-col items-start pt-20">
            {/* Label */}
            <div className="specs-animate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#ff6b00] uppercase font-bold">
                WHY NEXUS
              </span>
            </div>

            {/* Heading */}
            <h2 className="specs-animate text-[54px] md:text-[80px] font-bebas text-white leading-[0.95] tracking-tight flex flex-col font-normal text-left">
              <span>ENGINEERING</span>
              <span className="relative inline-block w-fit">
                EXCELLENCE
                <span className="specs-underline absolute -bottom-1 left-0 w-full h-[3px] bg-[#ff6b00] rounded-sm scale-x-0" />
              </span>
            </h2>

            {/* Description */}
            <p className="specs-animate text-[#b5b5b5] text-[11px] md:text-xs leading-normal font-sans font-medium text-left max-w-[380px]">
              Every NEXUS machine is engineered to maximize productivity, precision, and long-term reliability. From high-speed spindle systems to intelligent CNC controls, every component is optimized for performance.
            </p>

            {/* Feature Grid -> 2x2 Grid Layout matching Section 2 with expandable cards */}
            <div className="specs-animate grid grid-cols-2 gap-3 w-full pt-1 text-left">
              {/* Card 01 */}
              <div
                onClick={() => setExpandedCard(expandedCard === 0 ? null : 0)}
                className="group border border-white/10 bg-white/5 py-3 px-4 rounded-md backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20 select-none"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <div className="text-xl md:text-2xl font-bebas text-[#ff6b00] leading-none uppercase">12,000 RPM</div>
                    <div className="text-[9px] font-mono tracking-wider text-slate-400 uppercase leading-none">Spindle Speed</div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono select-none transition-transform duration-300 group-hover:text-white pt-1">
                    {expandedCard === 0 ? "−" : "+"}
                  </span>
                </div>
                <div className={`grid transition-all duration-300 ease-in-out ${expandedCard === 0 ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                  }`}>
                  <div className="overflow-hidden">
                    <p className="text-[9px] md:text-[9.5px] text-[#b5b5b5] leading-normal font-sans font-medium pt-1.5 border-t border-white/5">
                      Advanced auto-balancing technology for maximum cutting performance and superior finish.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 02 */}
              <div
                onClick={() => setExpandedCard(expandedCard === 1 ? null : 1)}
                className="group border border-white/10 bg-white/5 py-3 px-4 rounded-md backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20 select-none"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <div className="text-xl md:text-2xl font-bebas text-[#ff6b00] leading-none uppercase">5-Axis</div>
                    <div className="text-[9px] font-mono tracking-wider text-slate-400 uppercase leading-none">Precision System</div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono select-none transition-transform duration-300 group-hover:text-white pt-1">
                    {expandedCard === 1 ? "−" : "+"}
                  </span>
                </div>
                <div className={`grid transition-all duration-300 ease-in-out ${expandedCard === 1 ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                  }`}>
                  <div className="overflow-hidden">
                    <p className="text-[9px] md:text-[9.5px] text-[#b5b5b5] leading-normal font-sans font-medium pt-1.5 border-t border-white/5">
                      Continuous multi-axis control designed for complex geometries and high-accuracy applications.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 03 */}
              <div
                onClick={() => setExpandedCard(expandedCard === 2 ? null : 2)}
                className="group border border-white/10 bg-white/5 py-3 px-4 rounded-md backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20 select-none"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <div className="text-xl md:text-2xl font-bebas text-[#ff6b00] leading-none uppercase">Integrated</div>
                    <div className="text-[9px] font-mono tracking-wider text-slate-400 uppercase leading-none">Smart CNC Control</div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono select-none transition-transform duration-300 group-hover:text-white pt-1">
                    {expandedCard === 2 ? "−" : "+"}
                  </span>
                </div>
                <div className={`grid transition-all duration-300 ease-in-out ${expandedCard === 2 ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                  }`}>
                  <div className="overflow-hidden">
                    <p className="text-[9px] md:text-[9.5px] text-[#b5b5b5] leading-normal font-sans font-medium pt-1.5 border-t border-white/5">
                      Seamless FANUC and Siemens integration with real-time feedback and process optimization.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 04 */}
              <div
                onClick={() => setExpandedCard(expandedCard === 3 ? null : 3)}
                className="group border border-white/10 bg-white/5 py-3 px-4 rounded-md backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20 select-none"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <div className="text-xl md:text-2xl font-bebas text-[#ff6b00] leading-none uppercase">24 Tools</div>
                    <div className="text-[9px] font-mono tracking-wider text-slate-400 uppercase leading-none">Auto Tool Changer</div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono select-none transition-transform duration-300 group-hover:text-white pt-1">
                    {expandedCard === 3 ? "−" : "+"}
                  </span>
                </div>
                <div className={`grid transition-all duration-300 ease-in-out ${expandedCard === 3 ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                  }`}>
                  <div className="overflow-hidden">
                    <p className="text-[9px] md:text-[9.5px] text-[#b5b5b5] leading-normal font-sans font-medium pt-1.5 border-t border-white/5">
                      Ultra-fast 1.2-second tool change cycles to maximize spindle runtime and throughput.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="specs-animate pt-2 w-full flex justify-start">
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
