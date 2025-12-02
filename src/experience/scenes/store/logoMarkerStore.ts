import { fetchSanitySceneBySlug } from '@/app/(main)/actions';
import { stegaClean } from 'next-sanity';
import { Vector3 } from 'three';
import { create } from 'zustand';

interface LogoMarkerStore {
  // State
  selectedScene: Sanity.Scene | null;
  isContentVisible: boolean;
  isLoading: boolean;
  shouldAnimateBack: boolean;
  initialCameraPosition: Vector3 | null;
  initialCameraTarget: Vector3 | null;
  otherMarkersVisible: boolean;
  hoveredMarkerId: string | null;

  // Actions
  setSelectedScene: (scene: Sanity.Scene | null) => void;
  setContentVisible: (visible: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setShouldAnimateBack: (should: boolean) => void;
  setInitialCameraState: (position: Vector3, target: Vector3) => void;
  setOtherMarkersVisible: (visible: boolean) => void;
  setHoveredMarkerId: (id: string | null) => void;
  fetchAndSetScene: (slug: string) => Promise<void>;
  reset: () => void;
}

export const useLogoMarkerStore = create<LogoMarkerStore>(set => ({
  // Initial State
  selectedScene: null,
  isContentVisible: false,
  isLoading: false,
  shouldAnimateBack: false,
  initialCameraPosition: null,
  initialCameraTarget: null,
  otherMarkersVisible: true,
  hoveredMarkerId: null,

  // Actions
  setSelectedScene: scene => {
    set({ selectedScene: scene });
  },
  setContentVisible: visible => set({ isContentVisible: visible }),
  setIsLoading: loading => set({ isLoading: loading }),
  setShouldAnimateBack: should => {
    set({ shouldAnimateBack: should });
  },
  setInitialCameraState: (position, target) => {
    set({
      initialCameraPosition: position.clone(),
      initialCameraTarget: target.clone(),
    });
  },
  setOtherMarkersVisible: visible => set({ otherMarkersVisible: visible }),
  setHoveredMarkerId: id => set({ hoveredMarkerId: id }),

  fetchAndSetScene: async slug => {
    const cleanSlug = stegaClean(slug);
    if (!cleanSlug) {
      console.warn('fetchAndSetScene called without a valid slug', { slug });
      set({ selectedScene: null, isContentVisible: false });
      return;
    }

    set({ isLoading: true });
    try {
      const scene = await fetchSanitySceneBySlug({ slug: cleanSlug });

      if (!scene) {
        console.warn('No scene returned for slug', { slug: cleanSlug });
        set({ selectedScene: null, isContentVisible: false });
        return;
      }

      // Only show drawer content in legacy mode
      // In interactive mode, POI buttons will appear instead
      const shouldShowContent = scene.poiDisplayMode !== 'interactive';

      set({ selectedScene: scene, isContentVisible: shouldShowContent });
    } catch (error) {
      console.error('Error fetching scene:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () =>
    set({
      selectedScene: null,
      isContentVisible: false,
      isLoading: false,
      shouldAnimateBack: false,
      otherMarkersVisible: true,
      hoveredMarkerId: null,
    }),
}));
