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
   * Priority level for the escape key handler (higher numbers = higher priority)
   * @default 0
   */
  priority?: number;
  /**
   * Callback function to execute when escape key is pressed
   */
  onEscape: () => void;
}

// Global registry to track active escape key handlers
const escapeKeyHandlers = new Map<
  symbol,
  {
    priority: number;
    enabled: boolean;
    condition: boolean;
    onEscape: () => void;
  }
>();

/**
 * Custom hook for handling escape key press events with priority support
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
 *     priority: 1,
 *     onEscape: () => setIsOpen(false)
 *   });
 *
 *   return <div>...</div>;
 * };
 * ```
 */
export function useEscapeKey({
  enabled = true,
  condition = true,
  priority = 0,
  onEscape,
}: UseEscapeKeyOptions) {
  const handlerId = useRef<symbol | undefined>(undefined);
  const onEscapeRef = useRef(onEscape);
  const enabledRef = useRef(enabled);
  const conditionRef = useRef(condition);
  const priorityRef = useRef(priority);

  // Keep refs up to date
  onEscapeRef.current = onEscape;
  enabledRef.current = enabled;
  conditionRef.current = condition;
  priorityRef.current = priority;

  useEffect(() => {
    // Create unique handler ID
    if (!handlerId.current) {
      handlerId.current = Symbol();
    }

    const id = handlerId.current;

    // Register handler
    escapeKeyHandlers.set(id, {
      priority: priorityRef.current,
      enabled: enabledRef.current,
      condition: conditionRef.current,
      onEscape: onEscapeRef.current,
    });

    // Update handler when dependencies change
    const updateHandler = () => {
      const handler = escapeKeyHandlers.get(id);
      if (handler) {
        handler.enabled = enabledRef.current;
        handler.condition = conditionRef.current;
        handler.priority = priorityRef.current;
        handler.onEscape = onEscapeRef.current;
      }
    };

    updateHandler();

    return () => {
      escapeKeyHandlers.delete(id);
    };
  }, [enabled, condition, priority]);

  // Global escape key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // Ignore auto-repeated Escape events from a single key press
      if (event.repeat) return;

      // If a Radix Dialog is present (open or animating closed), let Radix handle Escape
      if (document.querySelector('[data-radix-dialog-overlay]')) return;

      // Find the highest priority active handler
      let highestPriority = -1;
      let activeHandler: (() => void) | null = null;

      for (const handler of escapeKeyHandlers.values()) {
        if (handler.enabled && handler.condition && handler.priority > highestPriority) {
          highestPriority = handler.priority;
          activeHandler = handler.onEscape;
        }
      }

      if (activeHandler) {
        event.preventDefault();
        activeHandler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array - we use the global registry
}
