import { useState, useEffect } from "react";
import logo_gh from '../../../../public/logo-red.jpg';
import logo_genc_hayat from '../../../../public/logo.png';
import logo_evg from '../../../../public/logo_evg.png';
import logo_te from '../../../../public/logo_te.jpg';
import logo_evrensel from '../../../../public/evrensel.jpg';
import { media } from "../../../MainPage/ArticleCard";

// Tarih formatlayıcı
const getTimeAgo = (date: Date) => {
  const diff = new Date().getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}g önce`;
  if (hours > 0) return `${hours}s önce`;
  if (minutes > 0) return `${minutes}dk önce`;
  return "Şimdi";
};

// Types
export type FeedCardProps = {
  href: string;
  media: media;
  title: string;
  source: string;
  timeAgo: string;
  description?: string;
};

// Logo bileşeni (Tepedeki Ana Logo)
const FeedLogo = () => (
  <div className="flex justify-center py-5 md:py-6 border-b bg-transparent transition-all duration-300">
    <img
      src={logo_genc_hayat}
      alt="Genç Hayat"
      className="h-8 md:h-16 w-auto object-contain drop-shadow-sm transition-all duration-300"
    />
  </div>
);

interface DiscoverFeedProps {
  onClose: () => void;
}

export const DiscoverFeed = ({ onClose }: DiscoverFeedProps) => {
  const [loading, setLoading] = useState(true);
  const [feedData, setFeedData] = useState<FeedCardProps[]>([]);

  // Kaynak ismine göre logo döndüren fonksiyon
  const getSourceLogo = (sourceName: string) => {
    switch (sourceName) {
      case "Evrensel":
        return logo_evrensel;
      case "Ekmek ve Gül":
        return logo_evg;
      case "Teori ve Eylem":
        return logo_te;
      case "Genç Hayat":
      default:
        return logo_gh;
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Fetch data
    const fetchFeed = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      try {
        const res = await fetch(`${apiUrl}/init`);
        const data = await res.json();

        const feedSection = data.sections?.find((s: any) => s.type === 'article-feed');
        let articlesRaw: any[] = [];

        if (feedSection && feedSection.articles) {
          articlesRaw = feedSection.articles;
        } else {
          // Fallback: tüm makalelerden
          articlesRaw = data.articles?.slice(0, 15) || [];
        }

        const mappedFeedData: FeedCardProps[] = articlesRaw.map((m: any) => ({
          href: `/articles/${m.id}`,
          media: { type: 'image', src: m.imageUrl, alt: m.title },
          title: m.title,
          source: m.author || "Genç Hayat",
          timeAgo: getTimeAgo(new Date(m.createdAt)),
          description: m.subheading
        }));

        setFeedData(mappedFeedData);
      } catch (err) {
        console.error("Akış çekilirken hata oluştu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();

    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    // Overlay Container
    <div className="fixed inset-0 z-[60] flex justify-center backdrop-blur-md bg-black/40">

      {/* Kapatma Butonu */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 md:top-6 md:right-6 z-50 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
        title="Kapat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* İçerik Sütunu */}
      <div
        className="w-full md:w-[45%] h-full bg-white overflow-y-auto relative animate-in slide-in-from-bottom-10 duration-300"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Logo Bölümü */}
        <FeedLogo />

        {/* Akış İçeriği */}
        <div className="px-3 md:px-4 py-6 md:py-8 pb-20 space-y-6 md:space-y-12 bg-white">
          {loading ? (
            <div className="pt-4 pb-6 flex justify-center text-stone-500">
              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : feedData.map((item, index) => (
            // Article Card
            <article key={index} className="flex flex-col bg-white shadow-sm backdrop-blur-sm overflow-hidden rounded-sm md:rounded-none">

              {/* İçerik Wrapper */}
              <div className="p-4 md:p-6 pb-3 md:pb-2">

                {/* --- Üst Kısım: Logo + Başlık --- */}
                <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-5">

                  {/* Yuvarlak Logo Alanı - Mobilde 40px (w-10), Desktopta 56px (w-14) */}
                  <div className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0 mt-1 rounded-full overflow-hidden bg-gray-50 border border-gray-100">
                    <img
                      src={getSourceLogo(item.source)}
                      alt={item.source}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Başlık ve Metadata */}
                  <div className="flex flex-col">
                    {/* Başlık - Mobilde text-lg (18px), Desktopta text-2xl (24px) */}
                    <h2 className="text-lg md:text-2xl font-bold leading-tight text-zinc-900 mb-1">
                      {item.title}
                    </h2>

                    {/* Yazar/Kaynak ve Konum/Zaman */}
                    <div className="flex flex-wrap items-center gap-x-2">
                      {/* Kaynak İsmi - Mobilde text-[11px], Desktopta text-sm */}
                      <span className="text-[11px] md:text-sm font-bold text-red-600 uppercase tracking-wider">
                        {item.source}
                      </span>
                      {/* Zaman */}
                      <span className="text-[10px] md:text-xs text-gray-500 font-medium border-l pl-2 border-gray-300">
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Orta Kısım: Metin */}
                <div className="mb-3 md:mb-6">
                  {/* Açıklama Metni - Mobilde text-[15px], Desktopta text-xl */}
                  <p className="text-zinc-700 font-serif text-[15px] md:text-xl leading-relaxed md:leading-relaxed line-clamp-4">
                    {item.description || item.title}
                  </p>

                  <a
                    href={item.href}
                    className="inline-block mt-3 md:mt-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-black border-b border-black hover:text-red-600 hover:border-red-600 transition-colors"
                  >
                    Devamını Oku
                  </a>
                </div>
              </div>

              {/* Alt Kısım: Görsel */}
              {item.media && (
                <div className="w-full mt-auto">
                  {item.media.type === 'video' ? (
                    <video
                      src={item.media.src}
                      className="w-full h-auto object-cover block"
                      autoPlay muted loop playsInline
                    />
                  ) : (
                    <img
                      src={item.media.src}
                      alt={item.title}
                      className="w-full h-auto object-cover block"
                      loading="lazy"
                    />
                  )}
                </div>
              )}

            </article>
          ))}
        </div>
      </div>
    </div>
  );
};