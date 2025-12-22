import { useDiscover } from "./DiscoverContext";
import logoRed from '../../../../public/logo-red.jpg';
import logoEvrensel from '../../../../public/evrensel.jpg';
import logo from '../../../../public/logo.png';
import { useState, useEffect } from "react";



// --- Shared Data ---

export const FEED_ITEMS = [
  {
    id: 1,
    title: "Türkiye'de Gençlerin Karşılaştığı Sosyal Medya Bağımlılığı",
    author: "Zeynep Yılmaz",
    source: "Genç Hayat",
    location: "İstanbul, Türkiye",
    timeAgo: "2s",
    imageUrl: "https://admin.itsnicethat.com/images/xgU-SDY-OWhfm5GeFswA9al_huk=/104505/format-webp|width-720/5783cf887fa44ce7c600493a.jpg",
    logo: logoRed,
    excerpt: "Sosyal medyanın gençler üzerindeki etkisi her geçen gün artıyor. Yapılan son araştırmalar, ekran süresinin artmasıyla birlikte anksiyete ve odaklanma sorunlarının da paralel olarak yükseldiğini gösteriyor. Peki bu dijital labirentten çıkış yolu nerede?",
    href: "#"
  },
  {
    id: 2,
    title: "Üniversite Öğrencilerinin Kariyer Kaygıları ve Çözüm Önerileri",
    author: "Mehmet Demir",
    source: "Genç Hayat",
    location: "Ankara, Türkiye",
    timeAgo: "5dk",
    imageUrl: "https://admin.itsnicethat.com/images/UYewhWw5_FJgCQJrANwckLyfBkM=/269630/format-webp|width-720/image_-_2171372.jpeg",
    logo: logoEvrensel,
    excerpt: "Mezuniyet yaklaşırken artan gelecek kaygısı, birçok öğrencinin potansiyelini tam olarak yansıtmasını engelliyor. Uzmanlar, erken dönem staj programları ve mentorluk desteğinin bu süreci yönetmede kilit rol oynadığını belirtiyor.",
    href: "#"
  },
  {
    id: 3,
    title: "Gençlerin Mental Sağlığı: Stres Yönetimi Teknikleri",
    author: "Elif Kaya",
    source: "Genç Hayat",
    location: "İzmir, Türkiye",
    timeAgo: "15dk",
    imageUrl: "https://admin.itsnicethat.com/images/emnRhOo2koR9RUVZc036ZExPpjw=/269593/format-webp|width-720/AAAABRtKl9umUKcf2ZO42cyqhAXyiIEiQTuorgmPWe7gWP-0uA42mQDYY8lGU9yywKhlbq75sU.jpg",
    logo: logoRed,
    excerpt: "Modern yaşamın hızı ve akademik beklentiler, gençlerin mental sağlığını zorluyor. Doğru nefes egzersizleri, düzenli spor ve sanatsal aktiviteler, stresle başa çıkmada basit ama etkili yöntemler sunuyor.",
    href: "#"
  },
  {
    id: 4,
    title: "Dijital Çağda Gençlerin Okuma Alışkanlıkları",
    author: "Caner Öztürk",
    source: "Genç Hayat",
    location: "Bursa, Türkiye",
    timeAgo: "1s",
    imageUrl: "https://admin.itsnicethat.com/images/YyAh-EnEg_3ppe64kU2xqL8UWN0=/270783/format-webp|width-720/image_-_1365896.jpeg",
    logo: logo,
    excerpt: "Basılı kitaplardan e-kitaplara ve sesli kitaplara geçiş, okuma alışkanlıklarını kökten değiştiriyor. Ancak format ne olursa olsun, hikayelerin gücü gençleri etkilemeye devam ediyor.",
    href: "#"
  }
];

// --- Sub-Components ---

// 1. FeedHeader
export const FeedHeader = () => {
  const { openDiscover } = useDiscover();

  return (
    <div className="bg-zinc-100 flex items-center justify-between p-4 mb-px">
      <h2 className="text-[11px] md:text-[13px] font-medium flex gap-2 leading-[15.4px] md:leading-[18.2px]">
          Genç Hayat Akışı
        <span className="text-stone-500/70">
          11s önce güncellendi
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
            <path d="M3 2l4 3-4 3V2z"/>
          </svg>
        </span>
      </button>
    </div>
  );
};

// 2. FeedCard
type FeedCardProps = {
  href: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  source: string;
  timeAgo: string;
};

export const FeedCard = (props: FeedCardProps) => {
  return (
    <div className="w-full h-full">
      <a
        href={props.href}
        className="bg-zinc-100 hover:bg-red-600/10 transition-colors duration-200 flex h-full group"
      >
        <div className="relative aspect-square min-w-[93px] md:aspect-[120/109] md:min-w-[120px] h-full">
          <div className="h-0 w-full overflow-hidden">
            <div className="absolute inset-0">
              <img
                alt={props.imageAlt}
                src={props.imageUrl}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="p-3 md:p-4 flex flex-col justify-between w-full font-medium">
          <p className="text-zinc-800 text-[13px] leading-[18.2px] group-hover:text-red-600 transition-colors duration-200 line-clamp-3 overflow-hidden">
            {props.title}
          </p>
          <div className="flex justify-between gap-2">
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

// 3. FeedCarousel
export const FeedCarousel = () => {
  const getVisibleItems = () => {
    if (typeof window === 'undefined') return FEED_ITEMS;
    
    const width = window.innerWidth;
    if (width < 640) return FEED_ITEMS.slice(0, 1); // Mobile: 1 card
    if (width < 1024) return FEED_ITEMS.slice(0, 2); // Tablet: 2 cards
    if (width < 1280) return FEED_ITEMS.slice(0, 3); // Medium: 3 cards
    return FEED_ITEMS; // Large: 4 cards
  };

  const [visibleItems, setVisibleItems] = useState(getVisibleItems());

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getVisibleItems());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 h-auto">
        {visibleItems.map((item) => (
          <FeedCard
            key={item.id}
            href={item.href}
            imageUrl={item.imageUrl}
            imageAlt={item.title}
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