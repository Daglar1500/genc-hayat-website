import { useDiscover } from "./DiscoverContext";
import { useState, useEffect } from "react";
import { MOCK_ARTICLES } from "../../../../data/MockArticles";
import { media } from "../../../MainPage/ArticleCard";
import { FEED_ARTICLES } from "../../../../data/MockArticles";

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
  description?: string; // Hata almamak için burayı opsiyonel (?) string yaptık
};

export const FeedCard = (props: FeedCardProps) => {
  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-right-4 duration-700 ease-in-out">
      <a
        href={props.href}
        className="bg-zinc-100 hover:bg-red-600/10 transition-colors duration-200 flex h-full group"
      >
        {/* Görsel Alanı */}
        <div className="relative aspect-square min-w-[93px] md:aspect-[120/109] md:min-w-[120px] h-full">
          <div className="h-0 w-full overflow-hidden">
            <div className="absolute inset-0">
              <img
                alt={props.media.alt}
                src={props.media.src}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Metin Alanı */}
        <div className="p-3 md:p-4 flex flex-col justify-between w-full font-medium">
          <p className="text-zinc-800 text-[13px] leading-[18.2px] group-hover:text-red-600 transition-colors duration-200 line-clamp-3 overflow-hidden">
            {props.title}
          </p>

          <div className="flex justify-between items-center gap-2">
            {/* Kaynak (Yazı Olarak) */}
            <span className="text-stone-500 text-[11px] leading-[15.4px] block">
              {props.source}
            </span>

            {/* Zaman */}
            <span className="text-stone-500/40 text-[11px] leading-[15.4px] block">
              {props.timeAgo}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

// --- DATA MERGE LOGIC (2 Mock - 1 Feed) ---
// Bu veriyi burada hazırlayıp export ediyoruz ki DiscoverFeed de aynısını kullansın.

// 1. Standart Format
const formattedMocks = MOCK_ARTICLES.map(m => ({
  href: m.href,
  media: m.firstMedia!,
  title: m.title,
  source: "Genç Hayat",
  timeAgo: getTimeAgo(m.publishedDate),
  description: m.description // Mock datadan gelen description (undefined olabilir)
}));

const formattedFeeds = FEED_ARTICLES.map(f => ({
  href: f.href,
  media: f.media,
  title: f.title,
  source: f.source,
  timeAgo: f.timeAgo,
  description: f.description || f.title // Feed datada description yoksa title kullan
}));

// 2. Birleştirme (2 Mock, 1 Feed döngüsü)
export const COMBINED_FEED_DATA: FeedCardProps[] = [];
let mIndex = 0;
let fIndex = 0;

while (mIndex < formattedMocks.length || fIndex < formattedFeeds.length) {
  if (mIndex < formattedMocks.length) COMBINED_FEED_DATA.push(formattedMocks[mIndex++]);
  if (mIndex < formattedMocks.length) COMBINED_FEED_DATA.push(formattedMocks[mIndex++]);
  if (fIndex < formattedFeeds.length) COMBINED_FEED_DATA.push(formattedFeeds[fIndex++]);
}

// 4. FeedCarousel
export const FeedCarousel = () => {
  const [itemsToShow, setItemsToShow] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % COMBINED_FEED_DATA.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const visibleItems = [];
  for (let i = 0; i < itemsToShow; i++) {
    const index = (currentIndex + i) % COMBINED_FEED_DATA.length;
    visibleItems.push(COMBINED_FEED_DATA[index]);
  }

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 h-auto">
        {visibleItems.map((item, i) => (
          <FeedCard
            // Key, animasyonun düzgün çalışması için benzersiz olmalı
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