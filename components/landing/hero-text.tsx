"use client";
import React from "react";
import { Cover } from "@/components/ui/cover";
import { motion } from "motion/react";

export function HeroText() {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <span className="inline-flex items-center gap-2 px-3 py-1 z-100  rounded-full bg-gray-400/80 text-black font-bold text-xs shadow mt-20 mb-2">
        <svg
          width="18"
          height="18"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="32" height="32" rx="6" fill="#FF6900" />
          <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="white"
          >
            YC
          </text>
        </svg>
        not backed yet
      </span>
      <h1 className="text-4xl md:text-4xl lg:text-8xl font-semibold max-w-7xl mx-auto text-center  relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Write trendy scripts <br /> at <Cover>warp speed</Cover>
      </h1>
      <p className="max-w-xl mx-auto text-center text-base italic md:text-lg text-muted-foreground mt-5 mb-4">
        Let your words echo your imagination.
      </p>
      <button className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
        Start Imagining
      </button>
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          delay: 1.2,
        }}
        className="relative z-10 mt-10 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="md:max-w-7xl w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
          <img
            src="https://assets.aceternity.com/pro/aceternity-landing.webp"
            alt="Landing page preview"
            className="aspect-[16/9] h-auto w-full object-cover"
            height={1000}
            width={1000}
          />
        </div>
      </motion.div>
    </div>
  );
}
