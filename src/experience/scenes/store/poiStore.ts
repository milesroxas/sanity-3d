import { create } from 'zustand';

/**
 * POI Store - Manages Points of Interest state
 *
 * Single source of truth for POI interactions and visibility.
 * Works in coordination with logoMarkerStore and expandedContentStore.
 *
 * State Flow:
 * 1. Camera animation completes → setPoisVisible(true)
 * 2. User clicks POI → setSelectedPoi(poi)
 * 3. POI content opens in overlay (via expandedContentStore)
 * 4. User closes overlay → setSelectedPoi(null)
 */

interface PoiStore {
  // State
  poisVisible: boolean;
  selectedPoi: Sanity.PointOfInterest | null;
  isAnimatingIn: boolean;

  // Actions
  setPoisVisible: (visible: boolean) => void;
  setSelectedPoi: (poi: Sanity.PointOfInterest | null) => void;
  setIsAnimatingIn: (animating: boolean) => void;
  reset: () => void;
}

export const usePoiStore = create<PoiStore>(set => ({
  // Initial State
  poisVisible: false,
  selectedPoi: null,
  isAnimatingIn: false,

  // Actions
  setPoisVisible: visible => {
    set({ poisVisible: visible });
    // If hiding POIs, also clear selection
    if (!visible) {
      set({ selectedPoi: null, isAnimatingIn: false });
    }
  },

  setSelectedPoi: poi => set({ selectedPoi: poi }),

  setIsAnimatingIn: animating => set({ isAnimatingIn: animating }),

  reset: () =>
    set({
      poisVisible: false,
      selectedPoi: null,
      isAnimatingIn: false,
    }),
}));
