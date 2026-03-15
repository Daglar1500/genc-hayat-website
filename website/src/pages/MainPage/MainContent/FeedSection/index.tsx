import { useDiscover } from "./DiscoverContext";
import { useState, useEffect } from "react";
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

// --- Sub-Components ---

// 2. FeedHeader
export const FeedHeader = () => {
  const { openDiscover } = useDiscover();

  return (
    <div className="bg-zinc-100 flex items-center justify-between p-4 mb-px">
      <h2 className="text-[11px] md:text-[13px] font-medium flex gap-2 leading-[15.4px] md:leading-[18.2px]">
        Genç Hayat Akışı
        <span className="text-stone-500/70">
          Canlı
        </span>
      </h2>
      <button
        type="button"
        onClick={openDiscover}
        className="flex items-center gap-2 bg-transparent p-0 hover:opacity-70 transition-opacity cursor-pointer"
      >
        <span className="text-[11px] md:text-[13px] font-medium leading-[15.4px] md:leading-[18.2px]">
          Hepsini Keşfet
        </span>
        <span className="bg-zinc-800 text-white w-4 h-4 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M3 2l4 3-4 3V2z" />
          </svg>
        </span>
      </button>
    </div>
  );
};

// 3. FeedCard & Tipler
export type FeedCardProps = {
  href: string;
  media: media;
  title: string;
  source: string;
  timeAgo: string;
  description?: string;
};

export const FeedCard = (props: FeedCardProps) => {
  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-right-4 duration-700 ease-in-out">
      <a
        href={props.href}
        className="bg-zinc-100 hover:bg-red-600/10 transition-colors duration-200 flex h-full group"
      >
        <div className="relative aspect-square min-w-[93px] md:aspect-[120/109] md:min-w-[120px] h-full">
          <div className="h-0 w-full overflow-hidden">
            <div className="absolute inset-0">
              <img
                alt={props.media.alt || props.title}
                src={props.media.src || '/placeholder.jpg'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="p-3 md:p-4 flex flex-col justify-between w-full font-medium">
          <p className="text-zinc-800 text-[13px] leading-[18.2px] group-hover:text-red-600 transition-colors duration-200 line-clamp-3 overflow-hidden">
            {props.title}
          </p>

          <div className="flex justify-between items-center gap-2">
            <span className="text-stone-500 text-[11px] leading-[15.4px] block">
              {props.source}
            </span>

            <span className="text-stone-500/40 text-[11px] leading-[15.4px] block">
              {props.timeAgo}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

// 4. FeedCarousel
export const FeedCarousel = () => {
  const [itemsToShow, setItemsToShow] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedData, setFeedData] = useState<FeedCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Veri Çekme İşlemi (MainContent ile benzer mantık)
  useEffect(() => {
    const apiUrl = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3001/api';
    fetch(`${apiUrl}/init`)
      .then(res => res.json())
      .then(data => {
        // Feed kısmı için admin panelindeki 'article-feed' (Haber Akışı) isimli section'ı arıyoruz.
        // Eğer o yoksa, tüm layout'taki makalelerden fallback yapabiliriz veya sadece ilk feed section'ı alırız.
        const feedSection = data.sections.find((s: any) => s.type === 'article-feed');
        let articlesRaw: any[] = [];

        if (feedSection && feedSection.articles) {
          articlesRaw = feedSection.articles;
        } else {
          // Fallback: tüm makalelerden ilk 10 tanesi
          articlesRaw = data.articles.slice(0, 10);
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
        setLoading(false);
      })
      .catch((err) => {
        console.error("Feed API Error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      if (width < 640) setItemsToShow(1);
      else if (width < 1024) setItemsToShow(2);
      else if (width < 1280) setItemsToShow(3);
      else setItemsToShow(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3 Saniyelik Otomatik Geçiş
  useEffect(() => {
    if (feedData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % feedData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [feedData]);

  if (loading) {
    return <div className="h-32 flex justify-center items-center bg-zinc-100 text-stone-500 text-sm">Akış Yükleniyor...</div>;
  }

  if (feedData.length === 0) {
    return <div className="h-32 flex justify-center items-center bg-zinc-100 text-stone-500 text-sm">Akışta henüz haber yok.</div>;
  }

  const visibleItems = [];
  for (let i = 0; i < itemsToShow; i++) {
    if (feedData.length > 0) {
      const index = (currentIndex + i) % feedData.length;
      visibleItems.push(feedData[index]);
    }
  }

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 h-auto">
        {visibleItems.map((item, i) => (
          <FeedCard
            key={`${item.title}-${i}-${currentIndex}`}
            href={item.href}
            media={item.media}
            title={item.title}
            source={item.source}
            timeAgo={item.timeAgo}
          />
        ))}
      </div>
    </div>
  );
};

// --- Main Feed Section ---

export const FeedSection = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px]">
      <FeedHeader />
      <FeedCarousel />
    </div>
  );
};