import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAVIGATION_QUERYResult } from "@/sanity.types";

type SanityLink = NonNullable<NAVIGATION_QUERYResult[0]["links"]>[number];

export default function DesktopNav({
  navigation,
}: {
  navigation: NAVIGATION_QUERYResult;
}) {
  return (
    <div className="hidden xl:flex items-center gap-7 text-primary">
      {navigation[0]?.links?.map((navItem: SanityLink) => (
        <Link
          key={navItem._key}
          href={navItem.href || "#"}
          target={navItem.target ? "_blank" : undefined}
          rel={navItem.target ? "noopener noreferrer" : undefined}
          className={cn(
            buttonVariants({
              variant: navItem.buttonVariant || "default",
            }),
            navItem.buttonVariant === "ghost" &&
              "transition-colors hover:text-foreground/80 text-foreground/60 text-sm p-0 h-auto hover:bg-transparent"
          )}
        >
          {navItem.title}
        </Link>
      ))}
    </div>
  );
}
