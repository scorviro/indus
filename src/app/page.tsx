"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { useFramePreloader } from "@/hooks/useFramePreloader";
import Preloader from "@/components/Preloader";
import ScrollContainer from "@/components/ScrollContainer";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { images, progress, isReady } = useFramePreloader();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [activeSection, setActiveSection] = useState<"home" | "about" | "product" | "specs" | "services">("home");
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

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on("scroll", () => {
      // Allow GSAP ScrollTrigger to update
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [loadingComplete]);

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
            <ScrollContainer images={images} onSectionChange={setActiveSection} />
          </main>
        </div>
      )}
    </div>
  );
}
