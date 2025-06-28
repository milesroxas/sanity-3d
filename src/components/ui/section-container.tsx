import { cn } from '@/lib/utils';
import React from 'react';

export const DEFAULT_PADDING = {
  padding: 'small',
  direction: 'both',
} as const;

export interface ISectionPadding {
  padding: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
  direction: 'top' | 'bottom' | 'both';
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
  padding?: ISectionPadding | null;
  noGap?: boolean;
  noContainer?: boolean;
}

// Use forwardRef to properly handle ref forwarding
const SectionContainer = React.forwardRef<HTMLDivElement, ISectionContainerProps>(
  (
    {
      color = 'background',
      theme,
      style,
      padding,
      children,
      className,
      noGap,
      noContainer = false,
    },
    ref
  ) => {
    // Use default padding if none provided
    const effectivePadding = padding || DEFAULT_PADDING;

    // Generate class names in a stable way
    const colorClass = color !== 'transparent' ? `bg-${color}` : '';
    const themeClass =
      theme === 'light'
        ? 'bg-background text-foreground'
        : theme === 'dark'
          ? 'bg-zinc-900 text-white'
          : theme === 'accent'
            ? 'bg-primary text-primary-foreground'
            : '';

    // Helper function to get padding classes based on size
    const getPaddingClasses = (size: ISectionPadding['padding']) => {
      switch (size) {
        case 'none':
          return { top: 'pt-0', bottom: 'pb-0' };
        case 'small':
          return { top: 'pt-8 xl:pt-16', bottom: 'pb-8 xl:pb-16' };
        case 'medium':
          return { top: 'pt-16 xl:pt-24', bottom: 'pb-16 xl:pb-24' };
        case 'large':
          return { top: 'pt-24 xl:pt-32', bottom: 'pb-24 xl:pb-32' };
        case 'xlarge':
          return { top: 'pt-32 xl:pt-48', bottom: 'pb-32 xl:pb-48' };
        default:
          return { top: 'pt-0', bottom: 'pb-0' };
      }
    };

    const paddingClasses = getPaddingClasses(effectivePadding.padding);

    // Apply padding based on direction
    const paddingTopClass =
      effectivePadding.direction === 'top' || effectivePadding.direction === 'both'
        ? paddingClasses.top
        : '';

    const paddingBottomClass =
      effectivePadding.direction === 'bottom' || effectivePadding.direction === 'both'
        ? paddingClasses.bottom
        : '';

    const content = noContainer ? children : <div className="container">{children}</div>;

    return (
      <div
        ref={ref}
        className={cn(
          colorClass,
          themeClass,
          paddingTopClass,
          paddingBottomClass,
          'transition-colors duration-500',
          noGap ? 'px-10' : undefined,
          className
        )}
        data-theme={theme || undefined}
      >
        {content}
      </div>
    );
  }
);

// Add display name for better debugging
SectionContainer.displayName = 'SectionContainer';

export default SectionContainer;
