import React from 'react';

type FilmItem = {
  id: string;
  url: string;
  title?: string;
  year?: string;
};

function getFilmSlug(url: string): string {
  const clean = url.replace(/\/$/, '');
  return clean.split('/').pop() || url;
}

function formatSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export const LetterboxdSection = ({ films, profileUrl }: { films: FilmItem[], profileUrl: string }) => {
  return (
    <section className="bg-zinc-950 py-16 md:py-24 font-bradford text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-green-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-[140px] relative z-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-10 border-b border-white/10 pb-4 md:pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1 md:mb-2">
              <span className="text-[#00c030] font-bold tracking-widest text-[10px] md:text-xs uppercase">
                Genç Hayat Letterboxd
              </span>
              {films.length > 0 && (
                <span className="text-[10px] md:text-xs bg-[#00c030]/10 text-[#00c030] border border-[#00c030]/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  {films.length} film
                </span>
              )}
            </div>
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

        {/* Film list */}
        {films.length === 0 ? (
          <p className="text-white/30 text-sm italic">Henüz film eklenmedi.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {films.map((film, i) => {
              const title = film.title || formatSlug(getFilmSlug(film.url));
              return (
                <a
                  key={film.id}
                  href={film.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-4 px-2 border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors duration-200"
                >
                  <span className="text-[#00c030]/40 font-mono text-xs w-6 shrink-0 group-hover:text-[#00c030] transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-sm md:text-base font-medium text-white/80 group-hover:text-white transition-colors leading-snug">
                    {i === 0 && (
                      <span className="inline-block text-[#00c030] text-[9px] font-bold tracking-widest uppercase bg-[#00c030]/10 border border-[#00c030]/30 px-1.5 py-0.5 rounded mr-2 align-middle">
                        En Son
                      </span>
                    )}
                    {title}
                  </span>
                  {film.year && (
                    <span className="text-white/30 text-xs font-mono shrink-0 group-hover:text-white/50 transition-colors">
                      {film.year}
                    </span>
                  )}
                  <span className="text-white/20 group-hover:text-[#00c030]/50 transition-colors text-xs shrink-0">→</span>
                </a>
              );
            })}
          </div>
        )}

        {/* Footer button */}
        <div className="mt-8 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-3 border border-[#00c030] text-[#00c030] hover:bg-[#00c030] hover:text-black font-bold py-4 rounded-lg transition-all uppercase tracking-wide text-sm"
          >
            Letterboxd Profilimize Göz Atın
          </a>
        </div>

      </div>
    </section>
  );
};

export default LetterboxdSection;
