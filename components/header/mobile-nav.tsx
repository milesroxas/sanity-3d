"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavItem } from "@/types";
import Logo from "@/components/logo";
import { useState } from "react";
import { TextAlignRightIcon } from "@radix-ui/react-icons";

export default function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          aria-label="Open Menu"
          variant="ghost"
          className="w-[1.75rem] p-5 focus-visible:ring-1 focus-visible:ring-offset-1"
        >
          <TextAlignRightIcon className="dark:text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="mr-6 ml-auto">
            <Logo />
          </div>
          <div className="sr-only">
            <SheetTitle>Main Navigation</SheetTitle>
            <SheetDescription>Navigate to the website pages</SheetDescription>
          </div>
        </SheetHeader>
        <div className="pt-10 pb-20">
          <div className="container">
            <ul className="list-none text-right space-y-3">
              <>
                {navItems.map((navItem) => (
                  <li key={navItem.label}>
                    <Link
                      onClick={() => setOpen(false)}
                      href={navItem.href}
                      target={navItem.target ? "_blank" : undefined}
                      rel={navItem.target ? "noopener noreferrer" : undefined}
                      className="hover:text-decoration-none hover:opacity-50 text-lg"
                    >
                      {navItem.label}
                    </Link>
                  </li>
                ))}
              </>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
