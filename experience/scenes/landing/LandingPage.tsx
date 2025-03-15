"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleClick = async () => {
    setIsExiting(true);
    // Wait for animation to complete before navigating
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/experience");
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-background z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex h-full max-w-prose mx-auto items-center justify-center flex-col gap-12">
          <h1 className="text-4xl font-bold">
            <Image
              src="/images/logo.webp"
              alt="O'Linn Security Inc."
              width={100}
              height={100}
            />
          </h1>
          <p className="text-xl text-center">
            With over 38 years of experience, O'Linn Security Inc. offers
            comprehensive security solutions tailored to your needs.
          </p>
          <Button size="lg" onClick={handleClick}>
            ENTER EXPERIENCE
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
