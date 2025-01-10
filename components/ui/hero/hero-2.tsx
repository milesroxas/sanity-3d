"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
export default function Hero2({
  tagLine,
  title,
  body,
  links,
}: Partial<{
  tagLine: string;
  title: string;
  body: any;
  links: {
    title: string;
    href: string;
    target?: boolean;
    buttonVariant:
      | "default"
      | "secondary"
      | "link"
      | "destructive"
      | "outline"
      | "ghost"
      | null
      | undefined;
  }[];
}>) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div
      ref={ref}
      className="container dark:bg-background py-20 lg:pt-40 text-center"
    >
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
          className="leading-[0] font-sans"
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
          className="mt-6 font-bold leading-[1.1] text-4xl md:text-5xl lg:text-6xl"
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
          className="text-lg mt-6 max-w-2xl mx-auto"
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
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          {links.map((link) => (
            <Button
              key={link.title}
              variant={stegaClean(link?.buttonVariant)}
              asChild
            >
              <Link
                href={link.href as string}
                target={link.target ? "_blank" : undefined}
                rel={link.target ? "noopener" : undefined}
              >
                {link.title}
              </Link>
            </Button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
