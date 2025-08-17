import { create } from 'zustand';

interface VideoModalStore {
  isOpen: boolean;
  video: Sanity.Video | null;
  openModal: (video: Sanity.Video) => void;
  closeModal: () => void;
}

export const useVideoModalStore = create<VideoModalStore>(set => ({
  isOpen: false,
  video: null,
  openModal: video => set({ isOpen: true, video }),
  closeModal: () => set({ isOpen: false, video: null }),
}));
