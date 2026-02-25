import { ArticleCardElement } from "../../ArticleCard";
import { MOCK_ARTICLES } from "../../../../data/MockArticles";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';

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
      {/* pointer-events-none kaldırıldı, böylece linklere tıklanabilir */}
      <div className="bg-white w-full h-full select-none">
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

  const handleAnimationStart = () => { setIsAnimating(true); };

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
    const direction = offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD ? 1 : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD ? -1 : 0;
    if (direction === 0) return;
    setPosition(prev => prev + direction);
  };

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;
  const activeIndex = articles.length === 0 ? 0 : loop ? (position - 1 + articles.length) % articles.length : Math.min(position, articles.length - 1);

  return (
    <div ref={containerRef} className="relative overflow-hidden w-full touch-pan-y h-full">
      <motion.div
        className="flex"
        drag={isAnimating ? false : 'x'}
        style={{ width: itemWidth, gap: `${GAP}px`, x }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((article, index) => (
          <CarouselItem key={`${index}-${article.title}`} article={article} itemWidth={itemWidth} />
        ))}
      </motion.div>
      <div className="flex justify-center w-full mt-6 gap-2">
        {articles.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${activeIndex === index ? 'bg-zinc-800' : 'bg-zinc-300'}`}
            animate={{ scale: activeIndex === index ? 1.2 : 1 }}
            onClick={() => setPosition(loop ? index + 1 : index)}
          />
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

interface ArticleLineProps {
  articles?: any[]; // Dışarıdan gelen makale listesi
  className?: string;
}

export const ArticleLine = ({ articles, className }: ArticleLineProps) => {
  const [isMobile, setIsMobile] = useState(false);

  // 1. Veri Kontrolü: Prop gelirse onu kullan, yoksa Mock'tan ilk 4'ü al
  const displayedArticles = useMemo(() => {
    if (articles && articles.length > 0) return articles;
    return MOCK_ARTICLES.slice(0, 4);
  }, [articles]);

  // 2. Grid Sınıfı Hesaplama: 3'lü veya 4'lü yapıya göre dinamik
  const gridClassName = useMemo(() => {
    const count = displayedArticles.length;
    let classes = "grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-";

    if (count === 3) {
      // 3 tane ise: LG ve XL'de 3 sütun
      classes += " lg:grid-cols-3 xl:grid-cols-3";
    } else {
      // 4 (veya diğer) ise: LG'de 3, XL'de 4 sütun (Varsayılan)
      classes += " lg:grid-cols-3 xl:grid-cols-4";
    }

    return classes;
  }, [displayedArticles.length]);

  useEffect(() => {
    const checkMobile = () => { setIsMobile(window.innerWidth < 768); };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Eğer gösterilecek makale yoksa boş dön
  if (!displayedArticles || displayedArticles.length === 0) return null;

  return (
    // STANDART HİZALAMA: px-4 md:px-10 lg:px-[140px]
    <article className={`w-full max-w-[1600px] mx-auto px-0 md:px-0 lg:px-[140px] py-6 md:py-10 ${className || ''}`}>
      {isMobile ? (
        <MobileCarousel articles={displayedArticles} />
      ) : (
        <div className={gridClassName}>
          {displayedArticles.map((article, index) => (
            <ArticleCardElement
              key={index}
              {...article}
            />
          ))}
        </div>
      )}
    </article>
  );
};