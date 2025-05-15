import { cn } from '@/lib/utils';
import React from 'react';

export const DEFAULT_PADDING = {
  top: true,
  bottom: true,
};

export interface ISectionPadding {
  top: boolean;
  bottom: boolean;
}

export interface ISectionContainerProps {
  color?:
    | 'primary'
    | 'secondary'
    | 'card'
    | 'accent'
    | 'destructive'
    | 'background'
    | 'transparent';
  theme?: 'light' | 'dark' | 'accent';
  style?: 'default' | 'offset';
  children: React.ReactNode;
  className?: string;
  padding?: ISectionPadding | null | undefined;
}

// Use forwardRef to properly handle ref forwarding
const SectionContainer = React.forwardRef<HTMLDivElement, ISectionContainerProps>(
  ({ color = 'background', theme, style, padding, children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          color !== 'transparent' && `bg-${color}`,
          theme === 'light'
            ? 'bg-background text-foreground'
            : theme === 'dark'
              ? 'bg-zinc-900 text-white' // Changed from rgba to Tailwind class
              : theme === 'accent'
                ? 'bg-primary text-primary-foreground'
                : undefined,
          padding?.top ? 'pt-16 xl:pt-32' : undefined,
          padding?.bottom ? 'pb-16 xl:pb-32' : undefined,
          'transition-colors duration-500', // Added for smooth transitions
          className
        )}
        data-theme={theme} // Added for easier targeting
      >
        <div className="container">{children}</div>
      </div>
    );
  }
);

// Add display name for better debugging
SectionContainer.displayName = 'SectionContainer';

export default SectionContainer;
