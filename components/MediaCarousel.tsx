"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface MediaCarouselProps {
  children: React.ReactNode;
}

export default function MediaCarousel({ children }: MediaCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Drag-to-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const checkScroll = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeft(scrollLeft > 15);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 15);
    }
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    checkScroll();

    const handleScroll = () => {
      checkScroll();
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    const timer = setTimeout(checkScroll, 400);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, [children, checkScroll]);

  // Smooth mouse drag-to-scroll implementation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftStart.current = carouselRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleChevronScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.75;
      const target =
        carouselRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      carouselRef.current.scrollTo({
        left: target,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/carousel w-full">
      {/* Fade Edge Gradient Masks */}
      {showRight && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 sm:w-24 bg-gradient-to-l from-[#0f1a1b] to-transparent z-15 transition-opacity duration-300" />
      )}
      {showLeft && (
        <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-12 sm:w-24 bg-gradient-to-r from-[#0f1a1b] to-transparent z-15 transition-opacity duration-300" />
      )}

      {/* Left Chevron Button */}
      <button
        onClick={() => handleChevronScroll("left")}
        className={`absolute left-2 top-[42%] -translate-y-1/2 z-20 p-3 rounded-full bg-[#0f1a1b]/90 border border-white/10 text-[#D3C3B9] hover:bg-[#B58863] hover:text-[#0f1a1b] hover:border-transparent active:scale-90 shadow-2xl transition-all duration-300 cursor-pointer ${
          showLeft ? "opacity-0 group-hover/carousel:opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll Left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Right Chevron Button */}
      <button
        onClick={() => handleChevronScroll("right")}
        className={`absolute right-2 top-[42%] -translate-y-1/2 z-20 p-3 rounded-full bg-[#0f1a1b]/90 border border-white/10 text-[#D3C3B9] hover:bg-[#B58863] hover:text-[#0f1a1b] hover:border-transparent active:scale-90 shadow-2xl transition-all duration-300 cursor-pointer ${
          showRight ? "opacity-0 group-hover/carousel:opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll Right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Smooth Scrollable Container */}
      <div
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-6 px-4 scroll-smooth cursor-grab active:cursor-grabbing select-none"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        {children}
      </div>
    </div>
  );
}
