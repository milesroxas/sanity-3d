'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import { motion, useInView } from 'motion/react';
import { PortableTextBlock } from 'next-sanity';
import { useRef } from 'react';

interface Hero2Props {
  _key?: string;
  tagLine?: string;
  title?: string;
  body?: PortableTextBlock[];
  links?: Sanity.Link[];
}

export default function Hero2({ tagLine, title, body, links, _key }: Hero2Props) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div ref={ref} className="container py-20 text-center dark:bg-background">
      {tagLine && (
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={
            isInView && {
              y: 0,
              opacity: 1,
            }
          }
          transition={{ duration: 0.4, ease: [0.21, 0.45, 0.27, 0.9] }}
          className="font-sans leading-[0]"
        >
          <span className="text-base font-semibold">{tagLine}</span>
        </motion.h1>
      )}
      {title && (
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          animate={
            isInView && {
              y: 0,
              opacity: 1,
            }
          }
          transition={{
            delay: 0.1,
            duration: 0.4,
            ease: [0.21, 0.45, 0.27, 0.9],
          }}
          className="mt-6 text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h2>
      )}
      {body && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={
            isInView && {
              y: 0,
              opacity: 1,
            }
          }
          transition={{
            delay: 0.2,
            duration: 0.4,
            ease: [0.21, 0.45, 0.27, 0.9],
          }}
          className="mx-auto mt-6 max-w-2xl text-lg"
        >
          <PortableTextRenderer value={body} />
        </motion.div>
      )}
      <LinkButtons links={links || []} containerClassName="mt-10" direction="row" />
    </div>
  );
}
