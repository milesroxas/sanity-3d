'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';

import PortableTextRenderer from '@/components/portable-text-renderer';
import type { PortableTextBlock } from 'next-sanity';

export default function LargeCalloutClient({ body }: { body: PortableTextBlock[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const paras = el.querySelectorAll('p');
      const splits: SplitText[] = [];
      const triggers: ScrollTrigger[] = [];

      for (const p of paras) {
        // split each paragraph into words
        const split = new SplitText(p, {
          type: 'words',
          wordsClass: 'word',
        });
        splits.push(split);

        // animate each word to fade in
        const tween = gsap.from(split.words, {
          opacity: 0,
          duration: 1,
          ease: 'power1.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: p,
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true,
          },
        });

        if (tween.scrollTrigger) {
          triggers.push(tween.scrollTrigger);
        }
      }

      // cleanup on unmount
      return () => {
        for (const s of splits) {
          s.revert();
        }
        for (const t of triggers) {
          t.kill();
        }
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      {body && Array.isArray(body) && body.length > 0 ? (
        <PortableTextRenderer
          value={body}
          className="mb-8 max-w-4xl py-16 text-2xl text-muted-foreground lg:py-32 lg:text-5xl/snug"
        />
      ) : (
        <p className="mb-8 max-w-4xl text-2xl text-muted-foreground lg:text-5xl/snug">
          No content available
        </p>
      )}
    </div>
  );
}
