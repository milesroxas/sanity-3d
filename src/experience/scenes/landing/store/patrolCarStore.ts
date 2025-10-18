import { create } from 'zustand';

interface PatrolCarStore {
  speedMultiplier: number;
  setSpeedMultiplier: (multiplier: number) => void;
}

export const usePatrolCarStore = create<PatrolCarStore>(set => ({
  speedMultiplier: 1, // Start at full speed - camera animation will ease to 0/1 as needed
  setSpeedMultiplier: (multiplier: number) => set({ speedMultiplier: multiplier }),
}));
