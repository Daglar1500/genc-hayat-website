import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';

// --- MOCK DATA ---
const SPOTIFY_PLAYLISTS = [
  {
    id: "1",
    title: "Genç Hayat: Okuma Listesi",
    description: "Dergi okurken size eşlik edecek, odaklanmayı artıran enstrümantal seçkiler.",
    cover: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cd4da691f9cf0d37ca297656d",
    trackCount: "42 Şarkı",
    url: "https://open.spotify.com/user/spotify" 
  },
  {
    id: "2",
    title: "Türkçe Alternatif & Indie",
    description: "Yerli sahnenin en taze sesleri ve keşfedilmeyi bekleyenler.",
    cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop",
    trackCount: "28 Şarkı",
    url: "https://open.spotify.com/user/spotify"
  },
  {
    id: "3",
    title: "Pazar Sabahı Kahvesi",
    description: "Hafta sonuna sakin bir başlangıç için yumuşak tonlar.",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    trackCount: "35 Şarkı",
    url: "https://open.spotify.com/user/spotify"
  },
  {
    id: "4",
    title: "Geçmişten Günümüze: Anadolu Rock",
    description: "Efsanevi gitar riffleri ve unutulmaz sözler.",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop",
    trackCount: "50 Şarkı",
    url: "https://open.spotify.com/user/spotify"
  },
  {
    id: "5",
    title: "Rap & Hip-Hop: Yeni Okul",
    description: "Sokağın ritmi, güçlü kafiyeler ve yeni nesil sesler.",
    cover: "https://images.unsplash.com/photo-1549497554-474c8309df55?q=80&w=800&auto=format&fit=crop",
    trackCount: "30 Şarkı",
    url: "https://open.spotify.com/user/spotify"
  }
];

// --- ICONS ---
const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.118-.96-.539-.12-.42.12-.84.54-.96 4.68-1.079 8.64-.66 11.94 1.38.36.24.48.66.24 1.02h.001zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.018.6-1.14 4.38-1.38 9.841-.72 13.441 1.56.419.24.6.84.3 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const PlayCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-black">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// --- CAROUSEL CONSTANTS & HELPERS ---
const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

// Mobile için dikey kart görünümü
const SpotifyMobileCard = ({ playlist }: { playlist: typeof SPOTIFY_PLAYLISTS[0] }) => (
  <a 
    href={playlist.url}
    target="_blank" 
    rel="noopener noreferrer"
    className="group block bg-zinc-900 rounded-lg overflow-hidden h-full border border-white/5 hover:border-[#1DB954]/30 transition-all active:scale-95"
  >
    {/* Cover Image */}
    <div className="relative aspect-square w-full overflow-hidden">
      <img 
        src={playlist.cover} 
        alt={playlist.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
      {/* Icon Overlay */}
      <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-black/40">
        <div className="w-5 h-5 text-black flex items-center justify-center">
          <PlayCircleIcon />
        </div>
      </div>
    </div>
    
    {/* Info */}
    <div className="p-4 flex flex-col gap-2">
      <h3 className="text-white font-labil font-bold text-lg leading-tight line-clamp-2 group-hover:text-[#1DB954] transition-colors">
        {playlist.title}
      </h3>
      <p className="text-white/60 text-xs font-serif line-clamp-2">
        {playlist.description}
      </p>
      <div className="mt-auto pt-2 flex items-center gap-1.5 text-[10px] font-bold text-[#1DB954] uppercase tracking-wide">
         <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Spotify" className="w-3 h-3" />
         {playlist.trackCount}
      </div>
    </div>
  </a>
);

// Carousel Item Wrapper
const CarouselItem = ({ playlist, itemWidth }: { playlist: any, itemWidth: number }) => {
  return (
    <div
      className="relative flex flex-col shrink-0 justify-start"
      style={{ width: itemWidth }}
    >
      <div className="h-full select-none">
         <SpotifyMobileCard playlist={playlist} />
      </div>
    </div>
  );
};

// Mobile Carousel Logic
const MobileCarousel = ({ playlists }: { playlists: any[] }) => {
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
    if (!loop) return playlists;
    if (playlists.length === 0) return [];
    return [playlists[playlists.length - 1], ...playlists, playlists[0]];
  }, [playlists, loop]);

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
      const target = playlists.length;
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
  const activeIndex = playlists.length === 0 ? 0 : loop ? (position - 1 + playlists.length) % playlists.length : Math.min(position, playlists.length - 1);

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
        {itemsForRender.map((playlist, index) => (
          <CarouselItem key={`${index}-${playlist.id}`} playlist={playlist} itemWidth={itemWidth} />
        ))}
      </motion.div>
      
      {/* Indicators */}
      <div className="flex justify-center w-full mt-6 gap-2">
        {playlists.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${activeIndex === index ? 'bg-[#1DB954]' : 'bg-zinc-800'}`}
              animate={{ scale: activeIndex === index ? 1.2 : 1 }}
              onClick={() => setPosition(loop ? index + 1 : index)}
            />
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const SpotifySection = () => {
  const [featuredPlaylist, ...otherPlaylists] = SPOTIFY_PLAYLISTS;
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
      <div className="absolute top-0 right-1/4 w-[60%] h-[60%] bg-[#1DB954]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Container */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-[140px] relative z-10">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#1DB954]">
                <SpotifyIcon />
              </span>
              <span className="text-[#1DB954] font-bold tracking-widest text-xs uppercase block">
                Genç Hayat Spotify
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-labil font-bold text-white leading-tight">
              Çalma Listelerimiz
            </h2>
          </div>
          
          <a 
            href="https://open.spotify.com/user/spotify" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-serif italic group"
          >
            Profilimizi Ziyaret Et
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* Content Switcher */}
        {isMobile ? (
          // MOBILE VIEW
          <div className="flex flex-col gap-8">
            <MobileCarousel playlists={SPOTIFY_PLAYLISTS} />
            
            {/* Mobile Follow Button */}
            <div className="px-0">
               <a 
                href="https://open.spotify.com/user/spotify" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-sm shadow-lg hover:shadow-green-900/40 hover:-translate-y-1"
               >
                 <SpotifyIcon />
                 Spotify'da Takip Et
               </a>
            </div>
          </div>
        ) : (
          // DESKTOP VIEW
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* LEFT: Featured Playlist */}
            <div className="lg:col-span-7 h-full">
              <a 
                href={featuredPlaylist.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block relative w-full h-full min-h-[400px] lg:min-h-0 bg-zinc-900 rounded-lg overflow-hidden border border-white/10 hover:border-[#1DB954]/50 transition-all duration-300 shadow-2xl"
              >
                <img 
                  src={featuredPlaylist.cover} 
                  alt={featuredPlaylist.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                  <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-green-900/50 p-3">
                     <PlayCircleIcon />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                  {/* BÜYÜK HARFLE MANUEL YAZILDI */}
                  <span className="inline-block bg-[#1DB954] text-black text-[10px] font-bold px-2 py-1 rounded mb-3 tracking-wider">
                    ÖNE ÇIKAN LİSTE
                  </span>
                  <h3 className="text-3xl md:text-4xl font-labil font-bold text-white leading-tight mb-2">
                    {featuredPlaylist.title}
                  </h3>
                  <p className="text-white/80 font-serif text-sm md:text-base max-w-md line-clamp-2">
                    {featuredPlaylist.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#1DB954] uppercase tracking-wide">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Spotify" className="w-4 h-4" />
                     {featuredPlaylist.trackCount}
                  </div>
                </div>
              </a>
            </div>

            {/* RIGHT: Playlist List + Button */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full gap-6">
              
              {/* List */}
              <div className="flex flex-col gap-4">
                {otherPlaylists.map((playlist) => (
                  <a 
                    key={playlist.id}
                    href={playlist.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 items-center"
                  >
                    <div className="relative w-20 md:w-24 aspect-square shrink-0 bg-zinc-800 rounded shadow-md overflow-hidden group-hover:shadow-green-900/20">
                      <img 
                        src={playlist.cover} 
                        alt={playlist.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      {/* DÜZELTME: Sadece Play icon yerine yeşil daire içine alınmış Play icon eklendi */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-black/40">
                              <div className="w-5 h-5 text-black flex items-center justify-center">
                                  <PlayCircleIcon />
                              </div>
                          </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="text-white font-medium text-lg md:text-xl leading-snug mb-1 line-clamp-1 group-hover:text-[#1DB954] transition-colors font-labil">
                        {playlist.title}
                      </h4>
                      <p className="text-white/50 text-xs md:text-sm font-serif line-clamp-1 mb-2">
                          {playlist.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/40 uppercase tracking-wider">
                        <span>{playlist.trackCount}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* SPOTIFY FOLLOW BUTTON */}
              <div className="mt-auto pt-2">
                 <a 
                  href="https://open.spotify.com/user/spotify" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-sm shadow-lg hover:shadow-green-900/40 hover:-translate-y-1"
                 >
                   <SpotifyIcon />
                   Spotify'da Takip Et
                 </a>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
};