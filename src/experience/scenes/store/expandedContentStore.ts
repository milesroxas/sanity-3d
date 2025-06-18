import { PortableTextBlock } from 'next-sanity';
import { create } from 'zustand';
import { useLogoMarkerStore } from './logoMarkerStore';

interface ExpandedContentState {
  title: string | null;
  content: PortableTextBlock[] | null;
  isVisible: boolean;
  setExpandedContent: (title: string, content: PortableTextBlock[]) => void;
  closeExpandedContent: () => void;
  syncWithLogoMarker: () => void;
}

export const useExpandedContentStore = create<ExpandedContentState>((set, get) => ({
  title: null,
  content: null,
  isVisible: false,
  setExpandedContent: (title, content) => set({ title, content, isVisible: true }),
  closeExpandedContent: () => set({ isVisible: false }),
  syncWithLogoMarker: () => {
    // Get the current logo marker visibility state
    const logoMarkerVisible = useLogoMarkerStore.getState().isContentVisible;

    // If logo marker is closed, also close expanded content
    if (!logoMarkerVisible) {
      set({ isVisible: false });
    }
  },
}));
