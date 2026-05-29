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

  const loadNextBatch = () => {
    if (nextToLoad > TOTAL_FRAMES) return;

    const currentBatchEnd = Math.min(nextToLoad + BATCH_SIZE - 1, TOTAL_FRAMES);
    const batchLength = currentBatchEnd - nextToLoad + 1;
    let batchLoaded = 0;

    for (let i = nextToLoad; i <= currentBatchEnd; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      globalImages[i - 1] = img;

      const handleImageLoad = () => {
        loadedCount++;
        batchLoaded++;
        
        globalProgress = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        if (loadedCount === TOTAL_FRAMES) {
          globalIsReady = true;
        }

        // Notify all active hooks
        globalCallbacks.forEach((cb) => cb(globalProgress, globalIsReady));

        if (batchLoaded === batchLength) {
          nextToLoad = currentBatchEnd + 1;
          setTimeout(loadNextBatch, 5);
        }
      };

      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Ensure broken loads don't block progress
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
    };
  }, []);

  return {
    images: globalImages,
    progress,
    isReady
  };
}
