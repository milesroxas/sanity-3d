"use client";
import { cn } from "@/lib/utils";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { PortableTextBlock } from "@portabletext/react";

export interface Timeline1Props {
  color:
    | "primary"
    | "secondary"
    | "card"
    | "accent"
    | "destructive"
    | "background"
    | "transparent";
  title: string;
  tagLine: string | null;
  body: PortableTextBlock[];
  image: Sanity.Image;
}

export default function Timeline1({
  color,
  title,
  tagLine,
  body,
}: Partial<Timeline1Props>) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div ref={ref} className="relative border-l-2 pl-12 lg:pl-28 py-8">
      <motion.div
        className="absolute w-8 h-8 rounded-full top-[3.5rem] lg:top-[3.75rem] left-[-1.1rem] border-8"
        initial={{
          backgroundColor: "hsl(var(--background))",
          opacity: 0.3,
        }}
        animate={
          isInView && {
            backgroundColor: "hsl(var(--muted-foreground))",
            opacity: 1,
          }
        }
        transition={{
          duration: 1,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />
      <div className={cn(color === "primary" ? "text-background" : undefined)}>
        <h3 className="flex justify-between items-center font-semibold mb-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={
              isInView && {
                opacity: 1,
                y: 0,
              }
            }
            transition={{
              duration: 0.8,
              ease: [0.21, 0.45, 0.27, 0.9],
              delay: 0.6,
            }}
          >
            {title}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={
              isInView && {
                opacity: 1,
                y: 0,
              }
            }
            transition={{
              duration: 0.8,
              ease: [0.21, 0.45, 0.27, 0.9],
              delay: 0.6,
            }}
          >
            {tagLine}
          </motion.span>
        </h3>
        {body && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isInView && {
                opacity: 1,
                y: 0,
              }
            }
            transition={{
              duration: 0.8,
              ease: [0.21, 0.45, 0.27, 0.9],
              delay: 0.7,
            }}
          >
            <PortableTextRenderer value={body} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
