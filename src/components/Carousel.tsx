"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
import { Briefcase, User, Mail, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const baseItems = [
  { id: "projects", title: "Projects", summary: "Case studies & work", href: "/projects", icon: Briefcase, tint: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" },
  { id: "about", title: "About Me", summary: "Academic & professional history", href: "/about", icon: User, tint: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" },
  { id: "newsletter", title: "Newsletter", summary: "Updates & thoughts", href: "/newsletter", icon: Mail, tint: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400" },
];

const MULTIPLIER = 7; // Enough track to sustain very fast momentum flicks
const items = Array.from({ length: MULTIPLIER }).flatMap((_, i) =>
  baseItems.map((item) => ({ ...item, uniqueId: `${item.id}-${i}` }))
);

const ITEM_WIDTH = 280;
const INITIAL_INDEX = Math.floor(MULTIPLIER / 2) * baseItems.length;

export default function Carousel() {
  const router = useRouter();

  // Global drag tracking with zero-lag
  const x = useMotionValue(-INITIAL_INDEX * ITEM_WIDTH);
  const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX);

  const handleDragEnd = (e: any, info: PanInfo) => {
    const currentX = x.get();
    const velocity = info.velocity.x;

    // Calculate projected end point based on momentum
    const targetX = currentX + velocity * 0.2;

    let closestIndex = Math.round(-targetX / ITEM_WIDTH);
    closestIndex = Math.max(0, Math.min(closestIndex, items.length - 1));

    const snapX = -closestIndex * ITEM_WIDTH;

    animate(x, snapX, {
      type: "spring",
      stiffness: 250,
      damping: 30,
      velocity: velocity,
      onUpdate: (latest) => {
        const currentIndex = Math.round(-latest / ITEM_WIDTH);
        if (currentIndex !== activeIndex) {
          setActiveIndex(Math.max(0, Math.min(currentIndex, items.length - 1)));
        }
      },
      onComplete: () => {
        // Infinite Wrap-Around Check
        const currentIndex = Math.round(-x.get() / ITEM_WIDTH);
        const middleIndexBase = Math.floor(MULTIPLIER / 2) * baseItems.length;
        const offsetInBase = currentIndex % baseItems.length;
        const targetMiddleIndex = middleIndexBase + offsetInBase;

        // If getting too close to edge of the duplicated track, seamlessly snap to center set
        if (currentIndex < baseItems.length * 2 || currentIndex >= items.length - baseItems.length * 2) {
          x.set(-targetMiddleIndex * ITEM_WIDTH);
          setActiveIndex(targetMiddleIndex);
        }
      }
    });
  };

  const handleDrag = () => {
    const currentIndex = Math.round(-x.get() / ITEM_WIDTH);
    if (currentIndex !== activeIndex) {
      setActiveIndex(Math.max(0, Math.min(currentIndex, items.length - 1)));
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[400px] flex items-center justify-center overflow-hidden touch-none">
      <motion.div
        drag="x"
        dragConstraints={{ left: -(items.length - 1) * ITEM_WIDTH, right: 0 }}
        style={{ x }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {items.map((item, index) => {
          return (
            <Card
              key={item.uniqueId}
              item={item}
              index={index}
              x={x}
              activeIndex={activeIndex}
              router={router}
              onCardClick={() => {
                if (index !== activeIndex) {
                  animate(x, -index * ITEM_WIDTH, { type: "spring", stiffness: 300, damping: 30 });
                  setActiveIndex(index);
                }
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

function Card({ item, index, x, activeIndex, router, onCardClick }: any) {
  const cardPosition = index * ITEM_WIDTH;

  // Real-Time Visual Syncing mapping offset to scale & opacity dynamically
  const distance = useTransform(x, (latestX: number) => latestX + cardPosition);

  const scale = useTransform(distance, [-ITEM_WIDTH * 1.5, 0, ITEM_WIDTH * 1.5], [0.85, 1, 0.85]);
  const opacity = useTransform(distance, [-ITEM_WIDTH * 1.5, 0, ITEM_WIDTH * 1.5], [0.4, 1, 0.4]);
  const zIndex = useTransform(distance, [-ITEM_WIDTH, 0, ITEM_WIDTH], [0, 10, 0]);

  // Button fluid transformations
  const buttonOpacity = useTransform(distance, [-ITEM_WIDTH * 0.5, 0, ITEM_WIDTH * 0.5], [0, 1, 0]);
  const buttonY = useTransform(distance, [-ITEM_WIDTH * 0.5, 0, ITEM_WIDTH * 0.5], [15, 0, 15]);

  const isActive = index === activeIndex;
  const Icon = item.icon;

  return (
    <motion.div
      style={{ scale, opacity, zIndex, x: cardPosition, position: "absolute" }}
      onClick={onCardClick}
      className={`w-72 h-96 rounded-3xl p-6 flex flex-col justify-between cursor-pointer glass-card ${isActive ? "shadow-2xl" : ""
        }`}
    >
      <div className="flex flex-col items-center mt-8 space-y-4">
        <div className={`p-4 rounded-full border ${item.tint}`}>
          <Icon size={48} className="currentColor" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{item.title}</h2>
        <p className="text-center text-slate-600 dark:text-slate-400 font-medium">{item.summary}</p>
      </div>

      <motion.div style={{ opacity: buttonOpacity, y: buttonY, pointerEvents: isActive ? "auto" : "none" }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            if (isActive) router.push(item.href);
          }}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg"
        >
          Explore <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
