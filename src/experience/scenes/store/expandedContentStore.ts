import { create } from 'zustand';
import { useLogoMarkerStore } from './logoMarkerStore';

interface ExpandedContentState {
  title: string | null;
  blocks: Sanity.Block[] | null;
  isVisible: boolean;
  setExpandedContent: (title: string, blocks?: Sanity.Block[]) => void;
  closeExpandedContent: () => void;
  syncWithLogoMarker: () => void;
}

export const useExpandedContentStore = create<ExpandedContentState>((set, get) => ({
  title: null,
  blocks: null,
  isVisible: false,
  setExpandedContent: (title, blocks = []) => set({ title, blocks, isVisible: true }),
  closeExpandedContent: () => set({ title: null, blocks: null, isVisible: false }), // Clear everything
  syncWithLogoMarker: () => {
    const logoMarkerVisible = useLogoMarkerStore.getState().isContentVisible;
    if (!logoMarkerVisible) {
      set({ title: null, blocks: null, isVisible: false }); // Clear everything here too
    }
  },
}));
