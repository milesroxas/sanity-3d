'use client';

import { Button } from '@/components/ui/button';
import { extractHrefFromLinkMark } from '@/lib/sanity-utils';
import { cn } from '@/lib/utils';
import { YouTubeEmbed } from '@next/third-parties/google';
import { PortableText, PortableTextBlockComponent, PortableTextProps } from '@portabletext/react';
import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import Link from 'next/link';

// Define variants using class-variance-authority
const portableTextVariants = cva('', {
  variants: {
    variant: {
      default: '',
      drawer: '',
      compact: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Define component props interface extending VariantProps
export interface PortableTextRendererProps extends VariantProps<typeof portableTextVariants> {
  value: PortableTextProps['value'];
  className?: string;
}

const PortableTextRenderer = ({ value, variant, className }: PortableTextRendererProps) => {
  // Generate the base component styles
  const baseStyles = cn(portableTextVariants({ variant, className }));

  // Variant-specific component configurations
  const getComponents = (): PortableTextProps['components'] => {
    // Helper function to create a properly typed block components object
    const createBlockComponents = (
      components: Record<string, PortableTextBlockComponent>
    ): Record<string, PortableTextBlockComponent> => components;

    // Default component configuration
    const defaultComponents: PortableTextProps['components'] = {
      types: {
        image: ({ value }) => {
          const { url, metadata } = value.asset;
          const { lqip, dimensions } = metadata;
          return (
            <Image
              src={url}
              alt={value.alt || 'Image'}
              width={dimensions.width}
              height={dimensions.height}
              placeholder="blur"
              blurDataURL={lqip}
              className="h-auto w-full"
              style={{
                borderRadius: '0.2rem',
                marginBottom: '1rem',
              }}
              quality={100}
            />
          );
        },
        youtube: ({ value }) => {
          const { videoId } = value;
          return (
            <div className="mx-auto w-full max-w-3xl">
              <div className="aspect-video">
                <YouTubeEmbed videoid={videoId} params="rel=0" />
              </div>
            </div>
          );
        },
      },
      block: createBlockComponents({
        normal: ({ children }) => <p className="mb-6 mt-2 w-full max-w-full">{children}</p>,
        largeText: ({ children }) => (
          <p className="mb-12 w-full max-w-full text-xl font-medium">{children}</p>
        ),
        h1: ({ children }) => <h1 className="mb-6 mt-4">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-6 mt-4">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-2 mt-12 font-bold">{children}</h3>,
        h4: ({ children }) => <h4 className="mb-4 mt-4">{children}</h4>,
        h5: ({ children }) => <h5 className="mb-2 mt-4">{children}</h5>,
        blockquote: ({ children }) => (
          <blockquote className="mb-4 w-full max-w-full border-l-4 border-primary pl-4">
            {children}
          </blockquote>
        ),
      }),

      marks: {
        link: ({ value, children }) => {
          // Extract href using our utility function
          const href = extractHrefFromLinkMark(value) || '#';

          const isExternal =
            href.startsWith('http') || href.startsWith('https') || href.startsWith('mailto');
          const target = isExternal ? '_blank' : undefined;
          const rel = isExternal ? 'noopener noreferrer' : undefined;

          // Render as Button component if specified
          if (value?.isButton) {
            // External site links should open in a new window
            if (isExternal) {
              return (
                <Button
                  asChild
                  variant={value?.buttonVariant || 'default'}
                  size={value?.buttonSize || 'default'}
                  className="mb-8 mt-8"
                >
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                </Button>
              );
            }

            // Internal links use Next.js Link
            return (
              <Button
                asChild
                variant={value?.buttonVariant || 'default'}
                size={value?.buttonSize || 'default'}
              >
                <Link href={href} target={target} rel={rel} prefetch={false}>
                  {children}
                </Link>
              </Button>
            );
          }

          // Default link rendering
          // External site links should open in a new window
          if (isExternal) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
                {children}
              </a>
            );
          }

          // Internal links use Next.js Link
          return (
            <Link href={href} className="underline" prefetch={false}>
              {children}
            </Link>
          );
        },
      },
      list: {
        bullet: ({ children }) => (
          <ul
            className="list-disc"
            style={{
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
              listStylePosition: 'outside',
            }}
          >
            {children}
          </ul>
        ),
        number: ({ children }) => (
          <ol
            className="list-decimal"
            style={{
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
              listStylePosition: 'outside',
            }}
          >
            {children}
          </ol>
        ),
      },
      listItem: {
        bullet: ({ children }) => <li className="mb-2">{children}</li>,
        number: ({ children }) => <li className="mb-2">{children}</li>,
      },
    };

    // Drawer variant - optimized for smaller spaces, tighter margins, smaller text
    const drawerComponents: PortableTextProps['components'] = {
      ...defaultComponents,
      block: createBlockComponents({
        normal: ({ children }) => (
          <p className="mb-2 w-full max-w-full text-sm md:mb-6 md:text-base">{children}</p>
        ),
        largeText: ({ children }) => (
          <p className="mb-6 w-full max-w-full text-sm font-medium text-slate-700 md:mb-8 md:pt-2 md:text-lg">
            {children}
          </p>
        ),
        h1: ({ children }) => (
          <h1 className="text-lg font-bold text-primary md:text-xl">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold leading-tight text-primary md:text-2xl">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-primary md:text-base">{children}</h3>
        ),
        h4: ({ children }) => <h4 className="text-sm font-semibold md:text-base">{children}</h4>,
        h5: ({ children }) => <h5 className="text-xs font-semibold md:text-sm">{children}</h5>,
      }),
      list: {
        bullet: ({ children }) => (
          <ul
            className="mb-6 list-disc text-sm md:text-base"
            style={{
              paddingLeft: '1rem',
              marginBottom: '0.75rem',
              listStylePosition: 'inside',
            }}
          >
            {children}
          </ul>
        ),
        number: ({ children }) => (
          <ol
            className="list-decimal text-sm md:text-base"
            style={{
              paddingLeft: '1rem',
              marginBottom: '0.75rem',
              listStylePosition: 'inside',
            }}
          >
            {children}
          </ol>
        ),
      },
      listItem: {
        bullet: ({ children }) => <li className="mb-1.5">{children}</li>,
        number: ({ children }) => <li className="mb-1.5">{children}</li>,
      },
    };

    // Compact variant - very minimal spacing, smaller text
    const compactComponents: PortableTextProps['components'] = {
      ...defaultComponents,
      block: createBlockComponents({
        normal: ({ children }) => (
          <p className="w-full max-w-full text-sm" style={{ marginBottom: '0.5rem' }}>
            {children}
          </p>
        ),
        largeText: ({ children }) => (
          <p className="mb-4 w-full max-w-full text-xs text-muted">{children}</p>
        ),
        h1: ({ children }) => <h1 className="text-xl font-bold">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>,
        h4: ({ children }) => <h4 className="text-xs font-semibold">{children}</h4>,
        h5: ({ children }) => <h5 className="text-xs font-medium">{children}</h5>,
      }),
      list: {
        bullet: ({ children }) => (
          <ul
            className="list-disc text-sm"
            style={{
              paddingLeft: '1rem',
              marginBottom: '0.5rem',
              listStylePosition: 'inside',
            }}
          >
            {children}
          </ul>
        ),
        number: ({ children }) => (
          <ol
            className="list-decimal text-sm"
            style={{
              paddingLeft: '1rem',
              marginBottom: '0.5rem',
              listStylePosition: 'inside',
            }}
          >
            {children}
          </ol>
        ),
      },
      listItem: {
        bullet: ({ children }) => <li className="mb-1">{children}</li>,
        number: ({ children }) => <li className="mb-1">{children}</li>,
      },
    };

    // Return component configuration based on variant
    switch (variant) {
      case 'drawer':
        return drawerComponents;
      case 'compact':
        return compactComponents;
      default:
        return defaultComponents;
    }
  };

  return (
    <div className={baseStyles}>
      <PortableText value={value} components={getComponents()} />
    </div>
  );
};

export default PortableTextRenderer;
