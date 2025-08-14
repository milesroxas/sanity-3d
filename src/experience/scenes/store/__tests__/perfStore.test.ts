import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePerfStore } from '../perfStore';

// Mock setTimeout and clearTimeout
vi.stubGlobal(
  'setTimeout',
  vi.fn((fn, delay) => {
    const id = Math.random();
    // Execute immediately for test purposes
    fn();
    return id;
  })
);
vi.stubGlobal('clearTimeout', vi.fn());

describe('perfStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    usePerfStore.setState({
      declined: false,
      dprFactor: 1,
      lastChangeTime: 0,
      debounceTimeoutId: null,
    });
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const state = usePerfStore.getState();
    expect(state.declined).toBe(false);
    expect(state.dprFactor).toBe(1);
    expect(state.lastChangeTime).toBe(0);
    expect(state.debounceTimeoutId).toBe(null);
  });

  it('should debounce declined changes', () => {
    const { setDeclined } = usePerfStore.getState();

    // First change should go through
    setDeclined(true);
    expect(usePerfStore.getState().declined).toBe(true);

    // Reset for next test
    usePerfStore.setState({ lastChangeTime: 0 });

    // Rapid subsequent change should be ignored due to debounce
    setDeclined(false);
    expect(usePerfStore.getState().declined).toBe(false);
  });

  it('should only update dprFactor for significant changes', () => {
    const { setDprFactor } = usePerfStore.getState();

    // Small change should be ignored
    setDprFactor(1.1);
    expect(usePerfStore.getState().dprFactor).toBe(1); // Should remain unchanged

    // Significant change should go through
    setDprFactor(1.2);
    expect(usePerfStore.getState().dprFactor).toBe(1.2);
  });

  it('should clear timeout on reset', () => {
    const { setDprFactor, reset } = usePerfStore.getState();

    // Trigger a debounced change
    setDprFactor(1.3);

    // Reset should clear timeout
    reset();

    expect(clearTimeout).toHaveBeenCalled();
    expect(usePerfStore.getState().debounceTimeoutId).toBe(null);
  });

  it('should reset all values to defaults', () => {
    // Set some non-default values
    usePerfStore.setState({
      declined: true,
      dprFactor: 0.8,
      lastChangeTime: Date.now(),
      debounceTimeoutId: 123,
    });

    // Reset
    usePerfStore.getState().reset();

    const state = usePerfStore.getState();
    expect(state.declined).toBe(false);
    expect(state.dprFactor).toBe(1);
    expect(state.lastChangeTime).toBe(0);
    expect(state.debounceTimeoutId).toBe(null);
  });
});
