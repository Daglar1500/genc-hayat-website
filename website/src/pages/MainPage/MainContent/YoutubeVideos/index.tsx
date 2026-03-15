import React, { useState, useEffect } from 'react';

type VideoItem = {
  id: string;
  url: string;
};

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

export const VideoSection = ({ videos, channelUrl }: { videos: VideoItem[], channelUrl: string }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [featured, ...rest] = videos;

  return (
    <section className="bg-black py-16 md:py-24 font-bradford text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-red-900/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-[140px] relative z-10">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Featured video */}
            <div className="lg:col-span-7">
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
            <div className="lg:col-span-5 flex flex-col gap-4">
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
