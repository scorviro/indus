"use client";

import { useEffect, useState } from "react";

const TOTAL_FRAMES = 960;

// Global cache to persist across React StrictMode remounts and hot reloads
const globalImages: HTMLImageElement[] = [];
let globalProgress = 0;
let globalIsReady = false;
let globalLoadingStarted = false;
const globalCallbacks: Set<(progress: number, ready: boolean) => void> = new Set();
let activeRequests: HTMLImageElement[] = [];

const getFramePath = (index: number) => {
  const frameNum = String(index).padStart(6, "0");
  return `/frames/frame_${frameNum}.webp`;
};

// Start loading frames globally once
const startGlobalLoading = () => {
  if (globalLoadingStarted) return;
  globalLoadingStarted = true;

  const tier1Indices: number[] = [];
  const tier2Indices: number[] = [];

  // Tier 1: Every 8th frame, plus the last frame to ensure smooth endpoint
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    if ((i - 1) % 8 === 0 || i === TOTAL_FRAMES) {
      tier1Indices.push(i);
    } else {
      tier2Indices.push(i);
    }
  }

  const totalTier1 = tier1Indices.length;
  let tier1LoadedCount = 0;

  // Pre-initialize globalImages array
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    globalImages[i] = null as unknown as HTMLImageElement;
  }

  const startTier2BackgroundLoading = () => {
    let nextIndex = 0;
    const totalTier2 = tier2Indices.length;

    const idleLoad = (deadline: IdleDeadline) => {
      while (nextIndex < totalTier2 && deadline.timeRemaining() > 1) {
        const frameNum = tier2Indices[nextIndex];
        nextIndex++;

        // Only load if not already loaded
        if (!globalImages[frameNum - 1]) {
          const img = new Image();
          img.src = getFramePath(frameNum);
          globalImages[frameNum - 1] = img;
          activeRequests.push(img);

          img.onload = () => {
            img.onload = null;
            img.onerror = null;
            const idx = activeRequests.indexOf(img);
            if (idx > -1) activeRequests.splice(idx, 1);
          };
          img.onerror = () => {
            img.onload = null;
            img.onerror = null;
            const idx = activeRequests.indexOf(img);
            if (idx > -1) activeRequests.splice(idx, 1);
          };
        }
      }

      if (nextIndex < totalTier2) {
        if (typeof requestIdleCallback !== "undefined") {
          requestIdleCallback(idleLoad);
        } else {
          setTimeout(() => {
            requestAnimationFrame(() => {
              const start = performance.now();
              idleLoad({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (performance.now() - start)),
              });
            });
          }, 50);
        }
      }
    };

    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(idleLoad);
    } else {
      setTimeout(() => {
        requestAnimationFrame(() => {
          const start = performance.now();
          idleLoad({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (performance.now() - start)),
          });
        });
      }, 50);
    }
  };

  const loadTier1 = () => {
    const BATCH_SIZE = 15;
    let nextIndex = 0;

    const loadNextBatch = () => {
      if (nextIndex >= totalTier1) {
        globalIsReady = true;
        globalProgress = 100;
        globalCallbacks.forEach((cb) => cb(globalProgress, globalIsReady));

        // Start loading Tier 2 frames in background
        startTier2BackgroundLoading();
        return;
      }

      const batchLimit = Math.min(nextIndex + BATCH_SIZE, totalTier1);
      let batchLoaded = 0;
      const batchSize = batchLimit - nextIndex;

      for (let k = nextIndex; k < batchLimit; k++) {
        const frameNum = tier1Indices[k];
        const img = new Image();
        img.src = getFramePath(frameNum);
        globalImages[frameNum - 1] = img;
        activeRequests.push(img);

        const handleLoad = () => {
          tier1LoadedCount++;
          batchLoaded++;

          if (tier1LoadedCount % 5 === 0 || tier1LoadedCount === totalTier1) {
            globalProgress = Math.floor((tier1LoadedCount / totalTier1) * 100);
            globalCallbacks.forEach((cb) => cb(globalProgress, globalIsReady));
          }

          img.onload = null;
          img.onerror = null;
          const idx = activeRequests.indexOf(img);
          if (idx > -1) activeRequests.splice(idx, 1);

          if (batchLoaded === batchSize) {
            nextIndex = batchLimit;
            setTimeout(loadNextBatch, 5);
          }
        };

        img.onload = handleLoad;
        img.onerror = handleLoad;
      }
    };

    loadNextBatch();
  };

  loadTier1();
};

export function useFramePreloader() {
  const [progress, setProgress] = useState(globalProgress);
  const [isReady, setIsReady] = useState(globalIsReady);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }

    startGlobalLoading();

    const handleUpdate = (newProgress: number, ready: boolean) => {
      setProgress(newProgress);
      setIsReady(ready);
    };

    globalCallbacks.add(handleUpdate);

    if (globalIsReady) {
      setProgress(100);
      setIsReady(true);
    }

    return () => {
      globalCallbacks.delete(handleUpdate);

      // Cancel/cleanup delayed to handle React StrictMode double-mounting safely
      setTimeout(() => {
        if (!globalIsReady && globalCallbacks.size === 0 && globalLoadingStarted) {
          activeRequests.forEach((img) => {
            img.onload = null;
            img.onerror = null;
            img.src = "";
          });
          activeRequests = [];
          globalLoadingStarted = false;
        }
      }, 50);
    };
  }, []);

  return {
    images: globalImages,
    progress,
    isReady,
  };
}

