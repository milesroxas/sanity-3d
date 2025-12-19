import { create } from 'zustand';
import { useLogoMarkerStore } from './logoMarkerStore';

interface ExpandedContentState {
  title: string | null;
  blocks: Sanity.Block[] | null;
  isVisible: boolean;
  hasSubmitted: boolean;
  setExpandedContent: (title: string, blocks?: Sanity.Block[]) => void;
  closeExpandedContent: () => void;
  markAsSubmitted: () => void;
  resetSubmissionState: () => void;
  clearBlocks: () => void;
  syncWithLogoMarker: () => void;
}

export const useExpandedContentStore = create<ExpandedContentState>((set, get) => ({
  title: null,
  blocks: null,
  isVisible: false,
  hasSubmitted: false,
  setExpandedContent: (title, blocks = []) => set({ title, blocks, isVisible: true }),
  closeExpandedContent: () => set({ isVisible: false }),
  markAsSubmitted: () => set({ hasSubmitted: true, isVisible: false }),
  resetSubmissionState: () => set({ hasSubmitted: false }),
  clearBlocks: () => set({ blocks: null }),
  syncWithLogoMarker: () => {
    const logoMarkerVisible = useLogoMarkerStore.getState().isContentVisible;
    if (!logoMarkerVisible) {
      set({ title: null, blocks: null, isVisible: false, hasSubmitted: false });
    }
  },
}));
