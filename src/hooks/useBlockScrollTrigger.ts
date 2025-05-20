// hooks/useBlockScrollTrigger.ts
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Hook to create isolated GSAP/ScrollTrigger contexts for each block
 * Each Sanity block gets its own GSAP context that won't interfere with others
 */
export function useBlockScrollTrigger(blockKey?: string) {
  // Create refs for the block element and its GSAP context
  const blockRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<gsap.Context | null>(null);
  const hasRegisteredPlugins = useRef(false);

  // Make sure ScrollTrigger is registered
  useLayoutEffect(() => {
    if (!hasRegisteredPlugins.current) {
      gsap.registerPlugin(ScrollTrigger);
      hasRegisteredPlugins.current = true;
    }
  }, []);

  // Create and manage the GSAP context when the block mounts
  useEffect(() => {
    if (!blockRef.current) return;

    // Create a fresh context for this block
    const ctx = gsap.context(() => {}, blockRef);
    contextRef.current = ctx;

    // Cleanup on unmount
    return () => {
      // Kill ScrollTriggers associated with this context
      const matchSelector = `[data-block-id="${blockKey}"]`;
      ScrollTrigger.getAll()
        .filter(st => {
          const trigger = st.trigger as Element;
          return (
            trigger && (trigger.matches(matchSelector) || trigger.closest(matchSelector) !== null)
          );
        })
        .forEach(st => st.kill());

      // Revert the context
      if (contextRef.current) {
        contextRef.current.revert();
        contextRef.current = null;
      }
    };
  }, [blockKey]);

  /**
   * Helper to create ScrollTrigger configs for this block
   */
  const createScrollTrigger = (element: HTMLElement, config: any, index: number) => {
    // Create a unique ID based on block key
    const id = `block-${blockKey || 'unknown'}-${index}`;

    // Return the config with ID and trigger element
    return {
      ...config,
      id,
      trigger: element,
    };
  };

  /**
   * Helper to run animations safely in this block's context
   * Will use the established context and properly handle cleanup
   */
  const runAnimations = (callback: () => void) => {
    if (!contextRef.current || !blockRef.current) return;

    // Run the animations in this block's context
    contextRef.current.add(callback);
  };

  return {
    blockRef,
    createScrollTrigger,
    runAnimations,
    context: contextRef.current,
  };
}
