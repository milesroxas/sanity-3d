// src/stores/perfStore.ts
import { create } from 'zustand';

interface PerfState {
  /** true when PerformanceMonitor has detected a sustained FPS drop */
  declined: boolean;
  /** the current DPR factor */
  dprFactor: number;
  /** mark performance as declined (e.g. hide heavy meshes) */
  setDeclined: (declined: boolean) => void;
  /** update the current DPR factor */
  setDprFactor: (factor: number) => void;
}

export const usePerfStore = create<PerfState>(set => ({
  declined: false,
  dprFactor: 1,

  setDeclined: declined => {
    console.log('[perfStore] declined →', declined);
    set({ declined });
  },

  setDprFactor: dprFactor => {
    console.log('[perfStore] dprFactor →', dprFactor);
    set({ dprFactor });
  },
}));
