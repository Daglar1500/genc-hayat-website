import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';

// --- MOCK DATA (Letterboxd profilinden alınan filmler) ---
const LETTERBOXD_FILMS = [
    {
        id: "1",
        title: "Stalker",
        year: "1979",
        director: "Andrei Tarkovsky",
        rating: 5,
        posterUrl: "https://a.ltrbxd.com/resized/film-poster/5/1/8/3/1/51831-stalker-0-230-0-345-crop.jpg",
        url: "https://letterboxd.com/genc_hayat/"
    },
    {
        id: "2",
        title: "Bong Joon-ho",
        year: "2019",
        director: "Bong Joon-ho",
        rating: 4.5,
        posterUrl: "https://a.ltrbxd.com/resized/film-poster/4/7/6/0/5/47605-parasite-0-230-0-345-crop.jpg",
        url: "https://letterboxd.com/genc_hayat/"
    },
    {
        id: "3",
        title: "Yi Yi",
        year: "2000",
        director: "Edward Yang",
        rating: 5,
        posterUrl: "https://a.ltrbxd.com/resized/film-poster/4/6/1/6/1/46161-yi-yi-0-230-0-345-crop.jpg",
        url: "https://letterboxd.com/genc_hayat/"
    },
    {
        id: "4",
        title: "Three Colours: Red",
        year: "1994",
        director: "Krzysztof Kieślowski",
        rating: 5,
        posterUrl: "https://a.ltrbxd.com/resized/film-poster/3/8/7/4/6/38746-three-colours-red-0-230-0-345-crop.jpg",
        url: "https://letterboxd.com/genc_hayat/"
    },
    {
        id: "5",
        title: "Ikiru",
        year: "1952",
        director: "Akira Kurosawa",
        rating: 5,
        posterUrl: "https://a.ltrbxd.com/resized/film-poster/5/1/5/9/2/51592-ikiru-0-230-0-345-crop.jpg",
        url: "https://letterboxd.com/genc_hayat/"
    },
    {
        id: "6",
        title: "La Dolce Vita",
        year: "1960",
        director: "Federico Fellini",
        rating: 4.5,
        posterUrl: "https://a.ltrbxd.com/resized/film-poster/5/1/3/1/6/51316-la-dolce-vita-0-230-0-345-crop.jpg",
        url: "https://letterboxd.com/genc_hayat/"
    }
];

// --- STAR RATING ---
const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                    {star <= fullStars ? (
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#00c030" stroke="#00c030" strokeWidth="1" />
                    ) : (hasHalf && star === fullStars + 1) ? (
                        // Half star
                        <>
                            <defs>
                                <linearGradient id={`half-${star}`}>
                                    <stop offset="50%" stopColor="#00c030" />
                                    <stop offset="50%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={`url(#half-${star})`} stroke="#00c030" strokeWidth="1" />
                        </>
                    ) : (
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="transparent" stroke="#555" strokeWidth="1" />
                    )}
                </svg>
            ))}
        </div>
    );
};

// --- FILM POSTER CARD ---
const FilmCard = ({ film }: { film: typeof LETTERBOXD_FILMS[0] }) => (
    <a
        href={film.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative"
    >
        <div className="relative aspect-[2/3] overflow-hidden rounded-sm shadow-lg">
            <img
                src={film.posterUrl}
                alt={film.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=80';
                }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                    <p className="text-white text-xs font-bold leading-tight">{film.title}</p>
                    <p className="text-white/70 text-[10px] mt-1">{film.year}</p>
                </div>
            </div>
        </div>
        <div className="mt-2">
            <StarRating rating={film.rating} />
        </div>
    </a>
);

// --- CAROUSEL CONSTANTS ---
const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 12;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

// --- MOBILE CAROUSEL ---
const MobileCarousel = ({ films }: { films: typeof LETTERBOXD_FILMS }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(300);
    const loop = true;
    const VISIBLE = 2;

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
        };
        requestAnimationFrame(updateWidth);
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const itemWidth = (containerWidth - GAP * (VISIBLE - 1)) / VISIBLE;
    const trackItemOffset = itemWidth + GAP;

    const itemsForRender = useMemo(() => {
        if (!loop) return films;
        if (films.length === 0) return [];
        return [films[films.length - 1], ...films, films[0]];
    }, [films, loop]);

    const [position, setPosition] = useState<number>(loop ? 1 : 0);
    const x = useMotionValue(0);
    const [isJumping, setIsJumping] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const startingPosition = loop ? 1 : 0;
        setPosition(startingPosition);
        x.set(-startingPosition * trackItemOffset);
    }, [itemsForRender.length, loop, trackItemOffset, x]);

    const handleAnimationComplete = () => {
        if (!loop || itemsForRender.length <= 1) { setIsAnimating(false); return; }
        const lastCloneIndex = itemsForRender.length - 1;
        if (position === lastCloneIndex) {
            setIsJumping(true); const target = 1;
            setPosition(target); x.set(-target * trackItemOffset);
            requestAnimationFrame(() => { setIsJumping(false); setIsAnimating(false); });
            return;
        }
        if (position === 0) {
            setIsJumping(true); const target = films.length;
            setPosition(target); x.set(-target * trackItemOffset);
            requestAnimationFrame(() => { setIsJumping(false); setIsAnimating(false); });
            return;
        }
        setIsAnimating(false);
    };

    const handleDragEnd = (_: any, info: PanInfo) => {
        const { offset, velocity } = info;
        const dir = offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD ? 1
            : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD ? -1 : 0;
        if (dir !== 0) setPosition(prev => prev + dir);
    };

    const activeIndex = films.length === 0 ? 0
        : loop ? (position - 1 + films.length) % films.length
            : Math.min(position, films.length - 1);
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
                        <FilmCard film={film} />
                    </div>
                ))}
            </motion.div>
            <div className="flex justify-center w-full mt-6 gap-2">
                {films.map((_, index) => (
                    <motion.div
                        key={index}
                        className={`h-1.5 rounded-full cursor-pointer transition-all duration-150 ${activeIndex === index ? 'w-4 bg-[#00c030]' : 'w-1.5 bg-white/20'}`}
                        onClick={() => setPosition(loop ? index + 1 : index)}
                    />
                ))}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export const LetterboxdSection = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const recentFilms = LETTERBOXD_FILMS.slice(0, 5);

    return (
        <section className="bg-zinc-950 py-16 md:py-24 font-bradford text-white overflow-hidden relative">

            {/* Subtle Letterboxd green glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-green-900/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-[140px] relative z-10">

                {/* Header */}
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
                        href="https://letterboxd.com/genc_hayat/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden lg:flex items-center gap-2 text-white/70 hover:text-[#00c030] transition-colors text-xs md:text-sm font-serif italic group"
                    >
                        Profilimize Bak
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </div>

                {/* Content */}
                {isMobile ? (
                    <div className="flex flex-col gap-8">
                        <MobileCarousel films={LETTERBOXD_FILMS} />
                        <a
                            href="https://letterboxd.com/genc_hayat/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 border border-[#00c030] text-[#00c030] hover:bg-[#00c030] hover:text-black font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-sm"
                        >
                            {/* Letterboxd icon */}
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12zm7.2-3.6h9.6v7.2H7.2V8.4zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-4.8-3a4.8 4.8 0 1 1 9.6 0 4.8 4.8 0 0 1-9.6 0z" />
                            </svg>
                            Letterboxd Profilimiz
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                        {/* LEFT: Featured / Large poster - 4 cols */}
                        <div className="lg:col-span-4">
                            <a
                                href={LETTERBOXD_FILMS[0].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block relative"
                            >
                                <div className="relative aspect-[2/3] overflow-hidden rounded-sm shadow-2xl">
                                    <img
                                        src={LETTERBOXD_FILMS[0].posterUrl}
                                        alt={LETTERBOXD_FILMS[0].title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                    <div className="absolute bottom-0 left-0 w-full p-6">
                                        <div className="text-[#00c030] text-xs font-bold tracking-widest uppercase mb-1">En Son</div>
                                        <h3 className="text-xl font-bold text-white leading-tight">{LETTERBOXD_FILMS[0].title}</h3>
                                        <p className="text-white/60 text-sm mt-1">{LETTERBOXD_FILMS[0].director} · {LETTERBOXD_FILMS[0].year}</p>
                                        <div className="mt-2">
                                            <StarRating rating={LETTERBOXD_FILMS[0].rating} />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* RIGHT: Grid of smaller posters + profile button - 8 cols */}
                        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
                            <div className="grid grid-cols-5 gap-4">
                                {recentFilms.map((film) => (
                                    <FilmCard key={film.id} film={film} />
                                ))}
                            </div>

                            {/* Profile link button */}
                            <div className="mt-auto">
                                <a
                                    href="https://letterboxd.com/genc_hayat/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-3 border border-[#00c030] text-[#00c030] hover:bg-[#00c030] hover:text-black font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-sm"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12zm7.2-3.6h9.6v7.2H7.2V8.4zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-4.8-3a4.8 4.8 0 1 1 9.6 0 4.8 4.8 0 0 1-9.6 0z" />
                                    </svg>
                                    Letterboxd Profilimize Göz Atın
                                </a>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </section>
    );
};

export default LetterboxdSection;
