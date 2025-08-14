import * as React from 'react';
import { beforeAll } from 'vitest';

// Ensure React global for classic runtime JSX in some transformed files
(globalThis as any).React = React;

beforeAll(() => {
  if (!(globalThis as any).requestAnimationFrame) {
    (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now()), 16) as any;
  }
  if (!(globalThis as any).cancelAnimationFrame) {
    (globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id as any);
  }

  // Stub env needed by sanity client in tests
  process.env.NEXT_PUBLIC_SANITY_DATASET ||= 'testing';
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= 'testing';
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||= '2025-01-01';
  process.env.NEXT_PUBLIC_USE_STEGA ||= 'false';
});
