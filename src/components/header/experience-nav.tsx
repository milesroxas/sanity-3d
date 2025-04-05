"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { fetchSanitySettings } from "@/app/(main)/actions";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { NavItem } from "@/types";

const navItems = [
  {
    label: "Services",
    href: "/services",
    target: false,
  },
  {
    label: "About Us",
    href: "/about",
    target: false,
  },
  {
    label: "Testimonials",
    href: "/testimonials",
    target: false,
  },
  {
    label: "News",
    href: "/news",
    target: false,
  },
];

interface ExperienceNavProps {
  visible: boolean; // Control visibility from parent
}

export default function ExperienceNav({ visible }: ExperienceNavProps) {
  const [logo, setLogo] = useState<any>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const settings = await fetchSanitySettings();
      setLogo(settings.logo);
    };
    fetchLogo();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-0 w-full border-border/40 z-50 py-2 text-white"
        >
          <div className="container flex items-center justify-between h-14">
            <Link href="/" aria-label="Home page" className="w-12">
              {logo && logo.asset?._id && (
                <Image
                  src={urlFor(logo.asset).url()}
                  alt={logo.alt || ""}
                  width={logo.asset?.metadata?.dimensions?.width || 800}
                  height={logo.asset?.metadata?.dimensions?.height || 800}
                  placeholder={logo?.asset?.metadata?.lqip ? "blur" : undefined}
                  blurDataURL={logo?.asset?.metadata?.lqip || ""}
                  quality={100}
                />
              )}
            </Link>
            <div className="hidden xl:flex gap-7 items-center justify-between">
              <ExperienceDesktopNav navItems={navItems} />
            </div>
            <div className="flex items-center xl:hidden">
              {/* <ExperienceMobileNav navItems={navItems} /> */}
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}

function ExperienceDesktopNav({ navItems }: { navItems: NavItem[] }) {
  return (
    <div className="hidden xl:flex items-center gap-7 text-primary">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          target={item.target ? "_blank" : undefined}
          className="transition-colors hover:text-white/80 text-white uppercase font-semibold text-sm"
        >
          {item.label}
        </Link>
      ))}
      <Link
        href="/contact"
        className="transition-colors hover:text-white/80 text-white uppercase font-semibold text-sm"
      >
        <Button size="sm" variant="outline" className="border-white text-primary hover:bg-white/10">Get in Touch</Button>
      </Link>
    </div>
  );
}

// function ExperienceMobileNav({ navItems }: { navItems: NavItem[] }) {
//   // Simple placeholder for now, you can customize this later
//   return (
//     <button className="text-white p-2 border border-white/30 rounded-md">
//       Menu
//     </button>
//   );
// } 