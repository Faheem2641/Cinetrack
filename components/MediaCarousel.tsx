"use client";

import { useRef, useState, useEffect } from "react";

interface MediaCarouselProps {
  children: React.ReactNode;
}

export default function MediaCarousel({ children }: MediaCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeft(scrollLeft > 15);
      // Give a tiny tolerance buffer
      setShowRight(scrollLeft + clientWidth < scrollWidth - 15);
    }
  };

  const handleScrollEffects = () => {
    checkScroll();
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      el.addEventListener("scroll", handleScrollEffects, { passive: true });
      
      // Translate vertical mouse wheel scrolling into horizontal carousel scrolling
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          // Only intercept the scroll if the cursor is hovering directly over a card item
          const target = e.target as HTMLElement;
          const isOverCard = target.closest("a") || target.closest(".group");

          if (isOverCard) {
            // If we are at the far left and scrolling left, or at the far right and scrolling right,
            // let the scroll bubble up so the user can continue scrolling down the page.
            const isAtLeft = el.scrollLeft <= 5 && e.deltaY < 0;
            const isAtRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5 && e.deltaY > 0;
            
            if (!isAtLeft && !isAtRight) {
              e.preventDefault();
              // Smoothly increment horizontal offset
              el.scrollLeft += e.deltaY;
            }
          }
        }
      };

      el.addEventListener("wheel", handleWheel, { passive: false });
      
      // Initial check
      handleScrollEffects();
      
      // Check after images/fonts might have loaded
      const timer = setTimeout(handleScrollEffects, 500);
      
      window.addEventListener("resize", handleScrollEffects);
      return () => {
        el.removeEventListener("scroll", handleScrollEffects);
        el.removeEventListener("wheel", handleWheel);
        window.removeEventListener("resize", handleScrollEffects);
        clearTimeout(timer);
      };
    }
  }, [children]);

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.75; // Scroll 75% of view width
      const target = carouselRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      carouselRef.current.scrollTo({
        left: target,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/carousel w-full">
      {/* Fade Edge Masks */}
      {showRight && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 sm:w-24 bg-gradient-to-l from-[#0f1a1b] to-transparent z-15 transition-opacity duration-300" />
      )}
      {showLeft && (
        <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-12 sm:w-24 bg-gradient-to-r from-[#0f1a1b] to-transparent z-15 transition-opacity duration-300" />
      )}

      {/* Left Chevron Control */}
      <button
        onClick={() => handleScroll("left")}
        className={`absolute left-2 top-[40%] -translate-y-1/2 z-20 p-2.5 rounded-full bg-[#0f1a1b]/85 border border-[#3D4D55]/50 text-[#D3C3B9] hover:bg-[#B58863] hover:text-[#0f1a1b] hover:border-transparent active:scale-95 shadow-xl transition-all duration-300 cursor-pointer ${
          showLeft ? "opacity-0 group-hover/carousel:opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll Left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Right Chevron Control */}
      <button
        onClick={() => handleScroll("right")}
        className={`absolute right-2 top-[40%] -translate-y-1/2 z-20 p-2.5 rounded-full bg-[#0f1a1b]/85 border border-[#3D4D55]/50 text-[#D3C3B9] hover:bg-[#B58863] hover:text-[#0f1a1b] hover:border-transparent active:scale-95 shadow-xl transition-all duration-300 cursor-pointer ${
          showRight ? "opacity-0 group-hover/carousel:opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll Right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div
        ref={carouselRef}
        onScroll={handleScrollEffects}
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-10 px-4"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* We map and wrap individual cards in items with snap alignment */}
        {children}
      </div>
    </div>
  );
}
