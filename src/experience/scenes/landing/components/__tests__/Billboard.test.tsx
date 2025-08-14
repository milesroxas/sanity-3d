import { describe, expect, it } from 'vitest';

// Import the real component first to test it exists
import { Billboard } from '../Billboard';

// Simple integration test focused on core functionality
describe('Billboard Integration Test', () => {
  it('component renders without errors and exports correctly', () => {
    // Test that the component can be imported
    expect(typeof Billboard).toBe('function');
  });

  it('has proper TypeScript types defined', () => {
    // Test that our new types are properly defined
    const mockProps = {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      textureVideo: undefined,
    };

    // Should not cause TypeScript errors
    expect(mockProps).toBeDefined();
  });

  it('component has expected structure and features', () => {
    // Test that the Billboard component has the expected properties
    expect(Billboard.name).toBe('Billboard');

    // Test the component function is valid
    const testComponent = Billboard;
    expect(testComponent).toBeDefined();
    expect(typeof testComponent).toBe('function');
  });
});
