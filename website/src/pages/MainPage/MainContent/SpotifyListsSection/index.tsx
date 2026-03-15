import React, { useState, useEffect } from 'react';

type PlaylistItem = {
  id: string;
  url: string;
};

function getSpotifyEmbedUrl(url: string): string {
  const match = url.match(/spotify\.com\/(playlist|album|track|show|episode)\/([a-zA-Z0-9]+)/);
  if (!match) return '';
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
}

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.118-.96-.539-.12-.42.12-.84.54-.96 4.68-1.079 8.64-.66 11.94 1.38.36.24.48.66.24 1.02h.001zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.018.6-1.14 4.38-1.38 9.841-.72 13.441 1.56.419.24.6.84.3 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

export const SpotifySection = ({ playlists, profileUrl }: { playlists: PlaylistItem[], profileUrl: string }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [featured, ...rest] = playlists;

  return (
    <section className="bg-black py-16 md:py-24 font-bradford text-white overflow-hidden relative">
      <div className="absolute top-0 right-1/4 w-[60%] h-[60%] bg-[#1DB954]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-[140px] relative z-10">
        <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#1DB954]"><SpotifyIcon /></span>
              <span className="text-[#1DB954] font-bold tracking-widest text-xs uppercase block">
                Genç Hayat Spotify
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-labil font-bold text-white leading-tight">
              Çalma Listelerimiz
            </h2>
          </div>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-serif italic group"
          >
            Profilimizi Ziyaret Et
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {isMobile ? (
          <div className="flex flex-col gap-4">
            {playlists.map((p) => {
              const embedUrl = getSpotifyEmbedUrl(p.url);
              if (!embedUrl) return null;
              return (
                <iframe
                  key={p.id}
                  src={embedUrl}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl border-0"
                />
              );
            })}
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-sm mt-2"
            >
              <SpotifyIcon />
              Spotify'da Takip Et
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Featured playlist - flex-1 fills the row height set by right column */}
            <div className="lg:col-span-7 flex flex-col">
              {featured && getSpotifyEmbedUrl(featured.url) && (
                <iframe
                  src={getSpotifyEmbedUrl(featured.url)}
                  width="100%"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="flex-1 min-h-0 rounded-xl border-0 block"
                />
              )}
            </div>

            {/* Rest of playlists + button */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              {rest.map((p) => {
                const embedUrl = getSpotifyEmbedUrl(p.url);
                if (!embedUrl) return null;
                return rest.length === 1 ? (
                  /* Single item: full mode, fills available height */
                  <iframe
                    key={p.id}
                    src={embedUrl}
                    width="100%"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="flex-1 min-h-0 rounded-xl border-0 block"
                  />
                ) : (
                  /* Multiple items: compact mode, fixed 152px */
                  <iframe
                    key={p.id}
                    src={embedUrl}
                    width="100%"
                    height="152"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="shrink-0 h-[152px] rounded-xl border-0 block"
                    style={{ height: '152px' }}
                  />
                );
              })}
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 mt-auto w-full flex items-center justify-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-sm"
              >
                <SpotifyIcon />
                Spotify'da Takip Et
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
