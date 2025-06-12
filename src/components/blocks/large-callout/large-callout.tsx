'use client';

import { SplitText } from '@/components/split-text';
import { useBlockScrollTrigger } from '@/hooks/useBlockScrollTrigger';
import gsap from 'gsap';
import type { PortableTextBlock } from 'next-sanity';
import { useEffect, useRef } from 'react';

export default function LargeCallout({ body, _key }: { body: PortableTextBlock[]; _key?: string }) {
  const splitRefs = useRef<Array<any>>([]);
  const { blockRef, createScrollTrigger, runAnimations } = useBlockScrollTrigger(_key);

  // Wait for split text to initialize, then animate
  useEffect(() => {
    // Ensure refs are ready
    if (!blockRef.current || splitRefs.current.length === 0) return;

    // Debug environment variables
    console.log('NEXT_PUBLIC_SITE_ENV:', process.env.NEXT_PUBLIC_SITE_ENV);

    // Small delay to ensure SplitText instances are fully initialized
    const timeout = setTimeout(() => {
      runAnimations(() => {
        // Create animations for each text block
        splitRefs.current.forEach((splitInstance, index) => {
          if (!splitInstance?.words || !splitInstance.elements?.[0]) return;

          // Simple animation that reveals the words
          gsap.from(splitInstance.words, {
            opacity: 0,
            duration: 1,
            ease: 'power1.out',
            stagger: 0.08,
            scrollTrigger: createScrollTrigger(
              blockRef.current!,
              {
                start: 'top 75%',
                toggleActions: 'play none none none',
                once: true,
                markers: false,
              },
              index
            ),
          });

          // Log the markers setting
          console.log('GSAP markers setting:', process.env.NEXT_PUBLIC_SITE_ENV !== 'production');
        });
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [body, _key, runAnimations, createScrollTrigger, blockRef]);

  const paragraphClass = 'mb-8 max-w-4xl text-2xl text-muted-foreground lg:text-5xl/snug';

  return (
    <div className="container">
      <div ref={blockRef} data-block-id={_key} className="large-callout-container">
        {body && Array.isArray(body) && body.length > 0 ? (
          <div className="py-16 lg:pb-12 lg:pt-32">
            {/* Custom renderer that uses SplitText for each paragraph */}
            {body.map((block, index) => {
              if (block._type === 'block' && block.style === 'normal') {
                return (
                  <SplitText
                    key={index}
                    type="words"
                    className={paragraphClass}
                    ref={splitInstance => {
                      // Store the split text instance
                      if (splitRefs.current) {
                        splitRefs.current[index] = splitInstance;
                      }
                    }}
                  >
                    {block.children?.map((child: any) => child.text).join(' ') || ''}
                  </SplitText>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <p className={paragraphClass}>No content available</p>
        )}
      </div>
    </div>
  );
}
