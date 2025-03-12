"use client";

import Link from "next/link";
import Image from "next/image";
import MobileNav from "@/components/header/mobile-nav";
import DesktopNav from "@/components/header/desktop-nav";
import { urlFor } from "@/sanity/lib/image";
import { fetchSanitySettings } from "@/app/(main)/actions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function Header() {
  const pathname = usePathname();
  const [logo, setLogo] = useState<any>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const settings = await fetchSanitySettings();
      setLogo(settings.logo);
    };
    fetchLogo();
  }, []);

  // Hide header on homepage
  if (pathname === "/") {
    return null;
  }

  // Check if we're in an experience slug route (but not the main experience page)
  const isExperienceSlugPage = pathname?.startsWith("/experience/") && pathname !== "/experience";

  return (
    <header className={`sticky top-0 w-full border-border/40 z-50 py-2 ${isExperienceSlugPage ? 'text-white' : ''}`}>
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
          <DesktopNav navItems={navItems} isExperiencePage={isExperienceSlugPage} />
          {/* <ModeToggle /> */}
        </div>
        <div className="flex items-center xl:hidden">
          {/* <ModeToggle /> */}
          <MobileNav navItems={navItems} isExperiencePage={isExperienceSlugPage} />
        </div>
      </div>
    </header>
  );
}
