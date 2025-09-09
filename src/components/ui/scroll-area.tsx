import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';

import { cn } from '@/lib/utils';

const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, style, ...props }, ref) => {
  // Forward touch momentum scrolling and lenis-prevent flags to the viewport to improve iOS performance
  const viewportExtraProps: React.HTMLAttributes<HTMLDivElement> = {
    style,
  };

  // Forward Lenis prevention attributes if provided
  if ('data-lenis-prevent' in (props as any))
    (viewportExtraProps as any)['data-lenis-prevent'] = (props as any)['data-lenis-prevent'];
  if ('data-lenis-prevent-wheel' in (props as any))
    (viewportExtraProps as any)['data-lenis-prevent-wheel'] = (props as any)['data-lenis-prevent-wheel'];
  if ('data-lenis-prevent-touch' in (props as any))
    (viewportExtraProps as any)['data-lenis-prevent-touch'] = (props as any)['data-lenis-prevent-touch'];

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className="h-full w-full rounded-[inherit]"
        {...viewportExtraProps}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none pr-1 transition-colors',
      orientation === 'vertical' && 'right-1 h-full w-3',
      orientation === 'horizontal' && 'bottom-1 h-3',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-black/30 dark:bg-white/30" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
