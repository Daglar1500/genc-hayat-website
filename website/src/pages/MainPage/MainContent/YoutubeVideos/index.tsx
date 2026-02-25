import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';

// --- MOCK DATA ---
const YOUTUBE_VIDEOS = [
  {
    id: "1",
    title: "Cumhuriyet'in 100. Yılında Gençlik ve Gelecek Tartışmaları",
    thumbnail: "https://www.evrensel.net/images/840/upload/dosya/113047.jpg",
    duration: "14:20",
    date: "2 Gün önce",
    url: "https://www.youtube.com/@GencHayatt"
  },
  {
    id: "2",
    title: "Sokak Röportajı: Gençlerin Ekonomiye Bakışı Nasıl?",
    thumbnail: "https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=800&auto=format&fit=crop",
    duration: "08:45",
    date: "1 Hafta önce",
    url: "https://www.youtube.com/@GencHayatt"
  },
  {
    id: "3",
    title: "Kültür Sanat: İstanbul Bienali'nden Öne Çıkanlar",
    thumbnail: "https://kulturbilinci.org/Thumbnail3.ashx?Type=Services&folder=Seminerler&width=600&height=600&url=populerkultur1revize.jpg",
    duration: "12:10",
    date: "2 Hafta önce",
    url: "https://www.youtube.com/@GencHayatt"
  },
  {
    id: "4",
    title: "Teknoloji Dosyası: Yapay Zeka Sanatı Öldürüyor mu?",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
    duration: "19:05",
    date: "3 Hafta önce",
    url: "https://www.youtube.com/@GencHayatt"
  }
];

// --- ICONS ---
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white ml-0.5">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 md:w-4 md:h-4">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// --- CAROUSEL CONSTANTS & HELPERS ---
const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

// Mobile için Dikey Video Kartı
const YoutubeMobileCard = ({ video }: { video: typeof YOUTUBE_VIDEOS[0] }) => (
  <a
    href={video.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group block bg-zinc-900 rounded-lg overflow-hidden h-full border border-white/5 hover:border-red-600/30 transition-all active:scale-95"
  >
    {/* Thumbnail - Aspect Video (16:9) */}
    <div className="relative aspect-video w-full overflow-hidden">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

      {/* Play Icon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-black/40 scale-90 group-hover:scale-100 transition-transform">
          <div className="w-5 h-5 text-white flex items-center justify-center">
            <PlayIcon />
          </div>
        </div>
      </div>
    </div>

    {/* Info */}
    <div className="p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-wide">
        <span>Video</span>
        <span className="w-1 h-1 bg-white/20 rounded-full" />
        <span className="flex items-center gap-1 text-white/50">
          <ClockIcon /> {video.duration}
        </span>
      </div>
      <h3 className="text-white font-labil font-bold text-lg leading-tight line-clamp-2 group-hover:text-red-500 transition-colors">
        {video.title}
      </h3>
      <p className="text-white/40 text-xs font-serif mt-1">
        {video.date}
      </p>
    </div>
  </a>
);

// Carousel Item Wrapper
const CarouselItem = ({ video, itemWidth }: { video: any, itemWidth: number }) => {
  return (
    <div
      className="relative flex flex-col shrink-0 justify-start"
      style={{ width: itemWidth }}
    >
      <div className="h-full select-none">
        <YoutubeMobileCard video={video} />
      </div>
    </div>
  );
};

// Mobile Carousel Logic
const MobileCarousel = ({ videos }: { videos: any[] }) => {
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
    if (!loop) return videos;
    if (videos.length === 0) return [];
    return [videos[videos.length - 1], ...videos, videos[0]];
  }, [videos, loop]);

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
      const target = videos.length;
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
  const activeIndex = videos.length === 0 ? 0 : loop ? (position - 1 + videos.length) % videos.length : Math.min(position, videos.length - 1);

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
        {itemsForRender.map((video, index) => (
          <CarouselItem key={`${index}-${video.id}`} video={video} itemWidth={itemWidth} />
        ))}
      </motion.div>

      {/* Indicators */}
      <div className="flex justify-center w-full mt-6 gap-2">
        {videos.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${activeIndex === index ? 'bg-red-600' : 'bg-zinc-800'}`}
            animate={{ scale: activeIndex === index ? 1.2 : 1 }}
            onClick={() => setPosition(loop ? index + 1 : index)}
          />
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const VideoSection = () => {
  const [featuredVideo, ...otherVideos] = YOUTUBE_VIDEOS;
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => { setIsMobile(window.innerWidth < 1024); }; // lg breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="bg-black py-16 md:py-24 font-bradford text-white overflow-hidden relative">

      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-red-900/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

      {/* Container - Desktop: 140px padding */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-[140px] relative z-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-10 border-b border-white/10 pb-4 md:pb-6">
          <div>
            <span className="text-red-600 font-bold tracking-widest text-[10px] md:text-xs uppercase mb-1 md:mb-2 block">
              Genç Hayat YouTube
            </span>
            <h2 className="text-3xl md:text-5xl font-labil font-bold text-white leading-tight">
              Son Videolar
            </h2>
          </div>

          <a
            href="https://www.youtube.com/@GencHayatt"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs md:text-sm font-serif italic group"
          >
            Tümünü İzle
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* Content Switcher */}
        {isMobile ? (
          // MOBILE VIEW
          <div className="flex flex-col gap-8">
            <MobileCarousel videos={YOUTUBE_VIDEOS} />

            {/* Mobile Subscribe Button */}
            <div className="px-0">
              <a
                href="https://www.youtube.com/@GencHayatt?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-sm shadow-lg hover:shadow-red-900/40 hover:-translate-y-1"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                Kanalımıza Göz Atın!
              </a>
            </div>
          </div>
        ) : (
          // DESKTOP VIEW
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

            {/* LEFT: Featured Video (Large) - 7 Columns */}
            <div className="lg:col-span-7 h-full">
              <a
                href={featuredVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative w-full h-full min-h-[400px] lg:min-h-0 bg-zinc-900 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 shadow-2xl"
                onMouseEnter={() => setHoveredVideo(featuredVideo.id)}
                onMouseLeave={() => setHoveredVideo(null)}
              >
                <img
                  src={featuredVideo.thumbnail}
                  alt={featuredVideo.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-red-600/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-red-900/50 relative z-10">
                    <div className="w-6 h-6 md:w-10 md:h-10 text-white flex items-center justify-center">
                      <PlayIcon />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20">
                  <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
                    <span>Yeni Video</span>
                    <span className="w-1 h-1 bg-white/50 rounded-full" />
                    <span className="text-white/70 flex items-center gap-1">
                      <ClockIcon /> {featuredVideo.duration}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-3xl font-labil font-bold text-white leading-tight group-hover:text-red-500 transition-colors line-clamp-2">
                    {featuredVideo.title}
                  </h3>
                </div>
              </a>
            </div>

            {/* RIGHT: Video List + Button - 5 Columns */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full gap-6">

              {/* Video List */}
              <div className="flex flex-col gap-4">
                {otherVideos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-3 md:gap-4 p-2 md:p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                  >
                    <div className="relative w-28 md:w-40 aspect-video shrink-0 bg-zinc-800 rounded-lg overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                          <div className="w-3 h-3 md:w-4 md:h-4 text-white flex items-center justify-center">
                            <PlayIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="text-white font-medium text-sm md:text-lg leading-snug mb-1 md:mb-2 line-clamp-2 group-hover:text-red-500 transition-colors font-labil">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-white/50">
                        <span>{video.date}</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon /> {video.duration}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* ABONE OL BUTONU - SAĞ SÜTUNUN DİBİNDE */}
              <div className="mt-auto pt-2">
                <a
                  href="https://www.youtube.com/@GencHayatt?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-xs md:text-sm shadow-lg hover:shadow-red-900/40 hover:-translate-y-1"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                  Kanalımıza Göz Atın!
                </a>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
};