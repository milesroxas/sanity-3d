'use client';

import { create } from 'zustand';

type CursorMode = 'default' | 'scroll';

type CursorStore = {
  hoveringInteractive: boolean;
  setHoveringInteractive: (value: boolean) => void;

  mode: CursorMode;
  setMode: (m: CursorMode) => void;
};

export const useCursorStore = create<CursorStore>(set => ({
  hoveringInteractive: false,
  setHoveringInteractive: value => set({ hoveringInteractive: value }),

  mode: 'default',
  setMode: m => set({ mode: m }),
}));
