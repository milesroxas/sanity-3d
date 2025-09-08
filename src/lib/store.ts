import { create } from 'zustand';

type ScrollLockStore = {
  // Number of active scroll locks requested by overlays (modals, drawers, etc.)
  scrollLockCount: number;
  // Derived flag for convenience
  isScrollLocked: boolean;
  // Acquire a scroll lock (increments count)
  acquireScrollLock: () => void;
  // Release a scroll lock (decrements count, never below 0)
  releaseScrollLock: () => void;
  // Reset all locks (safety fallback)
  resetScrollLock: () => void;
};

export const useScrollLockStore = create<ScrollLockStore>((set, get) => ({
  scrollLockCount: 0,
  isScrollLocked: false,
  acquireScrollLock: () =>
    set(state => {
      const next = state.scrollLockCount + 1;
      return { scrollLockCount: next, isScrollLocked: next > 0 };
    }),
  releaseScrollLock: () =>
    set(state => {
      const next = Math.max(0, state.scrollLockCount - 1);
      return { scrollLockCount: next, isScrollLocked: next > 0 };
    }),
  resetScrollLock: () => set({ scrollLockCount: 0, isScrollLocked: false }),
}));
