import Link from "next/link";
import Image from "next/image";
import MobileNav from "@/components/header/mobile-nav";
import DesktopNav from "@/components/header/desktop-nav";
import { ModeToggle } from "@/components/menu-toggle";
import { urlFor } from "@/sanity/lib/image";
import { fetchSanitySettings } from "@/app/(main)/actions";

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

export default async function Header() {
  const settings = await fetchSanitySettings();
  const logo = settings.logo;

  return (
    <header className="sticky top-0 w-full border-border/40 z-50 py-2">
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
          <DesktopNav navItems={navItems} />
          <ModeToggle />
        </div>
        <div className="flex items-center xl:hidden">
          <ModeToggle />
          <MobileNav navItems={navItems} />
        </div>
      </div>
    </header>
  );
}
