"use client";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface SplitInfoItemProps {
  image: Sanity.Image;
  title: string;
  body: any;
  tags: string[];
}

export default function SplitCardsItem({
  image,
  title,
  body,
  tags,
}: Partial<SplitInfoItemProps>) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 1,
  });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "border border-primary rounded-3xl px-6 lg:px-8 py-6 lg:py-8 transition-colors duration-1000 ease-in-out",
        isInView ? "bg-foreground/85" : "bg-background"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-4 transition-colors duration-1000 ease-in-out",
          isInView ? "text-background" : "text-foreground"
        )}
      >
        <div className="flex items-center gap-2">
          {image && image.asset._id && (
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
              <Image
                src={urlFor(image.asset).url()}
                alt={image.alt || ""}
                placeholder={
                  image?.asset?.metadata?.lqip &&
                  image?.asset?.mimeType !== "image/svg+xml"
                    ? "blur"
                    : undefined
                }
                blurDataURL={image?.asset?.metadata?.lqip || ""}
                width={image.asset?.metadata?.dimensions?.width || 40}
                height={image?.asset?.metadata?.dimensions?.height || 40}
                unoptimized={image?.asset?.mimeType === "image/svg+xml"}
              />
            </div>
          )}
          {title && (
            <div className="text-xl font-semibold leading-[1.1]">{title}</div>
          )}
        </div>
        {body && <PortableTextRenderer value={body} />}
      </div>
      {tags && (
        <div
          className={cn(
            "flex flex-wrap gap-3 mt-4 transition-colors duration-1000 ease-in-out",
            isInView ? "text-background" : "text-foreground"
          )}
        >
          {tags.map((tag) => (
            <Badge
              key={tag}
              className={cn(
                "transition-colors duration-1000 ease-in-out",
                isInView
                  ? "bg-background text-foreground"
                  : "bg-foreground text-background"
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
}
