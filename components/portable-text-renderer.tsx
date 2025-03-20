"use client";

import { PortableText, PortableTextProps } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";
import { extractHrefFromLinkMark } from "@/lib/sanity-utils";

const portableTextComponents: PortableTextProps["components"] = {
  types: {
    image: ({ value }) => {
      const { url, metadata } = value.asset;
      const { lqip, dimensions } = metadata;
      return (
        <Image
          src={url}
          alt={value.alt || "Image"}
          width={dimensions.width}
          height={dimensions.height}
          placeholder="blur"
          blurDataURL={lqip}
          className="w-full h-auto"
          style={{
            borderRadius: "0.5rem",
          }}
          quality={100}
        />
      );
    },
    youtube: ({ value }) => {
      const { videoId } = value;
      return (
        <div className="max-w-3xl w-full mx-auto">
          <div className="aspect-video">
            <YouTubeEmbed videoid={videoId} params="rel=0" />
          </div>
        </div>
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="w-full max-w-full" style={{ marginBottom: "1rem" }}>
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 style={{ marginBottom: "1rem", marginTop: "1rem" }}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ marginBottom: "1rem", marginTop: "1rem" }}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ marginBottom: "1rem", marginTop: "1rem" }}>{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 style={{ marginBottom: "1rem", marginTop: "1rem" }}>{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 style={{ marginBottom: "1rem", marginTop: "1rem" }}>{children}</h5>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      // Extract href using our utility function
      const href = extractHrefFromLinkMark(value) || '#';
      
      const isExternal =
        href.startsWith("http") ||
        href.startsWith("https") ||
        href.startsWith("mailto");
      const target = isExternal ? "_blank" : undefined;
      const rel = isExternal ? "noopener noreferrer" : undefined;
      
      // Render as Button component if specified
      if (value?.isButton) {
        // External site links should open in a new window
        if (isExternal) {
          return (
            <Button 
              asChild 
              variant={value?.buttonVariant || "default"}
              size={value?.buttonSize || "default"}
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
            variant={value?.buttonVariant || "default"}
            size={value?.buttonSize || "default"}
          >
            <Link
              href={href}
              target={target}
              rel={rel}
              prefetch={false}
            >
              {children}
            </Link>
          </Button>
        );
      }
      
      // Default link rendering
      // External site links should open in a new window
      if (isExternal) {
        return (
          <a 
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
          >
            {children}
          </a>
        );
      }
      
      // Internal links use Next.js Link
      return (
        <Link
          href={href}
          style={{ textDecoration: "underline" }}
          prefetch={false}
        >
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul
        style={{
          paddingLeft: "1.5rem",
          marginBottom: "1rem",
          listStyleType: "disc",
          listStylePosition: "inside",
        }}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        style={{
          paddingLeft: "1.5rem",
          marginBottom: "1rem",
          listStyleType: "decimal",
          listStylePosition: "inside",
        }}
      >
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li style={{ marginBottom: "0.5rem" }}>{children}</li>
    ),
    number: ({ children }) => (
      <li style={{ marginBottom: "0.5rem" }}>{children}</li>
    ),
  },
};

const PortableTextRenderer = ({
  value,
}: {
  value: PortableTextProps["value"];
}) => {
  return <PortableText value={value} components={portableTextComponents} />;
};

export default PortableTextRenderer;
