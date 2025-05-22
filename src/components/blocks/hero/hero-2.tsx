'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import { motion, useInView } from 'motion/react';
import { PortableTextBlock, stegaClean } from 'next-sanity';
import Link from 'next/link';
import { useRef } from 'react';
export default function Hero2({
  tagLine,
  title,
  body,
  links,
  _key,
}: Partial<{
  _key: string;
  tagLine: string;
  title: string;
  body: PortableTextBlock[];
  links: {
    title: string;
    href: string;
    target?: boolean;
    buttonVariant:
      | 'default'
      | 'secondary'
      | 'link'
      | 'destructive'
      | 'outline'
      | 'ghost'
      | null
      | undefined;
  }[];
}>) {
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
      {links && links.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={
            isInView && {
              y: 0,
              opacity: 1,
            }
          }
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          {links.map(link => {
            if (!link) return null;
            if ((link as any)._type === 'reference' && (link as any).slug) {
              const ref = link as { _id?: string; title?: string; slug?: { current: string } };
              return (
                <Button key={ref._id || ref.title} variant="default" asChild>
                  <Link href={`/${ref.slug?.current || ''}`}>{ref.title}</Link>
                </Button>
              );
            }
            return (
              <Button key={link.title} variant={stegaClean((link as any)?.buttonVariant)} asChild>
                <Link
                  href={(link as any).href as string}
                  target={(link as any).target ? '_blank' : undefined}
                  rel={(link as any).target ? 'noopener' : undefined}
                >
                  {link.title}
                </Link>
              </Button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
