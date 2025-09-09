'use client';

import { create } from 'zustand';

type CursorStore = {
  hoveringInteractive: boolean;
  setHoveringInteractive: (value: boolean) => void;
};

export const useCursorStore = create<CursorStore>(set => ({
  hoveringInteractive: false,
  setHoveringInteractive: (value: boolean) => set({ hoveringInteractive: value }),
}));

