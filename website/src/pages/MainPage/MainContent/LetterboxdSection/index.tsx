import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';

type FilmItem = {
  id: string;
  url: string;
  title?: string;
  year?: string;
  posterUrl?: string;
};

function getFilmSlug(url: string): string {
  const clean = url.replace(/\/$/, '');
  return clean.split('/').pop() || url;
}

function formatSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const FilmCard = ({ film, index }: { film: FilmItem; index: number }) => {
  const slug = useMemo(() => getFilmSlug(film.url), [film.url]);
  const label = film.title || formatSlug(slug);

  return (
    <a
      href={film.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative aspect-[2/3] rounded-md overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/50"
    >
      {/* Poster image or dark placeholder */}
      {film.posterUrl ? (
        <img
          src={film.posterUrl}
          alt={label}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center gap-2 p-3 text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-7 h-7 text-zinc-600">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* "En Son" badge */}
      {index === 0 && (
        <span className="absolute top-2 left-2 text-[#00c030] text-[9px] font-bold tracking-widest uppercase bg-black/70 px-1.5 py-0.5 rounded">
          En Son
        </span>
      )}

      {/* Letterboxd green ring on hover */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-[#00c030]/70 rounded-md transition-all duration-300" />

      {/* Title + year at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-xs font-bold leading-tight line-clamp-2 group-hover:text-[#00c030] transition-colors duration-200">
          {label}
        </p>
        {film.year && (
          <p className="text-white/40 text-[10px] mt-0.5 font-mono">{film.year}</p>
        )}
      </div>
    </a>
  );
};

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 12;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

const MobileCarousel = ({ films }: { films: FilmItem[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(300);
  const VISIBLE = 2;

  useEffect(() => {
    const update = () => { if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth); };
    requestAnimationFrame(update);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const itemWidth = (containerWidth - GAP * (VISIBLE - 1)) / VISIBLE;
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (films.length === 0) return [];
    return [films[films.length - 1], ...films, films[0]];
  }, [films]);

  const [position, setPosition] = useState(1);
  const x = useMotionValue(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setPosition(1);
    x.set(-1 * trackItemOffset);
  }, [itemsForRender.length, trackItemOffset, x]);

  const handleAnimationComplete = () => {
    if (itemsForRender.length <= 1) { setIsAnimating(false); return; }
    const lastClone = itemsForRender.length - 1;
    if (position === lastClone) {
      setIsJumping(true); setPosition(1); x.set(-1 * trackItemOffset);
      requestAnimationFrame(() => { setIsJumping(false); setIsAnimating(false); });
      return;
    }
    if (position === 0) {
      setIsJumping(true); const t = films.length; setPosition(t); x.set(-t * trackItemOffset);
      requestAnimationFrame(() => { setIsJumping(false); setIsAnimating(false); });
      return;
    }
    setIsAnimating(false);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const dir = info.offset.x < -DRAG_BUFFER || info.velocity.x < -VELOCITY_THRESHOLD ? 1
      : info.offset.x > DRAG_BUFFER || info.velocity.x > VELOCITY_THRESHOLD ? -1 : 0;
    if (dir !== 0) setPosition(prev => prev + dir);
  };

  const activeIndex = films.length === 0 ? 0 : (position - 1 + films.length) % films.length;
  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  return (
    <div ref={containerRef} className="relative overflow-hidden w-full touch-pan-y">
      <motion.div
        className="flex"
        drag={isAnimating ? false : 'x'}
        style={{ gap: `${GAP}px`, x }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((film, index) => (
          <div key={`${index}-${film.id}`} className="shrink-0" style={{ width: itemWidth }}>
            <FilmCard film={film} index={index === 1 ? 0 : index} />
          </div>
        ))}
      </motion.div>
      <div className="flex justify-center w-full mt-6 gap-2">
        {films.map((_, index) => (
          <motion.div
            key={index}
            className={`h-1.5 rounded-full cursor-pointer transition-all duration-150 ${activeIndex === index ? 'w-4 bg-[#00c030]' : 'w-1.5 bg-white/20'}`}
            onClick={() => setPosition(index + 1)}
          />
        ))}
      </div>
    </div>
  );
};

export const LetterboxdSection = ({ films, profileUrl }: { films: FilmItem[], profileUrl: string }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section className="bg-zinc-950 py-16 md:py-24 font-bradford text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-green-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-[140px] relative z-10">
        <div className="flex items-end justify-between mb-8 md:mb-10 border-b border-white/10 pb-4 md:pb-6">
          <div>
            <span className="text-[#00c030] font-bold tracking-widest text-[10px] md:text-xs uppercase mb-1 md:mb-2 block">
              Genç Hayat Letterboxd
            </span>
            <h2 className="text-3xl md:text-5xl font-labil font-bold text-white leading-tight">
              Son İzlenenler
            </h2>
          </div>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 text-white/70 hover:text-[#00c030] transition-colors text-xs md:text-sm font-serif italic group"
          >
            Profilimize Bak
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {isMobile ? (
          <div className="flex flex-col gap-8">
            <MobileCarousel films={films} />
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border border-[#00c030] text-[#00c030] hover:bg-[#00c030] hover:text-black font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-sm"
            >
              Letterboxd Profilimiz
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Featured film — larger */}
            <div className="lg:col-span-3">
              {films[0] && <FilmCard film={films[0]} index={0} />}
            </div>

            {/* Rest of films + button */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              <div className="grid grid-cols-5 gap-4">
                {films.slice(1, 6).map((film, i) => (
                  <FilmCard key={film.id} film={film} index={i + 1} />
                ))}
              </div>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 border border-[#00c030] text-[#00c030] hover:bg-[#00c030] hover:text-black font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-sm"
              >
                Letterboxd Profilimize Göz Atın
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LetterboxdSection;
