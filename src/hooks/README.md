Overlay Scroll Lock

Purpose
- Provide a single, reusable way to lock background scroll while overlays (modals, drawers, sheets) are open.
- Coordinate with Lenis so smooth scrolling pauses while any overlay is open.
- Return touch-friendly props for the overlay’s scrollable content to avoid scroll bleed and improve iOS behavior.

API
- Hook: `useOverlayScrollLock(isOpen, options?)`
- Returns: `{ scrollAreaProps }`

Options
- `lockBody` (default: true): Applies `overflow: hidden` and `overscroll-behavior-y` to `body` while open.
- `overscrollBehaviorY` (default: 'none'): Body overscroll policy ('none' | 'contain' | 'auto').
- `preventLenis` (default: true): Sets `data-lenis-prevent`, `data-lenis-prevent-wheel`, and `data-lenis-prevent-touch` on the scrollable element.
- `stopWheelPropagation` (default: true): Stops wheel events from bubbling to the page to prevent background scrolling.
- `webkitMomentumScroll` (default: true): Adds `-webkit-overflow-scrolling: touch` to enable momentum scroll on iOS.
- `className` (default: ''): Additional classes to append to the scrollable element.

scrollAreaProps
- `className`: Includes `touch-pan-y overscroll-y-contain` plus any provided `className`.
- `style`: Includes `WebkitOverflowScrolling: 'touch'` when `webkitMomentumScroll` is true.
- `onWheel`: Stops event propagation when `stopWheelPropagation` is true.
- `data-lenis-prevent`, `data-lenis-prevent-wheel`, `data-lenis-prevent-touch`: Present when `preventLenis` is true.

Lenis Integration
- The hook uses a ref-counted store (`useScrollLockStore`) so multiple overlays can be open simultaneously without fighting.
- The Lenis controller (`src/app/(components)/lenis/index.tsx`) observes `isScrollLocked` and automatically stops/starts Lenis.

Usage Examples
1) Modal with inner scroll (Radix ScrollArea)

  const { scrollAreaProps } = useOverlayScrollLock(isOpen);
  const { className: overlayClassName, ...overlayProps } = scrollAreaProps;

  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent>
      <ScrollArea className={`your-layout-classes ${overlayClassName || ''}`} {...overlayProps}>
        {/* scrollable content */}
      </ScrollArea>
    </DialogContent>
  </Dialog>

2) Drawer content (simple div)

  const { scrollAreaProps } = useOverlayScrollLock(open);
  const { className: overlayClassName, ...overlayProps } = scrollAreaProps;

  <div className={`flex-1 overflow-y-auto ${overlayClassName || ''}`} {...overlayProps}>
    {/* scrollable content */}
  </div>

Notes
- The hook is SSR-safe and no-ops on server.
- Prefer spreading `scrollAreaProps` and merging `className` to avoid duplicate flags.
- Avoid additional ad-hoc body locks in components; rely on the hook for consistency.

