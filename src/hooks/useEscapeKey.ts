import { useEffect, useRef } from 'react';

interface UseEscapeKeyOptions {
  /**
   * Whether the escape key listener should be active
   * @default true
   */
  enabled?: boolean;
  /**
   * Additional condition that must be met for the escape key to trigger
   * @default true
   */
  condition?: boolean;
  /**
   * Callback function to execute when escape key is pressed
   */
  onEscape: () => void;
}

/**
 * Custom hook for handling escape key press events
 *
 * @param options Configuration options for the escape key handler
 * @returns void
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   useEscapeKey({
 *     enabled: isOpen,
 *     condition: !isAnimating,
 *     onEscape: () => setIsOpen(false)
 *   });
 *
 *   return <div>...</div>;
 * };
 * ```
 */
export function useEscapeKey({ enabled = true, condition = true, onEscape }: UseEscapeKeyOptions) {
  const onEscapeRef = useRef(onEscape);
  const enabledRef = useRef(enabled);
  const conditionRef = useRef(condition);

  // Keep refs up to date
  onEscapeRef.current = onEscape;
  enabledRef.current = enabled;
  conditionRef.current = condition;

  useEffect(() => {
    if (!enabledRef.current || !conditionRef.current) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && enabledRef.current && conditionRef.current) {
        event.preventDefault();
        onEscapeRef.current();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array - we use refs to avoid stale closures
}
