// src/stores/perfStore.ts
import { create } from 'zustand';

interface PerfState {
  /** true when PerformanceMonitor has detected a sustained FPS drop */
  declined: boolean;
  /** the current DPR factor */
  dprFactor: number;
  /** timestamp of last performance change to implement debouncing */
  lastChangeTime: number;
  /** debounce timeout ID for performance changes */
  debounceTimeoutId: number | null;
  /** mark performance as declined (e.g. hide heavy meshes) */
  setDeclined: (declined: boolean) => void;
  /** update the current DPR factor with debouncing */
  setDprFactor: (factor: number) => void;
  /** reset performance state */
  reset: () => void;
}

const DEBOUNCE_DELAY = 2000; // 2 seconds debounce
const MIN_FACTOR_CHANGE = 0.15; // Minimum change to trigger update

export const usePerfStore = create<PerfState>((set, get) => ({
  declined: false,
  dprFactor: 1,
  lastChangeTime: 0,
  debounceTimeoutId: null,

  setDeclined: declined => {
    const current = get().declined;
    const now = Date.now();

    // Debounce declined changes to prevent rapid oscillation
    if (current !== declined && now - get().lastChangeTime > DEBOUNCE_DELAY) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[perfStore] declined →', declined);
      }
      set({ declined, lastChangeTime: now });
    }
  },

  setDprFactor: dprFactor => {
    const current = get().dprFactor;
    const change = Math.abs(current - dprFactor);

    // Only update if change is significant enough
    if (change < MIN_FACTOR_CHANGE) return;

    // Clear existing timeout
    const timeoutId = get().debounceTimeoutId;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Debounce factor changes to prevent jitter
    const newTimeoutId = window.setTimeout(() => {
      const now = Date.now();
      if (process.env.NODE_ENV !== 'production') {
        console.log('[perfStore] dprFactor →', dprFactor, `(change: ${change.toFixed(2)})`);
      }
      set({
        dprFactor,
        lastChangeTime: now,
        debounceTimeoutId: null,
      });
    }, DEBOUNCE_DELAY);

    set({ debounceTimeoutId: newTimeoutId });
  },

  reset: () => {
    const timeoutId = get().debounceTimeoutId;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    set({
      declined: false,
      dprFactor: 1,
      lastChangeTime: 0,
      debounceTimeoutId: null,
    });
  },
}));
