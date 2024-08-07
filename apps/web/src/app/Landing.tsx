"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../components/ui/acerternity/lamp";
import AnimatedGradientText from "@/components/ui/magicui/gradiant-text";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export function Landing() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="-mt-20 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        YourPenPal <br /> is one step away from you!
      </motion.h1>
      <motion.div className="z-10 flex min-h-10 items-center justify-center"
      initial={{ opacity: 0.5, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      >
      <AnimatedGradientText className="cursor-pointer h-10"  >
        🎉 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{" "}
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
          )}
        >
          Log In with Google
        </span>
        <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 text-white" />
      </AnimatedGradientText>
    </motion.div>
    </LampContainer>
  );
}
