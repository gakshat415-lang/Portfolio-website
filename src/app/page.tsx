"use client";

import Carousel from "@/components/Carousel";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

function HeroText() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="relative group cursor-default animate-focus-in"
      onMouseMove={handleMouseMove}
    >
      {/* Base Text (Solid Black) */}
      <h1 className="text-[clamp(1.8rem,4vw,3.5rem)] font-extrabold tracking-[-0.03em] text-black dark:text-white text-center leading-tight">
        Product &bull; Strategy &bull; AI
      </h1>
      
      {/* Radiant Spotlight Overlay */}
      <motion.h1
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none text-[clamp(1.8rem,4vw,3.5rem)] font-extrabold tracking-[-0.03em] text-center leading-tight bg-clip-text text-transparent"
        style={{
          backgroundImage: useMotionTemplate`
            radial-gradient(
              160px circle at ${mouseX}px ${mouseY}px,
              rgba(37, 99, 235, 0.7) 0%,
              rgba(255, 255, 255, 0.4) 30%,
              transparent 70%
            )
          `,
        }}
      >
        Product &bull; Strategy &bull; AI
      </motion.h1>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 w-full flex-col items-center justify-center px-4 overflow-hidden py-2 md:py-6">
      
      {/* Top: Hero Section */}
      <div className="flex flex-col items-center justify-center mt-2 md:mt-6 mb-2">
        <HeroText />
      </div>

      {/* Middle: Interactive Carousel */}
      <div className="w-full flex items-center justify-center my-4 scale-90 sm:scale-95 md:scale-100 origin-center">
        <Carousel />
      </div>

      {/* Bottom: Instructional Text */}
      <div className="mt-2 md:mt-4 mb-4">
        <motion.p 
          animate={{ x: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-[10px] md:text-xs uppercase tracking-[0.1em] text-slate-400 font-bold select-none text-center"
        >
          Swipe to browse
        </motion.p>
      </div>

    </main>
  );
}
