"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useFramePreloader } from "@/hooks/useFramePreloader";
import Preloader from "@/components/Preloader";
import ScrollContainer from "@/components/ScrollContainer";
import Navbar from "@/components/Navbar";
import ProductSection from "@/components/ProductSection";
import SpecsSection from "@/components/SpecsSection";
import ServicesSection from "@/components/ServicesSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const { images, progress, isReady } = useFramePreloader();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [activeSection, setActiveSection] = useState<"home" | "about" | "product" | "specs" | "services" | "quote">("home");
  const [startTransition, setStartTransition] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setStartTransition(true);
    }
  }, [progress]);

  useEffect(() => {
    if (!loadingComplete) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      return;
    }

    // Reset scroll to top before initializing Lenis and ScrollTrigger
    window.scrollTo(0, 0);
    document.body.style.overflow = "";
    document.body.style.height = "";

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Intercept anchor clicks for smooth scrolling via Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const targetLink = (e.target as HTMLElement).closest("a");
      if (!targetLink) return;

      const href = targetLink.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        
        const targetId = href === "#" ? "home" : href.substring(1);
        const targetEl = document.getElementById(targetId);
        
        if (targetEl) {
          let offset = 0;
          if (targetId === "services") {
            offset = -120; // Scroll 120px further down to center the technical quote form
          } else if (targetId === "quote") {
            offset = 80;  // Stop 80px above the quote form to account for the navbar
          } else if (targetId === "product" || targetId === "specs") {
            offset = 80;  // Stop 80px above to account for the sticky navbar height
          }

          lenis.scrollTo(targetEl, {
            offset: offset,
            duration: 1.8,
            immediate: false,
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { passive: false });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [loadingComplete]);

  // Set up ScrollTriggers for tracking active section in navigation
  useGSAP(
    () => {
      if (!loadingComplete) return;

      ScrollTrigger.create({
        trigger: "#product",
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) setActiveSection("product");
        },
      });

      ScrollTrigger.create({
        trigger: "#specs",
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) setActiveSection("specs");
        },
      });

      ScrollTrigger.create({
        trigger: "#services",
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) setActiveSection("services");
        },
      });
    },
    { dependencies: [loadingComplete] }
  );

  const experienceMounted = isReady || progress >= 100;

  return (
    <div className={`relative w-full bg-[#050505] text-white selection:bg-[#FF5500] selection:text-white ${
      loadingComplete ? "min-h-screen overflow-x-hidden" : "h-screen overflow-hidden"
    }`}>
      {/* Premium Preloader */}
      <Preloader 
        progress={progress} 
        onComplete={() => setLoadingComplete(true)} 
      />

      {/* Main Experience (rendered once preloading finishes) */}
      {experienceMounted && (
        <div 
          className={
            loadingComplete
              ? "w-full"
              : `w-full transition-all duration-[1400ms] ease-out origin-center ${
                  startTransition 
                    ? "opacity-100 blur-none scale-100" 
                    : "opacity-0 blur-[40px] scale-[0.96]"
                }`
          }
        >
          {/* White Glowing Light Leak / Transition Overlay */}
          {!loadingComplete && (
            <div 
              className={`fixed inset-0 bg-white z-40 pointer-events-none transition-all duration-[1400ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
                startTransition ? "opacity-0 blur-[30px]" : "opacity-100 blur-[5px]"
              }`} 
            />
          )}

          <Navbar activeSection={activeSection} />
          <main className="w-full">
            <ScrollContainer
              images={images}
              loadingComplete={loadingComplete}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
            <ProductSection />
            <SpecsSection />
            <ServicesSection />
          </main>
        </div>
      )}
    </div>
  );
}

