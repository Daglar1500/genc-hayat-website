import React, { useState, useRef, useLayoutEffect } from 'react';

type VideoItem = {
  id: string;
  url: string;
};

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

const YT_COL_GAP = 32;  // gap-8 = 2rem = 32px
const YT_ROW_GAP = 16;  // gap-4 = 1rem = 16px
const BTN_H      = 52;  // py-4 + text-sm ≈ 52px

export const VideoSection = ({ videos, channelUrl }: { videos: VideoItem[], channelUrl: string }) => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [featured, ...rest] = videos;

  // Compute left column width so that left video height === right column height.
  // Left height  = w_L × 9/16
  // Right height = N × (w_R × 9/16) + N × rowGap + btnH
  // Equal when: w_L = N × w_R + (N × rowGap + btnH) × 16/9
  // With w_L + colGap + w_R = W:
  //   w_R = [(W - colGap) - (N × rowGap + btnH) × 16/9] / (N + 1)
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const N = rest.length;
    if (N === 0) { setLeftWidth(null); return; }

    const calc = () => {
      if (!containerRef.current) return;
      const W = containerRef.current.offsetWidth;
      const rightW = ((W - YT_COL_GAP) - (N * YT_ROW_GAP + BTN_H) * (16 / 9)) / (N + 1);
      const leftW  = W - YT_COL_GAP - rightW;
      if (leftW > 50 && rightW > 50) setLeftWidth(Math.round(leftW));
    };

    calc();
    const ro = new ResizeObserver(calc);
    const el = containerRef.current;
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [rest.length]);

  return (
    <section className="bg-black py-16 md:py-24 font-bradford text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-red-900/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-[140px] relative z-10">
        <div className="flex items-end justify-between mb-8 md:mb-10 border-b border-white/10 pb-4 md:pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-red-600" aria-label="YouTube">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span className="text-red-600 font-bold tracking-widest text-[10px] md:text-xs uppercase block">
                Genç Hayat YouTube
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-labil font-bold text-white leading-tight">
              Son Videolar
            </h2>
          </div>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs md:text-sm font-serif italic group"
          >
            Tümünü İzle
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {isMobile ? (
          <div className="flex flex-col gap-6">
            {videos.map((v) => {
              const embedUrl = getYouTubeEmbedUrl(v.url);
              if (!embedUrl) return null;
              return (
                <div key={v.id} className="w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              );
            })}
            <a
              href={`${channelUrl}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              Kanalımıza Göz Atın!
            </a>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="flex gap-8"
          >
            {/* Featured video — width computed so heights match */}
            <div style={leftWidth ? { width: leftWidth, flexShrink: 0 } : { flex: '7 1 0%' }}>
              {featured && getYouTubeEmbedUrl(featured.url) && (
                <div className="w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                  <iframe
                    src={getYouTubeEmbedUrl(featured.url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* Rest of videos + button */}
            <div className="flex-1 flex flex-col gap-4">
              {rest.map((v) => {
                const embedUrl = getYouTubeEmbedUrl(v.url);
                if (!embedUrl) return null;
                return (
                  <div key={v.id} className="w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              })}
              <a
                href={`${channelUrl}?sub_confirmation=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-xs md:text-sm mt-auto"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                Kanalımıza Göz Atın!
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
