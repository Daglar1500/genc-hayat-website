import { ArticleCardElement, Label, Labelo } from "../../ArticleCard"; 
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';

// --- HELPER: Hex Number to String ---
const hexToString = (hex: number) => `#${hex.toString(16).padStart(6, '0')}`;

// --- CONSTANTS ---
const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

// --- ITEM COMPONENT ---
interface CarouselItemProps {
  article: any;
  itemWidth: number;
}

const CarouselItem = ({ article, itemWidth }: CarouselItemProps) => {
  return (
    <div
      className="relative flex flex-col shrink-0 justify-start"
      style={{ width: itemWidth }}
    >
      <div className="bg-white p-1.5 h-full select-none">
         <ArticleCardElement {...article} />
      </div>
    </div>
  );
};

// --- MOBILE CAROUSEL COMPONENT ---
const MobileCarousel = ({ articles }: { articles: any[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(300);
  const loop = true; 

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    requestAnimationFrame(updateWidth);
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const containerPadding = 0; 
  const itemWidth = containerWidth - (containerPadding * 2);
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop) return articles;
    if (articles.length === 0) return [];
    return [articles[articles.length - 1], ...articles, articles[0]];
  }, [articles, loop]);

  const [position, setPosition] = useState<number>(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [itemsForRender.length, loop, trackItemOffset, x]);

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }

    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true); 
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = articles.length;
      setPosition(target);
      x.set(-target * trackItemOffset);

      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: any, info: PanInfo): void => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition(prev => prev + direction);
  };

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const activeIndex = articles.length === 0 ? 0 : loop ? 
    (position - 1 + articles.length) % articles.length : 
    Math.min(position, articles.length - 1);

  return (
    <div ref={containerRef} className="relative overflow-hidden w-full touch-pan-y h-full">
      <motion.div
        className="flex"
        drag={isAnimating ? false : 'x'}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          x 
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((article, index) => (
          <CarouselItem
            key={`${index}-${article.title}`}
            article={article}
            itemWidth={itemWidth}
          />
        ))}
      </motion.div>

      {/* İndikatörler */}
      <div className="flex justify-center w-full mt-6 gap-2">
        {articles.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${activeIndex === index ? 'bg-white' : 'bg-white/40'}`}
              animate={{ scale: activeIndex === index ? 1.2 : 1 }}
              onClick={() => setPosition(loop ? index + 1 : index)}
            />
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

interface CategorySectionProps {
  categoryTitle: string; // İsteğinize uygun olarak 'categoryTitle' olarak güncellendi
  articles: any[];       // Dışarıdan gelen makale listesi
}

export const CategorySection = ({ categoryTitle, articles }: CategorySectionProps) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // categoryTitle prop'unu kullanarak renk ve link oluşturma
  const categoryInfo = useMemo(() => new Labelo("category", categoryTitle), [categoryTitle]);
  const sectionColor = hexToString(categoryInfo.color);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); 
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Eğer makale listesi boşsa bu bölümü hiç gösterme
  if (!articles || articles.length === 0) return null;

  return (
    <section 
      className="py-16 md:py-20 font-bradford transition-colors duration-300"
      style={{ backgroundColor: sectionColor }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-[140px]">
        
        {/* Header Section */}
        <div className="mb-10 border-b border-white/30 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            
            {/* Title */}
            <div>
              <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tight mb-2 capitalize">
                {categoryTitle}
              </h2>
            </div>

            {/* "More" Link */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-white/80 font-serif italic">
                Daha fazlası için
              </span>
              <a
                href={categoryInfo.href}
                className="cursor-pointer"
              >
                <Label label={categoryTitle} />
              </a>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isMobile ? (
          <MobileCarousel articles={articles} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div key={index} className="bg-white p-4 h-full">
                <ArticleCardElement {...article} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};