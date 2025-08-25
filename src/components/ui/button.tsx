'use client';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

export const buttonVariants = cva(
  // Base
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        button21: 'button-21',
      },
      size: {
        // Icon sizing and line-height are controlled here via [&_svg]
        sm: 'h-8 px-3 text-sm leading-none [&_svg]:h-4 [&_svg]:w-4',
        default: 'h-10 px-4 text-base leading-none [&_svg]:h-5 [&_svg]:w-5',
        lg: 'h-12 px-6 text-lg leading-none [&_svg]:h-6 [&_svg]:w-6',
        icon: 'h-10 w-10 leading-none [&_svg]:h-5 [&_svg]:w-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          // Common accessibility and disabled styles
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          buttonVariants({ variant, size }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
