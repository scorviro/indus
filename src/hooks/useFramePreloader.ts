"use client";

import { useEffect, useState } from "react";

const TOTAL_FRAMES = 960;
const BATCH_SIZE = 50; // Smaller batches are safer for mobile memory

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

  let loadedCount = 0;
  let nextToLoad = 1;
  const imageSuccess = new Uint8Array(TOTAL_FRAMES);

  const loadNextBatch = () => {
    if (nextToLoad > TOTAL_FRAMES) return;

    const currentBatchEnd = Math.min(nextToLoad + BATCH_SIZE - 1, TOTAL_FRAMES);
    const batchLength = currentBatchEnd - nextToLoad + 1;
    let batchLoaded = 0;

    for (let i = nextToLoad; i <= currentBatchEnd; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      globalImages[i - 1] = img;
      activeRequests.push(img);

      const handleImageLoad = () => {
        loadedCount++;
        batchLoaded++;
        
        // Restrict executions of state notification to progress % 15 or loop completion
        if (loadedCount % 15 === 0 || loadedCount === TOTAL_FRAMES) {
          globalProgress = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
          globalCallbacks.forEach((cb) => cb(globalProgress, globalIsReady));
        }

        if (loadedCount === TOTAL_FRAMES) {
          // Resolve broken frames by replacing them with the nearest valid frame
          for (let j = 0; j < TOTAL_FRAMES; j++) {
            if (imageSuccess[j] === 0) {
              let nearestIndex = -1;
              let minDist = Infinity;
              
              // Search backwards
              for (let k = j - 1; k >= 0; k--) {
                if (imageSuccess[k] === 1) {
                  nearestIndex = k;
                  minDist = j - k;
                  break;
                }
              }
              
              // Search forwards
              for (let k = j + 1; k < TOTAL_FRAMES; k++) {
                if (imageSuccess[k] === 1) {
                  const dist = k - j;
                  if (dist < minDist) {
                    nearestIndex = k;
                  }
                  break;
                }
              }
              
              if (nearestIndex !== -1) {
                globalImages[j] = globalImages[nearestIndex];
              }
            }
          }
          globalIsReady = true;
          // Notify listeners of the final loaded status
          globalCallbacks.forEach((cb) => cb(globalProgress, globalIsReady));
        }

        if (batchLoaded === batchLength) {
          nextToLoad = currentBatchEnd + 1;
          setTimeout(loadNextBatch, 5);
        }
      };

      img.onload = () => {
        imageSuccess[i - 1] = 1;
        // Explicitly clear listener references to prevent GC build-up
        img.onload = null;
        img.onerror = null;
        
        const idx = activeRequests.indexOf(img);
        if (idx > -1) {
          activeRequests.splice(idx, 1);
        }

        queueMicrotask(handleImageLoad);
      };
      
      img.onerror = () => {
        // Explicitly clear listener references to prevent GC build-up
        img.onload = null;
        img.onerror = null;

        const idx = activeRequests.indexOf(img);
        if (idx > -1) {
          activeRequests.splice(idx, 1);
        }

        queueMicrotask(handleImageLoad);
      }; // Ensure broken loads don't block progress
    }
  };

  loadNextBatch();
};

export function useFramePreloader() {
  const [progress, setProgress] = useState(globalProgress);
  const [isReady, setIsReady] = useState(globalIsReady);

  useEffect(() => {
    // Start global loading if it hasn't run yet
    startGlobalLoading();

    // Register update callback
    const handleUpdate = (newProgress: number, ready: boolean) => {
      setProgress(newProgress);
      setIsReady(ready);
    };

    globalCallbacks.add(handleUpdate);

    // If already loaded, trigger state update immediately
    if (globalIsReady) {
      setProgress(100);
      setIsReady(true);
    }

    return () => {
      globalCallbacks.delete(handleUpdate);

      // Cancel and nullify all listeners if no more active hooks are listening mid-load
      if (!globalIsReady && globalCallbacks.size === 0) {
        activeRequests.forEach((img) => {
          img.onload = null;
          img.onerror = null;
          img.src = ""; // Stops pending browser network stream downloads immediately
        });
        activeRequests = [];
        globalLoadingStarted = false;
      }
    };
  }, []);

  return {
    images: globalImages,
    progress,
    isReady
  };
}
